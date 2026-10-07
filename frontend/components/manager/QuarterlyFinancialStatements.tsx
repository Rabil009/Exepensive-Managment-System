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
import { Download } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { toast } from "sonner";

export interface StatementPeriodData {
  period: string;
  allocated: number;
  disbursed: number;
}

export interface StatementMonthRow {
  id: "june" | "may" | "april";
  m: string;
  d: string;
  c: string;
  t: string;
  s: string;
  data: StatementPeriodData[];
}

const MONTH_STATEMENTS: StatementMonthRow[] = [
  {
    id: "june",
    m: "June 2026",
    d: "₹1,42,800",
    c: "38 Claims",
    t: "₹28,500",
    s: "Verified",
    data: [
      { period: "Jun 1-4", allocated: 35, disbursed: 28 },
      { period: "Jun 5-8", allocated: 40, disbursed: 36 },
      { period: "Jun 9-12", allocated: 45, disbursed: 42 },
      { period: "Jun 13-16", allocated: 40, disbursed: 35 },
      { period: "Jun 17-20", allocated: 50, disbursed: 48 },
      { period: "Jun 21-24", allocated: 45, disbursed: 39 },
      { period: "Jun 25-28", allocated: 45, disbursed: 41 },
      { period: "Jun 29-30", allocated: 30, disbursed: 25 },
    ],
  },
  {
    id: "may",
    m: "May 2026",
    d: "₹1,36,200",
    c: "34 Claims",
    t: "₹26,800",
    s: "Verified",
    data: [
      { period: "May 1-4", allocated: 34, disbursed: 27 },
      { period: "May 5-8", allocated: 38, disbursed: 34 },
      { period: "May 9-12", allocated: 42, disbursed: 38 },
      { period: "May 13-16", allocated: 39, disbursed: 33 },
      { period: "May 17-20", allocated: 48, disbursed: 45 },
      { period: "May 21-24", allocated: 43, disbursed: 37 },
      { period: "May 25-28", allocated: 42, disbursed: 38 },
      { period: "May 29-31", allocated: 28, disbursed: 24 },
    ],
  },
  {
    id: "april",
    m: "April 2026",
    d: "₹1,33,000",
    c: "32 Claims",
    t: "₹24,100",
    s: "Verified",
    data: [
      { period: "Apr 1-4", allocated: 32, disbursed: 26 },
      { period: "Apr 5-8", allocated: 36, disbursed: 32 },
      { period: "Apr 9-12", allocated: 40, disbursed: 36 },
      { period: "Apr 13-16", allocated: 38, disbursed: 32 },
      { period: "Apr 17-20", allocated: 46, disbursed: 43 },
      { period: "Apr 21-24", allocated: 41, disbursed: 35 },
      { period: "Apr 25-28", allocated: 40, disbursed: 36 },
      { period: "Apr 29-30", allocated: 28, disbursed: 23 },
    ],
  },
];

export function QuarterlyFinancialStatements() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("june");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeRow =
    MONTH_STATEMENTS.find((m) => m.id === selectedMonthId) ||
    MONTH_STATEMENTS[0];

  const chartData = activeRow.data;

  const handleDownload = () => {
    toast.success("Downloading Q2 Statement", {
      description: "Verified GST report & expense reconciliations (PDF + CSV) queued for export.",
    });
  };

  return (
    <div
      className={`rounded-xl p-5 border transition-colors ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Top Header */}
      <div
        className={`pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/60"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Quarterly Financial Statements
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Download verified GST reports and company expense reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Month Filter Selector */}
          <div
            className={`inline-flex items-center rounded-lg p-0.5 shrink-0 ${
              isDark
                ? "bg-[#18181D] border border-white/[0.06]"
                : "bg-zinc-100 border border-zinc-200/80"
            }`}
          >
            {MONTH_STATEMENTS.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setSelectedMonthId(row.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedMonthId === row.id
                    ? isDark
                      ? "bg-[#25252D] text-white border border-white/[0.1] shadow-xs"
                      : "bg-white text-zinc-900 shadow-xs border border-zinc-200/60"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {row.m.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="h-8 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Q2 Statement</span>
          </button>
        </div>
      </div>

      {/* Visual Telemetry & Legend Strip */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-lg border mb-4 ${
          isDark
            ? "bg-[#161619] border-white/[0.05]"
            : "bg-zinc-50/70 border-zinc-200/60"
        }`}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#2E9E74]/70 shrink-0" />
            <span
              className={`text-[11px] font-medium block ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Allocated Budget
            </span>
          </div>
          <span
            className={`text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block ${
              isDark ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            {selectedMonthId === "june"
              ? "₹1,65,000"
              : selectedMonthId === "may"
              ? "₹1,55,000"
              : "₹1,50,000"}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#4F75FF] shrink-0" />
            <span
              className={`text-[11px] font-medium block ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Total Disbursed ({activeRow.m.split(" ")[0]})
            </span>
          </div>
          <span
            className={`text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {activeRow.d}
          </span>
        </div>

        <div>
          <span
            className={`text-[11px] font-medium block ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Tax Deductible (GST)
          </span>
          <span className="text-[16px] font-semibold tracking-tight tabular-nums mt-0.5 block text-emerald-500">
            {activeRow.t}
          </span>
        </div>

        <div>
          <span
            className={`text-[11px] font-medium block ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Reconciliation Status
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[14px] font-medium tracking-tight ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {activeRow.c}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              100% Verified
            </span>
          </div>
        </div>
      </div>

      {/* Clustered Bar Chart (matching Reference) */}
      <div className="h-[210px] w-full pt-1 pb-2">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.06)"
                }
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
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
              />
              <Tooltip
                cursor={{
                  fill: isDark
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.03)",
                }}
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
                formatter={(val, name) => [
                  `₹${val}k (₹${Number(val) * 1000})`,
                  name === "disbursed" ? "Total Disbursed" : "Allocated Budget",
                ]}
              />
              <Bar
                dataKey="allocated"
                name="Allocated Budget"
                fill={isDark ? "rgba(46, 158, 116, 0.45)" : "#a8d8c0"}
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="disbursed"
                name="Total Disbursed"
                fill={isDark ? "#6086D6" : "#4F75FF"}
                radius={[4, 4, 0, 0]}
                barSize={18}
                opacity={isDark ? 0.9 : 0.95}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            className={`h-full w-full animate-pulse rounded-lg ${
              isDark ? "bg-white/[0.04]" : "bg-zinc-200/40"
            }`}
          />
        )}
      </div>

      {/* Table Section */}
      <div
        className={`overflow-x-auto pt-3 border-t ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/60"
        }`}
      >
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b ${
                isDark
                  ? "text-zinc-400 border-white/[0.06]"
                  : "text-zinc-500 border-zinc-200/60"
              }`}
            >
              <th className="py-2.5 px-4 font-medium">Month</th>
              <th className="py-2.5 px-4 font-medium text-right">
                Total Disbursed
              </th>
              <th className="py-2.5 px-4 font-medium">Claims Count</th>
              <th className="py-2.5 px-4 font-medium text-right">
                Tax Deductible
              </th>
              <th className="py-2.5 px-4 font-medium text-right">
                Audit Status
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-[13px] ${
              isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
            }`}
          >
            {MONTH_STATEMENTS.map((row) => {
              const isSelected = selectedMonthId === row.id;
              return (
                <tr
                  key={row.m}
                  onClick={() => setSelectedMonthId(row.id)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-white/[0.05]"
                        : "bg-zinc-100/70"
                      : isDark
                      ? "hover:bg-white/[0.02]"
                      : "hover:bg-zinc-50"
                  }`}
                  title="Click to view chart for this month"
                >
                  <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected
                          ? "bg-blue-500 ring-2 ring-blue-500/20"
                          : "bg-transparent"
                      }`}
                    />
                    <span>{row.m}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {row.d}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{row.c}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-emerald-500 font-medium">
                    {row.t}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{row.s}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuarterlyFinancialStatements;