import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { isProduction, loadEnv } from './env';

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7;

export function adminPassword(): string | null {
  loadEnv();
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (isProduction()) return null;
  return 'changeme';
}

function secret(): string | null {
  loadEnv();
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (isProduction()) return null;
  return 'dev-only-secret';
}

function sign(payload: string, key: string) {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

export function passwordMatches(input: string) {
  const expected = adminPassword();
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function setSession(cookies: AstroCookies) {
  const key = secret();
  if (!key) throw new Error('AUTH_SECRET is not set.');
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: Date.now() + MAX_AGE * 1000 }),
  ).toString('base64url');
  cookies.set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProduction(),
    maxAge: MAX_AGE,
  });
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export function isAdmin(cookies: AstroCookies) {
  const token = cookies.get(COOKIE)?.value;
  const key = secret();
  if (!token || !key) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload, key);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number };
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}
