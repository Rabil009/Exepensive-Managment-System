"use client";

import React from "react";
import { Wallet, Clock, CreditCard } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export function OverviewSummary() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section aria-label="Key Metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Ready for Reimbursement */}
        <div
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
                Ready for Reimbursement
              </span>
              <Wallet
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
                ₹2,480.50
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Expected payment: Oct 28</span>
            </span>
            <span className="tabular-nums">2 approved reports</span>
          </div>
        </div>

        {/* Card 2: Pending Approval */}
        <div
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
                Pending Approval
              </span>
              <Clock
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
                ₹840.00
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
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Awaiting manager review</span>
            </span>
            <span className="tabular-nums">1 report</span>
          </div>
        </div>

        {/* Card 3: Monthly Card Spending */}
        <div
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
                Monthly Card Spending
              </span>
              <CreditCard
                className={`h-4 w-4 shrink-0 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              />
            </div>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <span
                className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                ₹3,320.50
              </span>
              <span
                className={`text-xs tabular-nums ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                / ₹7,500.00
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                style={{ width: "44.2%" }}
              />
            </div>
            <div
              className={`flex items-center justify-between text-xs mt-2 tabular-nums ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              <span>44% of limit used</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                ₹4,179.50 remaining
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default OverviewSummary;
