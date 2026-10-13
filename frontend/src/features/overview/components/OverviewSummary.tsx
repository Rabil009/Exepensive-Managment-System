"use client";

import React from "react";
import { Wallet, Clock, CreditCard, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import type { ExpenseSummary } from "../../expenses/data/ExpensesContext";

const toLakhs = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return "—";
  const cleaned = typeof value === "string" ? value.replace(/,/g, "") : value;
  const num = Number(cleaned);
  if (isNaN(num)) return "—";
  return `₹${(num / 100000).toFixed(2)}L`;
};

const fullRupees = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return "—";
  const cleaned = typeof value === "string" ? value.replace(/,/g, "") : value;
  const num = Number(cleaned);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function OverviewSummary({ summary }: { summary: ExpenseSummary | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardLimitNum = Number(summary?.card_limit) || 100000;
  const cardSpentNum = Number(summary?.card_spending_mtd) || 0;
  const cardRemainingNum = Number(summary?.card_limit_remaining) ?? Math.max(0, cardLimitNum - cardSpentNum);
  const isOverLimit = cardSpentNum > cardLimitNum;

  const cards = [
    {
      label: "Ready for Reimbursement",
      value: toLakhs(summary?.ready_for_reimbursement),
      rawTitle: fullRupees(summary?.ready_for_reimbursement),
      icon: CheckCircle2,
      subBadge: `${summary?.approved_count ?? 0} approved`,
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Pending Approval",
      value: toLakhs(summary?.pending_approval),
      rawTitle: fullRupees(summary?.pending_approval),
      icon: Clock,
      subBadge: `${summary?.pending_count ?? 0} pending`,
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Card Spending (MTD)",
      value: toLakhs(summary?.card_spending_mtd),
      rawTitle: fullRupees(summary?.card_spending_mtd),
      icon: CreditCard,
      subBadge: isOverLimit
        ? `Exceeded limit of ${toLakhs(cardLimitNum)}`
        : `Limit: ${toLakhs(cardLimitNum)}`,
      subColor: isOverLimit
        ? "text-amber-500 dark:text-amber-400 font-medium"
        : "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: "Card Limit Remaining",
      value: toLakhs(cardRemainingNum),
      rawTitle: fullRupees(cardRemainingNum),
      icon: Wallet,
      subBadge:
        cardLimitNum > 0
          ? `${Math.max(0, Math.round((100 * cardRemainingNum) / cardLimitNum))}% available`
          : "No card assigned",
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
              className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors border min-w-0 overflow-hidden ${
                isDark
                  ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                  : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
              }`}
            >
              {/* Category Label + Icon */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider truncate ${
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

              {/* Metric Value + Inline Context Sub-Badge (Stacked to guarantee no card boundary overflow) */}
              <div className="mt-3 flex flex-col gap-1 min-w-0">
                <div
                  className={`text-2xl sm:text-[25px] font-bold tracking-tight tabular-nums leading-tight truncate ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                  title={card.rawTitle || card.value}
                >
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-xs min-w-0">
                  <span className={`truncate tabular-nums ${card.subColor}`}>
                    {card.subBadge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default OverviewSummary;
