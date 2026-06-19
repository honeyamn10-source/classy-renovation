import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/request-auth';
import { processReceiptUpload } from '@/lib/receipt-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const uploadedById = String(formData.get('uploadedById') ?? auth.user.id);
  const expenseOwnerId = String(formData.get('expenseOwnerId') ?? uploadedById);
  const notes = String(formData.get('notes') ?? '');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Receipt file is required' }, { status: 400 });
  }

  const result = await processReceiptUpload({
    userId: uploadedById,
    file,
    expenseOwnerId,
    visibleTo: ['Parget', 'Rajan'],
    notes: notes || undefined
  });

  if (result.duplicate) {
    return NextResponse.json({ ...result, duplicate: true });
  }

  return NextResponse.json(result, { status: 201 });
}
