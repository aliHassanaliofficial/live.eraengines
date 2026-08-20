const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  type: string;
  preferred_date: string | null;
  created_at: string;
}

export interface ConsultationCreate {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  preferred_date?: string;
}

export class SupabaseError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

function ensureEnv() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new SupabaseError("Supabase environment variables are not configured", 500);
  }
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  ensureEnv();
  const headers = new Headers(init.headers);
  headers.set("apikey", SERVICE_ROLE_KEY!);
  headers.set("Authorization", `Bearer ${SERVICE_ROLE_KEY!}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SupabaseError(`Supabase request failed (${res.status}): ${text.slice(0, 300)}`, res.status);
  }
  return res;
}

export async function createConsultation(data: ConsultationCreate): Promise<Consultation> {
  const res = await supabaseFetch("/rest/v1/consultations", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  const rows = (await res.json()) as Consultation[];
  return rows[0];
}

export interface ListOptions {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listConsultations(options: ListOptions = {}): Promise<Consultation[]> {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", "created_at.desc");

  if (options.status) {
    params.set("status", `eq.${options.status}`);
  }
  if (options.search && options.search.trim()) {
    const term = options.search.trim().replace(/%/g, "").replace(/'/g, "");
    params.set(
      "or",
      `(name.ilike.*${term}*,email.ilike.*${term}*,company.ilike.*${term}*,phone.ilike.*${term}*)`
    );
  }
  if (typeof options.limit === "number") params.set("limit", String(options.limit));
  if (typeof options.offset === "number") params.set("offset", String(options.offset));

  const res = await supabaseFetch(`/rest/v1/consultations?${params.toString()}`);
  return (await res.json()) as Consultation[];
}

export async function countConsultations(status?: string): Promise<number> {
  const params = new URLSearchParams();
  params.set("select", "id");
  if (status) params.set("status", `eq.${status}`);

  const res = await supabaseFetch(`/rest/v1/consultations?${params.toString()}`, {
    headers: {
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  const contentRange = res.headers.get("content-range") || "";
  const match = contentRange.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

export async function updateConsultation(
  id: string,
  patch: Partial<Pick<Consultation, "status">>
): Promise<Consultation | null> {
  const res = await supabaseFetch(`/rest/v1/consultations?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  const rows = (await res.json()) as Consultation[];
  return rows[0] ?? null;
}

export async function deleteConsultation(id: string): Promise<void> {
  await supabaseFetch(`/rest/v1/consultations?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

const BRANDING_BUCKET = "branding-logos";

export interface BrandingLogo {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface BrandingLogoCreate {
  title: string;
  category: string;
  file_url: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
}

export async function createBrandingLogo(data: BrandingLogoCreate): Promise<BrandingLogo> {
  const res = await supabaseFetch("/rest/v1/branding_logos", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  const rows = (await res.json()) as BrandingLogo[];
  return rows[0];
}

export async function listBrandingLogos(category?: string): Promise<BrandingLogo[]> {
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", "created_at.desc");
  if (category) {
    params.set("category", `eq.${category}`);
  }
  const res = await supabaseFetch(`/rest/v1/branding_logos?${params.toString()}`);
  return (await res.json()) as BrandingLogo[];
}

export async function deleteBrandingLogo(id: string): Promise<void> {
  await supabaseFetch(`/rest/v1/branding_logos?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function uploadBrandingFile(
  path: string,
  file: ArrayBuffer,
  contentType: string
): Promise<void> {
  ensureEnv();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BRANDING_BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${SERVICE_ROLE_KEY!}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: file,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SupabaseError(
      `Storage upload failed (${res.status}): ${text.slice(0, 300)}`,
      res.status
    );
  }
}

export async function deleteBrandingFile(path: string): Promise<void> {
  ensureEnv();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BRANDING_BUCKET}/${path}`,
    {
      method: "DELETE",
      headers: {
        apikey: SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${SERVICE_ROLE_KEY!}`,
      },
    }
  );
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => "");
    throw new SupabaseError(
      `Storage delete failed (${res.status}): ${text.slice(0, 300)}`,
      res.status
    );
  }
}

export function getBrandingFileUrl(path: string): string {
  ensureEnv();
  return `${SUPABASE_URL}/storage/v1/object/public/${BRANDING_BUCKET}/${path}`;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  sort_order: number;
  created_at: string;
}

export interface SocialLinkCreate {
  platform: string;
  url: string;
  label?: string;
  sort_order?: number;
}

export async function createSocialLink(data: SocialLinkCreate): Promise<SocialLink> {
  const res = await supabaseFetch("/rest/v1/social_links", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  const rows = (await res.json()) as SocialLink[];
  return rows[0];
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  const res = await supabaseFetch("/rest/v1/social_links?select=*&order=sort_order.asc");
  return (await res.json()) as SocialLink[];
}

export async function updateSocialLink(
  id: string,
  patch: Partial<Pick<SocialLink, "platform" | "url" | "label" | "sort_order">>
): Promise<SocialLink | null> {
  const res = await supabaseFetch(`/rest/v1/social_links?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  const rows = (await res.json()) as SocialLink[];
  return rows[0] ?? null;
}

export async function deleteSocialLink(id: string): Promise<void> {
  await supabaseFetch(`/rest/v1/social_links?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
