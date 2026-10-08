"use client";

import React from "react";
import { Search, Download, CreditCard, Wallet, RotateCcw } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import type { ReportsModel } from "../hooks/useReports";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { displayDate, money } from "../../../shared/utils/format";
import { formatTotal, isPersonal } from "../utils/reportTotals";

type Props = {
  model: Pick<
    ReportsModel,
    | "items"
    | "selected"
    | "visible"
    | "query"
    | "setQuery"
    | "category"
    | "setCategory"
    | "payment"
    | "setPayment"
    | "status"
    | "setStatus"
    | "exportTransactions"
    | "clearFilters"
  >;
};

export function ReportTransactions({ model }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    items,
    selected,
    visible,
    query,
    setQuery,
    category,
    setCategory,
    payment,
    setPayment,
    status,
    setStatus,
    exportTransactions,
    clearFilters,
  } = model;

  return (
    <section
      aria-label="Report Expenses"
      className={`rounded-xl border transition-colors overflow-hidden ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Top Filter and Header Row */}
      <div className="p-4 sm:p-5 flex flex-col gap-4 border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Report Expenses
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {items.length} {items.length === 1 ? "expense" : "expenses"} listed under{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {selected}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={exportTransactions}
            className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#161619] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1E1E24] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              aria-label="Search report expenses"
              placeholder="Search merchant or description..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Category:
            </span>
            <select
              aria-label="Category"
              className="h-8 px-2.5 text-xs bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {[...new Set(items.map((item) => item.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Payment:
            </span>
            <select
              aria-label="Payment"
              className="h-8 px-2.5 text-xs bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="All">All Payments</option>
              <option value="Corporate Card">Corporate Card</option>
              <option value="Out of Pocket">Out of Pocket</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Status:
            </span>
            <select
              aria-label="Status"
              className="h-8 px-2.5 text-xs bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {[...new Set(items.map((item) => item.status))].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {(query || category !== "All" || payment !== "All" || status !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-8 px-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Financial Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b text-[11px] font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-400 ${
                isDark ? "bg-[#141418] border-white/[0.06]" : "bg-zinc-50/80 border-zinc-100"
              }`}
            >
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Merchant &amp; Details</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium">Payment Method</th>
              <th className="py-3 px-4 font-medium">Receipt Status</th>
              <th className="py-3 px-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
            {visible.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-zinc-50/70 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 tabular-nums whitespace-nowrap">
                  {displayDate(item.date)}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-col min-w-0">
                    <strong className="text-zinc-900 dark:text-zinc-100 font-semibold truncate">
                      {item.merchant}
                    </strong>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {item.description || item.id}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-100/70 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 text-[11px] font-medium whitespace-nowrap">
                    {item.category}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    {isPersonal(item) ? (
                      <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                    ) : (
                      <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                    <span>{item.paymentMethod || "Not assigned"}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <StatusBadge tone={item.receipt ? "success" : "warning"}>
                    {item.receipt === "Auto-Matched Invoice"
                      ? "Invoice Attached"
                      : item.receipt === "Verified Receipt"
                      ? "Receipt Attached"
                      : item.receipt || "Receipt Missing"}
                  </StatusBadge>
                </td>

                <td className="py-3.5 px-4 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {money(item.amount, item.currency || "INR")}
                </td>
              </tr>
            ))}

            {!visible.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-zinc-500 dark:text-zinc-400"
                >
                  No transactions match the selected filters.{" "}
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1 cursor-pointer"
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr
              className={`border-t font-medium ${
                isDark ? "bg-[#141418] border-white/[0.06]" : "bg-zinc-50/80 border-zinc-100"
              }`}
            >
              <td
                className="py-3 px-4 text-zinc-500 dark:text-zinc-400 text-xs"
                colSpan={4}
              >
                Showing {visible.length} of {items.length} report transactions
              </td>
              <td className="py-3 px-4 text-right text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                Total:
              </td>
              <td className="py-3 px-4 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100 text-sm">
                {formatTotal(visible)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default ReportTransactions;
