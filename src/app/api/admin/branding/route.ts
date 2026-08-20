import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  createBrandingLogo,
  listBrandingLogos,
  deleteBrandingLogo,
  uploadBrandingFile,
  deleteBrandingFile,
  getBrandingFileUrl,
} from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
  "image/bmp",
  "image/x-icon",
]);

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await listBrandingLogos();
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to load logos." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`branding-upload:${ip}`, 5, 600_000);
  if (!limited) {
    return Response.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();

  if (!file || !title || !category) {
    return Response.json({ error: "Missing file, title, or category." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File too large. Maximum 20MB." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Invalid file type." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    await uploadBrandingFile(filePath, arrayBuffer, file.type);

    const fileUrl = getBrandingFileUrl(filePath);
    const logo = await createBrandingLogo({
      title,
      category,
      file_url: fileUrl,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
    });

    return Response.json({ data: logo }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to upload logo." }, { status: 500 });
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
    const logos = await listBrandingLogos();
    const logo = logos.find((l) => l.id === id);
    if (logo?.file_path) {
      await deleteBrandingFile(logo.file_path);
    }
    await deleteBrandingLogo(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to delete." }, { status: 500 });
  }
}
