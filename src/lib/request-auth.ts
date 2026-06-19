import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifySessionToken } from '@/lib/jwt';
import { AUTH_COOKIE } from '@/lib/auth';

export async function getAuthFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await verifySessionToken(token);
    const sessionId = String(payload.sid ?? '');
    if (!sessionId) return null;

    const session = await db.userSession.findUnique({ where: { id: sessionId }, include: { user: true } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) return null;

    return {
      user: session.user,
      session,
      token,
      auth: {
        sub: String(payload.sub ?? ''),
        name: String(payload.name ?? ''),
        role: String(payload.role ?? '')
      }
    };
  } catch {
    return null;
  }
}
