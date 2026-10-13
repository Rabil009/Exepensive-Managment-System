"use client";

import Link from "next/link";
import { ArrowRight, FilePenLine } from "lucide-react";
import { useExpenses } from "../data/ExpensesContext";
import { displayDate, money } from "../../../shared/utils/format";

export function ExpenseDrafts() {
  const { expenses, loading } = useExpenses();
  const drafts = expenses.filter((expense) => expense.status === "Draft");

  return (
    <section
      aria-label="Saved expense drafts"
      className="flex flex-1 flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-white/[0.07] dark:bg-[#111113]"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <FilePenLine className="h-4 w-4 text-[#5A78A6]" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Saved Drafts
          </h2>
        </div>
        <span className="rounded-md border border-zinc-200 px-2 py-1 text-[11px] tabular-nums text-zinc-500 dark:border-white/[0.08]">
          {drafts.length}
        </span>
      </div>

      {loading ? (
        <p className="py-3 text-xs text-zinc-500">Loading drafts…</p>
      ) : drafts.length ? (
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {drafts.map((draft) => (
            <Link
              key={draft.id}
              href={`/employee/expenses/new?draft=${encodeURIComponent(draft.id)}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-zinc-200/70 bg-zinc-50/70 p-3 transition-colors hover:border-[#5A78A6]/40 hover:bg-zinc-100/80 dark:border-white/[0.06] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
            >
              <span className="min-w-0">
                <strong className="block truncate text-xs text-zinc-900 dark:text-zinc-100">
                  {draft.merchant || "Untitled expense"}
                </strong>
                <span className="mt-1 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  {draft.date ? displayDate(draft.date) : "Date not set"} ·{" "}
                  {draft.category || "Category not set"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                {money(draft.amount)}
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400">
            <FilePenLine className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            No saved drafts
          </p>
          <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-zinc-500">
            Save an expense as a draft to return and finish it later.
          </p>
        </div>
      )}

      {drafts.length > 0 && (
        <p className="mt-auto border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-white/[0.06] dark:text-zinc-400">
          Select a draft to continue editing before submission.
        </p>
      )}
    </section>
  );
}

export default ExpenseDrafts;

