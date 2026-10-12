import React from "react";
import { Spiral } from "@/components/ui/spiral";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#FAFAFB] dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100">
      <Spiral className="size-10 text-emerald-500" />
      <div className="flex flex-col items-center text-center gap-1.5">
        <h3 className="text-sm font-semibold tracking-tight">FinPulse Enterprise</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading secure financial workspace...</p>
      </div>
    </div>
  );
}
