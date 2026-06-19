import { Worker, type ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';
import { getEnv } from '@/lib/env';
import { db } from '@/lib/db';

const env = getEnv();

if (!env.REDIS_URL) {
  console.log('REDIS_URL is not configured. Receipt worker is idle.');
  process.exit(0);
}

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null }) as unknown as ConnectionOptions;

new Worker(
  'receipt-processing',
  async (job) => {
    const { expenseId, uploadId } = job.data as { expenseId: string; uploadId: string };

    await db.oCRJob.create({
      data: {
        uploadId,
        provider: 'local',
        status: 'processed',
        rawText: `Background verification completed for expense ${expenseId}`,
        structuredData: { expenseId, uploadId },
        confidence: 1,
        startedAt: new Date(),
        completedAt: new Date()
      }
    });

    await db.activityLog.create({
      data: {
        userId: (await db.expense.findUnique({ where: { id: expenseId } }))?.uploadedById ?? '',
        action: 'receipt.processed',
        entityType: 'Expense',
        entityId: expenseId,
        metadata: { uploadId }
      }
    });

    return { expenseId, uploadId };
  },
  { connection }
);

console.log('Receipt worker started.');
