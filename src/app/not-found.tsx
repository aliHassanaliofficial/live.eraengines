"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "-10%", insetInlineStart: "-8%", width: 360, height: 360 }} />
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ bottom: "-12%", insetInlineEnd: "-8%", width: 340, height: 340, animationDelay: "-8s" }} />

      <div className="relative mx-auto max-w-md text-center">
        <div className="glass rounded-[32px] px-8 py-14 sm:px-12">
          <p className="text-gradient text-[80px] font-bold leading-none sm:text-[120px]">
            {t.notFound.code}
          </p>
          <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
            {t.notFound.title}
          </h1>
          <p className="mt-3 text-sm leading-[1.6] text-muted">
            {t.notFound.message}
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{
              backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
              boxShadow: "0 12px 30px -10px var(--accent)",
            }}
          >
            {t.notFound.back}
          </Link>
        </div>
      </div>
    </section>
  );
}
