import { employeeRequest } from "@/lib/employee-api";
import type { Draft } from "./expenseDraft";

type SavedDraft = {
  id: string;
  merchant: string | null;
  expense_date: string | null;
  amount: string | number | null;
  category: string | null;
  report_name: string | null;
  payment_method: string | null;
  business_purpose: string | null;
  attendees: string[];
  receipt_name: string | null;
  linked_transaction_id: string | null;
};

export type ExpenseOptions = {
  categories: string[];
  reports: string[];
  unlinked_transactions: {
    id: string; card_id: string; transaction_date: string; merchant: string;
    purpose: string | null; amount: string; currency: string; status: string;
  }[];
};

export async function loadExpenseOptions() {
  const response = await employeeRequest("/new-expense/options");
  return response.json() as Promise<ExpenseOptions>;
}

export async function saveNewExpense(draft: Draft, file: File | null, submit: boolean) {
  const body = new FormData();
  body.set("action", submit ? "Submit" : "Draft");
  body.set("data", JSON.stringify({
    id: draft.id,
    merchant: draft.merchant,
    date: draft.date,
    amount: draft.amount || "0",
    category: draft.category,
    report: draft.report,
    payment_method: draft.paymentMethod,
    purpose: draft.purpose,
    attendees: draft.attendees,
    linked_transaction_id: draft.linkedTransactionId,
  }));
  if (file) body.set("file", file);
  const response = await employeeRequest("/new-expense", { method: "POST", body });
  return response.json() as Promise<{ id: string; status: "Draft" | "Pending" }>;
}

export async function loadNewExpense(id: string) {
  const response = await employeeRequest(`/new-expense/${encodeURIComponent(id)}`);
  return response.json() as Promise<SavedDraft>;
}

export async function discardNewExpense(id: string) {
  await employeeRequest(`/new-expense/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function downloadExpenseReceipt(id: string, filename: string) {
  const response = await employeeRequest(`/new-expense/receipts/${encodeURIComponent(id)}`);
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function completeSubmittedExpense(id: string, update: { report?: string; file?: File }) {
  const body = new FormData();
  if (update.report) body.set("report", update.report);
  if (update.file) body.set("file", update.file);
  const response = await employeeRequest(`/new-expense/claims/${encodeURIComponent(id)}`, { method: "PATCH", body });
  return response.json();
}
