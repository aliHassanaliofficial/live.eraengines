import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  createSocialLink,
  listSocialLinks,
  updateSocialLink,
  deleteSocialLink,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await listSocialLinks();
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to load social links." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { platform?: string; url?: string; label?: string; sort_order?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const platform = typeof body?.platform === "string" ? body.platform.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!platform || !url) {
    return Response.json({ error: "Missing platform or URL." }, { status: 400 });
  }

  try {
    const link = await createSocialLink({
      platform,
      url,
      label: body?.label?.trim() || undefined,
      sort_order: body?.sort_order,
    });
    return Response.json({ data: link }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create social link." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; platform?: string; url?: string; label?: string; sort_order?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  const patch: Record<string, string | number> = {};
  if (typeof body.platform === "string") patch.platform = body.platform.trim();
  if (typeof body.url === "string") patch.url = body.url.trim();
  if (typeof body.label === "string") patch.label = body.label.trim();
  if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "No fields to update." }, { status: 400 });
  }

  try {
    const updated = await updateSocialLink(id, patch);
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
      // fall through
    }
  }

  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  try {
    await deleteSocialLink(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to delete." }, { status: 500 });
  }
}
