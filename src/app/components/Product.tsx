"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

const products = [
  {
    badge: "Healthcare",
    title: "Clinic Management System",
    description:
      "End-to-end clinic management — patient records, appointments, billing, and prescriptions in one secure platform built for healthcare providers.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop&auto=format",
  },
  {
    badge: "Education",
    title: "School & University Management",
    description:
      "Complete academic management — student enrollment, attendance, grades, scheduling, and parent portals for schools and universities.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=800&h=400&fit=crop&auto=format",
  },
  {
    badge: "Enterprise",
    title: "ERP & Business Systems",
    description:
      "Integrated ERP, CRM, HR & payroll, inventory, and POS systems designed around your actual business processes, not the other way around.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format",
  },
  {
    badge: "E-Commerce",
    title: "E-Commerce & Customer Portals",
    description:
      "Custom e-commerce platforms, booking systems, and customer portals built for conversion, performance, and long-term growth.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format",
  },
];

export default function Product() {
  return (
    <section id="products" className="py-[62px] sm:py-[120px] px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0.001, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: appearEasing }}
          className="text-center mb-16"
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-[1.3]">
            Our Products
          </h2>
          <p className="mt-4 text-base text-[#949fa6] max-w-[600px] mx-auto leading-[1.6]">
            Industry-specific software products built from years of experience solving
            real problems for real businesses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0.001, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: appearEasing, delay: index * 0.05 }}
              className="rounded-[20px] border border-[#19191a] bg-[#0e0e10] overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-[100px] bg-white/5 text-[#949fa6] border border-[#19191a] mb-4">
                  {product.badge}
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-bold text-white leading-[1.2] mb-3">
                  {product.title}
                </h3>
                <p className="text-sm text-[#949fa6] leading-[1.6]">
                  {product.description}
                </p>
              </div>
              <div className="h-48 mx-6 sm:mx-8 mb-6 sm:mb-8 rounded-[12px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
