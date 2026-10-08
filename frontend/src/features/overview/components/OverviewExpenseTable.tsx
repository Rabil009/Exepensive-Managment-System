"use client";

import React from "react";
import {
  RotateCw,
  Columns,
  Paperclip,
  CreditCard,
  Wallet,
  Plane,
  Building2,
  Coffee,
  Laptop,
  ShoppingBag,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { displayDate, money } from "../../../shared/utils/format";
import { tabs } from "../data/overview";
import type { OverviewModel } from "../hooks/useOverview";
import { useTheme } from "@/lib/theme-store";
import { downloadExpenseReceipt } from "../../expenses/data/newExpenseApi";

type Props = {
  model: Pick<
    OverviewModel,
    | "visible"
    | "expenses"
    | "tab"
    | "setTab"
    | "countFor"
    | "setNotice"
    | "refresh"
    | "loading"
    | "hideReceipt"
    | "setHideReceipt"
  >;
};

function getCategoryIcon(cat: string) {
  const c = cat?.toLowerCase() || "";
  if (c.includes("travel") || c.includes("flight")) return Plane;
  if (c.includes("accommodation") || c.includes("hotel")) return Building2;
  if (c.includes("food") || c.includes("meal") || c.includes("coffee")) return Coffee;
  if (c.includes("software") || c.includes("app")) return Laptop;
  if (c.includes("office") || c.includes("device") || c.includes("equipment")) return ShoppingBag;
  return Receipt;
}

export function OverviewExpenseTable({ model }: Props) {
  const {
    visible,
    expenses,
    tab,
    setTab,
    countFor,
    setNotice,
    refresh,
    loading,
    hideReceipt,
    setHideReceipt,
  } = model;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl overflow-hidden transition-colors border ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Table Toolbar */}
      <div
        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/60"
        }`}
      >
        {/* Status Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-lg border w-fit ${
            isDark
              ? "bg-[#18181D] border-white/[0.06]"
              : "bg-zinc-100 border-zinc-200/80"
          }`}
          role="group"
          aria-label="Expense status"
        >
          {tabs.map(({ value, label }) => {
            const isSelected = tab === value;
            const count = countFor(value);
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTab(value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? isDark
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "bg-black text-white shadow-xs font-semibold"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] leading-tight font-semibold tabular-nums ${
                    isSelected
                      ? isDark
                        ? "bg-black/15 text-black"
                        : "bg-white/20 text-white"
                      : isDark
                      ? "bg-white/10 text-zinc-300"
                      : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="tabular-nums">
            Displaying {visible.length} of {expenses.length} records
          </span>
          <div className="h-3.5 w-px bg-zinc-200 dark:bg-white/[0.1]" />
          <button
            type="button"
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
            title="Refresh Expenses"
            disabled={loading}
            onClick={() => void refresh().then(() => setNotice("Expense records refreshed."))}
          >
            <RotateCw className="h-3.5 w-3.5 text-zinc-400" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
            title="Columns Visibility"
            aria-pressed={!hideReceipt}
            onClick={() => setHideReceipt((value) => !value)}
          >
            <Columns className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Flat Data Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-xs font-medium border-b ${
                isDark
                  ? "text-zinc-400 border-white/[0.06]"
                  : "text-zinc-500 border-zinc-200/60"
              }`}
            >
              <th className="py-2.5 px-4 font-medium">Merchant &amp; Purpose</th>
              <th className="py-2.5 px-4 font-medium">Date</th>
              <th className="py-2.5 px-4 font-medium">Expense Report</th>
              <th className="py-2.5 px-4 font-medium">Payment Method</th>
              {!hideReceipt && (
                <th className="py-2.5 px-4 font-medium">Receipt</th>
              )}
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium text-left">Status</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-[13px] ${
              isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
            }`}
          >
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={hideReceipt ? 6 : 7}
                  className="py-12 text-center text-xs text-zinc-500"
                >
                  No expenses match this view.
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const CatIcon = getCategoryIcon(item.category);
                const isCard =
                  item.paymentMethod?.toLowerCase().includes("card") ||
                  item.paymentMethod?.toLowerCase().includes("visa");

                const tone =
                  item.status === "Approved" || item.status === "Reimbursed"
                    ? "success"
                    : item.status === "Pending"
                    ? "warning"
                    : item.status === "Rejected"
                    ? "danger"
                    : "neutral";

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors cursor-pointer ${
                      isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"
                    }`}
                  >
                    {/* Merchant & Purpose */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            isDark
                              ? "bg-[#18181D] border-white/[0.08] text-zinc-300"
                              : "bg-zinc-100 border-zinc-200 text-zinc-700"
                          }`}
                        >
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`font-medium text-[13px] leading-tight truncate ${
                              isDark ? "text-zinc-200" : "text-zinc-900"
                            }`}
                          >
                            {item.merchant}
                          </span>
                          <span
                            className={`text-[11.5px] leading-tight mt-0.5 truncate max-w-xs ${
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-4 text-[13px] text-zinc-500 whitespace-nowrap tabular-nums">
                      {displayDate(item.date)}
                    </td>

                    {/* Expense Report */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                          isDark
                            ? "bg-white/[0.04] border-white/[0.08] text-zinc-300"
                            : "bg-zinc-100 border-zinc-200/80 text-zinc-700"
                        }`}
                      >
                        {item.report || "Unassigned"}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        {isCard ? (
                          <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                        ) : (
                          <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                        <span>{item.paymentMethod || "Out of Pocket"}</span>
                      </div>
                    </td>

                    {/* Receipt Status */}
                    {!hideReceipt && (
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                          <Paperclip
                            className={`h-3.5 w-3.5 ${
                              item.receipt
                                ? "text-emerald-500"
                                : "text-zinc-400"
                            }`}
                          />
                          {item.receipt ? <button type="button" className="hover:underline" onClick={() => void downloadExpenseReceipt(item.id, item.receipt || "receipt").catch((cause: unknown) => setNotice(cause instanceof Error ? cause.message : "Could not download receipt."))}>
                            {item.receipt === "Auto-Matched Invoice"
                              ? "Invoice Attached"
                              : item.receipt === "Verified Receipt"
                              ? "Receipt Attached"
                              : item.receipt || "No receipt"}
                          </button> : <span>No receipt</span>}
                        </div>
                      </td>
                    )}

                    {/* Amount */}
                    <td className="py-2.5 px-4 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {money(item.amount, item.currency)}
                    </td>

                    {/* Status with Dot */}
                    <td className="py-2.5 px-4 whitespace-nowrap text-left">
                      <StatusBadge tone={tone}>
                        {item.status}
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className={`p-3 sm:px-5 flex items-center justify-between border-t text-xs ${
          isDark
            ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
            : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Your saved expenses are shown above.</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-white/[0.08] text-zinc-400 cursor-not-allowed opacity-50"
            disabled
          >
            Previous
          </button>
          <span className="px-2 font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
            Page 1 of 1
          </span>
          <button
            type="button"
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 dark:border-white/[0.08] text-zinc-400 cursor-not-allowed opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
export default OverviewExpenseTable;
