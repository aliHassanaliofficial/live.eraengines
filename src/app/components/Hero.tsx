"use client";

import { motion } from "framer-motion";
import { appearEasing } from "./animations";

export default function Hero() {
  return (
    <section id="hero" className="relative pt-40 pb-20 sm:pt-48 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#eaa879] rounded-full opacity-[0.03] blur-[40px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white rounded-full opacity-[0.02] blur-[40px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0.001, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: appearEasing }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#eaa879]/20 mb-6"
            style={{ background: "rgba(234, 168, 121, 0.08)" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#eaa879] animate-pulse" />
            <span className="text-xs font-medium text-[#eaa879]">
              Software Development Company — Middle East &amp; Africa
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0.001, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: appearEasing, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] tracking-tight text-white"
            style={{ fontFamily: "Manrope" }}
          >
            Build Software That{" "}
            <span className="bg-gradient-to-r from-[#eaa879] to-[#d4956a] bg-clip-text text-transparent">
              Solves Real Problems.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0.001, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: appearEasing, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-[#949fa6] max-w-[650px] mx-auto leading-[1.6]"
          >
            Era Engines is a full-service software company. We design, build, and maintain
            custom web applications, mobile apps, SaaS platforms, and enterprise systems for
            startups, SMEs, and large enterprises across the region.
          </motion.p>

          <motion.div
            initial={{ opacity: 0.001, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: appearEasing, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="inline-block bg-white text-[#0b0b0d] px-8 py-3.5 rounded-[100px] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Free Consultation
            </a>
            <a
              href="#services"
              className="inline-block text-[#949fa6] px-8 py-3.5 rounded-[100px] text-sm font-semibold border border-[#19191a] hover:border-[#eaa879]/30 hover:text-white transition-colors"
            >
              Explore Our Services
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0.001, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: appearEasing, delay: 0.4 }}
            className="mt-6 text-sm text-[#949fa6]/60 max-w-[500px] mx-auto leading-[1.6]"
          >
            No commitment. Just a conversation about what you&apos;re building and how we can help.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
