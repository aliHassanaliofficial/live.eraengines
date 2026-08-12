"use client";

import { motion } from "framer-motion";
import {
  HeartIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

const productIcons = [HeartIcon, AcademicCapIcon, BuildingOffice2Icon, ShoppingCartIcon];

const productGradients = [
  "linear-gradient(135deg, #f472b6, #a855f7)",
  "linear-gradient(135deg, #38bdf8, #6366f1)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #34d399, #0ea5e9)",
];

export default function Product() {
  const { t } = useI18n();

  return (
    <section id="products" className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "10%", insetInlineStart: "-14%", width: 320, height: 320, opacity: 0.45 }} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.nav.products} title={t.products.title} subtitle={t.products.subtitle} />

        <div className="grid gap-5 sm:grid-cols-2">
          {t.products.items.map((product, index) => {
            const Icon = productIcons[index % productIcons.length];
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0.001, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: appearEasing, delay: (index % 2) * 0.1 }}
                className="group relative overflow-hidden rounded-[26px] glass glass-hover"
              >
                <div
                  className="relative flex h-44 items-center justify-center overflow-hidden"
                  style={{ backgroundImage: productGradients[index % productGradients.length] }}
                >
                  <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), transparent 60%)" }} />
                  <Icon className="relative h-16 w-16 text-white drop-shadow-lg" />
                </div>
                <div className="p-6 sm:p-7">
                  <span className="inline-block rounded-full border border-border-glass bg-surface px-3 py-1 text-xs font-semibold text-accent">
                    {product.badge}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-ink">{product.title}</h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted">{product.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
