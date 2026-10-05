"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "./Footer";

export function FinalCTA() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#0A3CC8] via-[#0934B0] to-[#072582] text-white pt-24 sm:pt-32 pb-8 overflow-hidden">
      {/* Ambient Radial Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 60% 40%, rgba(59, 108, 246, 0.4) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headline and Button */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-5 text-left flex flex-col items-start"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.06]">
            Start for<br />free today
          </h2>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/dashboard"
              className="inline-block bg-[#3B6CF6] hover:bg-[#2557EB] text-white text-xs font-semibold px-5 sm:px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              Open Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Right Column: 3D Rocket on Platform Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-7 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[460px] sm:max-w-[520px] aspect-square rounded-3xl overflow-hidden animate-float">
            <Image
              src="/images/rocket-stage.jpg"
              alt="3D paper plane rocket hovering over stage with scattered coins"
              fill
              className="object-cover object-center"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer Row */}
      <Footer />
    </section>
  );
}
