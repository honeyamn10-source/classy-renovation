import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function StatCard({ label, value, delta, sublabel }: { label: string; value: string; delta?: string; sublabel?: string }) {
  return (
    <Card className="overflow-hidden bg-white/95 dark:bg-ink-900/90">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-2 text-sm text-ink-500 dark:text-ink-300">
        <span>{sublabel}</span>
        <span className="rounded-full bg-gold-50 px-3 py-1 text-gold-800 dark:bg-gold-950 dark:text-gold-200">{delta}</span>
      </CardContent>
    </Card>
  );
}
