"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money } from "../../../shared/utils/format";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

const colors = ["#5A78A6", "#3B9B78", "#C98642", "#8875B8"];

export function SpendingOverview({ data }: { data: AnalyticsData | null }) {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const points = (period === "daily" ? data?.daily_spend.map((item) => ({ label: item.date.slice(8), amount: Number(item.amount) }))
    : data?.weekly_spend.map((item) => ({ label: item.week, amount: Number(item.amount) }))) || [];
  const total = Number(data?.totals.total_spend || 0);
  const categories = (data?.categories || []).map((item, index) => ({ name: item.name, value: Number(item.amount), color: colors[index % colors.length] }));
  return <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
    <section className="lg:col-span-8 rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07]">
      <div className="flex justify-between gap-3 mb-4"><div><h2 className="text-sm font-semibold">Spending Trend</h2><p className="text-xs text-zinc-500">Business expenses for {data?.month || "the selected month"}</p></div>
        <div className="flex gap-1">{(["daily", "weekly"] as const).map((value) => <button key={value} type="button" onClick={() => setPeriod(value)} aria-pressed={period === value}
          className={`h-7 px-2 rounded-md border text-xs capitalize ${period === value ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "border-zinc-200 dark:border-white/[0.1]"}`}>{value}</button>)}</div></div>
      <div className="h-[230px] w-full">{points.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} /><XAxis dataKey="label" fontSize={11} /><YAxis fontSize={11} tickFormatter={(value: number) => `₹${value}`} />
        <Tooltip formatter={(value) => money(Number(value))} /><Area type="monotone" dataKey="amount" stroke="#5A78A6" fill="#5A78A6" fillOpacity={0.18} /></AreaChart></ResponsiveContainer>
        : <div className="h-full flex items-center justify-center text-xs text-zinc-500">No expenses in this month.</div>}</div>
    </section>
    <section className="lg:col-span-4 rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07]">
      <h2 className="text-sm font-semibold">Category Breakdown</h2>
      <div className="h-[180px] relative">{categories.length ? <><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" innerRadius={54} outerRadius={74} strokeWidth={0}>{categories.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => money(Number(value))} /></PieChart></ResponsiveContainer><span className="absolute inset-0 flex items-center justify-center pointer-events-none text-sm font-semibold">{money(total)}</span></>
        : <div className="h-full flex items-center justify-center text-xs text-zinc-500">No category spend.</div>}</div>
      <div className="space-y-1.5">{categories.map((item) => <div key={item.name} className="flex justify-between items-center text-xs p-2 rounded-lg bg-zinc-50 dark:bg-white/[0.03]"><span className="flex items-center gap-2"><i className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />{item.name}</span><strong>{total ? Math.round(item.value / total * 100) : 0}%</strong></div>)}</div>
    </section>
  </div>;
}

export default SpendingOverview;
