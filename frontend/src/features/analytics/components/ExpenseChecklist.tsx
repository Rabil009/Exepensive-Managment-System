"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { useExpenses } from "../../expenses/data/ExpensesContext";
import { displayDate, money } from "../../../shared/utils/format";
import type { Expense } from "../../expenses/types";

const missingReceipt = (expense: Expense) => !expense.receipt?.trim();
const missingReport = (expense: Expense) =>
  !expense.report?.trim() || expense.report === "Unassigned";
const needsWork = (expense: Expense) =>
  missingReceipt(expense) || expense.status === "Draft" || missingReport(expense);

export function ExpenseChecklist() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { expenses } = useExpenses();
  const [filter, setFilter] = useState("all");

  const attention = expenses.filter(needsWork);
  const hasItems = attention.length > 0;

  const filters = [
    { id: "all", label: "All", count: attention.length },
    { id: "receipts", label: "Receipts", count: attention.filter(missingReceipt).length },
    { id: "drafts", label: "Drafts", count: attention.filter((e) => e.status === "Draft").length },
    { id: "reports", label: "Reports", count: attention.filter(missingReport).length },
  ];

  const visible = attention.filter((expense) =>
    filter === "all"
      ? true
      : filter === "receipts"
      ? missingReceipt(expense)
      : filter === "drafts"
      ? expense.status === "Draft"
      : missingReport(expense)
  );

  return (
    <section
      aria-label="Expense Checklist"
      className={`rounded-xl p-5 flex flex-col justify-between transition-colors border ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {hasItems ? (
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            ) : (
              <FileCheck className="h-4 w-4 text-zinc-400 shrink-0" />
            )}
            <h2
              className={`text-sm font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              Expenses to Complete
            </h2>
          </div>
          <span
            className={`text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border ${
              hasItems
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : isDark
                ? "bg-[#3B9B78]/10 text-[#3B9B78] border-[#3B9B78]/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {hasItems ? `${attention.length} Need Action` : "All Clear"}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {hasItems
            ? "Add missing receipts, assign reports, or finalize draft items."
            : "All submitted expenses have documentation and assigned reports."}
        </p>
      </div>

      {/* When there are actionable items: show filters and list */}
      {hasItems ? (
        <div className="my-3 flex-1 flex flex-col">
          {/* Minimalist Filter Tabs */}
          <div
            role="group"
            aria-label="Filter expenses to complete"
            className="flex flex-wrap gap-1.5 mb-3"
          >
            {filters.map((item) => {
              const isSelected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setFilter(item.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? isDark
                        ? "bg-[#25252D] border-white/[0.1] text-zinc-100 shadow-xs"
                        : "bg-zinc-900 border-zinc-900 text-white shadow-xs"
                      : isDark
                      ? "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200"
                      : "bg-zinc-50 border-zinc-200/80 text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {item.label}{" "}
                  <span className="ml-1 tabular-nums font-semibold opacity-80">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actionable items list */}
          <div className="flex flex-col gap-2.5 flex-1 max-h-[220px] overflow-y-auto pr-1">
            {visible.map((expense) => (
              <article
                key={expense.id}
                className={`rounded-lg p-3 flex flex-col gap-2 border transition-colors ${
                  isDark
                    ? "bg-[#161619] border-white/[0.05]"
                    : "bg-zinc-50/70 border-zinc-200/60"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {expense.merchant}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {expense.date ? displayDate(expense.date) : "Date needed"} ·{" "}
                      {expense.category}
                    </p>
                  </div>
                  <strong className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {money(expense.amount)}
                  </strong>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/60 dark:border-white/[0.05]">
                  {missingReceipt(expense) && <span className="text-xs text-amber-500">Receipt needed</span>}
                  {missingReport(expense) && <span className="text-xs text-amber-500">Report needed</span>}
                  {expense.status === "Draft" && (
                    <Link
                      href={`/employee/expenses/new?draft=${encodeURIComponent(expense.id)}`}
                      className="rounded-md border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111113] px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Continue Draft</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State: Simple, clean, centered, no clutter */
        <div className="my-6 py-6 flex flex-col items-center justify-center text-center">
          <div className="w-11 h-11 rounded-full bg-[#3B9B78]/10 text-[#3B9B78] flex items-center justify-center mb-3 border border-[#3B9B78]/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3
            className={`text-sm font-semibold tracking-tight ${
              isDark ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            You&apos;re all caught up
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[280px]">
            Every expense has a verified receipt attached and an assigned report.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link
              href="/employee/expenses/new"
              className="h-8 px-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Expense</span>
            </Link>
            <Link
              href="/employee/dashboard"
              className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#161619] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1E1E24] transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <div
        className={`flex justify-between items-center gap-3 pt-3 border-t text-xs ${
          isDark ? "border-white/[0.06]" : "border-zinc-200/80"
        }`}
      >
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Receipts support PDF, PNG, JPG up to 25 MB
        </span>
        <Link
          href="/employee/dashboard"
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 inline-flex items-center gap-1 transition-colors"
        >
          <span>All Expenses</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}

export default ExpenseChecklist;
