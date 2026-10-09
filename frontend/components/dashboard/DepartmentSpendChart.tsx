"use client";

import React, { useMemo } from "react";
import { useTheme } from "@/lib/theme-store";
import { useFinanceStore } from "@/lib/finance-store";

interface DepartmentBudgetProgress {
  name: string;
  spent: string;
  allocated: string;
  percentage: number;
  color: string;
  status: "Normal" | "Near Limit" | "Critical";
}

const COLORS = ["#5A78A6", "#3B9B78", "#8875B8", "#C98642", "#E05656"];

export function DepartmentSpendChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { budgets } = useFinanceStore();

  const departments: DepartmentBudgetProgress[] = useMemo(() => {
    if (budgets && budgets.length > 0) {
      return budgets.map((b, idx) => {
        const allocated = Number(b.allocatedAmount) || 0;
        const spent = Number(b.spentAmount) || 0;
        const percentage = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;
        return {
          name: b.name,
          spent: `₹${(spent / 100000).toFixed(1)}L`,
          allocated: `₹${(allocated / 100000).toFixed(1)}L`,
          percentage,
          color: COLORS[idx % COLORS.length],
          status: percentage > 90 ? "Critical" : percentage > 75 ? "Near Limit" : "Normal",
        };
      });
    }
    return [];
  }, [budgets]);

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
          Live DB
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 my-2">
        {departments.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No department budgets recorded in Supabase.
          </div>
        ) : (
          departments.map((dept) => (
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
        )))}
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

