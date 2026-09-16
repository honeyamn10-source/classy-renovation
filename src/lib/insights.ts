import { db } from '@/lib/db';
import { getDashboardSnapshot } from '@/lib/dashboard';
import { getEnv } from '@/lib/env';

export async function getInsightNarrative() {
  const snapshot = await getDashboardSnapshot();
  const env = getEnv();

  const fuelVsLastMonth = snapshot.metrics.fuelCost;
  const businessCardShare = snapshot.metrics.businessCardSpend / Math.max(snapshot.metrics.yearToDate, 1);
  const partnerGap = Math.abs(snapshot.metrics.pargetSpend - snapshot.metrics.rajanSpend);

  const heuristicInsights = [
    `Fuel expenses are currently $${fuelVsLastMonth.toFixed(2)} this period.`,
    `Business cards account for ${(businessCardShare * 100).toFixed(1)}% of year-to-date spend.`,
    `The spending gap between Parget and Rajan is $${partnerGap.toFixed(2)}.`
  ];

  if (!env.OPENAI_API_KEY) {
    return heuristicInsights;
  }

  const { OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: 'system',
        content:
          'You are a bookkeeping analyst for a renovation company. Produce 3 short business insights from the supplied analytics data. Keep them concrete, professional, and metric-based.'
      },
      {
        role: 'user',
        content: JSON.stringify(snapshot.metrics)
      }
    ]
  });

  const text = response.output_text?.trim();
  if (!text) return heuristicInsights;
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5);
}
