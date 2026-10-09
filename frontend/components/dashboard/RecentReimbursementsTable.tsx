"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTheme } from "@/lib/theme-store";
import { useFinanceStore } from "@/lib/finance-store";

export interface ReimbursementRow {
  id: string;
  employee: string;
  avatar?: string;
  department?: string;
  amount: string;
  completedDate: string;
  paymentMethod: string;
  status: "Paid";
}

interface RecentReimbursementsTableProps {
  items?: ReimbursementRow[];
  onViewAll?: () => void;
}

export function RecentReimbursementsTable({
  items,
  onViewAll,
}: RecentReimbursementsTableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { reimbursements } = useFinanceStore();

  const displayItems: ReimbursementRow[] = items || reimbursements.map((r) => ({
    id: r.id,
    employee: r.employee,
    avatar: r.avatar,
    department: r.department,
    amount: `₹${Number(r.amount).toLocaleString("en-IN")}`,
    completedDate: r.completedDate || "Recent",
    paymentMethod: r.paymentMethod || "Bank Transfer",
    status: "Paid",
  }));

  return (
    <div
      className={`rounded-xl overflow-hidden transition-colors border ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div
        className={`p-5 pb-3 flex items-center justify-between border-b ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/60"
        }`}
      >
        <h3 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          Recent Reimbursements
        </h3>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-xs font-medium border-b ${
                isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
              }`}
            >
              <th className="py-2.5 px-4 font-medium">Employee</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium">Completed Date</th>
              <th className="py-2.5 px-4 font-medium">Payment Method</th>
              <th className="py-2.5 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
            {displayItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-zinc-500">
                  No recent reimbursements found.
                </td>
              </tr>
            ) : (
              displayItems.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"}`}
              >
                {/* Employee with Avatar Profile & Department */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      {row.avatar ? (
                        <img
                          src={row.avatar}
                          alt={row.employee}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                          {row.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-medium text-[13px] leading-tight truncate ${
                          isDark ? "text-zinc-200" : "text-zinc-900"
                        }`}
                      >
                        {row.employee}
                      </span>
                      {row.department && (
                        <span
                          className={`text-[11.5px] leading-tight mt-0.5 truncate ${
                            isDark ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          {row.department}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td
                  className={`py-2.5 px-4 text-sm font-semibold tabular-nums text-right ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {row.amount}
                </td>
                <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {row.completedDate}
                </td>
                <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {row.paymentMethod}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex justify-end">
                    <StatusBadge tone="success">{row.status}</StatusBadge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
