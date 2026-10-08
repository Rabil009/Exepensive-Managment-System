"use client";

import { TrendingUp, Receipt, CheckCircle2 } from "lucide-react";
import { money } from "../../../shared/utils/format";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

export function AnalyticsInsights({ data }: { data: AnalyticsData | null }) {
  const top = [...(data?.categories || [])].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
  const total = Number(data?.totals.total_spend || 0);
  const largest = data?.largest_expense;
  const insights = [
    { title: "Top Spending Category", value: top?.name || "—", subtitle: top && total ? `${Math.round(Number(top.amount) / total * 100)}% of monthly spend` : "No spend yet", icon: TrendingUp },
    { title: "Largest Single Expense", value: largest ? money(largest.amount, largest.currency) : "—", subtitle: largest ? `${largest.merchant} · ${largest.date}` : "No expenses yet", icon: Receipt },
    { title: "Receipt Compliance", value: `${data?.receipt_compliance.attached || 0} of ${data?.receipt_compliance.total || 0} attached`, subtitle: "Keep receipts for reimbursement", icon: CheckCircle2 },
  ];
  return <section aria-label="Analytics Insights" className="grid grid-cols-1 md:grid-cols-3 gap-4">{insights.map((item) => <div key={item.title} className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] flex gap-3"><item.icon className="h-4 w-4 mt-1 text-zinc-500" /><div><span className="text-xs uppercase text-zinc-500">{item.title}</span><div className="font-semibold mt-1">{item.value}</div><p className="text-xs text-zinc-500">{item.subtitle}</p></div></div>)}</section>;
}

export default AnalyticsInsights;
