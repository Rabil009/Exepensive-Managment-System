import React from "react";
import { Spiral } from "@/components/ui/spiral";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFB] dark:bg-[#08080A]">
      <Spiral className="size-9 text-emerald-500" />
    </div>
  );
}
