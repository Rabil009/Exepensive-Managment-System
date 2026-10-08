import { supabase } from "@/lib/supabase";
import type { Draft } from "./expenseDraft";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

async function sessionToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("Could not read your Employee session. Please try again.");
  if (!data.session?.access_token) {
    throw new Error("An Employee Supabase session is needed before expenses can be saved.");
  }
  return data.session.access_token;
}

async function employeeRequest(path: string, init: RequestInit = {}) {
  const token = await sessionToken();
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/employee/new-expense${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("The Employee backend is unavailable. Please try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === "string" ? body.detail : "Could not save the expense.");
  }
  return response;
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
  }));
  if (file) body.set("file", file);
  const response = await employeeRequest("", { method: "POST", body });
  return response.json() as Promise<{ id: string; status: "Draft" | "Pending" }>;
}

export async function loadNewExpense(id: string) {
  const response = await employeeRequest(`/${encodeURIComponent(id)}`);
  return response.json() as Promise<SavedDraft>;
}

export async function discardNewExpense(id: string) {
  await employeeRequest(`/${encodeURIComponent(id)}`, { method: "DELETE" });
}
