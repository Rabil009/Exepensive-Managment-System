"use client";

import React from "react";
import { useTheme } from "@/lib/theme-store";
import { BudgetVsActualChart } from "./BudgetVsActualChart";
import { BudgetBreakdownTable } from "./BudgetBreakdownTable";

export function BudgetsView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Treasury Budgets & Limits Visibility
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              Q4-2026 Fiscal Cycle
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Track allocated budgets across Departments, Projects, and Cost Centers
          </p>
        </div>
      </div>

      {/* Primary Analytics Comparison */}
      <BudgetVsActualChart />

      {/* Multi-dimension Breakdown */}
      <BudgetBreakdownTable />
    </div>
  );
}
