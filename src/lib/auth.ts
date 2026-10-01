import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Server-only auth helpers for Artnest BD.
 * - Passwords: scrypt with per-user random salt, stored as "salt:hash".
 * - Sessions: stateless HMAC-signed tokens in an httpOnly cookie.
 */

const SECRET = process.env.AUTH_SECRET ?? "artnest-bd-dev-secret-change-me";

export const SESSION_COOKIE = "artnest_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(userId: string): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  const expected = Buffer.from(sign(payload), "hex");
  const received = Buffer.from(signature, "hex");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }
  if (!Number.isFinite(Number(expires)) || Number(expires) < Date.now()) {
    return null;
  }
  return userId;
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidBdPhone(phone: string): boolean {
  return /^01[3-9]\d{8}$/.test(phone);
}

export function publicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}
