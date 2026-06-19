import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cardSchema } from '@/lib/schemas';
import { getAuthFromRequest } from '@/lib/request-auth';
import { logActivity } from '@/lib/activity';

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const cards = await db.card.findMany({ include: { owner: true }, orderBy: [{ owner: { name: 'asc' } }, { cardName: 'asc' }] });
  return NextResponse.json({ cards });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const payload = cardSchema.safeParse(await request.json().catch(() => ({})));
  if (!payload.success) {
    return NextResponse.json({ message: 'Invalid card payload', issues: payload.error.flatten() }, { status: 400 });
  }

  const card = await db.card.create({ data: payload.data, include: { owner: true } });
  await logActivity(auth.user.id, 'card.created', 'Card', card.id, payload.data);
  return NextResponse.json({ card }, { status: 201 });
}
