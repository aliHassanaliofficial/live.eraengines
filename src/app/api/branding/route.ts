import { type NextRequest } from "next/server";
import { listBrandingLogos } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? undefined;

  try {
    const data = await listBrandingLogos(category);
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to load logos." }, { status: 500 });
  }
}
