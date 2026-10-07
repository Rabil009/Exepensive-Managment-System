"use client";
import { useState } from "react";
import Link from "next/link";
import { useExpenses } from "../../expenses/data/ExpensesContext";
import { displayDate, money } from "../../../shared/utils/format";
import type { Expense } from "../../expenses/types";

const missingReceipt = (expense: Expense) => !expense.receipt?.trim();
const missingReport = (expense: Expense) => !expense.report?.trim() || expense.report === "Unassigned";
const needsWork = (expense: Expense) => missingReceipt(expense) || expense.status === "Draft" || missingReport(expense);

export function ExpenseChecklist() {
  const { expenses, addExpense } = useExpenses();
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const attention = expenses.filter(needsWork);
  const filters = [
    { id: "all", label: "All", count: attention.length },
    { id: "receipts", label: "Receipts", count: attention.filter(missingReceipt).length },
    { id: "drafts", label: "Drafts", count: attention.filter((expense) => expense.status === "Draft").length },
    { id: "reports", label: "Reports", count: attention.filter(missingReport).length },
  ];
  const visible = attention.filter((expense) => filter === "all" || (filter === "receipts" ? missingReceipt(expense) : filter === "drafts" ? expense.status === "Draft" : missingReport(expense)));
  const reports = [...new Set(expenses.map((expense) => expense.report).filter((report): report is string => Boolean(report?.trim()) && report !== "Unassigned"))];
  function updateExpense(expense: Expense, changes: Partial<Expense>, success: string) {
    try {
      addExpense({ ...expense, ...changes });
      setError(false);
      setMessage(success);
    } catch {
      setError(true);
      setMessage("Could not save the change. Please try again.");
    }
  }
  function attachReceipt(expense: Expense, file?: File) {
    if (!file) return;
    if (!/\.(pdf|png|jpe?g|heic)$/i.test(file.name) || file.size > 25 * 1024 * 1024) {
      setError(true);
      setMessage("Choose a PDF, PNG, JPG, or HEIC receipt up to 25 MB.");
      return;
    }
    updateExpense(expense, { receipt: file.name }, `Receipt name saved for ${expense.merchant}.`);
  }
  return (
    <section aria-label="Expense Checklist" className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Expenses to Complete</h2>
        <span className="text-label-caps text-outline">{attention.length} need attention</span>
      </div>
      <p className="text-body-sm text-on-surface-variant">Add a receipt, assign a report, or continue a saved draft.</p>
      <div role="group" aria-label="Filter expenses to complete" className="flex flex-wrap gap-2">
        {filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`px-3 py-2 rounded-lg text-label-md font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === item.id ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`}>{item.label} <span className="ml-1 tabular-nums">{item.count}</span></button>)}
      </div>
      {message && <p role={error ? "alert" : "status"} className={`text-body-sm ${error ? "text-error" : "text-tertiary"}`}>{message}</p>}
      <div className="flex flex-col gap-3 flex-1 max-h-[320px] overflow-y-auto">
        {visible.map((expense) => <article key={expense.id} className="rounded-xl bg-surface-container-low/60 p-3 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0"><h3 className="font-semibold text-body-md text-on-surface break-words">{expense.merchant}</h3><p className="text-body-sm text-on-surface-variant mt-1">{expense.date ? displayDate(expense.date) : "Date needed"} · {expense.category}</p></div>
            <strong className="text-body-md tabular-nums whitespace-nowrap">{money(expense.amount)}</strong>
          </div>
          <div className="flex flex-wrap gap-2 text-label-caps text-outline">
            {missingReceipt(expense) && <span>Receipt needed</span>}{expense.status === "Draft" && <span>Draft not submitted</span>}{missingReport(expense) && <span>Report needed</span>}
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 py-3 border-y border-outline-variant/20 text-body-sm">
            <div className="min-w-0"><dt className="text-outline">Expense Report</dt><dd className="mt-1 font-medium text-on-surface break-words">{expense.report || "Not assigned"}</dd></div>
            <div className="min-w-0"><dt className="text-outline">Payment Method</dt><dd className="mt-1 font-medium text-on-surface break-words">{expense.paymentMethod || "Not specified"}</dd></div>
            <div><dt className="text-outline">Expense Status</dt><dd className="mt-1 font-medium text-on-surface">{expense.status}</dd></div>
            <div><dt className="text-outline">Receipt</dt><dd className="mt-1 font-medium text-on-surface">{missingReceipt(expense) ? "Not attached" : "Attached"}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-2 items-center">
            {missingReceipt(expense) && <label className="cursor-pointer rounded-lg bg-primary-container text-on-primary px-3 py-2 text-label-md font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary relative">Add Receipt<input type="file" aria-label={`Add receipt for ${expense.merchant}`} accept=".pdf,.png,.jpg,.jpeg,.heic" className="absolute inset-0 opacity-0 cursor-pointer w-full" onChange={(event) => { attachReceipt(expense, event.target.files?.[0]); event.target.value = ""; }} /></label>}
            {missingReport(expense) && <select aria-label={`Assign report for ${expense.merchant}`} value="" onChange={(event) => updateExpense(expense, { report: event.target.value }, `Report assigned to ${expense.merchant}.`)} className="rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface px-3 py-2 text-label-md max-w-full"><option value="" disabled>Assign Report</option>{reports.map((report) => <option key={report} value={report}>{report}</option>)}</select>}
            {expense.status === "Draft" && <Link href={`/employee/expenses/new?draft=${encodeURIComponent(expense.id)}`} className="rounded-lg border border-outline-variant px-3 py-2 text-label-md font-semibold text-primary hover:bg-surface-container-low">Continue Draft</Link>}
          </div>
        </article>)}
        {!visible.length && <div className="p-4 rounded-xl bg-surface-container-low/60"><p className="text-body-md font-semibold text-on-surface">{attention.length ? "Nothing to complete in this category" : "You're all caught up"}</p><p className="text-body-sm text-on-surface-variant mt-1">{attention.length ? "Choose another filter to view the remaining expenses." : "Your saved expenses have receipts and reports, with no drafts left."}</p></div>}
      </div>
      <div className="flex justify-between items-center gap-3 flex-wrap pt-3 border-t border-outline-variant/20">
        <span className="text-label-caps text-outline">Receipts save as filenames in this preview.</span>
        <Link href="/employee/dashboard" className="text-label-md font-semibold text-primary hover:underline">View All Expenses →</Link>
      </div>
    </section>
  );
}
