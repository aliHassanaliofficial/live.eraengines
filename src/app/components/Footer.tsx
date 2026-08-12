"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.nav.services,
      links: [
        { label: t.features.items[0].title, href: "#services" },
        { label: t.features.items[2].title, href: "#services" },
        { label: t.features.items[3].title, href: "#services" },
        { label: t.features.items[5].title, href: "#services" },
      ],
    },
    {
      title: t.nav.products,
      links: [
        { label: t.products.items[0].title, href: "#products" },
        { label: t.products.items[1].title, href: "#products" },
        { label: t.products.items[2].title, href: "#products" },
        { label: t.products.items[3].title, href: "#products" },
      ],
    },
    {
      title: t.nav.contact,
      links: [
        { label: "hello@eraengines.com", href: "mailto:hello@eraengines.com" },
        { label: t.contact.info.location, href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden px-4 pb-8 pt-16 sm:px-8">
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ bottom: "-30%", insetInlineStart: "20%", width: 340, height: 340, opacity: 0.35 }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="glass rounded-[28px] p-8 sm:p-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <a href="#hero" className="flex items-center gap-3">
                <Image
                  src="/800x800_white_logo.png"
                  alt="Era Engines"
                  width={44}
                  height={44}
                  className="invert dark:invert-0"
                  style={{ objectFit: "contain" }}
                />
                <span className="text-lg font-bold text-ink">
                  Era<span className="text-accent"> Engines</span>
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-[1.7] text-muted">{t.footer.tagline}</p>
              <p className="mt-2 text-xs text-muted/70">{t.footer.madeIn}</p>
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-bold text-ink">{column.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-muted transition-colors hover:text-accent">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-border-glass pt-6 sm:flex-row">
            <p className="text-xs text-muted">
              &copy; {year} Era Engines. {t.footer.rights}
            </p>
            <div className="flex items-center gap-6">
              {[t.footer.privacy, t.footer.terms, t.footer.security].map((item) => (
                <a key={item} href="#hero" className="text-xs text-muted transition-colors hover:text-accent">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
