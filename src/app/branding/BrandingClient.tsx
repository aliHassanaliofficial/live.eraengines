"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { appearEasing } from "../components/animations";

interface BrandingLogo {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export default function BrandingClient() {
  const { t, lang } = useI18n();

  const [logos, setLogos] = useState<BrandingLogo[] | null>(null);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/branding", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to load logos.");
        return;
      }
      const body = (await res.json()) as { data: BrandingLogo[] };
      setError("");
      setLogos(body.data);
    } catch {
      setError("Failed to load logos.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const logo of logos ?? []) cats.add(logo.category);
    return Array.from(cats).sort();
  }, [logos]);

  const filteredLogos = useMemo(() => {
    const list = logos ?? [];
    if (categoryFilter === "all") return list;
    return list.filter((l) => l.category === categoryFilter);
  }, [logos, categoryFilter]);

  async function handleDownload(logo: BrandingLogo) {
    setDownloading(logo.id);
    try {
      const res = await fetch(logo.file_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = logo.file_path.split(".").pop() || "png";
      a.download = `${logo.title.replace(/[^a-zA-Z0-9-_]/g, "_")}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent fail
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "-8%", insetInlineEnd: "-6%", width: 400, height: 400 }} />
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ bottom: "-10%", insetInlineStart: "-6%", width: 380, height: 380, animationDelay: "-8s" }} />

      <section className="relative px-4 pt-32 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0.001, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: appearEasing }}
            className="text-center"
          >
            <span className="inline-block rounded-full bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              {t.branding.title}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-ink sm:text-5xl">
              {t.branding.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
              {t.branding.subtitle}
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                categoryFilter === "all"
                  ? "text-white"
                  : "glass glass-hover text-ink"
              }`}
              style={
                categoryFilter === "all"
                  ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                  : undefined
              }
            >
              {t.branding.allCategories}
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  categoryFilter === cat
                    ? "text-white"
                    : "glass glass-hover text-ink"
                }`}
                style={
                  categoryFilter === cat
                    ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {error && (
            <p className="mx-auto mt-6 max-w-md rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-12">
            {logos === null ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-glass border-t-accent" />
              </div>
            ) : filteredLogos.length === 0 ? (
              <div className="glass mx-auto max-w-md rounded-[28px] py-20 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-muted/40" />
                <p className="mt-4 text-sm text-muted">
                  {categoryFilter === "all" ? t.branding.noLogos : t.branding.noLogosCategory}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredLogos.map((logo, index) => (
                    <motion.div
                      key={logo.id}
                      layout
                      initial={{ opacity: 0.001, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: appearEasing, delay: Math.min(index, 6) * 0.04 }}
                      className="glass-strong group rounded-[24px] p-5 transition-all hover:ring-2 hover:ring-accent/30"
                    >
                      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white/50 p-6 transition-colors group-hover:bg-white/70 dark:bg-white/5 dark:group-hover:bg-white/8">
                        <img
                          src={logo.file_url}
                          alt={logo.title}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-ink">{logo.title}</h3>
                          <p className="mt-0.5 text-xs text-muted">{logo.category}</p>
                          {logo.file_size && (
                            <p className="mt-0.5 text-[11px] text-muted/70">
                              {(logo.file_size / 1024).toFixed(0)} KB
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={downloading === logo.id}
                          onClick={() => handleDownload(logo)}
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-70"
                          style={{
                            backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                          }}
                        >
                          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                          {downloading === logo.id ? "..." : t.branding.downloadPng}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 6v12ZM3.75 7.5h16.5" />
    </svg>
  );
}
