import React, { Suspense } from "react";
import ReportsPage from "@/features/reports/ReportsPage";
import { Spiral } from "@/components/ui/spiral";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#08080A] flex flex-col items-center justify-center gap-3">
          <Spiral className="size-9 text-blue-500" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Loading Reports...</span>
        </div>
      }
    >
      <ReportsPage />
    </Suspense>
  );
}
