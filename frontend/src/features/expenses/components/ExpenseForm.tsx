"use client";

import React from "react";
import Link from "next/link";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { ExpenseFormHeader } from "./ExpenseFormHeader";
import { ReceiptCapture } from "./ReceiptCapture";
import { UnlinkedTransactions } from "./UnlinkedTransactions";
import { ExpenseDetailsFields } from "./ExpenseDetailsFields";
import { ExpenseCategorization } from "./ExpenseCategorization";
import { ExpenseAttendees } from "./ExpenseAttendees";
import { ExpenseFormActions } from "./ExpenseFormActions";

export function ExpenseForm() {
  const model = useExpenseForm();

  return (
    <form
      className="flex flex-col w-full gap-5 pb-12"
      onSubmit={model.submit}
    >
      <ExpenseFormHeader model={model} />

      {/* Message / Error Notification */}
      {(model.error || model.message) && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
            model.error
              ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 border-rose-200 dark:border-rose-900/60"
              : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/60"
          }`}
          role={model.error ? "alert" : "status"}
        >
          <span>{model.error || model.message}</span>
          {model.submitted && (
            <Link
              href={`/employee/reports?expense=${model.draft.id}`}
              className="font-medium underline hover:opacity-80"
            >
              View expense →
            </Link>
          )}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Receipt & Unlinked Transactions (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ReceiptCapture model={model} />
          <UnlinkedTransactions model={model} />
        </div>

        {/* Right Column: Details, Categories, Attendees & Actions (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Form Fields Card */}
          <div className="bg-white dark:bg-[#111113] rounded-xl border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs flex flex-col gap-5">
            <ExpenseDetailsFields model={model} />

            <div className="h-px w-full bg-zinc-100 dark:bg-white/[0.05]" />

            <ExpenseCategorization model={model} />

            <div className="h-px w-full bg-zinc-100 dark:bg-white/[0.05]" />

            <ExpenseAttendees model={model} />

            <div className="h-px w-full bg-zinc-100 dark:bg-white/[0.05]" />

            <ExpenseFormActions model={model} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default ExpenseForm;
