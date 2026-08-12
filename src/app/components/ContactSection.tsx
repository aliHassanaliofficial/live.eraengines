"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  PaperAirplaneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { appearEasing } from "./animations";
import SectionHeading from "./SectionHeading";

const inputClass =
  "w-full rounded-xl border border-border-glass bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25";

export default function ContactSection() {
  const { t, isRTL } = useI18n();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    preferred_date: "",
    message: "",
    company_website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          preferred_date: "",
          message: "",
          company_website: "",
        });
      } else {
        setStatus("error");
        setError(data.error || t.contact.form.error);
      }
    } catch {
      setStatus("error");
      setError(t.contact.form.error);
    }
  }

  const infoCards = [
    {
      icon: EnvelopeIcon,
      label: t.contact.info.email,
      value: "hello@eraengines.com",
      href: "mailto:hello@eraengines.com",
    },
    {
      icon: MapPinIcon,
      label: t.contact.info.locationLabel,
      value: t.contact.info.location,
    },
    {
      icon: ClockIcon,
      label: t.contact.info.response,
      value: "Sat – Thurs, 9:00 – 18:00",
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-[70px] sm:px-8 sm:py-24">
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ bottom: "-20%", insetInlineStart: "-10%", width: 360, height: 360, opacity: 0.5 }} />
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ top: "-10%", insetInlineEnd: "-12%", width: 340, height: 340, opacity: 0.4, animationDelay: "-8s" }} />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.nav.contact} title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <motion.div
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: appearEasing }}
            className="flex flex-col gap-4"
          >
            {infoCards.map((card) => (
              <div key={card.label} className="rounded-[22px] glass glass-hover p-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {card.label}
                    </div>
                    {card.href ? (
                      <a href={card.href} className="mt-1 block text-sm font-semibold text-ink hover:text-accent">
                        {card.value}
                      </a>
                    ) : (
                      <div className="mt-1 text-sm font-semibold text-ink">{card.value}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-[22px] glass p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t.contact.info.follow}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {[
                  { label: "Facebook", href: "https://facebook.com/eraengines" },
                  { label: "Instagram", href: "https://instagram.com/eraengines" },
                  { label: "LinkedIn", href: "https://linkedin.com/company/eraengines" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full glass glass-hover px-4 py-2 text-xs font-semibold text-ink"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: appearEasing, delay: 0.1 }}
            className="relative overflow-hidden rounded-[28px] glass-strong p-6 sm:p-8"
          >
            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-accent-soft">
                  <CheckCircleIcon className="h-10 w-10 text-accent" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-ink">
                  {t.contact.form.success}
                </h3>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full glass glass-hover px-6 py-3 text-sm font-semibold text-ink"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  {t.contact.form.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="cf-name" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.name} *
                  </label>
                  <input
                    id="cf-name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder={t.contact.form.namePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cf-email" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.email} *
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder={t.contact.form.emailPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cf-phone" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.phone}
                  </label>
                  <input
                    id="cf-phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder={t.contact.form.phonePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cf-company" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.company}
                  </label>
                  <input
                    id="cf-company"
                    value={form.company}
                    onChange={update("company")}
                    placeholder={t.contact.form.companyPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cf-service" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.service}
                  </label>
                  <select id="cf-service" value={form.service} onChange={update("service")} className={inputClass}>
                    <option value="">{t.contact.form.servicePlaceholder}</option>
                    {t.contact.services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="cf-budget" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.budget}
                  </label>
                  <select id="cf-budget" value={form.budget} onChange={update("budget")} className={inputClass}>
                    <option value="">{t.contact.form.budgetPlaceholder}</option>
                    {t.contact.budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-date" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.date}
                  </label>
                  <input
                    id="cf-date"
                    type="date"
                    value={form.preferred_date}
                    onChange={update("preferred_date")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-message" className="mb-1.5 block text-xs font-semibold text-muted">
                    {t.contact.form.message} *
                  </label>
                  <textarea
                    id="cf-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder={t.contact.form.messagePlaceholder}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <input
                  type="text"
                  name="company_website"
                  value={form.company_website}
                  onChange={update("company_website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="sm:col-span-2">
                  {status === "error" && error && (
                    <p className="mb-3 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                      boxShadow: "0 14px 34px -10px var(--accent)",
                    }}
                  >
                    <PaperAirplaneIcon className={`h-4 w-4 ${isRTL ? "-scale-x-100" : ""}`} />
                    {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
