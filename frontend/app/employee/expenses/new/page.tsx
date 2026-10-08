import React, { Suspense } from "react";
import NewExpensePage from "@/features/expenses/NewExpensePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFB] dark:bg-[#08080A]" />}>
      <NewExpensePage />
    </Suspense>
  );
}
