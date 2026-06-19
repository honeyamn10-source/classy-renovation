import { z } from 'zod';

export const loginSchema = z.object({
  userId: z.string().min(1),
  pin: z.string().regex(/^\d{4}$/),
  rememberDevice: z.boolean().default(false)
});

export const cardSchema = z.object({
  cardName: z.string().min(2),
  bank: z.string().min(2),
  type: z.enum(['credit', 'debit']),
  ownership: z.enum(['business', 'personal']),
  ownerId: z.string().min(1),
  last4: z.string().regex(/^\d{4}$/),
  color: z.string().optional()
});

export const expenseUpdateSchema = z.object({
  categoryId: z.string().nullable().optional(),
  cardId: z.string().nullable().optional(),
  expenseOwnerId: z.string().min(1).optional(),
  amount: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  subtotal: z.number().nonnegative().optional(),
  paidByLabel: z.string().optional(),
  notes: z.string().nullable().optional(),
  visibleTo: z.array(z.string()).optional(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional()
});

export const uploadQuerySchema = z.object({
  uploadedById: z.string().min(1),
  expenseOwnerId: z.string().min(1).optional()
});

export const reportQuerySchema = z.object({
  period: z.enum(['month', 'partner', 'card', 'vendor', 'category', 'tax', 'annual']).default('month'),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional()
});
