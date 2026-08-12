"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.001, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: appearEasing }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold leading-[1.2] tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-[1.7] text-muted">{subtitle}</p>}
    </motion.div>
  );
}
