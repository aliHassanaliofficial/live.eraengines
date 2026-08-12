"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";

const IMAGES = {
  about:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
  values:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&auto=format",
};

const VALUE_POINTS = {
  about: ["Innovation", "Transparency", "Security", "Excellence"],
  values: ["Innovation", "Transparency", "Security", "Excellence"],
} as const;

export default function ContentSection({
  variant = "about",
  imageSide = "right",
}: {
  variant?: "about" | "values";
  imageSide?: "left" | "right";
}) {
  const { t } = useI18n();
  const content = variant === "about" ? t.about : t.values;
  const image = IMAGES[variant];
  const isRTL = imageSide === "left";

  return (
    <section className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ top: "10%", insetInlineEnd: "-12%", width: 300, height: 300, opacity: 0.45 }} />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: appearEasing }}
            className={`${isRTL ? "lg:order-2" : "lg:order-1"}`}
          >
            <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              {content.badge}
            </span>
            <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-muted">{content.description}</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {VALUE_POINTS[variant].map((point) => (
                <li key={point} className="flex items-center gap-2.5 rounded-2xl glass glass-hover px-4 py-3 text-sm font-semibold text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft">
                    <CheckIcon className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: appearEasing, delay: 0.1 }}
            className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}
          >
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-tr from-[var(--orb-a)] via-[var(--orb-b)] to-[var(--orb-c)] blur-2xl opacity-50" />
              <div className="glass relative overflow-hidden rounded-[28px] p-2">
                <Image
                  src={image}
                  alt={content.title}
                  width={800}
                  height={500}
                  className="aspect-[16/10] w-full rounded-[20px] border border-border-glass object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
