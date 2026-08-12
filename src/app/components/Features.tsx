"use client";

import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CubeIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  ArrowPathRoundedSquareIcon,
  CloudIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

const featureIcons = [
  CodeBracketIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CubeIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  ArrowPathRoundedSquareIcon,
  CloudIcon,
  SwatchIcon,
];

export default function Features() {
  const { t } = useI18n();

  return (
    <section id="services" className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-c)]" style={{ top: "20%", insetInlineEnd: "-14%", width: 320, height: 320, opacity: 0.5 }} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.nav.services} title={t.features.title} subtitle={t.features.subtitle} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0.001, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: appearEasing, delay: (index % 3) * 0.08 }}
                className="group relative overflow-hidden rounded-[22px] glass glass-hover p-6"
              >
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundImage: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                />
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-muted">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
