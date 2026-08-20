import { listSocialLinks } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listSocialLinks();
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to load social links." }, { status: 500 });
  }
}
