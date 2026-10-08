"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "@/lib/theme-store";
import { money } from "../../../shared/utils/format";

// Daily data points reflecting the curve in the design
const DAILY_DATA = [
  { date: "Oct 1", tick: "", amount: 620, merchant: "Uber Trip" },
  { date: "Oct 3", tick: "", amount: 510, merchant: "Starbucks Coffee" },
  { date: "Oct 5", tick: "Oct 5", amount: 720, merchant: "Blue Tokai" },
  { date: "Oct 8", tick: "", amount: 840, merchant: "Swiggy Delivery" },
  { date: "Oct 10", tick: "Oct 10", amount: 1420, merchant: "AWS Cloud Services" },
  { date: "Oct 13", tick: "", amount: 1850, merchant: "Zoom Pro" },
  { date: "Oct 15", tick: "Oct 15", amount: 1540, merchant: "Figma Team" },
  { date: "Oct 18", tick: "", amount: 2120, merchant: "GitHub Enterprise" },
  { date: "Oct 20", tick: "Oct 20", amount: 1940, merchant: "Google Cloud Platform" },
  { date: "Oct 22", tick: "", amount: 2480, merchant: "Hyatt Regency Dinner" },
  { date: "Oct 24", tick: "Oct 24", amount: 3380, merchant: "Delta Air Lines", highlight: true },
  { date: "Oct 27", tick: "", amount: 1490, merchant: "Apple Store Supplies" },
  { date: "Oct 30", tick: "Oct 30", amount: 940, merchant: "Local Transit" },
];

const WEEKLY_DATA = [
  { date: "Week 1", tick: "Oct 1-7", amount: 2480, merchant: "Cloud & Transit" },
  { date: "Week 2", tick: "Oct 8-14", amount: 4120, merchant: "Software & SaaS" },
  { date: "Week 3", tick: "Oct 15-21", amount: 5600, merchant: "Team Dinner & Tools" },
  { date: "Week 4", tick: "Oct 22-28", amount: 7350, merchant: "Flight & Lodging" },
  { date: "Week 5", tick: "Oct 29-31", amount: 1870, merchant: "Local Transport" },
];

const CATEGORY_DATA = [
  { name: "Travel & Lodging", percentage: "45%", value: 17289, color: "#5A78A6" },
  { name: "Software & SaaS", percentage: "23%", value: 8836, color: "#3B9B78" },
  { name: "Meals & Entertainment", percentage: "19%", value: 7300, color: "#C98642" },
  { name: "Equipment & Devices", percentage: "13%", value: 4995, color: "#8875B8" },
];

export function SpendingOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = period === "daily" ? DAILY_DATA : WEEKLY_DATA;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Left: Spending Trend (col-span-8) */}
      <div
        className={`lg:col-span-8 rounded-xl p-5 flex flex-col justify-between transition-colors border ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2
              className={`text-sm font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              Spending Trend
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Daily trajectory of incurred business expenses
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Daily / Weekly toggle pills */}
            <div
              className={`inline-flex items-center rounded-lg border p-0.5 ${
                isDark
                  ? "border-white/[0.08] bg-[#141417]"
                  : "border-zinc-200/80 bg-zinc-100/80"
              }`}
            >
              <button
                type="button"
                onClick={() => setPeriod("daily")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  period === "daily"
                    ? isDark
                      ? "bg-[#27272A] text-zinc-100 shadow-xs"
                      : "bg-white text-zinc-900 shadow-xs"
                    : isDark
                    ? "text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setPeriod("weekly")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  period === "weekly"
                    ? isDark
                      ? "bg-[#27272A] text-zinc-100 shadow-xs"
                      : "bg-white text-zinc-900 shadow-xs"
                    : isDark
                    ? "text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Weekly
              </button>
            </div>

            {/* Date badge */}
            <span
              className={`text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-md border ${
                isDark
                  ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
              }`}
            >
              Oct 1 – Oct 31
            </span>
          </div>
        </div>

        {/* Chart Visual with Area, axes and interactive tooltip */}
        <div className="relative h-[230px] w-full mt-2">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" debounce={150}>
              <AreaChart
                data={chartData}
                margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="spendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#5A78A6"
                      stopOpacity={isDark ? 0.35 : 0.22}
                    />
                    <stop
                      offset="100%"
                      stopColor="#5A78A6"
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke={isDark ? "#71717A" : "#A1A1AA"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={({ x, y, payload }) => {
                    const item = chartData.find((d) => d.date === payload.value);
                    if (!item || !item.tick) return <g />;
                    const isHighlight = item.date === "Oct 24";
                    return (
                      <text
                        x={x}
                        y={Number(y) + 12}
                        textAnchor="middle"
                        fill={
                          isHighlight
                            ? isDark
                              ? "#60A5FA"
                              : "#2563EB"
                            : isDark
                            ? "#71717A"
                            : "#71717A"
                        }
                        fontWeight={isHighlight ? 600 : 400}
                        fontSize={11}
                      >
                        {item.tick}
                      </text>
                    );
                  }}
                />
                <YAxis
                  stroke={isDark ? "#71717A" : "#A1A1AA"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    val === 0 ? "₹0.00" : `₹${Math.round(val / 1000)}k`
                  }
                  ticks={[0, 1000, 2000, 3000, 4000]}
                  domain={[0, 4000]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className={`rounded-lg p-2.5 shadow-lg border text-xs ${
                            isDark
                              ? "bg-[#18181B] border-white/[0.1] text-zinc-100"
                              : "bg-white border-zinc-200 text-zinc-900"
                          }`}
                        >
                          <div className="font-semibold text-[13px] tabular-nums">
                            {money(data.amount)}
                          </div>
                          <div className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-[11px] flex items-center gap-1">
                            <span>{data.date}</span>
                            <span>•</span>
                            <span className="font-medium">{data.merchant}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#5A78A6"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#spendAreaGradient)"
                  dot={({ cx, cy, payload }) => {
                    if (payload.date === "Oct 24") {
                      return (
                        <g key="highlight-oct-24">
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="#5A78A6"
                            fillOpacity={0.25}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#5A78A6"
                            stroke={isDark ? "#111113" : "#FFFFFF"}
                            strokeWidth={2}
                          />
                        </g>
                      );
                    }
                    if (["Oct 5", "Oct 10", "Oct 15", "Oct 20"].includes(payload.date)) {
                      return (
                        <circle
                          key={payload.date}
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill={isDark ? "#111113" : "#FFFFFF"}
                          stroke="#5A78A6"
                          strokeWidth={1.75}
                        />
                      );
                    }
                    return <g key={payload.date} />;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              className={`h-full w-full rounded-lg animate-pulse ${
                isDark ? "bg-white/[0.03]" : "bg-zinc-100"
              }`}
            />
          )}

          {/* Persistent highlight pill above Oct 24 for exact design match */}
          <div
            className={`absolute top-2 left-[73%] -translate-x-1/2 px-2.5 py-1 rounded-lg border shadow-md pointer-events-none text-left hidden sm:block ${
              isDark
                ? "bg-[#18181D]/90 border-white/[0.08] text-zinc-100 backdrop-blur-xs"
                : "bg-white/95 border-zinc-200 text-zinc-900 backdrop-blur-xs"
            }`}
          >
            <div className="text-xs font-semibold tabular-nums leading-tight">
              {money(1120.0)}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
              <span>Oct 24</span>
              <span>·</span>
              <span className="truncate">Delta Air Lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Category Breakdown (col-span-4) */}
      <div
        className={`lg:col-span-4 rounded-xl p-5 flex flex-col justify-between transition-colors border ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <h2
            className={`text-sm font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            Category Breakdown
          </h2>
          <span
            className={`text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border ${
              isDark
                ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
                : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
            }`}
          >
            October 2025
          </span>
        </div>

        {/* Donut Chart Visual */}
        <div className="relative h-[180px] w-full my-2 flex items-center justify-center">
          {isMounted ? (
            <>
              <ResponsiveContainer width="100%" height="100%" debounce={150}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid #E4E4E7",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: isDark ? "#F4F4F5" : "#18181B",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                      padding: "8px 12px",
                    }}
                    formatter={(val: any) => [money(Number(val)), "Spend"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                  className={`text-[19px] font-semibold tracking-tight tabular-nums ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {money(38420.0)}
                </span>
              </div>
            </>
          ) : (
            <div
              className={`h-[150px] w-[150px] rounded-full animate-pulse ${
                isDark ? "bg-white/[0.04]" : "bg-zinc-200/40"
              }`}
            />
          )}
        </div>

        {/* Legend */}
        <div
          className={`flex flex-col gap-1.5 pt-2 border-t ${
            isDark ? "border-white/[0.04]" : "border-zinc-200/60"
          }`}
        >
          {CATEGORY_DATA.map((cat) => (
            <div
              key={cat.name}
              className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                isDark ? "bg-white/[0.02] hover:bg-white/[0.04]" : "bg-zinc-50/70 hover:bg-zinc-100/70"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span
                  className={`truncate font-medium ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {cat.name}
                </span>
              </div>
              <span
                className={`font-semibold tabular-nums ml-2 ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {cat.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpendingOverview;
