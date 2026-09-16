import { Prisma, type Expense } from '@prisma/client';
import { db } from '@/lib/db';
import { categorySpend, groupByCategory, groupByVendor, sumExpenses } from '@/lib/analytics';

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value == null) return 0;
  return Number(value);
}

export async function getDashboardSnapshot() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [thisMonth, lastMonth, ytd, expenses, cards, categories, vendors] = await Promise.all([
    db.expense.findMany({ where: { date: { gte: monthStart } }, include: { card: true, category: true, vendor: true, expenseOwner: true } }),
    db.expense.findMany({ where: { date: { gte: lastMonthStart, lt: monthStart } }, include: { card: true, category: true, vendor: true, expenseOwner: true } }),
    db.expense.findMany({ where: { date: { gte: yearStart } }, include: { card: true, category: true, vendor: true, expenseOwner: true } }),
    db.expense.findMany({ orderBy: { date: 'desc' }, take: 50, include: { card: true, category: true, vendor: true, uploadedBy: true, expenseOwner: true } }),
    db.card.findMany({ where: { isActive: true }, include: { owner: true } }),
    db.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    db.vendor.findMany({ orderBy: [{ totalSpend: 'desc' }, { purchaseCount: 'desc' }], take: 10, include: { category: true } })
  ]);

  const thisMonthTotals = sumExpenses(thisMonth);
  const lastMonthTotals = sumExpenses(lastMonth);
  const ytdTotals = sumExpenses(ytd);

  const cardSpend = cards.reduce(
    (acc, card) => {
      const total = expenses.filter((expense) => expense.cardId === card.id).reduce((sum, expense) => sum + toNumber(expense.amount), 0);
      acc[card.cardName] = total;
      return acc;
    },
    {} as Record<string, number>
  );

  const partnerSpend = expenses.reduce(
    (acc, expense) => {
      const ownerName = expense.expenseOwner.name;
      acc[ownerName] = (acc[ownerName] ?? 0) + toNumber(expense.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryRows = categories.map((category) => ({
    name: category.name,
    amount: expenses.filter((expense) => expense.categoryId === category.id).reduce((sum, expense) => sum + toNumber(expense.amount), 0)
  }));

  const topVendors = groupByVendor(expenses.map((expense) => ({ vendorName: expense.vendorName, amount: toNumber(expense.amount) }))).slice(0, 5);
  const largestExpenses = [...expenses].sort((a, b) => toNumber(b.amount) - toNumber(a.amount)).slice(0, 10);

  return {
    metrics: {
      totalThisMonth: thisMonthTotals.total,
      totalLastMonth: lastMonthTotals.total,
      yearToDate: ytdTotals.total,
      taxPaid: ytdTotals.tax,
      materialCost: categoryRows.find((row) => row.name === 'Materials')?.amount ?? 0,
      toolCost: categoryRows.find((row) => row.name === 'Tools')?.amount ?? 0,
      fuelCost: categoryRows.find((row) => row.name === 'Fuel')?.amount ?? 0,
      mealsCost: categoryRows.find((row) => row.name === 'Meals')?.amount ?? 0,
      businessCardSpend: cards
        .filter((card) => card.ownership === 'business')
        .reduce((sum, card) => sum + (cardSpend[card.cardName] ?? 0), 0),
      personalCardSpend: cards
        .filter((card) => card.ownership === 'personal')
        .reduce((sum, card) => sum + (cardSpend[card.cardName] ?? 0), 0),
      pargetSpend: partnerSpend['Parget'] ?? 0,
      rajanSpend: partnerSpend['Rajan'] ?? 0
    },
    series: {
      categories: categoryRows,
      cards: cards.map((card) => ({ name: card.cardName, amount: cardSpend[card.cardName] ?? 0, owner: card.owner.name, ownership: card.ownership })),
      vendors: topVendors.map((vendor) => ({ name: vendor.vendor, amount: vendor.total, count: vendor.count })),
      monthly: [
        { name: 'Last Month', amount: lastMonthTotals.total },
        { name: 'This Month', amount: thisMonthTotals.total },
        { name: 'YTD', amount: ytdTotals.total }
      ]
    },
    tables: {
      latestExpenses: largestExpenses,
      topVendors,
      categoryRows
    },
    raw: {
      expenses,
      cards,
      categories,
      vendors
    }
  };
}

export async function getExpenseFilters() {
  const [users, categories, cards, vendors] = await Promise.all([
    db.user.findMany({ orderBy: { name: 'asc' } }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.card.findMany({ include: { owner: true }, orderBy: { cardName: 'asc' } }),
    db.vendor.findMany({ orderBy: { name: 'asc' } })
  ]);

  return { users, categories, cards, vendors };
}

export function expenseTableRecord(expense: any) {
  return {
    id: expense.id,
    date: expense.date,
    vendor: expense.vendorName,
    category: expense.category?.name ?? 'Uncategorized',
    amount: toNumber(expense.amount),
    tax: toNumber(expense.tax),
    paidBy: expense.expenseOwner.name,
    cardUsed: expense.card?.cardName ?? 'Cash',
    ownership: expense.businessPersonal,
    uploadedBy: expense.uploadedBy.name,
    receiptExists: expense.receiptExists,
    confidenceScore: expense.confidenceScore,
    visibleTo: expense.visibleTo,
    notes: expense.notes,
    status: expense.status,
    ownerId: expense.expenseOwnerId,
    cardId: expense.cardId,
    categoryId: expense.categoryId,
    uploadedById: expense.uploadedById
  };
}
