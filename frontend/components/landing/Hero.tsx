"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] bg-gradient-to-b from-[#0A3CC8] via-[#0935B3] to-[#072582] flex flex-col justify-center px-6 sm:px-12 lg:px-16 pt-28 pb-16 overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 65% 50%, rgba(59, 108, 246, 0.4) 0%, transparent 60%)"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Left-Aligned Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-5 text-left flex flex-col items-start"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold text-white leading-[1.06] tracking-tight">
            Track every expense, stay in control!
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-[13px] text-white/80 font-normal leading-relaxed max-w-sm">
            9 out of 10 teams close their monthly reports in under an hour.
          </p>
        </motion.div>

        {/* Right Column: 3D Stage Illustration with Phone */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-7 flex justify-center lg:justify-end relative"
        >
          <div className="relative w-full max-w-[480px] sm:max-w-[540px] aspect-square rounded-3xl overflow-hidden animate-float">
            <Image
              src="/images/hero-stage.jpg"
              alt="3D architectural stage with mobile expense tracker"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
