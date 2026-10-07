"use client";

import { useState } from "react";
import { money } from "../../../shared/utils/format";
import { cardUsage } from "../data/cardUsage";

export function CardLimitUsage() {
  const [selectedId, setSelectedId] = useState<string>("aura");
  const card = cardUsage.find((item) => item.id === selectedId) ?? cardUsage[0];
  const spent = card.weeks.reduce((sum: number, amount) => sum + amount, 0);
  const available = card.limit - spent;
  const utilization = (spent / card.limit) * 100;
  const weeklyLimit = card.limit / 4;

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col" aria-label="Card Spending & Limits">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Card Spending & Limits</h2>
        </div>
        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container-low text-outline font-semibold">••{card.last4} {card.network}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4" role="group" aria-label="Choose card for limit usage">
        {cardUsage.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === card.id}
            aria-controls="card-limit-details"
            onClick={() => setSelectedId(item.id)}
            className="analytics-card-selector min-w-0 rounded-xl p-3 text-left border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex items-center gap-1.5 font-semibold text-body-sm"><span aria-hidden="true" className="material-symbols-outlined text-[18px]">{item.id === "personal" ? "person" : "credit_card"}</span>{item.name}</span>
            <span className="block mt-1 text-label-caps opacity-75">••{item.last4} · {item.network}</span>
          </button>
        ))}
      </div>

      <div id="card-limit-details" aria-live="polite" aria-atomic="true">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-2.5 px-3.5 rounded-xl bg-surface-container-low/60">
          {[
            { label: "Total Spent", amount: spent, color: "text-primary" },
            { label: "Available to Spend", amount: available, color: "text-tertiary" },
            { label: "Monthly Limit", amount: card.limit, color: "text-on-surface" },
          ].map((metric) => (
            <div key={metric.label} className="min-w-0">
              <div className="font-label-caps text-label-caps uppercase text-outline font-semibold">{metric.label}</div>
              <div className={`font-financial-display text-[22px] font-bold mt-0.5 ${metric.color}`}>{money(metric.amount)}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap text-outline border-b border-dashed border-outline-variant/40 pb-2">
          <span className="font-label-caps text-label-caps">Weekly Spending Guide</span>
          <span className="font-financial-tabular text-body-sm font-semibold">{money(weeklyLimit)} / week</span>
        </div>
        <div className="grid grid-cols-4 gap-3 h-36 items-end py-3" role="img" aria-label={`${card.name} weekly spending: ${card.weeks.map((amount, index) => `Week ${index + 1}: ${money(amount)}`).join(", ")}`}>
          {card.weeks.map((amount, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end min-w-0">
              <span className="font-financial-tabular text-body-sm font-semibold text-on-surface">{money(amount)}</span>
              <div className={`w-full max-w-[48px] rounded-t-md ${index === 3 ? "bg-primary-container" : "bg-outline-variant/60"}`} style={{ height: `${Math.max(5, Math.min(65, (amount / weeklyLimit) * 65))}%` }} />
              <span className="font-label-caps text-label-caps text-outline">Week {index + 1}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between gap-2 flex-wrap font-label-md text-label-md">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-primary font-semibold">Limit Used: {utilization.toFixed(1)}%</span>
              <span className="text-tertiary font-label-caps text-label-caps font-semibold">Spending: {utilization <= 75 ? "On Track" : "Near Limit"}</span>
            </div>
            <span className="text-outline font-label-caps text-label-caps">Resets Nov 1, 2025</span>
          </div>
          <div role="progressbar" aria-label={`${card.name} limit utilization`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(utilization.toFixed(1))} className="w-full h-2.5 rounded-full bg-surface-container-low overflow-hidden">
            <div className="h-full rounded-full bg-primary-container" style={{ width: `${Math.min(100, utilization)}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
