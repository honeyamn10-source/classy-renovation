import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/request-auth';
import { expenseTableRecord } from '@/lib/dashboard';

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const expenses = await db.expense.findMany({
    orderBy: { date: 'desc' },
    take: 200,
    include: { category: true, card: true, uploadedBy: true, expenseOwner: true, vendor: true }
  });

  return NextResponse.json({ expenses: expenses.map(expenseTableRecord) });
}
