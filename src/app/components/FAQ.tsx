"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { appearEasing } from "./animations";
import { useI18n } from "@/lib/i18n/I18nProvider";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow={t.nav.contact} title={t.faq.title} subtitle={t.faq.subtitle} />

        <div className="space-y-3">
          {t.faq.items.map((faq, index) => {
            const open = openIndex === index;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0.001, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, ease: appearEasing, delay: (index % 4) * 0.05 }}
                className={`overflow-hidden rounded-[20px] transition-colors duration-300 ${
                  open ? "glass-strong" : "glass glass-hover"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-start"
                >
                  <span className="text-sm font-semibold text-ink sm:text-base">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-[1.7] text-muted">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
