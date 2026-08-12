import { type NextRequest } from "next/server";
import { createConsultation } from "@/lib/supabase";
import { validateConsultation } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!rateLimit(`consultations:${ip}`, 5, 10 * 60 * 1000)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill this hidden field. Silently accept to not leak logic.
  if (body && typeof body === "object") {
    const raw = body as Record<string, unknown>;
    if (raw.company_website) {
      return Response.json({ ok: true, accepted: true }, { status: 201 });
    }
  }

  const result = validateConsultation(body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    const created = await createConsultation(result.data);
    return Response.json(
      { ok: true, id: created.id, created_at: created.created_at },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Could not save your request. Please try again later." },
      { status: 500 }
    );
  }
}
