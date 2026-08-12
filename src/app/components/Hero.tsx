"use client";

import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  CubeIcon,
  SparklesIcon,
  CloudIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";

const appear = {
  initial: { opacity: 0.001, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const chipIcons = [CodeBracketIcon, CubeIcon, SparklesIcon, CloudIcon];

export default function Hero() {
  const { t, isRTL } = useI18n();

  const chips = t.hero.chips.map((label, index) => ({
    icon: chipIcons[index % chipIcons.length],
    label,
  }));

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-8 sm:pt-24 sm:pb-28"
    >
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] pointer-events-none" />
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "-8%", insetInlineStart: "-6%", width: 480, height: 480 }} />
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ top: "18%", insetInlineEnd: "-10%", width: 420, height: 420, animationDelay: "-6s" }} />
      <div className="orb animate-drift bg-[var(--orb-c)]" style={{ bottom: "-18%", insetInlineStart: "30%", width: 420, height: 420, animationDelay: "-12s" }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            {...appear}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-semibold text-accent">{t.hero.badge}</span>
          </motion.div>

          <motion.h1
            {...appear}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            {t.hero.titleA}{" "}
            <span className="text-gradient">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            {...appear}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-[1.7] text-muted sm:text-lg"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            {...appear}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto"
              style={{
                backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                boxShadow: "0 14px 34px -10px var(--accent)",
              }}
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-ink glass glass-hover sm:w-auto"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.p
            {...appear}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 text-sm text-muted/80"
          >
            {t.hero.note}
          </motion.p>
        </div>

        <motion.div
          {...appear}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="flex flex-col items-center gap-2 rounded-2xl glass glass-hover px-4 py-5 text-center"
            >
              <chip.icon className="h-6 w-6 text-accent" />
              <span className="text-xs font-semibold text-ink">{chip.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="#services"
            aria-label="Scroll down"
            className={`grid h-11 w-11 place-items-center rounded-full glass glass-hover text-muted ${
              isRTL ? "animate-bounce" : "animate-bounce"
            }`}
          >
            <ArrowDownIcon className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
