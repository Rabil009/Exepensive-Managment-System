"use client";

import React from "react";
import {
  Download,
  Search,
  CreditCard,
  Building2,
  Plane,
  Coffee,
  Car,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<
    CardControlsModel,
    | "visible"
    | "query"
    | "setQuery"
    | "status"
    | "setStatus"
    | "exportTransactions"
    | "transactionCount"
  >;
};

function getMerchantIcon(merchant: string) {
  const m = merchant.toLowerCase();
  if (m.includes("delta") || m.includes("flight") || m.includes("airline"))
    return Plane;
  if (m.includes("clancy") || m.includes("hotel") || m.includes("autograph"))
    return Building2;
  if (m.includes("coffee") || m.includes("lunch") || m.includes("food"))
    return Coffee;
  if (m.includes("uber") || m.includes("transfer") || m.includes("taxi"))
    return Car;
  return CreditCard;
}

export function CardTransactions({ model }: Props) {
  const {
    visible,
    query,
    setQuery,
    status,
    setStatus,
    exportTransactions,
    transactionCount,
  } = model;

  const totalAmount = visible.reduce((total, item) => total + item.amount, 0);

  return (
    <section className="rounded-xl overflow-hidden border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs">
      {/* Table Toolbar Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Card Transactions
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Recent authorizations, settled card payments, and corporate card activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input
              className="h-8 pl-8 pr-3 text-xs rounded-lg border bg-zinc-50/70 dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all w-44 sm:w-56"
              aria-label="Filter transactions"
              placeholder="Search merchant..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            aria-label="Filter by transaction status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Export CSV */}
          <button
            type="button"
            className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            onClick={exportTransactions}
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full min-w-[620px] text-left border-collapse">
          <thead>
            <tr className="text-xs font-medium border-b text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-white/[0.06]">
              <th className="py-2.5 px-4 font-medium">Merchant &amp; Purpose</th>
              <th className="py-2.5 px-4 font-medium">Date</th>
              <th className="py-2.5 px-4 font-medium">Payment Card</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50 dark:divide-white/[0.04] text-[13px]">
            {visible.map((item) => {
              const Icon = getMerchantIcon(item.merchant);
              const tone =
                item.status === "Success"
                  ? "success"
                  : item.status === "Failed"
                  ? "danger"
                  : "warning";

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-white/[0.03] cursor-pointer"
                >
                  {/* Merchant & Purpose */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <strong className="font-medium text-[13px] text-zinc-900 dark:text-zinc-100 truncate">
                          {item.merchant}
                        </strong>
                        <span className="text-[11.5px] text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                          {item.purpose}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-2.5 px-4 text-[13px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap tabular-nums">
                    {item.date}
                  </td>

                  {/* Payment Card */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                      <span>
                        Corporate Card ••{item.cardLabel || "••••"}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-4 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {money(item.amount)}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-4 whitespace-nowrap text-left">
                    <StatusBadge tone={tone}>{item.status}</StatusBadge>
                  </td>
                </tr>
              );
            })}
            {!visible.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-xs text-zinc-500"
                >
                  No transactions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="p-3 sm:px-5 flex items-center justify-between border-t border-zinc-200/60 dark:border-white/[0.06] text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-white/[0.01]">
        <span className="tabular-nums">
          Showing {visible.length} of {transactionCount} card transactions
        </span>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="uppercase text-[11px] tracking-wider text-zinc-400">Total:</span>
          <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {money(totalAmount)}
          </span>
        </div>
      </footer>
    </section>
  );
}
export default CardTransactions;
