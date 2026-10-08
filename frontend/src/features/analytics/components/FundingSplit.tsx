"use client";

import React from "react";
import { ArrowLeftRight } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { money } from "../../../shared/utils/format";

// Muted institutional color palette matching Finance Dashboard exactly
const funding = [
  {
    label: "Corporate Card",
    amount: 3320.5,
    color: "#5A78A6", // Finance Dashboard Slate Blue
  },
  {
    label: "Personal Card",
    amount: 2480.5,
    color: "#8875B8", // Finance Dashboard Dusty Violet
  },
  {
    label: "Out-of-Pocket",
    amount: 32619.5,
    color: "#3B9B78", // Finance Dashboard Subdued Emerald
  },
];

const total = funding.reduce((sum, item) => sum + item.amount, 0);
const percent = (amount: number) => (total ? (amount / total) * 100 : 0);

export function FundingSplit() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      aria-label="Funding split"
      className={`rounded-xl p-5 flex flex-col justify-between transition-colors border ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-zinc-400 shrink-0" />
          <h2
            className={`text-sm font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            How I Paid for Expenses
          </h2>
        </div>
        <span
          className={`text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border ${
            isDark
              ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
              : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
          }`}
        >
          Monthly Breakdown
        </span>
      </div>

      {/* 3 Funding Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {funding.map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-xl flex flex-col justify-between border transition-colors ${
              isDark
                ? "bg-[#161619] border-white/[0.05]"
                : "bg-zinc-50/80 border-zinc-200/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2 w-2 rounded-xs shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className={`text-[11px] font-medium uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <span
                className={`text-xs font-semibold tabular-nums shrink-0 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {percent(item.amount).toFixed(1)}%
              </span>
            </div>
            <div
              className={`mt-3 text-[22px] font-semibold tracking-tight tabular-nums ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              {money(item.amount)}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar & Summary */}
      <div
        className={`flex flex-col gap-2.5 pt-3 border-t ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/80"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {funding.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 ${
                index === 1
                  ? "md:justify-center"
                  : index === 2
                  ? "md:justify-end"
                  : ""
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span
                className={`text-[11.5px] font-medium tabular-nums ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {percent(item.amount).toFixed(1)}% {item.label} (
                {money(item.amount)})
              </span>
            </div>
          ))}
        </div>

        <div
          className={`w-full h-2 rounded-full overflow-hidden flex ${
            isDark ? "bg-[#1E1E24]" : "bg-zinc-200/80"
          }`}
          role="img"
          aria-label={funding
            .map(
              (item) =>
                `${item.label}: ${percent(item.amount).toFixed(1)} percent`
            )
            .join(", ")}
        >
          {funding.map((item) => (
            <div
              key={item.label}
              className="h-full transition-all duration-500"
              style={{
                width: `${percent(item.amount)}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FundingSplit;
