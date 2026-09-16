import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { getEnv } from '@/lib/env';
import { getLocalUploadsPath, sanitizeFileName } from '@/lib/security';

export type StoredFile = {
  storageKey: string;
  publicUrl: string;
  mimeType: string;
};

async function ensureLocalDir() {
  await mkdir(getLocalUploadsPath(), { recursive: true });
}

export async function storeReceiptFile(file: File, sha256: string) {
  const env = getEnv();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const storageKey = `receipts/${sha256}-${sanitizeFileName(file.name)}`;
    const { error } = await client.storage.from(env.SUPABASE_BUCKET).upload(storageKey, buffer, {
      contentType: file.type,
      upsert: true
    });
    if (error) throw error;
    const { data } = client.storage.from(env.SUPABASE_BUCKET).getPublicUrl(storageKey);
    return { storageKey, publicUrl: data.publicUrl, mimeType: file.type } satisfies StoredFile;
  }

  await ensureLocalDir();
  const storageKey = `${sha256}-${sanitizeFileName(file.name)}`;
  const filePath = path.join(getLocalUploadsPath(), storageKey);
  await writeFile(filePath, buffer);

  return {
    storageKey: filePath,
    publicUrl: `/uploads/${storageKey}`,
    mimeType: file.type
  } satisfies StoredFile;
}
