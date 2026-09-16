import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalyticsCharts } from '@/components/charts';
import { StatCard } from '@/components/stat-card';
import { getDashboardSnapshot } from '@/lib/dashboard';
import { formatCurrency } from '@/lib/format';
import { getInsightNarrative } from '@/lib/insights';

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const insights = await getInsightNarrative();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Expenses" value={formatCurrency(snapshot.metrics.totalThisMonth)} sublabel="This Month" delta={`${((snapshot.metrics.totalThisMonth / Math.max(snapshot.metrics.totalLastMonth, 1) - 1) * 100).toFixed(1)}% vs last month`} />
        <StatCard label="Year to Date" value={formatCurrency(snapshot.metrics.yearToDate)} sublabel="All expenses this year" delta={formatCurrency(snapshot.metrics.taxPaid)} />
        <StatCard label="Parget Spending" value={formatCurrency(snapshot.metrics.pargetSpend)} sublabel="Partner spend" delta={formatCurrency(snapshot.metrics.rajanSpend)} />
        <StatCard label="Card Spend" value={formatCurrency(snapshot.metrics.businessCardSpend + snapshot.metrics.personalCardSpend)} sublabel="Business + personal cards" delta={formatCurrency(snapshot.metrics.personalCardSpend)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Executive Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Material Cost', snapshot.metrics.materialCost],
              ['Tool Cost', snapshot.metrics.toolCost],
              ['Fuel Cost', snapshot.metrics.fuelCost],
              ['Meals Cost', snapshot.metrics.mealsCost]
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-3xl bg-ink-50 p-4 dark:bg-ink-800/60">
                <div className="text-sm text-ink-500">{label}</div>
                <div className="mt-2 text-2xl font-semibold">{formatCurrency(Number(value))}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-3xl border border-gold-200 bg-gold-50/70 p-4 text-sm text-ink-800 dark:border-gold-900/50 dark:bg-gold-950/30 dark:text-gold-50">
                {insight}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts categories={snapshot.series.categories} cards={snapshot.series.cards} vendors={snapshot.series.vendors} monthly={snapshot.series.monthly} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.tables.topVendors.map((vendor) => (
              <div key={vendor.vendor} className="flex items-center justify-between rounded-2xl bg-ink-50 px-4 py-3 dark:bg-ink-800/60">
                <div>
                  <div className="font-semibold">{vendor.vendor}</div>
                  <div className="text-xs text-ink-500">{vendor.count} purchases</div>
                </div>
                <Badge>${vendor.total.toFixed(2)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Largest Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.tables.latestExpenses.map((expense: any) => (
              <div key={expense.id} className="rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{expense.vendorName}</div>
                    <div className="text-xs text-ink-500">{new Date(expense.date).toLocaleDateString()} · {expense.category?.name ?? 'Uncategorized'}</div>
                  </div>
                  <div className="font-semibold">{formatCurrency(Number(expense.amount))}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
