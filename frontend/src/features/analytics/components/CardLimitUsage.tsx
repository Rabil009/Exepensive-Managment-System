"use client";

import { CreditCard } from "lucide-react";
import { money } from "../../../shared/utils/format";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

export function CardLimitUsage({ data }: { data: AnalyticsData | null }) {
  const cards = data?.cards || [];
  const totalLimit = cards.reduce((sum, card) => sum + Number(card.limit), 0);
  const spent = Number(data?.totals.corporate_card_spend || 0);
  const utilization = totalLimit ? Math.min(100, spent / totalLimit * 100) : 0;
  return <section aria-label="Card Spending & Limits" className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07]">
    <h2 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" />Card Spending &amp; Limits</h2>
    {cards.length ? <><div className="space-y-2 mt-4">{cards.map((card) => <p key={card.id} className="text-xs text-zinc-500">{card.name} · ••{card.last4 || "••••"} · {money(Number(card.limit))} limit</p>)}</div>
      <div className="grid grid-cols-3 gap-3 my-4 text-xs"><div>Spent<strong className="block text-lg">{money(spent)}</strong></div><div>Available<strong className="block text-lg">{money(Math.max(0, totalLimit - spent))}</strong></div><div>Limit<strong className="block text-lg">{money(totalLimit)}</strong></div></div>
      <div role="progressbar" aria-valuenow={utilization} aria-valuemin={0} aria-valuemax={100} className="h-2 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden"><div className="h-full bg-[#5A78A6]" style={{ width: `${utilization}%` }} /></div></>
      : <p className="mt-6 text-xs text-zinc-500">No corporate card is assigned.</p>}
  </section>;
}

export default CardLimitUsage;
