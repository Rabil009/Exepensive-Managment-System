"use client";

import React from "react";
import { Calendar, ChevronDown, SlidersHorizontal, Download } from "lucide-react";

type Props = {
  cycleFilter: () => void;
  exportExpenses: () => void;
};

export function OverviewHeader({ cycleFilter, exportExpenses }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back, Rabil
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage your corporate cards, submit expense claims, and track reimbursement status.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <span className="tabular-nums">Oct 1 - 31, 2025</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </button>

        <button
          type="button"
          onClick={cycleFilter}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
          <span>Filters</span>
        </button>

        <button
          type="button"
          onClick={exportExpenses}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
export default OverviewHeader;
