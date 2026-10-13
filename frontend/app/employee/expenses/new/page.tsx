import React, { Suspense } from "react";
import NewExpensePage from "@/features/expenses/NewExpensePage";
import { Spiral } from "@/components/ui/spiral";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#08080A] flex items-center justify-center">
          <Spiral className="size-9 text-blue-500" />
        </div>
      }
    >
      <NewExpensePage />
    </Suspense>
  );
}
