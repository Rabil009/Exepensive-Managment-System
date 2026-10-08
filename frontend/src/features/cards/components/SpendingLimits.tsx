"use client";

import React from "react";
import {
  RotateCw,
  Plane,
  UtensilsCrossed,
  Laptop,
  ShoppingBag,
} from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";
import { categories } from "../data/demoCards";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<CardControlsModel, "state" | "spent" | "limit" | "percent">;
};

function getCategoryIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("travel") || l.includes("lodging")) return Plane;
  if (l.includes("meal") || l.includes("diem") || l.includes("restaurant"))
    return UtensilsCrossed;
  if (l.includes("software") || l.includes("saas") || l.includes("cloud"))
    return Laptop;
  return ShoppingBag;
}

export function SpendingLimits({ model }: Props) {
  const { state, spent, limit, percent } = model;
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

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <section
        className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex flex-col gap-5"
        aria-label="Monthly spending limits"
      >
        {/* Period Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60 dark:border-white/[0.06] gap-2 flex-wrap">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spending Period
            </span>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Oct 1 – Oct 31, 2026
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400">
            <RotateCw className="h-3 w-3 text-zinc-400" />
            <span>Resets Nov 1, 2026</span>
          </span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kpis.map((item) => (
            <div
              key={item.name}
              className="rounded-lg p-3.5 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col justify-between"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {item.name}
              </span>
              <div className="mt-2.5">
                <span className="text-[22px] sm:text-[24px] font-semibold tracking-tight tabular-nums leading-none text-zinc-900 dark:text-zinc-100">
                  {money(item.value)}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 tabular-nums">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Spend Overall Progress */}
        <div className="rounded-lg p-4 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col gap-2.5">
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

          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
            <span>₹0</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Spent: {money(spent)} ({percent.toFixed(1)}%)
            </span>
            <span>Limit: {money(limit)}</span>
          </div>
        </div>

        {/* Spending Limits by Category */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spending Limits by Category
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
              4 active categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((item) => {
              const Icon = getCategoryIcon(item.label);
              const catPercent = Math.min(
                100,
                Math.round((item.spent / item.limit) * 100),
              );
              const remaining = Math.max(0, item.limit - item.spent);

              return (
                <article
                  key={item.label}
                  className="rounded-lg p-3 border bg-zinc-50/70 dark:bg-[#161619] border-zinc-200/70 dark:border-white/[0.06] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {money(item.spent)}{" "}
                      <span className="font-normal text-zinc-400 text-[11px]">
                        / {money(item.limit).replace(".00", "")}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${catPercent}%`, backgroundColor: item.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums">
                    <span>{catPercent}% used</span>
                    <span>{money(remaining)} remaining</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {state.requestedLimit && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
            Limit increase requested: {money(state.requestedLimit)} · Processing with issuer
          </p>
        )}
      </section>
    </div>
  );
}
export default SpendingLimits;
