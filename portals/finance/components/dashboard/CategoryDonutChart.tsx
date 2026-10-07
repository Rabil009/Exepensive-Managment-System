"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "@/lib/theme-store";

const CATEGORY_DATA = [
  { name: "Cloud & Infra", value: 700000, percentage: "38%", color: "#5A78A6" },
  { name: "Hardware", value: 500000, percentage: "27%", color: "#3B9B78" },
  { name: "Travel & Offsite", value: 370000, percentage: "20%", color: "#C98642" },
  { name: "Software & SaaS", value: 270000, percentage: "15%", color: "#8875B8" },
];

export function CategoryDonutChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          Spend by Category
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
          isDark
            ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
            : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
        }`}>
          June 2026
        </span>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative h-[190px] w-full my-2 flex items-center justify-center">
        {isMounted ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E4E4E7",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: isDark ? "#F4F4F5" : "#18181B",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    padding: "8px 12px",
                  }}
                  formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(1)}L`, "Amount"]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Total
              </span>
              <span className={`text-[19px] font-semibold tracking-tight tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                ₹18.4L
              </span>
            </div>
          </>
        ) : (
          <div className={`h-[150px] w-[150px] rounded-full animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-zinc-200/40"}`} />
        )}
      </div>

      {/* Clean Compact Legend */}
      <div className={`grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t ${
        isDark ? "border-white/[0.04]" : "border-zinc-200/60"
      }`}>
        {CATEGORY_DATA.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="h-2 w-2 rounded-xs shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className={`truncate ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                {cat.name}
              </span>
            </div>
            <span className={`text-[12px] font-medium tabular-nums ml-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {cat.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

