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
              { label: 'Total', value: summary.totalAmount },
              { label: 'Parget / Rajan Book', value: summary.businessCardAmount },
              { label: 'Tax', value: summary.taxAmount },
              { label: 'Materials', value: summary.materialAmount },
              { label: 'Tools', value: summary.toolAmount },
              { label: 'Fuel', value: summary.fuelAmount },
              { label: 'Meals', value: summary.mealsAmount },
              { label: 'Misc', value: summary.miscAmount }
            ].map(({ label, value }) => (
              <div key={label} className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
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
