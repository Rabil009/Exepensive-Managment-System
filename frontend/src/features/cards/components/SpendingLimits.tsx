"use client";

import React from "react";
import {
  RotateCw,
  Plane,
  UtensilsCrossed,
  Laptop,
  Briefcase,
} from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<CardControlsModel, "spent" | "limit" | "percent" | "categories" | "month" | "card">;
};

export function SpendingLimits({ model }: Props) {
  const { spent, limit, percent, categories, month, card } = model;
  const period = month ? new Date(`${month}-01T00:00:00`) : new Date();
  const nextPeriod = new Date(period.getFullYear(), period.getMonth() + 1, 1);
  const available = Math.max(0, limit - spent);

  const kpis = [
    {
      name: "Total Spent",
      value: spent,
      note: `${percent.toFixed(1)}% of limit used`,
    },
    {
      name: "Available to Spend",
      value: available,
      note: "Remaining spending limit",
    },
    {
      name: "Monthly Limit",
      value: limit,
      note: "Assigned corporate limit",
    },
  ];

  // Standardize exactly 4 balanced corporate spending categories
  const catMap = new Map((categories || []).map((c) => [c.category?.toUpperCase(), c]));

  const standardFourCategories = [
    {
      category: "SOFTWARE",
      name: "Software & Cloud",
      icon: Laptop,
      color: "#3B9B78",
      spent: Number(catMap.get("SOFTWARE")?.spent || 0),
      limit: Number(catMap.get("SOFTWARE")?.limit || Math.round(limit * 0.35) || 35000),
    },
    {
      category: "TRAVEL",
      name: "Travel & Transit",
      icon: Plane,
      color: "#5A78A6",
      spent: Number(catMap.get("TRAVEL")?.spent || 0),
      limit: Number(catMap.get("TRAVEL")?.limit || Math.round(limit * 0.35) || 35000),
    },
    {
      category: "MEALS",
      name: "Meals & Dining",
      icon: UtensilsCrossed,
      color: "#C98642",
      spent: Number(catMap.get("MEALS")?.spent || catMap.get("FOOD")?.spent || 0),
      limit: Number(catMap.get("MEALS")?.limit || Math.round(limit * 0.15) || 15000),
    },
    {
      category: "OFFICE",
      name: "Office & Equipment",
      icon: Briefcase,
      color: "#8875B8",
      spent: Number(catMap.get("OFFICE")?.spent || catMap.get("HARDWARE")?.spent || 0),
      limit: Number(catMap.get("OFFICE")?.limit || Math.round(limit * 0.15) || 15000),
    },
  ];

  return (
    <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
      <section
        className="rounded-xl p-4 sm:p-5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex flex-col gap-4"
        aria-label="Monthly spending limits"
      >
        {/* Period Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.06] gap-2 flex-wrap">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spending Period
            </span>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {period.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400">
            <RotateCw className="h-3 w-3 text-zinc-400" />
            <span>
              Resets{" "}
              {nextPeriod.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {kpis.map((item) => (
            <div
              key={item.name}
              className="rounded-lg p-3 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col justify-between"
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {item.name}
              </span>
              <div className="mt-2">
                <span className="text-[20px] sm:text-[22px] font-semibold tracking-tight tabular-nums leading-none text-zinc-900 dark:text-zinc-100">
                  {money(item.value)}
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 tabular-nums">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Spend Overall Progress */}
        <div className="rounded-lg p-3.5 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Monthly Card Utilization</span>
            </div>
            <div className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {money(spent)}{" "}
              <span className="font-normal text-zinc-500 dark:text-zinc-400">
                / {money(limit)}
              </span>
            </div>
          </div>

          <div
            className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden"
            role="progressbar"
            aria-label="Monthly spend"
            aria-valuenow={spent}
            aria-valuemin={0}
            aria-valuemax={limit}
          >
            <div
              className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums">
            <span>₹0</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Spent: {money(spent)} ({percent.toFixed(1)}%)
            </span>
            <span>Limit: {money(limit)}</span>
          </div>
        </div>

        {/* Spending Limits by Category: EXACTLY 4 SECTIONS IN 2x2 GRID */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spending Limits by Category
            </h3>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums">
              4 active categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {standardFourCategories.map((item) => {
              const Icon = item.icon;
              const catPercent = Math.min(
                100,
                item.limit > 0 ? Math.round((item.spent / item.limit) * 100) : 0
              );
              const remaining = Math.max(0, item.limit - item.spent);

              return (
                <article
                  key={item.category}
                  className="rounded-lg p-2.5 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-md bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                        <Icon className="h-3 w-3 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 shrink-0">
                      {money(item.spent)}{" "}
                      <span className="font-normal text-zinc-400 text-[10.5px]">
                        / {money(item.limit).replace(".00", "")}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${catPercent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] text-zinc-500 dark:text-zinc-400 tabular-nums">
                    <span>{catPercent}% used</span>
                    <span>{money(remaining)} remaining</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {!card && (
          <p className="text-xs text-zinc-500">
            No assigned card or spending limits.
          </p>
        )}
      </section>
    </div>
  );
}

export default SpendingLimits;
