import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';

export default async function MonthlySummaryPage() {
  const summaries = await db.monthlySummary.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }], include: { createdBy: true }, take: 12 });

  return (
    <div className="space-y-6">
      {summaries.map((summary) => (
        <Card key={summary.id}>
          <CardHeader>
            <CardTitle>{summary.month}/{summary.year} Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Total', summary.totalAmount],
              ['Parget / Rajan Book', summary.businessCardAmount],
              ['Tax', summary.taxAmount],
              ['Materials', summary.materialAmount],
              ['Tools', summary.toolAmount],
              ['Fuel', summary.fuelAmount],
              ['Meals', summary.mealsAmount],
              ['Misc', summary.miscAmount]
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
                <div className="text-sm text-ink-500">{label}</div>
                <div className="text-2xl font-semibold">{formatCurrency(Number(value))}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
