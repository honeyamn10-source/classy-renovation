import { CategoryGroup, Prisma, type Expense } from '@prisma/client';

export type DashboardMetrics = {
  totalThisMonth: number;
  totalLastMonth: number;
  yearToDate: number;
  taxPaid: number;
  materialCost: number;
  toolCost: number;
  fuelCost: number;
  mealsCost: number;
  businessCardSpend: number;
  personalCardSpend: number;
  pargetSpend: number;
  rajanSpend: number;
};

export function sumExpenses(expenses: Array<Pick<Expense, 'amount' | 'tax'>>) {
  return expenses.reduce(
    (acc, expense) => {
      acc.total += Number(expense.amount);
      acc.tax += Number(expense.tax ?? 0);
      return acc;
    },
    { total: 0, tax: 0 }
  );
}

export function groupByCategory(expenses: Array<{ categoryName: string; amount: number }>) {
  const map = new Map<string, number>();
  expenses.forEach((expense) => {
    map.set(expense.categoryName, (map.get(expense.categoryName) ?? 0) + expense.amount);
  });
  return [...map.entries()].map(([name, amount]) => ({ name, amount }));
}

export function groupByVendor(expenses: Array<{ vendorName: string; amount: number }>) {
  const map = new Map<string, { total: number; count: number }>();
  expenses.forEach((expense) => {
    const current = map.get(expense.vendorName) ?? { total: 0, count: 0 };
    current.total += expense.amount;
    current.count += 1;
    map.set(expense.vendorName, current);
  });
  return [...map.entries()].map(([vendor, stats]) => ({ vendor, ...stats }));
}

export function categorySpend(expenses: Array<{ categoryGroup: CategoryGroup; amount: number }>) {
  return expenses.reduce(
    (acc, expense) => {
      if (expense.categoryGroup === 'renovation') acc.materialCost += expense.amount;
      if (expense.categoryGroup === 'tools') acc.toolCost += expense.amount;
      if (expense.categoryGroup === 'vehicle') acc.fuelCost += expense.amount;
      if (expense.categoryGroup === 'operations') acc.mealsCost += expense.amount;
      return acc;
    },
    { materialCost: 0, toolCost: 0, fuelCost: 0, mealsCost: 0 }
  );
}
