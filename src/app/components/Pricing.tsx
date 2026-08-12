"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

export default function Pricing() {
  const { t } = useI18n();

  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-c)]" style={{ top: "10%", insetInlineStart: "-12%", width: 300, height: 300, opacity: 0.4 }} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.nav.pricing} title={t.pricing.title} subtitle={t.pricing.subtitle} />

        <div className="grid gap-5 md:grid-cols-3">
          {t.pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0.001, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: appearEasing, delay: index * 0.1 }}
              className={`relative flex flex-col overflow-hidden rounded-[26px] p-7 ${
                plan.popular
                  ? "glass-strong ring-2 ring-accent/60 shadow-[0_18px_60px_-18px_var(--accent)]"
                  : "glass glass-hover"
              }`}
            >
              {plan.popular && (
                <span className="absolute end-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
                  {t.pricing.popular}
                </span>
              )}

              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-xs text-muted">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-ink">{plan.price}</span>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                      <CheckIcon className="h-3 w-3 text-accent" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  plan.popular
                    ? "text-white"
                    : "glass text-ink glass-hover"
                }`}
                style={
                  plan.popular
                    ? {
                        backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                        boxShadow: "0 12px 30px -10px var(--accent)",
                      }
                    : undefined
                }
              >
                {index === t.pricing.plans.length - 1
                  ? t.pricing.ctaContact
                  : t.pricing.ctaStart}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
