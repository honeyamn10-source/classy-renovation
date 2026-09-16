import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/request-auth';

export async function GET(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.user.id,
      name: auth.user.name,
      role: auth.user.role
    },
    session: {
      id: auth.session.id,
      expiresAt: auth.session.expiresAt,
      deviceLabel: auth.session.deviceLabel
    }
  });
}
