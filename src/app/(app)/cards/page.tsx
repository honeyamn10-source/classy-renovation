import { db } from '@/lib/db';
import { Card as UiCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardForm } from '@/components/card-form';

export default async function CardsPage() {
  const [users, cards] = await Promise.all([
    db.user.findMany({ orderBy: { name: 'asc' } }),
    db.card.findMany({ include: { owner: true }, orderBy: [{ owner: { name: 'asc' } }, { cardName: 'asc' }] })
  ]);

  return (
    <div className="space-y-8">
      <CardForm users={users.map((user) => ({ id: user.id, name: user.name }))} />
      <UiCard>
        <CardHeader>
          <CardTitle>Stored Cards</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="rounded-3xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-800/60">
              <div className="text-xs uppercase tracking-[0.2em] text-gold-700">{card.ownership} · {card.type}</div>
              <div className="mt-2 text-xl font-semibold">{card.cardName}</div>
              <div className="text-sm text-ink-500">{card.bank} •••• {card.last4}</div>
              <div className="mt-4 text-sm text-ink-600 dark:text-ink-300">Owner: {card.owner.name}</div>
            </div>
          ))}
        </CardContent>
      </UiCard>
    </div>
  );
}
