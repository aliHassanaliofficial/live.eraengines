import type { Lang } from "./translations";

export const ARABIC_COUNTRIES = new Set([
  "AE",
  "SA",
  "EG",
  "KW",
  "QA",
  "BH",
  "OM",
  "JO",
  "LB",
  "IQ",
  "YE",
  "SD",
  "SY",
  "PS",
  "LY",
  "DZ",
  "TN",
  "MA",
  "MR",
  "ER",
  "DJ",
  "SO",
  "KM",
]);

async function fetchWithTimeout(url: string, ms = 4000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

export async function detectCountryCode(): Promise<string | null> {
  const providers: Array<() => Promise<string | null>> = [
    async () => {
      const res = await fetchWithTimeout("https://ipwho.is/");
      const json = await res.json();
      return json && json.success ? json.country_code : null;
    },
    async () => {
      const res = await fetchWithTimeout("https://ipapi.co/json/");
      const json = await res.json();
      return json ? json.country_code : null;
    },
    async () => {
      const res = await fetchWithTimeout("https://get.geojs.io/v1/ip/country.json");
      const json = await res.json();
      return Array.isArray(json) && json.length ? json[0].country : null;
    },
  ];

  for (const provider of providers) {
    try {
      const code = await provider();
      if (code && /^[A-Za-z]{2}$/.test(code)) return code.toUpperCase();
    } catch {
      // try next provider
    }
  }
  return null;
}

export function countryToLang(countryCode: string): Lang {
  return ARABIC_COUNTRIES.has(countryCode.toUpperCase()) ? "ar" : "en";
}

export function browserLanguage(): Lang | null {
  if (typeof navigator === "undefined") return null;
  const lang = (navigator.language || navigator.languages?.[0] || "").toLowerCase();
  if (!lang) return null;
  return lang.startsWith("ar") ? "ar" : "en";
}
