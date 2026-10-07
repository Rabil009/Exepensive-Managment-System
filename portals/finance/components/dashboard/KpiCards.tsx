"use client";

import React from "react";
import { ArrowUpRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export interface FinanceKpis {
  awaitingVerificationCount: number;
  awaitingVerificationHighPriority: number;
  approvedAmount: string;
  approvedPeriod: string;
  reimbursementsPendingCount: number;
  reimbursementsPendingAmount: string;
  paymentsPendingCount: number;
  paymentsPendingAmount: string;
}

const DEFAULT_KPIS: FinanceKpis = {
  awaitingVerificationCount: 24,
  awaitingVerificationHighPriority: 8,
  approvedAmount: "₹8,42,500",
  approvedPeriod: "This month",
  reimbursementsPendingCount: 18,
  reimbursementsPendingAmount: "₹1,24,800 total",
  paymentsPendingCount: 12,
  paymentsPendingAmount: "₹76,400 total",
};

interface KpiCardsProps {
  data?: Partial<FinanceKpis>;
}

import { useTheme } from "@/lib/theme-store";

function renderMetricValue(val: string, isDark: boolean) {
  return (
    <span className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
      isDark ? "text-zinc-100" : "text-zinc-900"
    }`}>
      {val}
    </span>
  );
}

export function KpiCards({ data }: KpiCardsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const kpis = { ...DEFAULT_KPIS, ...data };

  const cards = [
    {
      label: "Awaiting Verification",
      value: String(kpis.awaitingVerificationCount),
      icon: Clock,
    },
    {
      label: "Approved Amount",
      value: kpis.approvedAmount,
      icon: CheckCircle2,
    },
    {
      label: "Reimbursements Pending",
      value: String(kpis.reimbursementsPendingCount),
      icon: AlertCircle,
    },
    {
      label: "Payments Pending",
      value: String(kpis.paymentsPendingCount),
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors cursor-pointer border ${
            isDark
              ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
              : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
          }`}
        >
          {/* Category Label + Icon */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {card.label}
            </span>
            <card.icon className={`h-4 w-4 shrink-0 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
          </div>

          {/* Metric Value */}
          <div className="mt-3.5 flex items-center">
            {renderMetricValue(card.value, isDark)}
          </div>
        </div>
      ))}
    </div>
  );
}
export { DEFAULT_KPIS };
