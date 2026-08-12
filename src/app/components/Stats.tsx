"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

export default function Stats() {
  const { t } = useI18n();

  return (
    <section className="px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t.stats.title} subtitle={t.stats.subtitle} />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-[var(--orb-a)] via-[var(--orb-b)] to-[var(--orb-c)] blur-2xl opacity-40" />
          <div className="grid gap-4 rounded-[32px] glass p-6 sm:grid-cols-3 sm:p-10">
            {t.stats.items.map((stat, index) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0.001, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: appearEasing, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-gradient text-5xl font-bold tracking-tight sm:text-6xl">
                  {stat.value}
                </div>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-[1.7] text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
