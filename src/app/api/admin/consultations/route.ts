import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  listConsultations,
  updateConsultation,
  deleteConsultation,
  type Consultation,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set(["new", "contacted", "done"]);

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function GET(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  if (status && !VALID_STATUSES.has(status)) {
    return Response.json({ error: "Invalid status filter." }, { status: 400 });
  }

  try {
    const data: Consultation[] = await listConsultations({
      status,
      search,
      limit: 200,
    });
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to load consultations." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof body?.id === "string" ? body.id : "";
  const status = typeof body?.status === "string" ? body.status : "";
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });
  if (!VALID_STATUSES.has(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const updated = await updateConsultation(id, { status });
    if (!updated) return Response.json({ error: "Not found." }, { status: 404 });
    return Response.json({ data: updated });
  } catch {
    return Response.json({ error: "Failed to update." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let id = request.nextUrl.searchParams.get("id") ?? "";
  if (!id) {
    try {
      const body = await request.json();
      id = typeof body?.id === "string" ? body.id : "";
    } catch {
      // fall through to validation below
    }
  }

  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  try {
    await deleteConsultation(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to delete." }, { status: 500 });
  }
}
