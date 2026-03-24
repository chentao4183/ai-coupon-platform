import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';

function getSecretKey() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_PASSWORD must be at least 16 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  const secretKey = getSecretKey();
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const secretKey = getSecretKey();
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function getAuthStatus(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return false;
    }

    return verifySession(token);
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
