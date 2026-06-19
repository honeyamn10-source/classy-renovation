import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInsightNarrative } from '@/lib/insights';

export default async function InsightsPage() {
  const insights = await getInsightNarrative();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight} className="rounded-3xl border border-gold-200 bg-gold-50/80 p-4 text-sm text-ink-800 dark:border-gold-900/50 dark:bg-gold-950/30 dark:text-gold-50">
            {insight}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
