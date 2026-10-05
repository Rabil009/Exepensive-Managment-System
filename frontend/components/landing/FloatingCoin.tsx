"use client";

import { motion } from "framer-motion";

interface FloatingCoinProps {
  variant: "edge" | "tilted" | "face";
  className?: string;
  delay?: number;
}

export function FloatingCoin({ variant, className = "", delay = 0 }: FloatingCoinProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-6, 6, -6], rotate: variant === "edge" ? [-4, 4, -4] : [0, 2, 0] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {variant === "edge" && (
        <div className="relative w-16 sm:w-20 h-6 sm:h-7 rounded-[50%] bg-gradient-to-r from-[#59432B] via-[#C8A26A] to-[#8C6436] shadow-[0_12px_24px_rgba(0,0,0,0.6)] rotate-[-18deg] border border-[#E7CE9D]/40">
          <div className="absolute inset-x-2 top-0.5 h-1.5 rounded-[50%] bg-[#F5DEB3]/50 blur-[0.5px]" />
          <div className="absolute inset-x-1 bottom-0.5 h-2 rounded-[50%] bg-[#3D2914]/80" />
        </div>
      )}

      {variant === "tilted" && (
        <div className="relative w-14 sm:w-18 h-12 sm:h-15 rounded-[50%] bg-gradient-to-br from-[#E1C28D] via-[#9B7343] to-[#4A321B] shadow-[0_14px_28px_rgba(0,0,0,0.65)] rotate-[24deg] border-2 border-[#E7CE9D]/30 flex items-center justify-center">
          <div className="w-10 sm:w-13 h-8 sm:h-10 rounded-[50%] border border-[#3A2613]/50 bg-gradient-to-br from-[#9B7343]/60 to-[#5C3D1E]/80 shadow-inner" />
          <div className="absolute top-1 left-2 w-4 h-2 rounded-[50%] bg-white/30 blur-[1px]" />
        </div>
      )}

      {variant === "face" && (
        <div className="relative w-16 sm:w-22 h-16 sm:h-22 rounded-full bg-gradient-to-br from-[#DFBA7F] via-[#9A6D3B] to-[#452D16] shadow-[0_16px_32px_rgba(0,0,0,0.7)] border-2 border-[#EAD0A1]/40 flex items-center justify-center rotate-[-6deg]">
          <div className="w-12 sm:w-17 h-12 sm:h-17 rounded-full border border-[#3C2510]/60 bg-gradient-to-br from-[#8D6232] to-[#54381C] flex items-center justify-center shadow-inner">
            <span className="text-sm sm:text-lg font-bold font-mono text-[#D7B47E] select-none opacity-85">
              ₹
            </span>
          </div>
          <div className="absolute top-1.5 left-3 w-5 h-3 rounded-full bg-white/25 blur-[1px]" />
        </div>
      )}
    </motion.div>
  );
}
