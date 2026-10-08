"use client";

import React from "react";
import Link from "next/link";
import {
  FileDown,
  PlusCircle,
  Undo2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { ReportsModel } from "../hooks/useReports";
import { StatusBadge } from "../../../shared/components/StatusBadge";

type Props = {
  model: Pick<
    ReportsModel,
    | "groups"
    | "selected"
    | "selectReport"
    | "recalled"
    | "completed"
    | "recallReport"
    | "addItem"
  >;
};

export function ReportHeader({ model }: Props) {
  const {
    groups,
    selected,
    selectReport,
    recalled,
    completed,
    recallReport,
    addItem,
  } = model;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div className="flex flex-col gap-1">
        {/* Breadcrumb with Report Selector */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-0.5"
        >
          <Link
            href="/employee/dashboard"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Overview
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <Link
            href="/employee/reports"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Reports
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />

          <div className="relative inline-flex items-center">
            <select
              aria-label="Select expense report"
              className="bg-transparent pr-5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none appearance-none cursor-pointer"
              value={selected}
              onChange={(event) => selectReport(event.target.value)}
            >
              {groups.map((name, index) => (
                <option key={name} value={name} className="dark:bg-[#18181D]">
                  {`REP-2026-${String(index + 894).padStart(4, "0")}`} · {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 h-3 w-3 text-zinc-400 pointer-events-none" />
          </div>
        </nav>

        {/* Title & Status Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Expense Report
          </h1>
          <StatusBadge
            tone={completed ? "success" : recalled ? "neutral" : "warning"}
          >
            {recalled
              ? "Draft · Recalled"
              : completed
              ? "Reimbursed · Complete"
              : "Submitted · In Review"}
          </StatusBadge>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Review report totals, approval timeline, and individual expense line items.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <button
          type="button"
          onClick={() => window.print()}
          title="Save Report as PDF"
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <FileDown className="h-3.5 w-3.5 text-zinc-400" />
          <span>Save PDF</span>
        </button>

        <button
          type="button"
          onClick={addItem}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 text-zinc-400" />
          <span>Add Expense</span>
        </button>

        <button
          type="button"
          disabled={completed || recalled}
          onClick={recallReport}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Undo2 className="h-3.5 w-3.5" />
          <span>Withdraw Report</span>
        </button>
      </div>
    </div>
  );
}

export default ReportHeader;
