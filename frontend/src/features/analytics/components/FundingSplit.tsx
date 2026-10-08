"use client";

import { ArrowLeftRight } from "lucide-react";
import { money } from "../../../shared/utils/format";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

export function FundingSplit({ data }: { data: AnalyticsData | null }) {
  const funding = [
    { label: "Corporate Card", amount: Number(data?.funding.corporate || 0), color: "#5A78A6" },
    { label: "Personal / Out-of-Pocket", amount: Number(data?.funding.personal || 0), color: "#3B9B78" },
  ];
  const total = funding.reduce((sum, item) => sum + item.amount, 0);
  return <section aria-label="Funding split" className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07]">
    <h2 className="text-sm font-semibold flex items-center gap-2"><ArrowLeftRight className="h-4 w-4" />How I Paid for Expenses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">{funding.map((item) => <div key={item.label} className="p-4 rounded-xl border bg-zinc-50 dark:bg-[#161619] border-zinc-200 dark:border-white/[0.05]"><div className="flex items-center justify-between text-xs text-zinc-500"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />{item.label}</span><strong>{total ? (item.amount / total * 100).toFixed(1) : "0.0"}%</strong></div><div className="mt-3 text-xl font-semibold">{money(item.amount)}</div></div>)}</div>
    <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden flex">{funding.map((item) => <div key={item.label} style={{ width: `${total ? item.amount / total * 100 : 0}%`, backgroundColor: item.color }} />)}</div>
  </section>;
}

export default FundingSplit;
