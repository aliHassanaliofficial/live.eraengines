"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

const stats = [
  {
    value: "50+",
    label: "Projects delivered across web, mobile, and enterprise systems.",
  },
  {
    value: "10+",
    label: "Industries served — from healthcare and education to retail and logistics.",
  },
  {
    value: "98%",
    label: "Client satisfaction. Long-term partnerships, not one-time deliveries.",
  },
];

export default function Stats() {
  return (
    <section className="py-[62px] sm:py-[120px] px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0.001, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: appearEasing }}
          className="text-center mb-16 max-w-[900px] mx-auto"
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-[1.3]">
            Era Engines by the Numbers
          </h2>
          <p className="mt-4 text-base text-[#949fa6] max-w-[500px] mx-auto leading-[1.6]">
            Building world-class software, one project at a time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0.001, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: appearEasing, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-[40px] sm:text-[48px] font-bold text-white leading-[1.2] mb-3">
                {stat.value}
              </div>
              <p className="text-sm text-[#949fa6] leading-[1.6] max-w-xs mx-auto">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
