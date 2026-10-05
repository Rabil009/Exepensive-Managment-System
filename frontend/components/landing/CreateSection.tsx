"use client";

import { motion } from "framer-motion";
import { FloatingCoin } from "./FloatingCoin";
import { FeatureRow } from "./FeatureRow";

export function CreateSection() {
  return (
    <section className="relative w-full bg-[#111111] text-white py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Floating 3D Coin 1: Left Edge-on */}
        <div className="absolute -left-2 sm:left-4 lg:left-12 top-1/2 -translate-y-8">
          <FloatingCoin variant="edge" delay={0} />
        </div>

        {/* Floating 3D Coin 2: Top Right Tilted */}
        <div className="absolute right-4 sm:right-16 lg:right-24 -top-6 sm:top-0">
          <FloatingCoin variant="tilted" delay={1.2} />
        </div>

        {/* Floating 3D Coin 3: Bottom Right Face */}
        <div className="absolute right-2 sm:right-12 lg:right-20 bottom-8 sm:bottom-12">
          <FloatingCoin variant="face" delay={2.1} />
        </div>

        {/* Huge Centered Section Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl sm:text-7xl lg:text-[88px] xl:text-[96px] font-bold tracking-tight text-white leading-[1.04] max-w-3xl"
        >
          Log expenses<br />in seconds
        </motion.h2>

        {/* Subtext with Highlighted Blue Word ("5 seconds") */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-6 sm:mt-8 text-xs sm:text-[14px] text-[#888888] max-w-lg leading-relaxed font-normal"
        >
          Add an expense in <span className="text-[#3B6CF6] font-medium">5 seconds</span>. Use our powerful features to organise it your way.
        </motion.p>
      </div>

      {/* 4-Column Feature Row */}
      <FeatureRow />
    </section>
  );
}
