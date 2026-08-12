"use client";

import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function LanguageToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language"
      className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink glass glass-hover"
    >
      <GlobeAltIcon className="h-4 w-4 text-accent" />
      <span>{lang === "ar" ? "EN" : "عربي"}</span>
    </button>
  );
}
