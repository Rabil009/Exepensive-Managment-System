"use client";

import React, { useState, useMemo } from "react";
import { Search, Paperclip, AlertTriangle, ShieldCheck, Filter, ArrowUpRight } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import type { ExpenseClaim } from "@/types/finance";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency } from "@/lib";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import { ReceiptModal } from "@/components/shared/ReceiptModal";

export function ExceptionsView() {
  const { claims, exceptions, releaseHold, approveClaim } = useFinanceStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inspectClaim, setInspectClaim] = useState<ExpenseClaim | null>(null);

  // Active flagged claims (unresolved issues)
  const activeFlaggedClaims = useMemo(() => {
    return claims.filter((c) => {
      const isResolved =
        c.status === "PAID" ||
        c.status === "CLOSED" ||
        c.status === "PAYMENT_PENDING" ||
        c.status === "DISBURSED" ||
        c.status === "FINANCE_APPROVED" ||
        c.status === "FINANCE_REJECTED" ||
        c.status === "MANAGER_REJECTED";
      if (isResolved) return false;

      return (
        Boolean(c.policyViolation) ||
        Boolean(c.isDuplicateWarning) ||
        Boolean(c.isHold) ||
        (!c.receiptUrl || c.receiptUrl.trim() === "")
      );
    });
  }, [claims]);

  // All claims with missing receipts
  const missingReceiptClaims = useMemo(() => {
    return claims.filter((c) => !c.receiptUrl || c.receiptUrl.trim() === "");
  }, [claims]);

  const duplicateClaims = useMemo(() => {
    return claims.filter((c) => Boolean(c.isDuplicateWarning));
  }, [claims]);

  const policyClaims = useMemo(() => {
    return claims.filter((c) => Boolean(c.policyViolation));
  }, [claims]);

  const holdClaims = useMemo(() => {
    return claims.filter((c) => Boolean(c.isHold));
  }, [claims]);

  // Determine current list based on selected filter
  const currentCategoryList = useMemo(() => {
    switch (selectedFilter) {
      case "missing_receipt":
        return missingReceiptClaims;
      case "duplicates":
        return duplicateClaims;
      case "policy":
        return policyClaims;
      case "hold":
        return holdClaims;
      default:
        return activeFlaggedClaims.length > 0 ? activeFlaggedClaims : missingReceiptClaims;
    }
  }, [selectedFilter, missingReceiptClaims, duplicateClaims, policyClaims, holdClaims, activeFlaggedClaims]);

  // Apply search query
  const displayedClaims = useMemo(() => {
    if (!searchQuery.trim()) return currentCategoryList;
    const q = searchQuery.toLowerCase().trim();
    return currentCategoryList.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.employeeName.toLowerCase().includes(q) ||
        (c.employeeDepartment || "").toLowerCase().includes(q) ||
        (c.merchant || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q)
    );
  }, [currentCategoryList, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
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
              Exceptions &amp; Policy Violation Center
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              {missingReceiptClaims.length} missing receipts • {activeFlaggedClaims.length} active violations
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Track missing tax receipts, policy breaches, duplicate expenses, and audit holds. Click any card below to view all items.
          </p>
        </div>
      </div>

      {/* Interactive Exception Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Missing Receipt Card */}
        <div
          onClick={() => setSelectedFilter((prev) => (prev === "missing_receipt" ? "all" : "missing_receipt"))}
          className={`rounded-xl p-4 flex flex-col justify-between border transition-all cursor-pointer select-none ${
            selectedFilter === "missing_receipt"
              ? "ring-2 ring-emerald-500 border-emerald-500/50 bg-emerald-50/15 dark:bg-emerald-950/20 shadow-sm"
              : isDark
              ? "bg-[#111113] border-white/[0.07] hover:border-white/20"
              : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                Missing receipt
              </span>
              <PriorityBadge level="high" />
            </div>
            <p className={`text-xs line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Expense claimed without compliant physical/digital tax proof
            </p>
          </div>
          <div
            className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
              isDark ? "border-white/[0.06]" : "border-zinc-200/60"
            }`}
          >
            <span className={`text-lg font-bold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              {missingReceiptClaims.length} items
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>{selectedFilter === "missing_receipt" ? "Filtering list" : "Click to view all 30"}</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* 2. Duplicate Expense Card */}
        <div
          onClick={() => setSelectedFilter((prev) => (prev === "duplicates" ? "all" : "duplicates"))}
          className={`rounded-xl p-4 flex flex-col justify-between border transition-all cursor-pointer select-none ${
            selectedFilter === "duplicates"
              ? "ring-2 ring-amber-500 border-amber-500/50 bg-amber-50/15 dark:bg-amber-950/20 shadow-sm"
              : isDark
              ? "bg-[#111113] border-white/[0.07] hover:border-white/20"
              : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                Duplicate expense
              </span>
              <PriorityBadge level="high" />
            </div>
            <p className={`text-xs line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Identical amount and merchant matched within 48h audit window
            </p>
          </div>
          <div
            className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
              isDark ? "border-white/[0.06]" : "border-zinc-200/60"
            }`}
          >
            <span className={`text-lg font-bold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              {duplicateClaims.length} items
            </span>
            <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
              <span>{selectedFilter === "duplicates" ? "Filtering list" : "Click to view"}</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* 3. Policy Cap Exceeded Card */}
        <div
          onClick={() => setSelectedFilter((prev) => (prev === "policy" ? "all" : "policy"))}
          className={`rounded-xl p-4 flex flex-col justify-between border transition-all cursor-pointer select-none ${
            selectedFilter === "policy"
              ? "ring-2 ring-rose-500 border-rose-500/50 bg-rose-50/15 dark:bg-rose-950/20 shadow-sm"
              : isDark
              ? "bg-[#111113] border-white/[0.07] hover:border-white/20"
              : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                Policy limit cap exceeded
              </span>
              <PriorityBadge level="medium" />
            </div>
            <p className={`text-xs line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Nightly accommodation cap or meals daily allowance exceeded
            </p>
          </div>
          <div
            className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
              isDark ? "border-white/[0.06]" : "border-zinc-200/60"
            }`}
          >
            <span className={`text-lg font-bold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              {policyClaims.length} items
            </span>
            <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
              <span>{selectedFilter === "policy" ? "Filtering list" : "Click to view"}</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Flagged Claims Table Section */}
      <div
        className={`rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        {/* Table Controls Header */}
        <div
          className={`p-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
            isDark ? "border-white/[0.06]" : "border-zinc-200/60"
          }`}
        >
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedFilter === "all"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              All Active ({activeFlaggedClaims.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("missing_receipt")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedFilter === "missing_receipt"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Paperclip className="h-3 w-3" />
              <span>Missing Receipts ({missingReceiptClaims.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("duplicates")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedFilter === "duplicates"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Duplicates ({duplicateClaims.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("policy")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedFilter === "policy"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Policy Caps ({policyClaims.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("hold")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedFilter === "hold"
                  ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              On Hold ({holdClaims.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search claim, employee, merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-8 pl-8 pr-3 text-xs rounded-lg border focus:outline-none transition-colors w-full sm:w-64 ${
                isDark
                  ? "bg-[#18181D] border-white/[0.08] text-zinc-100 placeholder:text-zinc-500 focus:border-white/20"
                  : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
              }`}
            />
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr
                className={`text-xs font-medium border-b ${
                  isDark
                    ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
                    : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Claim ID</th>
                <th className="py-2.5 px-4 font-medium">Employee &amp; Dept</th>
                <th className="py-2.5 px-4 font-medium">Merchant &amp; Category</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium">Exception Detail</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {displayedClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`py-12 text-center text-xs ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    No claims match the selected filter or search query.
                  </td>
                </tr>
              ) : (
                displayedClaims.map((claim) => {
                  const isMissingReceipt = !claim.receiptUrl || claim.receiptUrl.trim() === "";
                  return (
                    <tr
                      key={claim.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                      }`}
                    >
                      {/* Claim ID */}
                      <td className={`py-3 px-4 font-mono text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>
                        {claim.id}
                      </td>

                      {/* Employee & Dept */}
                      <td className="py-3 px-4">
                        <span className={`font-medium block ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {claim.employeeName}
                        </span>
                        <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {claim.employeeDepartment || "General"}
                        </span>
                      </td>

                      {/* Merchant & Category */}
                      <td className="py-3 px-4">
                        <span className={`font-medium block truncate max-w-[160px] ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {claim.merchant || claim.title}
                        </span>
                        <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {claim.category || "General"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        {formatCurrency(claim.amount, claim.currency)}
                      </td>

                      {/* Violation / Exception Detail */}
                      <td className="py-3 px-4 max-w-xs">
                        {isMissingReceipt && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                            <Paperclip className="h-3 w-3 shrink-0" />
                            <span>Missing Tax Invoice / Receipt Proof</span>
                          </span>
                        )}
                        {claim.policyViolation && (
                          <span className="text-xs text-rose-500 font-medium block mt-0.5">
                            • {claim.policyViolation}
                          </span>
                        )}
                        {claim.isDuplicateWarning && (
                          <span className="text-xs text-amber-500 font-medium block mt-0.5">
                            • Potential duplicate expense pattern
                          </span>
                        )}
                        {claim.isHold && (
                          <span className="text-xs text-blue-500 font-medium block mt-0.5">
                            • Hold: {claim.holdReason || "Under audit review"}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={claim.status} />
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setInspectClaim(claim)}
                            className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer border flex items-center gap-1 ${
                              isMissingReceipt
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                                : isDark
                                ? "bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 border-white/[0.08]"
                                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{isMissingReceipt ? "Upload Receipt" : "View Receipt"}</span>
                          </button>

                          {claim.isHold && (
                            <button
                              type="button"
                              onClick={() => releaseHold(claim.id)}
                              className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                                isDark
                                  ? "bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border-white/[0.08]"
                                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                              }`}
                            >
                              Release
                            </button>
                          )}

                          {claim.status === "SUBMITTED" && !claim.isHold && (
                            <button
                              type="button"
                              onClick={() =>
                                approveClaim(
                                  claim.id,
                                  "Exception reviewed and granted exception waiver by Finance."
                                )
                              }
                              className={`h-7 px-2.5 rounded-md font-medium text-xs transition-colors cursor-pointer border ${
                                isDark
                                  ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
                                  : "bg-zinc-900 text-white hover:bg-black border-transparent"
                              }`}
                            >
                              Waiver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Receipt Inspection & Upload Modal */}
      {inspectClaim && (
        <ReceiptModal
          isOpen={Boolean(inspectClaim)}
          onClose={() => setInspectClaim(null)}
          claimId={inspectClaim.id}
          receiptName={inspectClaim.receiptName}
          receiptUrl={inspectClaim.receiptUrl}
          merchant={inspectClaim.merchant || inspectClaim.title}
          amount={inspectClaim.amount}
          currency={inspectClaim.currency}
          date={inspectClaim.submittedAt || inspectClaim.createdAt}
          employeeName={inspectClaim.employeeName}
          category={inspectClaim.category}
        />
      )}
    </div>
  );
}
