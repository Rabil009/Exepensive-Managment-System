"use client";

import React from "react";
import { Download } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency } from "@/lib";

export function ReportsView() {
  const { claims, exportCsv, approvedAmountTotal } = useFinanceStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Accounting Reports & CSV Exports
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              Reconciliation Ready
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Export reconciled financial ledger records, tax allocations, and disbursement references
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className={`h-8 px-3 rounded-lg font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 border ${
            isDark
              ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
              : "bg-zinc-900 text-white hover:bg-black border-transparent"
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download Accounting CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`p-4 rounded-xl border transition-colors ${
            isDark
              ? "bg-[#111113] border-white/[0.07]"
              : "bg-white border-zinc-200/80 shadow-xs"
          }`}
        >
          <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Total Processed Volume
          </span>
          <span className={`text-xl font-semibold tabular-nums mt-1 block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {formatCurrency(approvedAmountTotal)}
          </span>
          <p className={`text-[11px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            {claims.length} total claims captured
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isDark
              ? "bg-[#111113] border-white/[0.07]"
              : "bg-white border-zinc-200/80 shadow-xs"
          }`}
        >
          <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Personal Claims Settlement
          </span>
          <span className={`text-xl font-semibold tabular-nums mt-1 block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {claims.filter((c) => c.paymentMethod !== "CORPORATE_CARD" && c.status === "PAID").length} settled
          </span>
          <p className={`text-[11px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Direct bank transfer UTR recorded
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-colors ${
            isDark
              ? "bg-[#111113] border-white/[0.07]"
              : "bg-white border-zinc-200/80 shadow-xs"
          }`}
        >
          <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Corporate Cards Accounted
          </span>
          <span className={`text-xl font-semibold tabular-nums mt-1 block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {claims.filter((c) => c.paymentMethod === "CORPORATE_CARD").length} claims
          </span>
          <p className={`text-[11px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Excluded from employee payout
          </p>
        </div>
      </div>
    </div>
  );
}
