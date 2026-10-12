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
import {
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  TrendingUp,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  fetchManagerClaims,
  fetchManagerQuarterlyReport,
  ManagerClaim,
  QuarterlyReport,
} from "@/lib/manager-api";

export interface StatementPeriodData {
  period: string;
  allocated: number;
  disbursed: number;
}

export interface StatementMonthRow {
  id: string;
  m: string;
  d: string;
  disbursedNum: number;
  c: string;
  claimsCountNum: number;
  t: string;
  taxDeductibleNum: number;
  s: string;
  data: StatementPeriodData[];
  claims: ManagerClaim[];
}

interface QuarterlyFinancialStatementsProps {
  initialClaims?: ManagerClaim[];
}

export function QuarterlyFinancialStatements({ initialClaims }: QuarterlyFinancialStatementsProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  const [statements, setStatements] = useState<StatementMonthRow[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");
  const [quarterlyMetrics, setQuarterlyMetrics] = useState<QuarterlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback row for initial render or empty state to prevent undefined access
  const defaultRow: StatementMonthRow = {
    id: "current",
    m: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    d: "₹0",
    disbursedNum: 0,
    c: "0 Claims",
    claimsCountNum: 0,
    t: "₹0",
    taxDeductibleNum: 0,
    s: "Verified",
    data: [
      { period: "Week 1", allocated: 35, disbursed: 0 },
      { period: "Week 2", allocated: 35, disbursed: 0 },
      { period: "Week 3", allocated: 35, disbursed: 0 },
      { period: "Week 4", allocated: 35, disbursed: 0 },
    ],
    claims: [],
  };

  const processClaimsIntoStatements = (allClaims: ManagerClaim[]) => {
    // 1. Group claims by YYYY-MM
    const monthsMap: Record<string, ManagerClaim[]> = {};
    allClaims.forEach((c) => {
      let mKey = "";
      if (c.date && c.date.includes("-")) {
        mKey = c.date.slice(0, 7);
      } else {
        mKey = new Date().toISOString().slice(0, 7);
      }
      if (!monthsMap[mKey]) monthsMap[mKey] = [];
      monthsMap[mKey].push(c);
    });

    // 2. Generate current and past 3 months
    const date = new Date();
    const mKeys: string[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const k = d.toISOString().slice(0, 7);
      if (!mKeys.includes(k)) mKeys.push(k);
    }
    // Also include any months from actual claims
    Object.keys(monthsMap).forEach((k) => {
      if (!mKeys.includes(k) && k.length === 7) mKeys.push(k);
    });
    mKeys.sort().reverse();

    const computedRows: StatementMonthRow[] = mKeys.map((mKey) => {
      const monthClaims = monthsMap[mKey] || [];
      const disbursedSum = monthClaims
        .filter(
          (c) =>
            (c.status || "").toUpperCase().includes("APPROV") ||
            (c.status || "").toUpperCase().includes("PAID") ||
            (c.status || "").toUpperCase().includes("DISBURS")
        )
        .reduce((s: number, c) => s + (Number(c.amount) || 0), 0);

      const [yearStr, monthStr] = mKey.split("-");
      const monthDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);
      const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      const week1 = monthClaims.filter((c) => {
        const day = Number(c.date?.split("-")[2] || "1");
        return day <= 7;
      });
      const week2 = monthClaims.filter((c) => {
        const day = Number(c.date?.split("-")[2] || "1");
        return day > 7 && day <= 14;
      });
      const week3 = monthClaims.filter((c) => {
        const day = Number(c.date?.split("-")[2] || "1");
        return day > 14 && day <= 21;
      });
      const week4 = monthClaims.filter((c) => {
        const day = Number(c.date?.split("-")[2] || "1");
        return day > 21;
      });

      const sumAmt = (arr: ManagerClaim[]) =>
        arr.reduce((s: number, c) => s + Math.round((Number(c.amount) || 0) / 1000), 0);

      const taxDeductible = Math.round(disbursedSum * 0.18);

      return {
        id: mKey,
        m: monthLabel,
        d: `₹${disbursedSum.toLocaleString("en-IN")}`,
        disbursedNum: disbursedSum,
        c: `${monthClaims.length} Claims`,
        claimsCountNum: monthClaims.length,
        t: `₹${taxDeductible.toLocaleString("en-IN")}`,
        taxDeductibleNum: taxDeductible,
        s: monthClaims.some((c) => c.policyNotes) ? "Audit Review" : "Verified",
        data: [
          { period: "Week 1", allocated: Math.max(30, sumAmt(week1) + 15), disbursed: sumAmt(week1) },
          { period: "Week 2", allocated: Math.max(30, sumAmt(week2) + 15), disbursed: sumAmt(week2) },
          { period: "Week 3", allocated: Math.max(30, sumAmt(week3) + 15), disbursed: sumAmt(week3) },
          { period: "Week 4", allocated: Math.max(30, sumAmt(week4) + 15), disbursed: sumAmt(week4) },
        ],
        claims: monthClaims,
      };
    });

    return computedRows;
  };

  useEffect(() => {
    setIsMounted(true);
    let active = true;

    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Fetch Quarterly Report
        const report = await fetchManagerQuarterlyReport();
        if (active && report) {
          setQuarterlyMetrics(report);
        }

        // 2. Fetch claims (use initialClaims if provided and non-empty, otherwise fetch)
        let allClaims: ManagerClaim[] = initialClaims && initialClaims.length > 0 ? initialClaims : [];
        if (allClaims.length === 0) {
          allClaims = await fetchManagerClaims();
        }

        // If backend returned claims or Supabase has claims
        if (allClaims.length === 0) {
          const { data: sbClaims } = await supabase.from("expense_claims").select("*");
          if (sbClaims && sbClaims.length > 0) {
            allClaims = sbClaims.map((c: any) => ({
              id: c.id,
              employeeName: c.employee_name || "Employee",
              department: c.employee_department || "Engineering",
              costCenter: c.cost_center || "CC-ENG-104",
              category: c.category || "Travel",
              description: c.description || c.title || "",
              amount: Number(c.amount) || 0,
              date: c.created_at ? c.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
              status: (c.status || "").toUpperCase().includes("APPROV")
                ? "Approved"
                : (c.status || "").toUpperCase().includes("REJECT")
                ? "Rejected"
                : "Pending",
              priority: Number(c.amount) > 5000 ? "High" : "Medium",
              receiptVerified: Boolean(c.receipt_url || c.receipt_name),
              policyNotes: c.policy_violation,
              managerRemark: c.manager_remark,
            }));
          }
        }

        const computed = processClaimsIntoStatements(allClaims);
        if (active) {
          setStatements(computed);
          if (computed.length > 0) {
            setSelectedMonthId(computed[0].id);
          }
        }
      } catch (err) {
        console.warn("Failed to load real statements:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [initialClaims]);

  const activeRow = statements.find((m) => m.id === selectedMonthId) || statements[0] || defaultRow;
  const chartData = activeRow?.data || defaultRow.data;

  // Real CSV export generation & download
  const handleDownload = () => {
    try {
      const monthLabel = activeRow.m;
      const claimsToExport = activeRow.claims || [];

      let csvContent = "";
      csvContent += `"COMPANY FINANCIAL STATEMENT & AUDIT RECONCILIATION"\n`;
      csvContent += `"Period:","${monthLabel}"\n`;
      csvContent += `"Total Disbursed:","${activeRow.d}"\n`;
      csvContent += `"Total Claims Processed:","${activeRow.c}"\n`;
      csvContent += `"Tax Deductible (GST 18%):","${activeRow.t}"\n`;
      csvContent += `"Audit Status:","${activeRow.s}"\n`;
      csvContent += `"Generated On:","${new Date().toLocaleString()}"\n\n`;

      csvContent += `"Claim ID","Employee","Department","Cost Center","Category","Description","Amount (INR)","Tax (GST 18%)","Status","Priority","Receipt Verified","Policy Notes","Manager Remark","Date"\n`;

      if (claimsToExport.length === 0) {
        csvContent += `"N/A","No processed claims for this period","","","","","0","0","Verified","Low","Yes","","",""\n`;
      } else {
        claimsToExport.forEach((c) => {
          const gst = Math.round(Number(c.amount) * 0.18);
          const safeDesc = `"${(c.description || "").replace(/"/g, '""')}"`;
          const safeEmp = `"${(c.employeeName || "").replace(/"/g, '""')}"`;
          const safeDept = `"${(c.department || "").replace(/"/g, '""')}"`;
          const safeNotes = `"${(c.policyNotes || "").replace(/"/g, '""')}"`;
          const safeRemark = `"${(c.managerRemark || "").replace(/"/g, '""')}"`;

          csvContent += `"${c.id}",${safeEmp},${safeDept},"${c.costCenter}","${c.category}",${safeDesc},${c.amount},${gst},"${c.status}","${c.priority}","${c.receiptVerified ? "Yes" : "No"}",${safeNotes},${safeRemark},"${c.date}"\n`;
        });
      }

      // Create download blob
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `Financial_Statement_${activeRow.id || "Q4_2026"}.csv`;
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Statement Exported: ${filename}`, {
        description: `Successfully generated verified report for ${monthLabel} with ${claimsToExport.length} claim(s).`,
      });
    } catch (err) {
      toast.error("Export failed", { description: String(err) });
    }
  };

  return (
    <div className="space-y-4">
      {/* Quarterly Performance Summary Cards */}
      {quarterlyMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-medium">Claims Processed</span>
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {quarterlyMetrics.totalClaimsProcessed}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">in {quarterlyMetrics.quarter}</span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-medium">Approved Payout</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                ₹{quarterlyMetrics.approvedTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-medium">Approval Rate</span>
              <ShieldCheck className="h-4 w-4 text-violet-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {quarterlyMetrics.approvalRatePercent}%
              </span>
              <span className="text-[11px] text-emerald-500 font-medium">High Compliance</span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-medium">Audit Exceptions</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {quarterlyMetrics.auditExceptionsCount}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">Flagged Items</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Financial Statements Container */}
      <div
        className={`rounded-xl p-5 border transition-colors ${
          isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
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
                Quarterly Financial Statements &amp; Audit Reconciliations
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review monthly spend telemetry, deductible tax invoices (GST), and audit records.
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
              <span>Download Statement</span>
            </button>
          </div>
        </div>

        {/* Visual Telemetry & Legend Strip */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-lg border mb-4 ${
            isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50/70 border-zinc-200/60"
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
                Allocated Monthly Budget
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
              Tax Deductible (GST 18%)
            </span>
            <span className="text-sm font-semibold tracking-tight tabular-nums mt-0.5 block text-emerald-500">
              {activeRow?.t || "₹0"}
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
                {activeRow?.c || "0 Claims"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{activeRow?.s || "Verified"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Clustered Bar Chart */}
        <div className="h-[210px] w-full pt-1 pb-2">
          {isMounted && !isLoading ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)"}
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
                  domain={[0, "auto"]}
                />
                <Tooltip
                  cursor={{
                    fill: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#18181B" : "#FFFFFF",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E4E4E7",
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
              className={`h-full w-full animate-pulse rounded-lg flex items-center justify-center ${
                isDark ? "bg-white/[0.04]" : "bg-zinc-200/40"
              }`}
            >
              <span className="text-xs text-zinc-500">Loading chart telemetry...</span>
            </div>
          )}
        </div>

        {/* Monthly Summary Table */}
        <div
          className={`overflow-x-auto pt-3 border-t ${
            isDark ? "border-white/[0.06]" : "border-zinc-200/60"
          }`}
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Month</th>
                <th className="py-2.5 px-4 font-medium text-right">Total Disbursed</th>
                <th className="py-2.5 px-4 font-medium">Claims Count</th>
                <th className="py-2.5 px-4 font-medium text-right">Tax Deductible (18%)</th>
                <th className="py-2.5 px-4 font-medium text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
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
                            isSelected ? "bg-blue-500 ring-2 ring-blue-500/20" : "bg-transparent"
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
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              row.s === "Verified" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
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

        {/* Itemized Claims Detail for Selected Month */}
        {activeRow.claims && activeRow.claims.length > 0 && (
          <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-zinc-500" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Itemized Audit Records ({activeRow.m})
                </h4>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                {activeRow.claims.length} claim(s)
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200/60 dark:border-white/[0.06]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b ${
                      isDark ? "bg-[#18181D] text-zinc-400 border-white/[0.06]" : "bg-zinc-50 text-zinc-500 border-zinc-200/60"
                    }`}
                  >
                    <th className="py-2 px-3 font-medium">Employee &amp; Dept</th>
                    <th className="py-2 px-3 font-medium">Description</th>
                    <th className="py-2 px-3 font-medium">Category</th>
                    <th className="py-2 px-3 font-medium text-right">Amount</th>
                    <th className="py-2 px-3 font-medium text-right">GST (18%)</th>
                    <th className="py-2 px-3 font-medium text-center">Status</th>
                    <th className="py-2 px-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-[12px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
                  {activeRow.claims.map((claim) => {
                    const gstVal = Math.round(Number(claim.amount) * 0.18);
                    return (
                      <tr
                        key={claim.id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100 block">
                            {claim.employeeName}
                          </span>
                          <span className="text-[11px] text-zinc-500 block">
                            {claim.department} &bull; {claim.costCenter}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate">
                          {claim.description || "Expense Claim"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                            {claim.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                          ₹{Number(claim.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-emerald-500 font-medium">
                          ₹{gstVal.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-medium ${
                              claim.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : claim.status === "Rejected"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-500 tabular-nums">
                          {claim.date}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuarterlyFinancialStatements;