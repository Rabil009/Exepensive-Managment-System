"use client";

import React from "react";
import { Calendar, Filter, Download, ChevronDown } from "lucide-react";

export function AnalyticsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          My Expense Analytics
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Review your spending trends, category breakdown, and reimbursement status.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Date Range Selector */}
        <button
          type="button"
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span>Oct 1 – Oct 31, 2026</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        </button>

        {/* Reports Filter */}
        <button
          type="button"
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Filter className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span>My Reports</span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        </button>

        {/* Export CSV */}
        <button
          type="button"
          onClick={() => {
            const csvContent =
              "data:text/csv;charset=utf-8,Category,Amount,Percentage\nTravel & Lodging,17289,45%\nSoftware & SaaS,8836.6,23%\nMeals & Entertainment,7299.8,19%\nEquipment & Devices,4994.6,13%";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "expense_analytics_oct_2026.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="h-8 px-3.5 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

export default AnalyticsHeader;
