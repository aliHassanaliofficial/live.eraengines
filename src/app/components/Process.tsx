"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

export default function Process() {
  const { t } = useI18n();

  return (
    <section id="process" className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ bottom: "0%", insetInlineEnd: "-10%", width: 300, height: 300, opacity: 0.5 }} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.nav.process} title={t.process.title} subtitle={t.process.subtitle} />

        <div className="grid gap-4 md:grid-cols-3">
          {t.process.items.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0.001, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: appearEasing, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-[22px] glass glass-hover p-7"
            >
              <div className="text-gradient text-5xl font-bold opacity-70">{item.step}</div>
              <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-[1.7] text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
