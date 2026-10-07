import type { ClaimStatus, ExpenseCategory } from "@/types/finance";

export const STATUS_STYLES: Record<ClaimStatus, string> = {
  DRAFT:              "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
  SUBMITTED:          "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/25",
  MANAGER_APPROVED:   "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25",
  MANAGER_REJECTED:   "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25",
  FINANCE_APPROVED:   "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/25",
  FINANCE_REJECTED:   "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25",
  PAYMENT_PENDING:    "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/25",
  PAID:               "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
  DISBURSED:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
  CLOSED:             "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  DRAFT:              "Draft",
  SUBMITTED:          "Pending Review",
  MANAGER_APPROVED:   "Manager Approved",
  MANAGER_REJECTED:   "Changes Requested",
  FINANCE_APPROVED:   "Finance Verified",
  FINANCE_REJECTED:   "Declined",
  PAYMENT_PENDING:    "Payment Pending",
  PAID:               "Settled",
  DISBURSED:          "Reimbursed",
  CLOSED:             "Closed",
};

export const CATEGORY_STYLES: Record<ExpenseCategory, string> = {
  TRAVEL:   "bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20",
  HOTEL:    "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20",
  MEALS:    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
  SOFTWARE: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20",
  HARDWARE: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20",
  OFFICE:   "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20",
  TRAINING: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  OTHER:    "bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 border border-neutral-500/20",
};
