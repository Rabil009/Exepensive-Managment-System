"use client";

import React from "react";
import { Receipt, Clock, Landmark, CreditCard } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { money } from "../../../shared/utils/format";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

export function SummaryMetrics({ data }: { data: AnalyticsData | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cards = [
    {
      label: "Total Spend",
      value: money(Number(data?.totals.total_spend || 0)),
      icon: Receipt,
    },
    {
      label: "Pending Approval",
      value: money(Number(data?.totals.pending_approval || 0)),
      icon: Clock,
    },
    {
      label: "Reimbursed",
      value: money(Number(data?.totals.reimbursed || 0)),
      icon: Landmark,
    },
    {
      label: "Corporate Card Spend",
      value: money(Number(data?.totals.corporate_card_spend || 0)),
      icon: CreditCard,
    },
  ];

  return (
    <section aria-label="Summary Metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors border ${
                isDark
                  ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                  : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
              }`}
            >
              {/* Category Label + Icon */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {card.label}
                </span>
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                />
              </div>

              {/* Metric Value */}
              <div className="mt-3.5 flex items-center">
                <span
                  className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SummaryMetrics;
