"use client";

import { Download } from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { exportCsv } from "../../../shared/utils/exportCsv";
import type { useEmployeeAnalytics } from "../data/useEmployeeAnalytics";

export function AnalyticsHeader({ model }: { model: ReturnType<typeof useEmployeeAnalytics> }) {
  const { data, month, setMonth } = model;
  const monthOptions = Array.from({ length: 60 }, (_, offset) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - offset);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      value,
      label: date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
  });
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div><h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">My Expense Analytics</h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Review your spending trends, category breakdown, and reimbursement status.</p></div>
    <div className="flex flex-wrap items-center gap-2">
      <StyledSelect aria-label="Analytics month" value={month} onChange={(event) => setMonth(event.target.value)}
        className="h-8 min-w-40 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 dark:border-white/[0.08] dark:bg-[#111113] dark:text-zinc-100" >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </StyledSelect>
      <button type="button" disabled={!data} onClick={() => data && exportCsv(`employee-analytics-${month}.csv`, ["Category", "Amount", "Currency"], (data.categories || []).map((item) => [item.name, item.amount, data.currency || "INR"]))}
        className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.08] inline-flex items-center gap-1.5 disabled:opacity-50">
        <Download className="h-3.5 w-3.5" />Export CSV</button>
    </div>
  </div>;
}

export default AnalyticsHeader;
