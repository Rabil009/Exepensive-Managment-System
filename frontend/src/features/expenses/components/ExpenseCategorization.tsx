"use client";

import React from "react";
import { Tag, FolderOpen, CreditCard, Wallet } from "lucide-react";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { StyledSelect } from "@/components/ui/StyledSelect";

type Props = { model: Pick<ExpenseFormModel, "draft" | "update" | "options"> };

const categoryGroups: {
  value: string;
  label: string;
  aliases: readonly string[];
}[] = [
  {
    value: "TRAVEL",
    label: "Travel & Lodging",
    aliases: ["TRAVEL", "HOTEL", "ACCOMMODATION", "TRAVEL & LODGING"],
  },
  {
    value: "SOFTWARE",
    label: "Software & SaaS",
    aliases: ["SOFTWARE", "SAAS", "SOFTWARE & SAAS"],
  },
  {
    value: "MEALS",
    label: "Meals & Other",
    aliases: ["MEALS", "FOOD", "OTHER", "TRAINING", "MEALS & OTHER"],
  },
  {
    value: "OFFICE",
    label: "Equipment & Devices",
    aliases: [
      "OFFICE",
      "HARDWARE",
      "EQUIPMENT",
      "DEVICES",
      "EQUIPMENT & DEVICES",
    ],
  },
];

function groupedCategory(value: string) {
  const normalized = value.trim().toUpperCase();
  return (
    categoryGroups.find((group) => group.aliases.includes(normalized))?.value ||
    ""
  );
}

export function ExpenseCategorization({ model }: Props) {
  const { draft, update, options } = model;

  const paymentMethods = ["Corporate Card", "Personal (Out-of-Pocket)"];

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
            <StyledSelect
              id="expense-category"
              fullWidth
              className="w-full h-9 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 appearance-none cursor-pointer"
              value={groupedCategory(draft.category)}
              onChange={(event) => update("category", event.target.value)}
              required
            >
              <option value="">Select category...</option>
              {categoryGroups.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </StyledSelect>
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
            <StyledSelect
              id="expense-report"
              fullWidth
              className="w-full h-9 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/[0.08] rounded-lg pl-9 pr-8 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 appearance-none cursor-pointer"
              value={draft.report}
              onChange={(event) => update("report", event.target.value)}
            >
              {[
                ...new Set(["Unassigned", ...options.reports, draft.report]),
              ].map((report) => (
                <option key={report} value={report}>
                  {report}
                </option>
              ))}
            </StyledSelect>
          </div>
        </div>
      </div>

      {/* Payment Method Radio Group */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {paymentMethods.map((method) => {
            const isSelected = draft.paymentMethod === method;
            const isCard = method === "Corporate Card";
            const Icon = isCard ? CreditCard : Wallet;

            return (
              <label
                key={method}
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[#5A78A6]/10 border-[#5A78A6] dark:border-[#5A78A6] text-zinc-900 dark:text-zinc-100"
                    : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-white/[0.07] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isSelected
                        ? "text-[#5A78A6]"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  />
                  <div>
                    <span className="font-medium block">{method}</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {isCard
                        ? "Company-issued card"
                        : "Eligible for reimbursement"}
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={isSelected}
                  onChange={(event) =>
                    update("paymentMethod", event.target.value)
                  }
                  className="accent-[#5A78A6] h-3.5 w-3.5"
                />
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExpenseCategorization;
