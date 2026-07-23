"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

const plans = [
  {
    name: "Starter",
    price: "Custom",
    period: "",
    description: "For startups and small businesses",
    features: [
      "Single web or mobile application",
      "UI/UX design included",
      "Cloud hosting setup",
      "3 months post-launch support",
      "1 revision cycle",
    ],
  },
  {
    name: "Growth",
    price: "Custom",
    period: "",
    description: "For growing companies with complex needs",
    features: [
      "Full-stack custom development",
      "API & third-party integrations",
      "AI & automation features",
      "6 months post-launch support",
      "Dedicated project manager",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations and government",
    features: [
      "End-to-end enterprise systems",
      "Multi-platform delivery",
      "SOC 2 & security compliance",
      "Ongoing maintenance & support",
      "Long-term technical partnership",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-[62px] sm:py-[120px] px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0.001, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: appearEasing }}
          className="text-center mb-16"
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-[1.3]">
            Let&apos;s Talk About Your Project
          </h2>
          <p className="mt-4 text-base text-[#949fa6] max-w-[600px] mx-auto">
            Every project is different. Tell us what you&apos;re building and we&apos;ll scope a solution
            that fits your goals and budget.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-[1000px] mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0.001, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: appearEasing, delay: index * 0.1 }}
              className={`p-6 rounded-[12px] border bg-[#0e0e10] ${
                plan.popular
                  ? "border-[#eaa879]/40 shadow-[0_0_40px_rgba(234,168,121,0.08)]"
                  : "border-[#19191a]"
              }`}
            >
              {plan.popular && (
                <div className="inline-block text-xs font-semibold px-3 py-1 rounded-[100px] bg-[#eaa879] text-[#0b0b0d] mb-4">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#949fa6] mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-white">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[#949fa6]"
                  >
                    <svg
                      className="w-4 h-4 text-[#eaa879] shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-2.5 rounded-[100px] text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-white text-[#0b0b0d] hover:opacity-90"
                    : "border border-[#19191a] text-white hover:bg-white/5"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
