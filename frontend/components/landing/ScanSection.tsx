"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import QRCode from "qrcode";

export function ScanSection() {
  const [qrCodeData, setQrCodeData] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL("#", {
      margin: 1,
      width: 160,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrCodeData(url))
      .catch((err) => console.error("Failed to generate QR code", err));
  }, []);

  return (
    <section className="relative w-full bg-[#111111] text-white py-24 sm:py-32 lg:py-36 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl sm:text-7xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.04]"
        >
          Scan<br />& Go
        </motion.h2>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-6 sm:mt-7 text-xs sm:text-[13px] text-[#888888] max-w-sm leading-relaxed font-normal"
        >
          Turn any receipt into an entry. Scan it with your phone and we fill in the details for you.
        </motion.p>

        {/* White Circle Container with QR Code & Corner Guides */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-12 sm:mt-16 relative w-48 sm:w-56 h-48 sm:h-56 rounded-full bg-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Target Corner Guides */}
          <div className="relative p-2 flex items-center justify-center">
            {/* Top-Left Bracket */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            {/* Top-Right Bracket */}
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            {/* Bottom-Left Bracket */}
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            {/* Bottom-Right Bracket */}
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {qrCodeData ? (
              <Image
                src={qrCodeData}
                alt="Scan QR code to log expense"
                width={128}
                height={128}
                className="w-28 sm:w-32 h-28 sm:h-32 object-contain"
                unoptimized
              />
            ) : (
              <div className="w-28 sm:w-32 h-28 sm:h-32 bg-slate-100 animate-pulse rounded-lg" />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
