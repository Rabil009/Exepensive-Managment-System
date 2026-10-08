import { supabase } from "./supabase";
import { draftKey, remoteDraftKey, expenseCacheKey } from "@/features/expenses/data/expenseDraft";

const cacheOwnerKey = "employee-expense-cache-owner-v1";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type EmployeeAccount = {
  user: { id: string; email: string | null };
  profile: { id: string; name: string | null; role: string };
};

async function authRequest(path: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(`${apiUrl}/api/auth/employee${path}`, init);
  } catch {
    throw new Error("The Employee backend is unavailable. Please try again.");
  }
}

async function authError(response: Response): Promise<Error> {
  const body = await response.json().catch(() => ({}));
  return new Error(typeof body.detail === "string" ? body.detail : "Employee authentication failed.");
}

export async function employeePasswordAuth(email: string, password: string, signup = false) {
  const response = await authRequest(signup ? "/signup" : "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw await authError(response);
  return response.json() as Promise<Partial<EmployeeAccount> & {
    confirmation_required?: boolean;
    access_token?: string;
    refresh_token?: string;
  }>;
}

export function safeEmployeeReturnPath(value: string | null) {
  if (!value || value.includes("\\") || value.startsWith("//")) return "/employee/dashboard";
  if (value === "/employee" || (value.startsWith("/employee/") && !value.startsWith("/employee/login"))) {
    return value;
  }
  return "/employee/dashboard";
}

export async function getEmployeeAccount() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) return null;
  const response = await authRequest("/me", {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw await authError(response);
  return response.json() as Promise<EmployeeAccount>;
}

export function clearEmployeeCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey);
  localStorage.removeItem(remoteDraftKey);
  localStorage.removeItem(expenseCacheKey);
  localStorage.removeItem(cacheOwnerKey);
}

export function assignEmployeeCacheOwner(userId: string) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(cacheOwnerKey) !== userId) clearEmployeeCache();
  localStorage.setItem(cacheOwnerKey, userId);
}
