"use client";

import React from "react";
import { Tag, FolderOpen, CreditCard, Wallet, ChevronDown } from "lucide-react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { categories } from "../data/categories";

type Props = { model: Pick<ExpenseFormModel, "draft" | "update"> };

export function ExpenseCategorization({ model }: Props) {
  const { draft, update } = model;

  const paymentMethods = [
    draft.paymentMethod.startsWith("Apple")
      ? "Apple Card (••8814)"
      : "Corporate Card (••4921)",
    "Personal (Out-of-Pocket)",
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="pb-1 border-b border-zinc-100 dark:border-white/[0.05]">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Category &amp; Payment
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Category Select */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-category"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <select
              id="expense-category"
              className="w-full h-9 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 appearance-none cursor-pointer"
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
              required
            >
              <option value="">Select category...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Expense Report Select */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-report"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Expense Report
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <select
              id="expense-report"
              className="w-full h-9 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 appearance-none cursor-pointer"
              value={draft.report}
              onChange={(event) => update("report", event.target.value)}
            >
              {[
                "Q4 Design Summit — SFO",
                "Software & Stipends",
                "Equipment & WFH",
                "Unassigned",
              ].map((report) => (
                <option key={report} value={report}>
                  {report}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Payment Method Segmented Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Payment Method
        </label>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 p-1 bg-zinc-100/70 dark:bg-[#161619] border border-zinc-200/80 dark:border-white/[0.08] rounded-lg gap-1"
          role="group"
          aria-label="Payment method"
        >
          {paymentMethods.map((method, index) => {
            const isSelected = draft.paymentMethod === method;
            const Icon = index === 0 ? CreditCard : Wallet;
            return (
              <button
                key={method}
                type="button"
                aria-pressed={isSelected}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-[#25252D] text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-white/[0.1]"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
                onClick={() => update("paymentMethod", method)}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{method}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExpenseCategorization;
