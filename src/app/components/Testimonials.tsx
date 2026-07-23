"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "We start by understanding your business, your customers, and the problem you're solving — not just the technical spec. Every great product starts with asking the right questions.",
  },
  {
    step: "02",
    title: "Design & Build",
    description:
      "Your product takes shape in focused sprints with regular demos and check-ins. You see real progress every week, not just status updates.",
  },
  {
    step: "03",
    title: "Launch & Support",
    description:
      "We launch alongside you and stay on as your technical partner. Updates, monitoring, new features, and long-term support as your business grows.",
  },
];

export default function Testimonials() {
  return (
    <section id="process" className="py-[62px] sm:py-[120px] px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0.001, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: appearEasing }}
          className="text-center mb-16"
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-[1.3]">
            From Idea to Launch
          </h2>
          <p className="mt-4 text-base text-[#949fa6] max-w-[600px] mx-auto leading-[1.6]">
            A transparent, collaborative process. You always know where your project stands
            and what happens next.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {process.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0.001, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: appearEasing, delay: index * 0.1 }}
              className="p-6 rounded-[12px] border border-[#19191a] bg-[#0e0e10]"
            >
              <div className="mb-4">
                <span className="text-[32px] font-bold text-[#eaa879]/30">{item.step}</span>
              </div>
              <h3 className="text-[18px] font-bold text-white mb-3">{item.title}</h3>
              <p className="text-[#949fa6] text-sm leading-[1.6]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
