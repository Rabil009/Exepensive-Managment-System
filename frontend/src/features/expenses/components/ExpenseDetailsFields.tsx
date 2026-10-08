"use client";

import React from "react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { fieldClass } from "../styles/formClasses";

type Props = { model: Pick<ExpenseFormModel, "draft" | "update"> };

export function ExpenseDetailsFields({ model }: Props) {
  const { draft, update } = model;

  return (
    <section className="flex flex-col gap-4">
      <div className="pb-1 border-b border-zinc-100 dark:border-white/[0.05]">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Expense Details
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="merchant"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Merchant
          </label>
          <input
            id="merchant"
            className={fieldClass}
            placeholder="e.g. Delta Air Lines, Uber, AWS"
            value={draft.merchant}
            onChange={(event) => update("merchant", event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-date"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Date
          </label>
          <input
            id="expense-date"
            type="date"
            className={fieldClass}
            value={draft.date}
            onChange={(event) => update("date", event.target.value)}
            required
          />
        </div>
      </div>

      {/* Clean Amount Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="amount"
          className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
        >
          Amount
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 select-none">
            ₹
          </span>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            className="w-full h-9 pl-7 pr-12 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors"
            value={draft.amount}
            onChange={(event) => update("amount", event.target.value)}
            required
          />
          <span className="absolute right-3 text-xs font-medium text-zinc-400 dark:text-zinc-500 select-none">
            INR
          </span>
        </div>
      </div>
    </section>
  );
}

export default ExpenseDetailsFields;
