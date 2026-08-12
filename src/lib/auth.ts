import { createHmac, timingSafeEqual } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "";
const COOKIE_NAME = "ee_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export { COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

function sign(data: string): string {
  return createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !SESSION_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts as [string, string];
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return false;
  if (!timingSafeEqual(expected, provided)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (typeof decoded.exp !== "number" || decoded.exp < Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !input) return false;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
