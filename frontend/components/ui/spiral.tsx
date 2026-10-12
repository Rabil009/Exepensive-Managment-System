"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SpiralProps extends React.ComponentProps<"span"> {
  dots?: number;
  radius?: number;
  speed?: number;
}

function Spiral({
  dots = 8,
  radius = 35,
  speed = 1.2,
  className,
  ...props
}: SpiralProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "relative inline-flex items-center justify-center size-8 shrink-0 select-none",
        className
      )}
      {...props}
    >
      <motion.span
        className="relative block w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: speed * 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: dots }, (_, index) => {
          const angle = (index / dots) * (2 * Math.PI);
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <motion.span
              key={index}
              aria-hidden="true"
              className="absolute rounded-full bg-current -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${Math.max(18, 220 / dots)}%`,
                height: `${Math.max(18, 220 / dots)}%`,
              }}
              animate={{
                scale: [0.45, 1.25, 0.45],
                opacity: [0.25, 1, 0.25],
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                delay: (index / dots) * speed,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.span>
      <span className="sr-only">Loading</span>
    </span>
  );
}

export { Spiral };
export default Spiral;
