import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/request-auth';
import { expenseUpdateSchema } from '@/lib/schemas';
import { logActivity } from '@/lib/activity';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const expense = await db.expense.findUnique({
    where: { id },
    include: { category: true, card: true, uploadedBy: true, expenseOwner: true, vendor: true, items: true, uploads: true }
  });

  if (!expense) return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
  return NextResponse.json({ expense });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const payload = expenseUpdateSchema.safeParse(await request.json().catch(() => ({})));
  if (!payload.success) {
    return NextResponse.json({ message: 'Invalid expense payload', issues: payload.error.flatten() }, { status: 400 });
  }

  const expense = await db.expense.update({ where: { id }, data: payload.data, include: { category: true, card: true, uploadedBy: true, expenseOwner: true, vendor: true } });
  await logActivity(auth.user.id, 'expense.updated', 'Expense', expense.id, payload.data as Record<string, unknown>);
  return NextResponse.json({ expense });
}
