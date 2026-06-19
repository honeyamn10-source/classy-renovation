import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export async function logActivity(userId: string, action: string, entityType?: string, entityId?: string, metadata?: Record<string, unknown>) {
  return db.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined
    }
  });
}
