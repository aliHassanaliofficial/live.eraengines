"use client";

import { ThemeProvider, type Theme } from "@/lib/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import type { Lang } from "@/lib/i18n/translations";

export default function Providers({
  children,
  initialLang,
  initialTheme,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
  initialTheme?: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <I18nProvider initialLang={initialLang}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
