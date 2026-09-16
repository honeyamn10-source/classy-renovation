import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from '@/lib/env';

function secretKey() {
  const secret = getEnv().JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: { sub: string; name: string; role: string; sid: string }, expiresIn: string) {
  return new SignJWT({ name: payload.name, role: payload.role, sid: payload.sid })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuer(getEnv().AUTH_ISSUER)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey());
}

export async function verifySessionToken(token: string) {
  return jwtVerify(token, secretKey(), { issuer: getEnv().AUTH_ISSUER });
}
