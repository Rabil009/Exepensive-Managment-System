"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Save, Send } from "lucide-react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";

type Props = { model: Pick<ExpenseFormModel, "save" | "submitted" | "ready" | "saving"> };

export function ExpenseFormHeader({ model }: Props) {
  const { save, submitted, ready, saving } = model;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1"
        >
          <Link
            href="/employee/dashboard"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Overview
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
            New Expense
          </span>
        </nav>

        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Submit New Expense
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Enter business expense details and attach supporting receipts.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => save("Draft")}
          disabled={submitted || saving}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5 text-zinc-400" />
          <span>Save Draft</span>
        </button>

        <button
          type="submit"
          disabled={!ready || submitted || saving}
          className="h-8 px-3.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Submit Expense</span>
        </button>
      </div>
    </div>
  );
}

export default ExpenseFormHeader;
