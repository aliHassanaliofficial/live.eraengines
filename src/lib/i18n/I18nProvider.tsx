"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Lang } from "./translations";
import { browserLanguage, countryToLang, detectCountryCode } from "./language";

export const LANG_COOKIE = "era_lang";
export const THEME_COOKIE = "era_theme";

function readStoredLang(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LANG_COOKIE);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // ignore storage errors
  }
  return null;
}

function applyLangToDocument(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANG_COOKIE, lang);
  } catch {
    // ignore storage errors
  }
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=${maxAge};SameSite=Lax`;
}

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? "en");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If the visitor already has an explicit preference, apply it to the
    // document (the state itself already mirrors the server cookie).
    const stored = readStoredLang();
    if (stored) {
      applyLangToDocument(stored);
      return;
    }

    // Auto-detect language from user location (IP geolocation) when no
    // explicit preference has been saved yet. Falls back to the browser
    // language if geolocation is unavailable.
    let cancelled = false;
    detectCountryCode()
      .catch(() => null)
      .then((countryCode) => {
        if (cancelled) return;
        const manual = readStoredLang();
        if (manual) return;
        const byLocation = countryCode ? countryToLang(countryCode) : null;
        const target = byLocation ?? browserLanguage() ?? "en";
        setLangState(target);
        applyLangToDocument(target);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyLangToDocument(next);
    persistLang(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "ar" ? "en" : "ar";
      applyLangToDocument(next);
      persistLang(next);
      return next;
    });
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
    return {
      lang,
      dir,
      isRTL: lang === "ar",
      t: dictionaries[lang],
      setLang,
      toggleLang,
    };
  }, [lang, setLang, toggleLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
