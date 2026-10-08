"use client";

import { Download } from "lucide-react";
import { exportCsv } from "../../../shared/utils/exportCsv";
import type { useEmployeeAnalytics } from "../data/useEmployeeAnalytics";

export function AnalyticsHeader({ model }: { model: ReturnType<typeof useEmployeeAnalytics> }) {
  const { data, month, setMonth } = model;
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div><h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">My Expense Analytics</h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Review your spending trends, category breakdown, and reimbursement status.</p></div>
    <div className="flex flex-wrap items-center gap-2">
      <input type="month" aria-label="Analytics month" value={month} onChange={(event) => setMonth(event.target.value)}
        className="h-8 px-3 rounded-lg border text-xs bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.08]" />
      <button type="button" disabled={!data} onClick={() => data && exportCsv(`employee-analytics-${month}.csv`, ["Category", "Amount", "Currency"], data.categories.map((item) => [item.name, item.amount, data.currency]))}
        className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.08] inline-flex items-center gap-1.5 disabled:opacity-50">
        <Download className="h-3.5 w-3.5" />Export CSV</button>
    </div>
  </div>;
}

export default AnalyticsHeader;
