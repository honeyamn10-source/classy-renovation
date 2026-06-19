import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/request-auth';
import { revokeSession } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  const auth = await getAuthFromRequest(request);
  if (auth) {
    await revokeSession(auth.session.id);
    await logActivity(auth.user.id, 'auth.logout', 'Session', auth.session.id, {});
  }

  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.set('cr_session', '', { path: '/', expires: new Date(0) });
  return response;
}
