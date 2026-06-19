import { db } from '@/lib/db';
import { getExpenseFilters, expenseTableRecord } from '@/lib/dashboard';
import { ExpensesTable } from '@/components/expenses-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadForm } from '@/components/upload-form';
import { formatCurrency } from '@/lib/format';

export default async function ExpensesPage() {
  const [filters, expenses] = await Promise.all([
    getExpenseFilters(),
    db.expense.findMany({
      orderBy: { date: 'desc' },
      take: 100,
      include: { category: true, card: true, uploadedBy: true, expenseOwner: true, vendor: true }
    })
  ]);

  const records = expenses.map(expenseTableRecord);
  const total = records.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <UploadForm users={filters.users} />
        <Card>
          <CardHeader>
            <CardTitle>Receipts & Bills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
              <div className="text-sm text-ink-500">Receipts tracked</div>
              <div className="text-3xl font-semibold">{records.length}</div>
            </div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
              <div className="text-sm text-ink-500">Total spend shown</div>
              <div className="text-3xl font-semibold">{formatCurrency(total)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Register</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={records} />
        </CardContent>
      </Card>
    </div>
  );
}
