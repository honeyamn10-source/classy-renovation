import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/schemas';
import { createSession, verifyPin } from '@/lib/auth';
import { rateLimit, sha256 } from '@/lib/security';
import { logActivity } from '@/lib/activity';
import { createAuthToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = await rateLimit(`login:${ip}`, 12, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ message: 'Too many login attempts. Try again in a minute.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid login payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { name: parsed.data.userId } });
  if (!user) {
    return NextResponse.json({ message: 'Invalid partner credentials' }, { status: 401 });
  }

  const valid = await verifyPin(parsed.data.pin, user.pinHash);
  if (!valid) {
    await logActivity(user.id, 'auth.login_failed', 'Session', undefined, { ip });
    return NextResponse.json({ message: 'Invalid partner credentials' }, { status: 401 });
  }

  const session = await createSession(user.id, parsed.data.rememberDevice, { ipAddress: ip, userAgent: request.headers.get('user-agent') ?? undefined });
  const token = await createAuthToken({ id: user.id, name: user.name, role: user.role }, session.id);
  await db.userSession.update({ where: { id: session.id }, data: { tokenHash: sha256(token) } });

  const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
  response.cookies.set('cr_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: parsed.data.rememberDevice ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  });

  await logActivity(user.id, 'auth.login', 'Session', session.id, { rememberDevice: parsed.data.rememberDevice, ip });
  return response;
}
