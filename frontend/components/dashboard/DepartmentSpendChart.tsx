"use client";

import React from "react";
import { useTheme } from "@/lib/theme-store";
import { ArrowUpRight } from "lucide-react";

interface DepartmentBudgetProgress {
  name: string;
  spent: string;
  allocated: string;
  percentage: number;
  color: string;
  status: "Normal" | "Near Limit" | "Critical";
}

const DEPARTMENTS: DepartmentBudgetProgress[] = [
  {
    name: "Engineering",
    spent: "₹8.2L",
    allocated: "₹10.0L",
    percentage: 82,
    color: "#5A78A6",
    status: "Near Limit",
  },
  {
    name: "Marketing & Growth",
    spent: "₹4.1L",
    allocated: "₹6.0L",
    percentage: 68,
    color: "#3B9B78",
    status: "Normal",
  },
  {
    name: "Product & Design",
    spent: "₹3.6L",
    allocated: "₹5.0L",
    percentage: 72,
    color: "#8875B8",
    status: "Normal",
  },
  {
    name: "Operations & Legal",
    spent: "₹2.5L",
    allocated: "₹4.0L",
    percentage: 62,
    color: "#C98642",
    status: "Normal",
  },
];

export function DepartmentSpendChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`rounded-xl p-5 flex flex-col justify-between transition-colors h-full border ${
      isDark
        ? "bg-[#111113] border-white/[0.07]"
        : "bg-white border-zinc-200/80 shadow-xs"
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDark ? "border-white/[0.06]" : "border-zinc-200/60"
      }`}>
        <h3 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          Department Utilization
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
          isDark
            ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
            : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
        }`}>
          Q2 2026
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 my-2">
        {DEPARTMENTS.map((dept) => (
          <div key={dept.name} className="space-y-1.5">
            {/* Dept Label & Metrics */}
            <div className="flex items-center justify-between text-[12.5px]">
              <span className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                {dept.name}
              </span>
              <div className="flex items-center gap-1.5 text-xs tabular-nums">
                <span className={`font-medium ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                  {dept.spent}
                </span>
                <span className={isDark ? "text-zinc-600" : "text-zinc-400"}>/</span>
                <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                  {dept.allocated}
                </span>
                <span className={`text-xs font-semibold tabular-nums ml-1 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}>
                  {dept.percentage}%
                </span>
              </div>
            </div>

            {/* Visual Progress Bar Track */}
            <div className={`h-2 w-full rounded-full overflow-hidden ${
              isDark ? "bg-[#1E1E24]" : "bg-zinc-200/80"
            }`}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${dept.percentage}%`,
                  backgroundColor: dept.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
        isDark ? "border-white/[0.04] text-zinc-500" : "border-zinc-200/40 text-zinc-500"
      }`}>
        <span>4 Active cost centers tracking on-target</span>
        <span className="tabular-nums font-medium">Avg 71.0%</span>
      </div>
    </div>
  );
}

