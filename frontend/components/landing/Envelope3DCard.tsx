"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Envelope3DCardProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Envelope3DCard({ className = "", size = "lg" }: Envelope3DCardProps) {
  const sizeMap = {
    sm: "max-w-[240px]",
    md: "max-w-[320px]",
    lg: "max-w-[420px]",
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Ambient Radial Back-glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 blur-2xl"
        style={{
          background: "radial-gradient(circle at 40% 60%, rgba(52, 211, 153, 0.25) 0%, rgba(59, 108, 246, 0.2) 45%, transparent 70%)"
        }}
      />

      <motion.div
        animate={{ y: [-4, 6, -4], rotate: [-0.5, 0.5, -0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`relative w-full ${sizeMap[size]} aspect-square rounded-3xl overflow-hidden select-none`}
      >
        <Image
          src="/images/envelope-3d.jpg"
          alt="3D Royal Blue Squircle Envelope Card with Chat Bubble"
          fill
          priority
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}
