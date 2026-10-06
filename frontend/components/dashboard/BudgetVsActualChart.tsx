"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "@/lib/theme-store";
import { StatusBadge } from "@/components/shared/StatusBadge";

export interface BudgetSummary {
  allocatedBudget: string;
  approvedSpend: string;
  remainingBudget: string;
  utilization: string;
}

const DEFAULT_BUDGET_SUMMARY: BudgetSummary = {
  allocatedBudget: "₹25,00,000",
  approvedSpend: "₹18,40,000",
  remainingBudget: "₹6,60,000",
  utilization: "73.6%",
};

// Periodic spend vs budget milestones (clean balanced spacing for bar chart)
const BUDGET_TIMELINE_DATA = [
  { period: "Jun 1-4", allocated: 35, spend: 28 },
  { period: "Jun 5-8", allocated: 40, spend: 36 },
  { period: "Jun 9-12", allocated: 45, spend: 42 },
  { period: "Jun 13-16", allocated: 40, spend: 35 },
  { period: "Jun 17-20", allocated: 50, spend: 48 },
  { period: "Jun 21-24", allocated: 45, spend: 39 },
  { period: "Jun 25-28", allocated: 45, spend: 41 },
  { period: "Jun 29-30", allocated: 30, spend: 25 },
];

interface BudgetVsActualChartProps {
  summary?: BudgetSummary;
}

export function BudgetVsActualChart({
  summary = DEFAULT_BUDGET_SUMMARY,
}: BudgetVsActualChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filter, setFilter] = useState<"3m" | "30d" | "7d">("30d");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`rounded-xl p-5 space-y-4 transition-colors h-full flex flex-col justify-between border ${
      isDark
        ? "bg-[#111113] border-white/[0.07]"
        : "bg-white border-zinc-200/80 shadow-xs"
    }`}>
      {/* Top Header: Clean Title on Left, Filter on Right */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDark ? "border-white/[0.06]" : "border-zinc-200/60"
      }`}>
        <h3 className={`text-sm font-semibold tracking-tight whitespace-nowrap ${
          isDark ? "text-zinc-100" : "text-zinc-900"
        }`}>
          Budget vs Actual
        </h3>

        {/* Filter Segmented Control */}
        <div className={`inline-flex items-center rounded-lg p-0.5 shrink-0 ${
          isDark ? "bg-[#18181D] border border-white/[0.06]" : "bg-zinc-100 border border-zinc-200/80"
        }`}>
          {(["3m", "30d", "7d"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setFilter(period)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filter === period
                  ? isDark
                    ? "bg-[#25252D] text-white border border-white/[0.1] shadow-xs"
                    : "bg-white text-zinc-900 shadow-xs border border-zinc-200/60"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {period === "3m" ? "Last 3m" : period === "30d" ? "Last 30d" : "Last 7d"}
            </button>
          ))}
        </div>
      </div>

      {/* Unified Telemetry KPI Strip */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-4 rounded-lg border ${
        isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50/70 border-zinc-200/60"
      }`}>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-xs bg-[#2E9E74]/70 shrink-0" />
            <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Allocated Budget
            </span>
          </div>
          <span className={`text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
            {summary.allocatedBudget}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-xs bg-[#5A78A6] shrink-0" />
            <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Approved Spend
            </span>
          </div>
          <span className={`text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {summary.approvedSpend}
          </span>
        </div>

        <div>
          <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Remaining
          </span>
          <span className={`text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {summary.remainingBudget}
          </span>
        </div>

        <div>
          <span className={`text-[11px] font-medium block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Utilization
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[16px] font-semibold tracking-tight tabular-nums ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
              {summary.utilization}
            </span>
            <StatusBadge tone="success">Healthy</StatusBadge>
          </div>
        </div>
      </div>

      {/* Bar Chart Visual */}
      <div className="h-[210px] w-full pt-1">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BUDGET_TIMELINE_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)"}
                vertical={false}
              />
              <XAxis
                dataKey="period"
                stroke={isDark ? "#71717A" : "#A1A1AA"}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#A1A1AA" : "#71717A" }}
              />
              <YAxis
                stroke={isDark ? "#71717A" : "#A1A1AA"}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#71717A" : "#A1A1AA" }}
                tickFormatter={(val) => `₹${val}k`}
              />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)" }}
                contentStyle={{
                  backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                  border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E4E4E7",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: isDark ? "#F4F4F5" : "#18181B",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  padding: "8px 12px",
                }}
                formatter={(val: any, name: any) => [
                  `₹${val}k`,
                  name === "spend" ? "Approved Spend" : "Allocated Budget",
                ]}
              />
              <Bar
                dataKey="allocated"
                name="Allocated Budget"
                fill={isDark ? "rgba(46, 158, 116, 0.40)" : "rgba(46, 158, 116, 0.35)"}
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="spend"
                name="Approved Spend"
                fill={isDark ? "#6086D6" : "#4F75FF"}
                radius={[4, 4, 0, 0]}
                barSize={18}
                opacity={isDark ? 0.9 : 0.95}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className={`h-full w-full animate-pulse rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-zinc-200/40"}`} />
        )}
      </div>
    </div>
  );
}

