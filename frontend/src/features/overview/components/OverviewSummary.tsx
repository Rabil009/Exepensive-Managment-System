"use client";

import React from "react";
import { Wallet, Clock, CreditCard, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export function OverviewSummary() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cards = [
    {
      label: "Ready for Reimbursement",
      value: "₹2,480.50",
      icon: CheckCircle2,
      subBadge: "2 approved",
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Pending Approval",
      value: "₹840.00",
      icon: Clock,
      subBadge: "1 report",
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Card Spending (MTD)",
      value: "₹3,320.50",
      icon: CreditCard,
      subBadge: "of ₹7,500 limit",
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Card Limit Remaining",
      value: "₹4,179.50",
      icon: Wallet,
      subBadge: "56% avail",
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
  ];

  return (
    <section aria-label="Key Metrics">
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

              {/* Metric Value + Inline Context Sub-Badge */}
              <div className="mt-3.5 flex items-baseline justify-between gap-2">
                <span
                  className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {card.value}
                </span>
                <span
                  className={`text-xs font-medium tabular-nums shrink-0 ${
                    card.subColor
                  }`}
                >
                  {card.subBadge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default OverviewSummary;
