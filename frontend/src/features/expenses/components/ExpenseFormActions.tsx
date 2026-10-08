"use client";

import React from "react";
import { Send, Trash2 } from "lucide-react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";

type Props = {
  model: Pick<ExpenseFormModel, "saved" | "submitted" | "ready" | "discard">;
};

export function ExpenseFormActions({ model }: Props) {
  const { saved, submitted, ready, discard } = model;

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <span className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span
          className={`w-2 h-2 rounded-full ${
            submitted
              ? "bg-[#3B9B78]"
              : saved
              ? "bg-blue-500"
              : "bg-zinc-400 dark:bg-zinc-600"
          }`}
        />
        <span>
          {submitted ? "Submitted" : saved ? "Draft saved" : "Unsaved changes"}
        </span>
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={discard}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#161619] border-zinc-200/80 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-[#1E1E24] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Discard</span>
        </button>

        <button
          type="submit"
          disabled={!ready || submitted}
          className="h-8 px-3.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Submit Expense</span>
        </button>
      </div>
    </div>
  );
}

export default ExpenseFormActions;
