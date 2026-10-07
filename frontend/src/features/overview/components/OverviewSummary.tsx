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
      dotColor: "bg-emerald-500",
      subLeft: "Expected payment: Oct 28",
      subRight: "2 approved reports",
    },
    {
      label: "Pending Approval",
      value: "₹840.00",
      icon: Clock,
      dotColor: "bg-amber-500",
      subLeft: "Awaiting manager review",
      subRight: "1 report",
    },
    {
      label: "Card Spending (MTD)",
      value: "₹3,320.50",
      icon: CreditCard,
      dotColor: "bg-blue-500",
      subLeft: "Monthly limit: ₹7,500",
      subRight: "44% used",
    },
    {
      label: "Card Limit Remaining",
      value: "₹4,179.50",
      icon: Wallet,
      dotColor: "bg-emerald-500",
      subLeft: "Corporate Visa active",
      subRight: "56% avail",
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
              <div>
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

              <div
                className={`mt-4 pt-3 flex items-center justify-between border-t text-xs ${
                  isDark
                    ? "border-white/[0.06] text-zinc-400"
                    : "border-zinc-100 text-zinc-500"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                  <span className="truncate">{card.subLeft}</span>
                </span>
                <span className="tabular-nums shrink-0 ml-1">{card.subRight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default OverviewSummary;
