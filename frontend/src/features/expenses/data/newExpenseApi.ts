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
};

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
