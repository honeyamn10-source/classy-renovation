import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function logActivity(userId: string, action: string, entityType?: string, entityId?: string, metadata?: Prisma.InputJsonObject) {
  return db.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata ?? undefined
    }
  });
}
