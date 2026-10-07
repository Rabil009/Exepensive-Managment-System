"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export function ComplianceBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`rounded-xl p-3.5 border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isDark
          ? "bg-[#111113] border-white/[0.07] text-zinc-400"
          : "bg-white border-zinc-200/80 text-zinc-600 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${
            isDark
              ? "bg-[#18181D] border-white/[0.08] text-emerald-400"
              : "bg-emerald-50 border-emerald-200/80 text-emerald-600"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Before You Submit
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
            &bull;
          </span>
          <span>Check your receipts and business purpose.</span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-medium">
        <span className="text-zinc-700 dark:text-zinc-300">
          Follow your expense policy
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
    </section>
  );
}
export default ComplianceBanner;
