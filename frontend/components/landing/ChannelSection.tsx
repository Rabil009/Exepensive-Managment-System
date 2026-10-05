"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ChannelSection() {
  return (
    <section className="relative w-full bg-[#111111] text-white py-24 sm:py-32 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: 3D Envelope Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-3xl overflow-hidden animate-float">
            <Image
              src="/images/envelope-3d.jpg"
              alt="3D envelope tile illustration with message bubble"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Right Column: Left-Aligned Text */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-7 text-left flex flex-col items-start"
        >
          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.08] max-w-lg">
            Easily submit expenses via e-mail or SMS
          </h2>
          <p className="mt-4 sm:mt-5 text-xs sm:text-[13px] text-[#888888] font-normal leading-relaxed">
            ... or just upload a photo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
