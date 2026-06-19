import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

export default async function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expense = await db.expense.findUnique({
    where: { id },
    include: { category: true, card: true, uploadedBy: true, expenseOwner: true, vendor: true, items: true, uploads: true, approvedBy: true }
  });

  if (!expense) notFound();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{expense.vendorName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Date: {new Date(expense.date).toLocaleString()}</div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Category: {expense.category?.name ?? 'Uncategorized'}</div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Paid By: {expense.expenseOwner.name}</div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Card: {expense.card?.cardName ?? 'Cash'}</div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Uploaded By: {expense.uploadedBy.name}</div>
            <div className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">Confidence: {(expense.confidenceScore * 100).toFixed(0)}%</div>
          </div>
          <div className="rounded-3xl border border-ink-200 p-4 dark:border-ink-800">
            <div className="text-sm text-ink-500">Receipt OCR</div>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-ink-700 dark:text-ink-200">{expense.ocrText ?? 'No OCR text available.'}</pre>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Subtotal', value: expense.subtotal },
              { label: 'Tax', value: expense.tax },
              { label: 'Total', value: expense.amount },
              { label: 'Currency', value: expense.currency }
            ].map(({ label, value }) => (
              <div key={label} className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
                <div className="text-sm text-ink-500">{label}</div>
                <div className="text-xl font-semibold">
                  {label === 'Currency' ? String(value) : formatCurrency(Number(value), expense.currency)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expense.items.length ? expense.items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-ink-500">Qty {item.quantity ?? 1} · {formatCurrency(Number(item.amount), expense.currency)}</div>
            </div>
          )) : <div className="text-sm text-ink-500">No itemized line items were extracted.</div>}
          <div className="rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
            <div className="font-semibold">Audit trail</div>
            <div className="text-sm text-ink-500">Receipt file stored: {expense.uploads[0]?.storageKey ?? 'No file linked'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
