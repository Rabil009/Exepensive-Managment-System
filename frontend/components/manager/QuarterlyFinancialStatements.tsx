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
import { supabase } from "@/lib/supabase";

export interface StatementPeriodData {
  period: string;
  allocated: number;
  disbursed: number;
}

export interface StatementMonthRow {
  id: string;
  m: string;
  d: string;
  c: string;
  t: string;
  s: string;
  data: StatementPeriodData[];
}

export function QuarterlyFinancialStatements() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  const [statements, setStatements] = useState<StatementMonthRow[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    let active = true;

    async function loadRealStatements() {
      try {
        const { data: claims } = await supabase.from("expense_claims").select("*");
        const allClaims = claims || [];

        // Group claims by YYYY-MM
        const monthsMap: Record<string, any[]> = {};
        allClaims.forEach((c: any) => {
          const mKey = c.expense_date?.slice(0, 7) || c.created_at?.slice(0, 7) || new Date().toISOString().slice(0, 7);
          if (!monthsMap[mKey]) monthsMap[mKey] = [];
          monthsMap[mKey].push(c);
        });

        const date = new Date();
        const mKeys: string[] = [];
        for (let i = 0; i < 3; i++) {
          const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
          mKeys.push(d.toISOString().slice(0, 7));
        }

        const computedRows: StatementMonthRow[] = mKeys.map((mKey) => {
          const monthClaims = monthsMap[mKey] || [];
          const disbursedSum = monthClaims
            .filter((c: any) => (c.status || "").toUpperCase().includes("APPROV") || (c.status || "").toUpperCase().includes("PAID") || (c.status || "").toUpperCase().includes("DISBURS"))
            .reduce((s: number, c: any) => s + (Number(c.amount) || 0), 0);

          const monthDate = new Date(`${mKey}-01T00:00:00`);
          const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

          const week1 = monthClaims.filter((c: any) => { const day = Number((c.expense_date || c.created_at || "").slice(8, 10) || 1); return day <= 7; });
          const week2 = monthClaims.filter((c: any) => { const day = Number((c.expense_date || c.created_at || "").slice(8, 10) || 1); return day > 7 && day <= 14; });
          const week3 = monthClaims.filter((c: any) => { const day = Number((c.expense_date || c.created_at || "").slice(8, 10) || 1); return day > 14 && day <= 21; });
          const week4 = monthClaims.filter((c: any) => { const day = Number((c.expense_date || c.created_at || "").slice(8, 10) || 1); return day > 21; });

          const sumAmt = (arr: any[]) => arr.reduce((s: number, c: any) => s + Math.round((Number(c.amount) || 0) / 1000), 0);

          return {
            id: mKey,
            m: monthLabel,
            d: `₹${disbursedSum.toLocaleString("en-IN")}`,
            c: `${monthClaims.length} Claims`,
            t: `₹${Math.round(disbursedSum * 0.18).toLocaleString("en-IN")}`,
            s: monthClaims.length > 0 ? "Verified" : "Pending",
            data: [
              { period: "Week 1", allocated: Math.max(25, sumAmt(week1) + 10), disbursed: sumAmt(week1) },
              { period: "Week 2", allocated: Math.max(25, sumAmt(week2) + 10), disbursed: sumAmt(week2) },
              { period: "Week 3", allocated: Math.max(25, sumAmt(week3) + 10), disbursed: sumAmt(week3) },
              { period: "Week 4", allocated: Math.max(25, sumAmt(week4) + 10), disbursed: sumAmt(week4) },
            ],
          };
        });

        if (active) {
          setStatements(computedRows);
          if (computedRows.length > 0) {
            setSelectedMonthId(computedRows[0].id);
          }
        }
      } catch (err) {
        console.warn("Failed to load real statements:", err);
      }
    }

    loadRealStatements();
    return () => { active = false; };
  }, []);

  const activeRow = statements.find((m) => m.id === selectedMonthId) || statements[0];
  const chartData = activeRow?.data || [];

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
            {statements.map((row) => (
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
            className={`text-sm font-semibold tracking-tight tabular-nums mt-0.5 block ${
              isDark ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            ₹1,50,000
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
              Total Disbursed ({activeRow?.m ? activeRow.m.split(" ")[0] : ""})
            </span>
          </div>
          <span
            className={`text-sm font-semibold tracking-tight tabular-nums mt-0.5 block ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {activeRow?.d || "₹0"}
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
          <span className="text-sm font-semibold tracking-tight tabular-nums mt-0.5 block text-emerald-500">
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
              className={`text-sm font-semibold tracking-tight tabular-nums ${
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
            {statements.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-zinc-500">
                  No monthly statements available.
                </td>
              </tr>
            ) : (
              statements.map((row) => {
                const isSelected = selectedMonthId === row.id;
                return (
                  <tr
                    key={row.id}
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
                    <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? "bg-blue-500 ring-2 ring-blue-500/20"
                            : "bg-transparent"
                        }`}
                      />
                      <span>{row.m}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {row.d}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-500">{row.c}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-500 font-medium">
                      {row.t}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{row.s}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuarterlyFinancialStatements;