"use client";

import React from "react";
import { Receipt, CreditCard, ShieldCheck } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import type { ReportsModel } from "../hooks/useReports";
import { formatTotal, isPersonal, isPersonalCard } from "../utils/reportTotals";

type Props = {
  model: Pick<
    ReportsModel,
    "items" | "corporate" | "personal" | "chartItems" | "total" | "verified"
  >;
};

export function ReportSummary({ model }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { items, corporate, personal, chartItems, total, verified } = model;
  const personalCard = personal.filter(isPersonalCard);
  const outOfPocket = personal.filter((item) => !isPersonalCard(item));
  const personalCardTotal = chartItems
    .filter(isPersonalCard)
    .reduce((sum, item) => sum + item.amount, 0);
  const outOfPocketTotal = chartItems
    .filter((item) => isPersonal(item) && !isPersonalCard(item))
    .reduce((sum, item) => sum + item.amount, 0);
  const corporateTotal = chartItems
    .filter((item) => !isPersonal(item))
    .reduce((sum, item) => sum + item.amount, 0);

  const allVerified = verified.length === items.length && items.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Report Total */}
      <div
        className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors border ${
          isDark
            ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
            : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Report Total
          </span>
          <Receipt className="h-4 w-4 text-zinc-400 shrink-0" />
        </div>

        <div className="mt-3.5 flex items-baseline justify-between gap-2">
          <span
            className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {formatTotal(items)}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
            {items.length} {items.length === 1 ? "expense" : "expenses"}
          </span>
        </div>

        <div
          className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
            isDark ? "border-white/[0.06]" : "border-zinc-100"
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">Average Expense</span>
          <span
            className={`font-semibold tabular-nums ${
              isDark ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            {formatTotal(items, true)}
          </span>
        </div>
      </div>

      {/* Card 2: Payment Breakdown */}
      <div
        className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors border ${
          isDark
            ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
            : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Payment Breakdown
          </span>
          <CreditCard className="h-4 w-4 text-zinc-400 shrink-0" />
        </div>

        <div className="mt-2.5 space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-xs bg-[#5A78A6] shrink-0" />
              <span>Corporate Card:</span>
            </span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatTotal(corporate)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-xs bg-[#8875B8] shrink-0" />
              <span>Personal Card:</span>
            </span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatTotal(personalCard)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-xs bg-[#3B9B78] shrink-0" />
              <span>Out-of-Pocket:</span>
            </span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatTotal(outOfPocket)}
            </span>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden flex mt-2.5 ${
            isDark ? "bg-[#1E1E24]" : "bg-zinc-100"
          }`}
        >
          <div
            className="h-full bg-[#5A78A6] transition-all"
            style={{
              width: `${total ? (corporateTotal / total) * 100 : 0}%`,
            }}
          />
          <div
            className="h-full bg-[#8875B8] transition-all"
            style={{
              width: `${total ? (personalCardTotal / total) * 100 : 0}%`,
            }}
          />
          <div
            className="h-full bg-[#3B9B78] transition-all"
            style={{
              width: `${total ? (outOfPocketTotal / total) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Card 3: Receipt Status */}
      <div
        className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors border ${
          isDark
            ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
            : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium uppercase tracking-wider ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Receipt Status
          </span>
          <ShieldCheck className="h-4 w-4 text-zinc-400 shrink-0" />
        </div>

        <div className="mt-3.5 flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
              allVerified
                ? "bg-[#3B9B78]/10 text-[#3B9B78] border-[#3B9B78]/20"
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}
          >
            {allVerified ? "All Receipts Attached" : "Receipts Need Review"}
          </span>
        </div>

        <div
          className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
            isDark ? "border-white/[0.06]" : "border-zinc-100"
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">Documentation</span>
          <span
            className={`font-semibold tabular-nums ${
              isDark ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            {verified.length} of {items.length} verified
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReportSummary;
