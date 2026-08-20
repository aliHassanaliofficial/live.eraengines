"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const EVENT_URL = "/events/rotaractsunrise-hiddenpoisons";

const EVENT_THEME = {
  "--hp-bg": "oklch(14% 0.006 260)",
  "--hp-surface": "oklch(18% 0.008 260)",
  "--hp-border": "oklch(30% 0.01 260 / 0.7)",
  "--hp-fg": "oklch(95% 0.005 90)",
  "--hp-muted": "oklch(68% 0.01 260)",
  "--hp-primary": "oklch(55% 0.235 27)",
  "--hp-accent": "oklch(76% 0.16 62)",
} as React.CSSProperties;

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function EventPromoPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      setOpen(true);
    }, 1200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={EVENT_THEME}
          className="fixed bottom-4 right-4 z-[70] w-[calc(100vw-2rem)] max-w-sm sm:bottom-6 sm:right-6"
          role="dialog"
          aria-label="The Hidden Poisons awareness seminar announcement"
        >
          <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-(--hp-primary)/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-(--hp-border) bg-(--hp-surface) shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-(--hp-primary)/25 blur-[70px]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-(--hp-accent)">
                    Rotaract Sunrise Club
                  </p>
                  <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-(--hp-muted)">
                    Limited seats · Alexandria
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close announcement"
                  className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border border-(--hp-border) text-(--hp-muted) transition-colors hover:bg-(--hp-accent) hover:text-(--hp-bg)"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-(--hp-fg)">
                The{" "}
                <span
                  className="text-(--hp-primary)"
                  style={{ textShadow: "0 0 40px oklch(55% 0.235 27 / 0.45)" }}
                >
                  Hidden
                </span>{" "}
                Poisons
              </h2>

              <div
                className="mt-3 h-0.5 w-24"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, oklch(55% 0.235 27), oklch(76% 0.16 62))",
                }}
              />

              <p className="mt-3.5 text-sm leading-relaxed text-(--hp-muted)">
                What if the greatest danger isn&apos;t always visible? An awareness
                seminar with General Walid ElSisi.
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2.5 border border-(--hp-border) bg-(--hp-bg)/60 px-3.5 py-2 backdrop-blur">
                  <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0 text-(--hp-primary)" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-(--hp-fg)/90">
                    Saturday, August 22, 2026
                  </span>
                </div>
                <div className="flex items-center gap-2.5 border border-(--hp-border) bg-(--hp-bg)/60 px-3.5 py-2 backdrop-blur">
                  <ClockIcon className="h-3.5 w-3.5 shrink-0 text-(--hp-primary)" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-(--hp-fg)/90">
                    6:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2.5 border border-(--hp-border) bg-(--hp-bg)/60 px-3.5 py-2 backdrop-blur">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-(--hp-primary)" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-(--hp-fg)/90">
                    Grand Plaza, Alexandria
                  </span>
                </div>
              </div>

              <Link
                href={EVENT_URL}
                className="promo-pulse group mt-5 inline-flex w-full items-center justify-center gap-2.5 bg-(--hp-primary) px-6 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-(--hp-fg) transition-all hover:brightness-110"
              >
                Reserve Your Seat
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
