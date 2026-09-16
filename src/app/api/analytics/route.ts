import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/request-auth';
import { getDashboardSnapshot } from '@/lib/dashboard';
import { getInsightNarrative } from '@/lib/insights';

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const [dashboard, insights] = await Promise.all([getDashboardSnapshot(), getInsightNarrative()]);
  return NextResponse.json({ dashboard, insights });
}
