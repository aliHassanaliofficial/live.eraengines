"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

const features = [
  {
    title: "Custom Software Development",
    description:
      "Tailor-made software built from the ground up to solve your specific business challenges. No templates, no shortcuts.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "Web Application Development",
    description:
      "Fast, responsive, and secure web applications built with modern frameworks and designed for real-world business workflows.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "Mobile App Development",
    description:
      "Native Android and iOS applications built for performance, designed for users, and built to scale with your business.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "SaaS Product Development",
    description:
      "Turn your SaaS idea into a fully productized platform. From MVP to production-ready, we build the product your customers will love.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "Enterprise Software",
    description:
      "Robust, secure, and scalable systems designed for large organizations. ERP, CRM, HR, and custom enterprise platforms.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "AI Integration & Automation",
    description:
      "Integrate artificial intelligence into your products and automate manual business processes with smart, data-driven workflows.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "API Development & Integrations",
    description:
      "Build and connect APIs, integrate third-party services, and create seamless data flows between your systems.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "Cloud-Based Solutions",
    description:
      "Cloud-first architecture designed for reliability, scalability, and cost-efficiency. AWS, Azure, and GCP deployments.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop&auto=format",
  },
  {
    title: "UI/UX Design",
    description:
      "Interfaces designed around how your real customers think, navigate, and act. Beautiful design that actually works.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop&auto=format",
  },
];

export default function Features() {
  return (
    <section id="services" className="py-[62px] sm:py-[120px] px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0.001, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: appearEasing }}
          className="text-center mb-16"
        >
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white leading-[1.3]">
            Our Services
          </h2>
          <p className="mt-4 text-base text-[#949fa6] max-w-[600px] mx-auto leading-[1.6]">
            From custom software development to AI integration, we cover the full spectrum of
            technology services your business needs to grow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0.001, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: appearEasing, delay: index * 0.05 }}
              className="p-6 rounded-[12px] border border-[#19191a] bg-[#0e0e10] hover:border-[#eaa879]/20 transition-colors duration-300"
            >
              <div className="mb-4 w-full aspect-[2/1] rounded-lg overflow-hidden bg-[#141417]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[18px] font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#949fa6] leading-[1.6]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
