"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency, getEmployeeAvatar } from "@/lib";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function PaymentsView() {
  const { claims, reimbursements, exportCsv } = useFinanceStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filterChannel, setFilterChannel] = useState("ALL");

  const paidClaims = claims.filter((c) => c.status === "PAID" || c.status === "CLOSED");

  const filteredReimbursements = reimbursements.filter((r) => {
    if (filterChannel === "ALL") return true;
    return r.paymentMethod.toLowerCase().includes(filterChannel.toLowerCase());
  });

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when filter channel changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterChannel]);

  const totalItems = filteredReimbursements.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedReimbursements = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredReimbursements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReimbursements, safePage]);

  const getVisiblePages = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push("...");
      pages.push(total);
    }
    return pages;
  };

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
              Payments & Treasury Disbursements
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              {paidClaims.length} settled
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Payment initiation tracking, electronic bank clearing, and accounting exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isDark
                ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
                : "bg-zinc-900 text-white hover:bg-black border-transparent"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Overview Strip */}
      <div
        className={`rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Filter Channel:
          </span>
          <div
            className={`inline-flex items-center rounded-lg p-0.5 border ${
              isDark
                ? "bg-[#18181D] border-white/[0.06]"
                : "bg-zinc-100 border-zinc-200/80"
            }`}
          >
            {["ALL", "NEFT", "RTGS", "IMPS"].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setFilterChannel(ch)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterChannel === ch
                    ? isDark
                      ? "bg-[#25252D] text-white border border-white/[0.1] shadow-xs"
                      : "bg-white text-zinc-900 shadow-xs border border-zinc-200/60"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex items-center gap-4 text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          <span>
            Reimbursements Settled:{" "}
            <strong className={`font-semibold tabular-nums ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              {reimbursements.length}
            </strong>
          </span>
          <span>
            Corporate Card Direct:{" "}
            <strong className={`font-semibold tabular-nums ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              {paidClaims.filter((c) => c.paymentMethod === "CORPORATE_CARD").length}
            </strong>
          </span>
        </div>
      </div>

      {/* Payments Table */}
      <div
        className={`rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr
                className={`text-xs font-medium border-b ${
                  isDark
                    ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
                    : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Reference UTR</th>
                <th className="py-2.5 px-4 font-medium">Beneficiary</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium">Disbursement Date</th>
                <th className="py-2.5 px-4 font-medium">Channel</th>
                <th className="py-2.5 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {paginatedReimbursements.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`py-8 text-center text-xs ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    No settled disbursements found. Recorded bank payments will appear here.
                  </td>
                </tr>
              ) : (
                paginatedReimbursements.map((r) => (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                  }`}
                >
                  <td className={`py-3 px-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {r.paymentReference}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <img
                          src={r.avatar || getEmployeeAvatar(r.employee)}
                          alt={r.employee}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-medium text-[13px] leading-tight truncate ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {r.employee}
                        </span>
                        {r.department && (
                          <span className={`text-[11.5px] leading-tight mt-0.5 truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {r.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                    {formatCurrency(r.amount, r.currency)}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {r.completedDate}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {r.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex justify-end">
                      <StatusBadge tone="success">Confirmed</StatusBadge>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>

        {/* Payments Pagination Controls */}
        {totalItems > 0 && (
          <div
            className={`px-4 py-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs select-none ${
              isDark ? "border-white/[0.06] bg-[#141418]/60" : "border-zinc-200/60 bg-zinc-50/70"
            }`}
          >
            <div className={isDark ? "text-zinc-400" : "text-zinc-500"}>
              Showing{" "}
              <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, totalItems)}
              </span>{" "}
              of{" "}
              <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                {totalItems}
              </span>{" "}
              disbursements
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-[#18181D] hover:bg-[#22222A] text-zinc-300 border-white/[0.08]"
                    : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-2xs"
                }`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getVisiblePages(safePage, totalPages).map((item, idx) => {
                  if (item === "...") {
                    return (
                      <span
                        key={`payments-ellipsis-${idx}`}
                        className={`px-1.5 text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                      >
                        …
                      </span>
                    );
                  }
                  const pageNum = Number(item);
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-7 h-7 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        pageNum === safePage
                          ? isDark
                            ? "bg-white text-zinc-950 font-semibold shadow-xs"
                            : "bg-zinc-950 text-white font-semibold shadow-xs"
                          : isDark
                          ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-[#18181D] hover:bg-[#22222A] text-zinc-300 border-white/[0.08]"
                    : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-2xs"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
