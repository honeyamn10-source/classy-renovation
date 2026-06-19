import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, service: 'classy-renovations-business-expense-manager', timestamp: new Date().toISOString() });
}
