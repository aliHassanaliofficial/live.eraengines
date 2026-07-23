"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <section
      className="sticky top-0 z-50 w-full"
      style={{
        padding: scrolled ? "16px" : "16px 32px",
        transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <motion.div
        initial={{ opacity: 0.001, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [1, 0.02, 0.69, 1] }}
        className="relative mx-auto overflow-hidden"
        style={{
          width: scrolled ? "min(90%, 900px)" : "100%",
          maxWidth: scrolled ? "900px" : "1200px",
          height: scrolled ? "64px" : "80px",
          borderRadius: scrolled ? "100px" : "0px",
          boxShadow: scrolled
            ? [
                "inset 0 0 0 1px rgba(255,255,255,0.10)",
                "inset 0 1px 0 rgba(255,255,255,0.06)",
                "inset 0 -1px 0 rgba(255,255,255,0.03)",
                "0 0 24px rgba(255,255,255,0.03)",
              ].join(",")
            : "none",
          transition:
            "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {scrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent pointer-events-none" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: scrolled ? "rgba(11,11,13,0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(24px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
            transition:
              "background 0.35s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        <div
          className="hidden md:flex items-center justify-between w-full h-full relative z-10"
          style={{ padding: scrolled ? "0 24px" : "0 0" }}
        >
          <a href="#hero" className="shrink-0" style={{ width: "180px" }}>
            <img
              src="/800x800_white_logo.png"
              alt="Era Engines"
              style={{ width: "72px", height: "72px", objectFit: "contain" }}
            />
          </a>

          <div className="flex items-center justify-center" style={{ gap: "42px" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors whitespace-nowrap"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  letterSpacing: "0em",
                  textDecoration: "none",
                  color: "#687278",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-end shrink-0" style={{ width: "180px" }}>
            <a
              href="#contact"
              className="relative whitespace-nowrap overflow-hidden"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "1.5",
                padding: scrolled ? "8px 14px" : "10px 16px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.02)",
                boxShadow: "inset 0px 1px 10px 0px rgba(255,255,255,0.05)",
                textDecoration: "none",
                color: "white",
                transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Start Your Project
              <span
                style={{
                  position: "absolute",
                  bottom: "-32px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "45px",
                  height: "45px",
                  borderRadius: "100px",
                  background: "rgb(234,168,121)",
                  filter: "blur(10px)",
                  opacity: 0.2,
                  pointerEvents: "none",
                }}
              />
            </a>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between w-full h-full relative z-10" style={{ padding: "0 4px" }}>
          <a href="#hero" className="shrink-0" style={{ width: "72px", height: "72px" }}>
            <img
              src="/800x800_white_logo.png"
              alt="Era Engines"
              style={{ width: "72px", height: "72px", objectFit: "contain" }}
            />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex flex-col items-center justify-center"
            style={{ width: "32px", height: "32px" }}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "9px",
                left: "calc(50% - 10.5px)",
                width: "21px",
                height: "2px",
                borderRadius: "10px",
                background: "white",
              }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                bottom: "9px",
                left: "calc(50% - 10.5px)",
                width: "21px",
                height: "2px",
                borderRadius: "10px",
                background: "white",
              }}
            />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden mx-auto"
            style={{
              width: scrolled ? "min(90%, 900px)" : "100%",
              maxWidth: scrolled ? "900px" : "1200px",
              borderRadius: scrolled ? "20px" : "0px",
              marginTop: "8px",
              border: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
              background: "rgba(11,11,13,0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: scrolled
                ? "inset 0 0 0 1px rgba(255,255,255,0.05)"
                : "none",
              transition:
                "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-3 rounded-lg hover:bg-white/[0.04]"
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.6",
                    textDecoration: "none",
                    color: "#687278",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-white/[0.06] my-2" />
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block text-center px-4 py-3 rounded-[100px] mt-2"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "white",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: "inset 0px 1px 10px 0px rgba(255,255,255,0.05)",
                  textDecoration: "none",
                }}
              >
                Start Your Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
