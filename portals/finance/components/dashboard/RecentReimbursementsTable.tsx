"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface ReimbursementRow {
  id: string;
  employee: string;
  amount: string;
  completedDate: string;
  paymentMethod: string;
  status: "Paid";
}

const DEFAULT_REIMBURSEMENTS: ReimbursementRow[] = [
  {
    id: "reimb-1",
    employee: "Rahul Sharma",
    amount: "₹8,450",
    completedDate: "Oct 06, 2026",
    paymentMethod: "Bank Transfer (NEFT)",
    status: "Paid",
  },
  {
    id: "reimb-2",
    employee: "Priya Singh",
    amount: "₹4,200",
    completedDate: "Oct 06, 2026",
    paymentMethod: "Bank Transfer (IMPS)",
    status: "Paid",
  },
  {
    id: "reimb-3",
    employee: "Amit Kumar",
    amount: "₹12,800",
    completedDate: "Oct 05, 2026",
    paymentMethod: "Bank Transfer (RTGS)",
    status: "Paid",
  },
  {
    id: "reimb-4",
    employee: "Neha Verma",
    amount: "₹3,650",
    completedDate: "Oct 05, 2026",
    paymentMethod: "Bank Transfer (NEFT)",
    status: "Paid",
  },
];

interface RecentReimbursementsTableProps {
  items?: ReimbursementRow[];
  onViewAll?: () => void;
}

import { useTheme } from "@/lib/theme-store";

export function RecentReimbursementsTable({
  items = DEFAULT_REIMBURSEMENTS,
  onViewAll,
}: RecentReimbursementsTableProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`rounded-xl overflow-hidden transition-colors border ${
      isDark
        ? "bg-[#111113] border-white/[0.07]"
        : "bg-white border-zinc-200/80 shadow-xs"
    }`}>
      {/* Header */}
      <div className={`p-5 pb-3 flex items-center justify-between border-b ${
        isDark ? "border-white/[0.06]" : "border-zinc-200/60"
      }`}>
        <h3 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          Recent Reimbursements
        </h3>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs font-medium border-b ${
              isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
            }`}>
              <th className="py-2.5 px-4 font-medium">Employee</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium">Completed Date</th>
              <th className="py-2.5 px-4 font-medium">Payment Method</th>
              <th className="py-2.5 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
            {items.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"}`}
              >
                <td className={`py-3 px-4 font-medium ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  {row.employee}
                </td>
                <td className={`py-2.5 px-4 text-sm font-semibold tabular-nums text-right ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
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
                    <StatusBadge tone="success">
                      {row.status}
                    </StatusBadge>
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

