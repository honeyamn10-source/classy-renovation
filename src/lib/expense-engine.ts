import { CategoryGroup, Prisma, type Expense, type ExpenseRule, type Vendor } from '@prisma/client';
import { db } from '@/lib/db';

const vendorRules: Array<{ pattern: RegExp; category: string }> = [
  { pattern: /home\s*depot/i, category: 'Materials' },
  { pattern: /rona/i, category: 'Materials' },
  { pattern: /lowes/i, category: 'Materials' },
  { pattern: /sherwin/i, category: 'Materials' },
  { pattern: /napa|canadian tire|home hardware/i, category: 'Tools' },
  { pattern: /esso|shell|petro|gas station|fuel/i, category: 'Fuel' },
  { pattern: /mcdonald|subway|tim hortons|restaurant|cafe|coffee/i, category: 'Meals' },
  { pattern: /microsoft|adobe|quickbooks|google workspace|canva/i, category: 'Software' }
];

export async function detectCategory(vendorName: string, aiCategory?: string) {
  if (aiCategory) return aiCategory;

  const localRule = vendorRules.find((rule) => rule.pattern.test(vendorName));
  if (localRule) return localRule.category;

  const learnedVendor = await db.vendor.findFirst({ where: { normalizedName: vendorName.toLowerCase() }, include: { category: true } });
  if (learnedVendor?.category) return learnedVendor.category.name;

  return 'Miscellaneous';
}

export async function learnVendor(vendorName: string, categoryId?: string | null) {
  const normalizedName = vendorName.trim().toLowerCase();
  const existing = await db.vendor.findUnique({ where: { normalizedName } });

  if (existing) {
    return db.vendor.update({
      where: { id: existing.id },
      data: { purchaseCount: { increment: 1 }, lastSeenAt: new Date(), categoryId: categoryId ?? existing.categoryId }
    });
  }

  return db.vendor.create({
    data: {
      name: vendorName.trim(),
      normalizedName,
      purchaseCount: 1,
      lastSeenAt: new Date(),
      categoryId: categoryId ?? null
    }
  });
}

export async function applyExpenseRules(vendorName: string, ownerId: string) {
  const rules = await db.expenseRule.findMany({ where: { active: true } });
  const normalized = vendorName.toLowerCase();

  return rules.filter((rule) => normalized.includes(rule.vendorPattern.toLowerCase()) && (!rule.ownerId || rule.ownerId === ownerId));
}

export async function detectDuplicateExpense(sourceHash: string) {
  return db.expense.findFirst({ where: { sourceHash } });
}

export function summarizeExpense(expense: Pick<Expense, 'amount' | 'tax' | 'categoryId'>) {
  return {
    total: Number(expense.amount),
    tax: Number(expense.tax ?? 0)
  };
}

export function categoryGroupFromName(name: string) {
  const map: Record<string, CategoryGroup> = {
    Materials: 'renovation',
    Tools: 'renovation',
    Fuel: 'vehicle',
    Vehicle: 'vehicle',
    Meals: 'operations',
    Office: 'operations',
    Software: 'technology',
    Marketing: 'marketing',
    Miscellaneous: 'operations'
  };

  return map[name] ?? 'operations';
}
