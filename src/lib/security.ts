import crypto from 'crypto';
import { getEnv } from '@/lib/env';

const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const current = memoryRateLimits.get(key);

  if (!current || current.resetAt < now) {
    memoryRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  memoryRateLimits.set(key, current);
  return { allowed: true, remaining: limit - current.count };
}

export function sha256(input: Buffer | string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function validateUploadFile(file: File) {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/pdf'
  ];

  if (!allowed.includes(file.type)) {
    throw new Error('Unsupported file type. Upload a receipt image or PDF.');
  }

  const maxBytes = 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('File too large. Maximum size is 25MB.');
  }
}

export function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

export function getLocalUploadsPath() {
  return process.env.UPLOADS_DIR ?? 'uploads';
}
