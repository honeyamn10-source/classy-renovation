import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { signSessionToken, verifySessionToken } from '@/lib/jwt';

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  sessionId: string;
};

export const AUTH_COOKIE = 'cr_session';
export const REMEMBER_COOKIE = 'cr_remember';

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 12);
}

export async function verifyPin(pin: string, hash: string) {
  return bcrypt.compare(pin, hash);
}

export async function createAuthToken(user: { id: string; name: string; role: string }, sessionId: string) {
  return signSessionToken({ sub: user.id, name: user.name, role: user.role, sid: sessionId }, '12h');
}

export async function verifyAuthToken(token: string): Promise<AuthUser> {
  const { payload } = await verifySessionToken(token);

  return {
    id: payload.sub ?? '',
    name: String(payload.name ?? ''),
    role: String(payload.role ?? 'PARTNER'),
    sessionId: String(payload.sid ?? '')
  };
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const auth = await verifyAuthToken(token);
    const session = await db.userSession.findUnique({ where: { id: auth.sessionId }, include: { user: true } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return null;
    }
    return { ...auth, user: session.user };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, rememberDevice: boolean, meta?: { userAgent?: string; ipAddress?: string }) {
  const session = await db.userSession.create({
    data: {
      userId,
      tokenHash: '',
      deviceLabel: rememberDevice ? 'Remembered device' : 'Current session',
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
      expiresAt: rememberDevice ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : new Date(Date.now() + 1000 * 60 * 60 * 12)
    }
  });

  return session;
}

export async function buildAuthCookie(user: { id: string; name: string; role: string }, sessionId: string, rememberDevice: boolean) {
  const token = await createAuthToken(user, sessionId);
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: rememberDevice ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  });
}

export async function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, '', { path: '/', expires: new Date(0) });
}

export async function revokeSession(sessionId: string) {
  await db.userSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
}
