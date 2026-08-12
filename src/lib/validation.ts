const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ConsultationInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  preferred_date?: string;
}

type ValidationResult =
  | { ok: true; data: ConsultationInput }
  | { ok: false; error: string };

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateConsultation(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;

  const name = clean(raw.name).slice(0, 120);
  const email = clean(raw.email).toLowerCase().slice(0, 200);
  const phone = clean(raw.phone).slice(0, 40);
  const company = clean(raw.company).slice(0, 160);
  const service = clean(raw.service).slice(0, 160);
  const budget = clean(raw.budget).slice(0, 80);
  const message = clean(raw.message).slice(0, 4000);
  const preferred_date = clean(raw.preferred_date).slice(0, 80);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !EMAIL_REGEX.test(email)) {
    return { ok: false, error: "A valid email is required." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Please describe your project (at least 10 characters)." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      service: service || undefined,
      budget: budget || undefined,
      message,
      preferred_date: preferred_date || undefined,
    },
  };
}
