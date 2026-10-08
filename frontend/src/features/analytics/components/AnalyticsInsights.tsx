"use client";

import React from "react";
import { TrendingUp, Plane, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { money } from "../../../shared/utils/format";
import { useExpenses } from "../../expenses/data/ExpensesContext";

export function AnalyticsInsights() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { expenses } = useExpenses();
  const attached = expenses.filter((e) => e.receipt?.trim()).length;

  const insights = [
    {
      title: "Top Spending Category",
      value: "Travel & Lodging",
      icon: TrendingUp,
      subtitle: "45% of total monthly spend",
    },
    {
      title: "Largest Single Expense",
      value: money(1120.0),
      icon: Plane,
      subtitle: "Delta Air Lines · Oct 24",
    },
    {
      title: "Receipt Compliance",
      value: `${attached} of ${expenses.length || 8} attached`,
      icon: CheckCircle2,
      subtitle: "Keep receipts for all reimbursement items",
    },
  ];

  return (
    <section aria-label="Analytics Insights">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl px-5 py-4 flex items-start gap-3.5 transition-colors border ${
                isDark
                  ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                  : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  isDark
                    ? "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                    : "bg-zinc-100 border-zinc-200/80 text-zinc-700"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-xs font-medium uppercase tracking-wider block ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {item.title}
                </span>
                <div
                  className={`text-base font-semibold tracking-tight mt-1 truncate ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {item.value}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AnalyticsInsights;
