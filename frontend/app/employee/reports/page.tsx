import React, { Suspense } from "react";
import ReportsPage from "@/features/reports/ReportsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFB] dark:bg-[#08080A]" />}>
      <ReportsPage />
    </Suspense>
  );
}
