import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { ExpenseStatus, OwnershipType, type Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { detectCategory, learnVendor } from '@/lib/expense-engine';
import { extractOCRText, extractWithAI } from '@/lib/ocr';
import { sha256, sanitizeFileName, validateUploadFile, getLocalUploadsPath } from '@/lib/security';
import { storeReceiptFile } from '@/lib/storage';
import { receiptQueue } from '@/lib/queue';
import { logActivity } from '@/lib/activity';

function toNumber(value: Prisma.Decimal | null | undefined) {
  return value ? Number(value) : 0;
}

async function createThumbnailIfNeeded(file: File, buffer: Buffer, storageKey: string) {
  if (!file.type.startsWith('image/')) return null;

  const sharp = (await import('sharp')).default;
  const thumbnail = await sharp(buffer).resize(360, 360, { fit: 'inside' }).webp({ quality: 82 }).toBuffer();
  const thumbnailKey = `${storageKey.replace(/\.[^.]+$/, '')}-thumb.webp`;
  const dir = getLocalUploadsPath();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, thumbnailKey), thumbnail);
  return thumbnailKey;
}

export async function processReceiptUpload(params: {
  userId: string;
  file: File;
  expenseOwnerId?: string;
  visibleTo?: string[];
  notes?: string;
  autoQueue?: boolean;
}) {
  const { userId, file } = params;
  validateUploadFile(file);

  const buffer = Buffer.from(await file.arrayBuffer());
  const digest = sha256(buffer);
  const duplicate = await db.upload.findUnique({ where: { sha256: digest }, include: { expense: true } });
  if (duplicate?.expense) {
    return { duplicate: true, expenseId: duplicate.expenseId, uploadId: duplicate.id };
  }

  const stored = await storeReceiptFile(file, digest);
  const thumbnailKey = await createThumbnailIfNeeded(file, buffer, stored.storageKey);
  const rawText = await extractOCRText(buffer, file.type);
  const aiResult = await extractWithAI(rawText, file.name.replace(/\.[^.]+$/, ''));
  const vendorName = aiResult.vendor?.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Unknown vendor';
  const categoryName = await detectCategory(vendorName, (aiResult as any).category);
  const category = await db.category.upsert({
    where: { name: categoryName },
    update: {},
    create: { name: categoryName, slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), group: 'other' }
  });
  const vendor = await learnVendor(vendorName, category.id);
  const ownerId = params.expenseOwnerId ?? userId;
  const availableCards = await db.card.findMany({ where: { ownerId, isActive: true }, orderBy: [{ ownership: 'asc' }, { createdAt: 'asc' }] });
  const card = availableCards.find((entry) => entry.ownership === 'business') ?? availableCards[0] ?? null;

  const subtotal = aiResult.subtotal ?? Math.max(0, (aiResult.total ?? 0) - (aiResult.tax ?? 0));
  const total = aiResult.total ?? subtotal + (aiResult.tax ?? 0);
  const ownership = card?.ownership ?? OwnershipType.business;
  const upload = await db.upload.create({
    data: {
      userId,
      originalName: file.name,
      fileName: sanitizeFileName(file.name),
      mimeType: file.type,
      storageKey: stored.storageKey,
      thumbnailKey,
      fileSize: file.size,
      sha256: digest
    }
  });

  const expense = await db.expense.create({
    data: {
      sourceHash: digest,
      uploadedById: userId,
      expenseOwnerId: ownerId,
      vendorId: vendor.id,
      categoryId: category.id,
      cardId: card?.id ?? null,
      vendorName,
      date: aiResult.date ? new Date(aiResult.date) : new Date(),
      time: aiResult.time,
      address: aiResult.address,
      phone: aiResult.phone,
      subtotal,
      tax: aiResult.tax ?? 0,
      amount: total,
      currency: aiResult.currency ?? 'CAD',
      businessPersonal: ownership,
      paymentMethod: 'card',
      paidByLabel: ownerId,
      visibleTo: params.visibleTo ?? ['Parget', 'Rajan'],
      confidenceScore: aiResult.confidence ?? 0.5,
      ocrText: rawText,
      ocrData: aiResult as unknown as Prisma.InputJsonValue,
      aiData: aiResult as unknown as Prisma.InputJsonValue,
      notes: params.notes,
      receiptExists: true,
      status: ExpenseStatus.processed
    },
    include: { category: true, card: true, expenseOwner: true, vendor: true }
  });

  await db.upload.update({ where: { id: upload.id }, data: { expenseId: expense.id } });
  await db.expenseItem.createMany({
    data: (aiResult.items ?? []).map((item) => ({
      expenseId: expense.id,
      name: item.name,
      amount: item.amount,
      unitPrice: item.amount,
      quantity: 1
    }))
  });
  await logActivity(userId, 'expense.created', 'Expense', expense.id, { vendorName, amount: total, categoryId: category.id });

  if (params.autoQueue !== false) {
    await receiptQueue.add('process-receipt', { expenseId: expense.id, uploadId: upload.id }, { removeOnComplete: true, attempts: 3 });
  }

  return { duplicate: false, expenseId: expense.id, uploadId: upload.id, expense };
}
