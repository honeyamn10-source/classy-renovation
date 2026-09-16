import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  AUTH_ISSUER: z.string().default('classy-renovations'),
  APP_URL: z.string().url().optional(),
  REDIS_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1'),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  GOOGLE_VISION_PROJECT_ID: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().default('receipts'),
  ENCRYPTION_KEY: z.string().optional()
});

export function getEnv() {
  return envSchema.parse(process.env);
}

export function hasProductionSecrets() {
  const env = getEnv();
  return Boolean(env.DATABASE_URL && env.JWT_SECRET && env.ENCRYPTION_KEY);
}
