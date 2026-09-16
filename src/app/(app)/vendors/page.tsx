import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

export default async function VendorsPage() {
  const vendors = await db.vendor.findMany({ orderBy: [{ totalSpend: 'desc' }, { purchaseCount: 'desc' }], include: { category: true }, take: 20 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Analytics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="rounded-3xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
            <div className="text-xs uppercase tracking-[0.16em] text-gold-700">{vendor.category?.name ?? 'Uncategorized'}</div>
            <div className="mt-2 text-xl font-semibold">{vendor.name}</div>
            <div className="mt-3 text-sm text-ink-500">Total spend</div>
            <div className="text-2xl font-semibold">{formatCurrency(Number(vendor.totalSpend))}</div>
            <div className="text-sm text-ink-500">{vendor.purchaseCount} purchases</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
