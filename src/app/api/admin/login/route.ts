import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_MAX_AGE_SECONDS, createSessionToken, verifyPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!rateLimit(`admin-login:${ip}`, 6, 5 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyPassword(password)) {
    return Response.json({ error: "Invalid password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return Response.json({ ok: true });
}
