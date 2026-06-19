import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

export default async function TaxPage() {
  const expenses = await db.expense.findMany({ orderBy: { date: 'desc' }, take: 200, include: { category: true, vendor: true } });
  const totalTax = expenses.reduce((sum, expense) => sum + Number(expense.tax), 0);
  const vendorTotals = expenses.reduce((acc, expense) => {
    acc[expense.vendorName] = (acc[expense.vendorName] ?? 0) + Number(expense.tax);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tax Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
            <div className="text-sm text-ink-500">Tax paid</div>
            <div className="text-3xl font-semibold">{formatCurrency(totalTax)}</div>
          </div>
          <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
            <div className="text-sm text-ink-500">Sample exports</div>
            <div className="text-sm">GST, HST, sales tax, and CPA-ready monthly reports.</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax by Vendor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(vendorTotals)
            .slice(0, 8)
            .map(([vendor, value]) => (
              <div key={vendor} className="flex items-center justify-between rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
                <div>{vendor}</div>
                <div className="font-semibold">{formatCurrency(value)}</div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
