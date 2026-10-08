"use client";

import React from "react";
import Link from "next/link";
import { PieChart, ArrowRight } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import type { ReportsModel } from "../hooks/useReports";
import { formatTotal } from "../utils/reportTotals";

// Standard Finance Dashboard Palette mapping
const CATEGORY_COLORS: Record<string, string> = {
  "Travel & Lodging": "#5A78A6",
  "Software & SaaS": "#3B9B78",
  "Meals & Other": "#C98642",
  "Equipment & Devices": "#8875B8",
};

type Props = {
  model: Pick<ReportsModel, "distribution" | "quarterTotal" | "quarterItems">;
};

export function SpendDistribution({ model }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { distribution, quarterTotal, quarterItems } = model;

  return (
    <section
      aria-label="Category Distribution"
      className={`rounded-xl p-5 border transition-colors ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Spend by Category
          </h2>
        </div>
        <Link
          href="/employee/analytics"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <span>View Analytics</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-3">
        Quarterly distribution across your active expense reports
      </p>

      {/* Multi-segment progress track */}
      <div
        className={`flex h-2 rounded-full overflow-hidden my-2 ${
          isDark ? "bg-[#1E1E24]" : "bg-zinc-100"
        }`}
      >
        {distribution.map((group) => {
          const color = CATEGORY_COLORS[group.name] || group.color;
          return (
            <div
              key={group.name}
              className="h-full transition-all"
              style={{
                width: `${quarterTotal ? (group.total / quarterTotal) * 100 : 0}%`,
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>

      {/* 4 Category Metric Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
        {distribution.map((group) => {
          const color = CATEGORY_COLORS[group.name] || group.color;
          const percentage = quarterTotal
            ? Math.round((group.total / quarterTotal) * 100)
            : 0;

          return (
            <div
              key={group.name}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
                isDark
                  ? "bg-[#161619] border-white/[0.05]"
                  : "bg-zinc-50/80 border-zinc-200/60"
              }`}
            >
              <div className="flex items-center justify-between gap-1 text-xs">
                <span className="flex items-center gap-1.5 font-medium truncate text-zinc-900 dark:text-zinc-100">
                  <span
                    className="h-2 w-2 rounded-xs shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate">{group.name}</span>
                </span>
                <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 shrink-0">
                  {percentage}%
                </span>
              </div>

              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {group.description}
                </span>
                <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {formatTotal(group.items)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div
        className={`pt-3 mt-3 border-t flex justify-between items-center text-xs ${
          isDark ? "border-white/[0.06] text-zinc-400" : "border-zinc-100 text-zinc-500"
        }`}
      >
        <span>{quarterItems.length} expense records</span>
        <span>
          Total Claimed:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatTotal(quarterItems)}
          </strong>
        </span>
      </div>
    </section>
  );
}

export default SpendDistribution;
