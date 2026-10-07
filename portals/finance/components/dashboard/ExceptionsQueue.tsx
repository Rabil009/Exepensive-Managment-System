"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { PriorityBadge } from "@/components/shared/StatusBadge";

export interface ExceptionItem {
  id: string;
  type: string;
  description: string;
  count: number;
  priority: "High" | "Medium" | "Low";
}

const DEFAULT_EXCEPTIONS: ExceptionItem[] = [
  {
    id: "exc-1",
    type: "Missing receipt",
    description: "Expense claimed without compliant physical/digital tax proof",
    count: 8,
    priority: "High",
  },
  {
    id: "exc-2",
    type: "Duplicate expense",
    description: "Identical amount and merchant matched within 48h window",
    count: 3,
    priority: "High",
  },
  {
    id: "exc-3",
    type: "Invalid receipt",
    description: "Incomplete GSTIN, handwritten note, or blurred invoice image",
    count: 5,
    priority: "Medium",
  },
  {
    id: "exc-4",
    type: "Returned claim",
    description: "Rejected by Department Manager with clarification notes",
    count: 4,
    priority: "Medium",
  },
  {
    id: "exc-5",
    type: "Payment mismatch",
    description: "Bank disbursement settlement variance against approved ledger",
    count: 2,
    priority: "High",
  },
];

interface ExceptionsQueueProps {
  exceptions?: ExceptionItem[];
  onViewAll?: () => void;
  onReviewException?: (exception: ExceptionItem) => void;
}

import { useTheme } from "@/lib/theme-store";

export function ExceptionsQueue({
  exceptions = DEFAULT_EXCEPTIONS,
  onViewAll,
  onReviewException,
}: ExceptionsQueueProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`rounded-xl overflow-hidden transition-colors h-full flex flex-col justify-between border ${
      isDark
        ? "bg-[#111113] border-white/[0.07]"
        : "bg-white border-zinc-200/80 shadow-xs"
    }`}>
      {/* Section Header */}
      <div className={`p-5 pb-3 flex items-center justify-between border-b ${
        isDark ? "border-white/[0.06]" : "border-zinc-200/60"
      }`}>
        <div className="flex items-center gap-2.5">
          <h3 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            Exceptions Requiring Attention
          </h3>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
            isDark
              ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
              : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
          }`}>
            {exceptions.reduce((sum, e) => sum + e.count, 0)} items
          </span>
        </div>
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs font-medium border-b ${
              isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
            }`}>
              <th className="py-2.5 px-4 font-medium">Exception Type</th>
              <th className="py-2.5 px-4 font-medium">Count</th>
              <th className="py-2.5 px-4 font-medium">Priority</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/40"}`}>
            {exceptions.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"}`}
              >
                <td className="py-2.5 px-4">
                  <span className={`font-medium whitespace-nowrap ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                    {item.type}
                  </span>
                </td>
                <td className={`py-2.5 px-4 text-sm font-semibold tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {item.count}
                </td>
                <td className="py-2.5 px-4">
                  <PriorityBadge level={item.priority.toLowerCase() as "high" | "medium" | "low"} />
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onReviewException?.(item)}
                    className="h-7 px-2.5 rounded-[6px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer inline-flex items-center gap-1.5 bg-transparent border-0 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
                  >
                    <span>Resolve</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

