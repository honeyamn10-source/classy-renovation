import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/jwt';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login', '/api/health'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('cr_session')?.value;
  const auth = token
    ? await verifySessionToken(token)
        .then(({ payload }) => ({ sub: String(payload.sub ?? ''), name: String(payload.name ?? ''), role: String(payload.role ?? '') }))
        .catch(() => null)
    : null;

  if (!auth) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id', auth.sub);
  response.headers.set('x-user-name', auth.name);
  response.headers.set('x-user-role', auth.role);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
