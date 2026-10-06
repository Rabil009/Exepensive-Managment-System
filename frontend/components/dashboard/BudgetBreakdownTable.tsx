"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface BudgetItem {
  id: string;
  name: string;
  allocated: string;
  spent: string;
  remaining: string;
  utilizationPercent: number;
}

const DEPARTMENT_BUDGETS: BudgetItem[] = [
  {
    id: "dep-1",
    name: "Engineering",
    allocated: "₹8,00,000",
    spent: "₹6,20,000",
    remaining: "₹1,80,000",
    utilizationPercent: 77.5,
  },
  {
    id: "dep-2",
    name: "Marketing",
    allocated: "₹5,00,000",
    spent: "₹3,10,000",
    remaining: "₹1,90,000",
    utilizationPercent: 62.0,
  },
  {
    id: "dep-3",
    name: "Operations",
    allocated: "₹7,00,000",
    spent: "₹6,40,000",
    remaining: "₹60,000",
    utilizationPercent: 91.4,
  },
  {
    id: "dep-4",
    name: "HR",
    allocated: "₹5,00,000",
    spent: "₹2,70,000",
    remaining: "₹2,30,000",
    utilizationPercent: 54.0,
  },
];

const PROJECT_BUDGETS: BudgetItem[] = [
  {
    id: "proj-1",
    name: "Project Phoenix (Core API)",
    allocated: "₹10,00,000",
    spent: "₹7,80,000",
    remaining: "₹2,20,000",
    utilizationPercent: 78.0,
  },
  {
    id: "proj-2",
    name: "Brand & Design Identity 2026",
    allocated: "₹4,00,000",
    spent: "₹2,30,000",
    remaining: "₹1,70,000",
    utilizationPercent: 57.5,
  },
  {
    id: "proj-3",
    name: "Cloud Security & Multi-AZ Migration",
    allocated: "₹6,50,000",
    spent: "₹6,10,000",
    remaining: "₹40,000",
    utilizationPercent: 93.8,
  },
];

const COST_CENTER_BUDGETS: BudgetItem[] = [
  {
    id: "cc-1",
    name: "CC-101 (Engineering Operations)",
    allocated: "₹8,50,000",
    spent: "₹6,40,000",
    remaining: "₹2,10,000",
    utilizationPercent: 75.3,
  },
  {
    id: "cc-2",
    name: "CC-202 (Marketing & Sales)",
    allocated: "₹6,00,000",
    spent: "₹3,90,000",
    remaining: "₹2,10,000",
    utilizationPercent: 65.0,
  },
  {
    id: "cc-3",
    name: "CC-303 (Enterprise Cloud & SaaS)",
    allocated: "₹7,50,000",
    spent: "₹7,10,000",
    remaining: "₹40,000",
    utilizationPercent: 94.6,
  },
];

import { useTheme } from "@/lib/theme-store";

export function BudgetBreakdownTable() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [dimension, setDimension] = useState<"Department" | "Project" | "Cost Center">("Department");

  const items =
    dimension === "Department"
      ? DEPARTMENT_BUDGETS
      : dimension === "Project"
      ? PROJECT_BUDGETS
      : COST_CENTER_BUDGETS;

  const getStatusBadge = (util: number) => {
    if (util > 100) {
      return <StatusBadge tone="danger">Over budget</StatusBadge>;
    }
    if (util >= 90) {
      return <StatusBadge tone="danger">Critical</StatusBadge>;
    }
    if (util >= 75) {
      return <StatusBadge tone="warning">Near limit</StatusBadge>;
    }
    return <StatusBadge tone="success">Healthy</StatusBadge>;
  };

  return (
    <div className={`rounded-xl overflow-hidden transition-colors border ${
      isDark
        ? "bg-[#111113] border-white/[0.07]"
        : "bg-white border-zinc-200/80 shadow-xs"
    }`}>
      {/* Header and Dimension Switcher */}
      <div className={`p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
        isDark ? "border-white/[0.06]" : "border-zinc-200/60"
      }`}>
        <h3 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          Budget Breakdown
        </h3>

        {/* Dimension Pill Controls */}
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center rounded-lg p-0.5 ${
            isDark ? "bg-[#18181D] border border-white/[0.06]" : "bg-zinc-100 border border-zinc-200/80"
          }`}>
            {(["Department", "Project", "Cost Center"] as const).map((dim) => (
              <button
                key={dim}
                type="button"
                onClick={() => setDimension(dim)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  dimension === dim
                    ? isDark
                      ? "bg-[#25252D] text-white border border-white/[0.1] shadow-xs"
                      : "bg-white text-zinc-900 shadow-xs border border-zinc-200/60"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs font-medium border-b ${
              isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
            }`}>
              <th className="py-2.5 px-4 font-medium">{dimension}</th>
              <th className="py-2.5 px-4 font-medium text-right">Allocated</th>
              <th className="py-2.5 px-4 font-medium text-right">Approved Spend</th>
              <th className="py-2.5 px-4 font-medium text-right">Remaining</th>
              <th className="py-2.5 px-4 font-medium">Utilization</th>
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
                  {row.name}
                </td>
                <td className={`py-3 px-4 text-right text-sm font-medium tabular-nums ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {row.allocated}
                </td>
                <td className={`py-3 px-4 text-right text-sm font-semibold tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {row.spent}
                </td>
                <td className={`py-3 px-4 text-right text-sm font-medium tabular-nums ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  {row.remaining}
                </td>
                <td className={`py-3 px-4 text-sm tabular-nums ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium tabular-nums">{row.utilizationPercent.toFixed(1)}%</span>
                    <div className={`w-16 h-1.5 rounded-full overflow-hidden hidden sm:block ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          row.utilizationPercent >= 90
                            ? "bg-rose-500/75 dark:bg-rose-400/70"
                            : row.utilizationPercent >= 75
                            ? "bg-amber-500/75 dark:bg-amber-400/70"
                            : "bg-[#2E9E74]/70 dark:bg-[#48B18B]/70"
                        }`}
                        style={{ width: `${Math.min(100, row.utilizationPercent)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex justify-end">
                    {getStatusBadge(row.utilizationPercent)}
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

