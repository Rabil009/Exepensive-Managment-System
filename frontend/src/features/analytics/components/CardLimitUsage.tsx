"use client";

import React, { useState } from "react";
import { CreditCard, User } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { money } from "../../../shared/utils/format";
import { cardUsage } from "../data/cardUsage";

// Finance Dashboard institutional color palette
const WEEK_COLORS = [
  "#5A78A6", // Week 1 - Slate Blue
  "#3B9B78", // Week 2 - Subdued Emerald
  "#C98642", // Week 3 - Warm Amber
  "#8875B8", // Week 4 - Dusty Violet
];

const CARD_COLORS: Record<string, string> = {
  aura: "#5A78A6",
  travel: "#3B9B78",
  personal: "#8875B8",
};

export function CardLimitUsage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedId, setSelectedId] = useState<string>("aura");
  const card = cardUsage.find((item) => item.id === selectedId) ?? cardUsage[0];
  const spent = card.weeks.reduce((sum: number, amount) => sum + amount, 0);
  const available = card.limit - spent;
  const utilization = (spent / card.limit) * 100;
  const weeklyLimit = card.limit / 4;

  return (
    <section
      aria-label="Card Spending & Limits"
      className={`rounded-xl p-5 flex flex-col justify-between transition-colors border ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-zinc-400 shrink-0" />
          <h2
            className={`text-sm font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            Card Spending &amp; Limits
          </h2>
        </div>
        <span
          className={`text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border ${
            isDark
              ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
              : "bg-zinc-50 text-zinc-600 border-zinc-200/80"
          }`}
        >
          ••{card.last4} {card.network}
        </span>
      </div>

      {/* Card Selector Pills */}
      <div
        className="grid grid-cols-3 gap-2 mt-4"
        role="group"
        aria-label="Choose card for limit usage"
      >
        {cardUsage.map((item) => {
          const isSelected = item.id === card.id;
          const cardColor = CARD_COLORS[item.id] || "#5A78A6";
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(item.id)}
              className={`rounded-lg p-2.5 text-left border transition-colors cursor-pointer ${
                isSelected
                  ? isDark
                    ? "bg-[#25252D] border-white/[0.1] text-zinc-100 shadow-xs"
                    : "bg-zinc-100 border-zinc-300 text-zinc-900 shadow-xs"
                  : isDark
                  ? "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  : "bg-zinc-50/60 border-zinc-200/70 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60"
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium text-xs">
                <span
                  className="h-2 w-2 rounded-xs shrink-0"
                  style={{ backgroundColor: cardColor }}
                />
                {item.id === "personal" ? (
                  <User className="h-3 w-3 shrink-0" />
                ) : (
                  <CreditCard className="h-3 w-3 shrink-0" />
                )}
                <span className="truncate">{item.name}</span>
              </div>
              <span className="block mt-0.5 text-[11px] opacity-75 tabular-nums">
                ••{item.last4} · {item.network}
              </span>
            </button>
          );
        })}
      </div>

      {/* Metrics Row */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-3 px-4 rounded-xl border ${
          isDark
            ? "bg-[#161619] border-white/[0.05]"
            : "bg-zinc-50/80 border-zinc-200/60"
        }`}
      >
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total Spent
          </div>
          <div className="text-[20px] font-semibold tracking-tight tabular-nums mt-0.5 text-zinc-900 dark:text-zinc-100">
            {money(spent)}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Available to Spend
          </div>
          <div className="text-[20px] font-semibold tracking-tight tabular-nums mt-0.5 text-zinc-900 dark:text-zinc-100">
            {money(available)}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Monthly Limit
          </div>
          <div className="text-[20px] font-semibold tracking-tight tabular-nums mt-0.5 text-zinc-900 dark:text-zinc-100">
            {money(card.limit)}
          </div>
        </div>
      </div>

      {/* Weekly Spending Guide */}
      <div
        className={`flex items-center justify-between pb-2 border-b border-dashed ${
          isDark ? "border-white/[0.08]" : "border-zinc-200"
        }`}
      >
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Weekly Spending Guide
        </span>
        <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {money(weeklyLimit)} / week
        </span>
      </div>

      {/* 4 Weekly Bars with Distinct Finance Dashboard Palette Colors */}
      <div
        className="grid grid-cols-4 gap-3 h-28 items-end py-2"
        role="img"
        aria-label="Weekly spending guide"
      >
        {card.weeks.map((amount, index) => {
          const heightPercent = Math.max(12, Math.min(100, (amount / weeklyLimit) * 100));
          const barColor = WEEK_COLORS[index % WEEK_COLORS.length];
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1.5 h-full justify-end min-w-0"
            >
              <span className="text-[11px] font-medium tabular-nums text-zinc-900 dark:text-zinc-100 truncate">
                {money(amount)}
              </span>
              <div
                className="w-full max-w-[40px] rounded-t-md transition-all shadow-xs"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                }}
              />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Week {index + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Limit Progress Footer with Finance Dashboard Color Palette */}
      <div
        className={`flex flex-col gap-2 pt-3 border-t ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/80"
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
              Limit Used: {utilization.toFixed(1)}%
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#3B9B78]/15 text-[#3B9B78] border border-[#3B9B78]/30">
              {utilization <= 75 ? "On Track" : "Near Limit"}
            </span>
          </div>
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Resets Nov 1, 2025
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Number(utilization.toFixed(1))}
          className={`w-full h-2 rounded-full overflow-hidden ${
            isDark ? "bg-[#1E1E24]" : "bg-zinc-200/80"
          }`}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, utilization)}%`,
              backgroundColor: utilization > 80 ? "#C98642" : "#5A78A6",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default CardLimitUsage;
