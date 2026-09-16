import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { getEnv } from '@/lib/env';

const env = getEnv();

type QueueLike = Pick<Queue, 'add'>;

const connection = env.REDIS_URL ? new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null }) : null;

const noOpQueue: QueueLike = {
  async add() {
    return undefined as never;
  }
};

export const receiptQueue: QueueLike = connection
  ? new Queue('receipt-processing', { connection })
  : noOpQueue;
