"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.products, href: "#products" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <motion.nav
        initial={{ opacity: 0.001, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [1, 0.02, 0.69, 1] }}
        className="mx-auto overflow-hidden transition-[padding] duration-300"
        style={{
          width: scrolled ? "min(92%, 980px)" : "100%",
          maxWidth: scrolled ? "980px" : "1200px",
          padding: scrolled ? "10px 12px" : "20px 24px",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`relative flex items-center justify-between overflow-hidden rounded-full transition-all duration-300 ${
            scrolled ? "glass-nav px-4 sm:px-6" : "px-0"
          }`}
          style={{ height: scrolled ? "56px" : "48px" }}
        >
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/800x800_white_logo.png"
              alt="Era Engines"
              width={40}
              height={40}
              className="invert dark:invert-0"
              style={{ objectFit: "contain" }}
            />
            <span className="hidden sm:block text-base font-bold text-ink">
              Era<span className="text-accent"> Engines</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
            <a
              href="#contact"
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{
                backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                boxShadow: "0 8px 24px -8px var(--accent)",
              }}
            >
              {t.nav.cta}
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-2.5">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full glass glass-hover text-ink"
            >
              {menuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto mt-2 w-[92%] max-w-md overflow-hidden rounded-3xl glass-nav lg:hidden"
          >
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between px-2">
                <LanguageToggle />
                <span className="text-xs font-medium text-muted">{t.nav.cta}</span>
              </div>
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-hover"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-full px-4 py-3 text-center text-sm font-semibold text-white"
                style={{
                  backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                }}
              >
                {t.nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
