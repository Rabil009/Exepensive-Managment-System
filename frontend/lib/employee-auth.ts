import { supabase } from "./supabase";
import { draftKey, remoteDraftKey, expenseCacheKey } from "@/features/expenses/data/expenseDraft";

const cacheOwnerKey = "employee-expense-cache-owner-v1";

export function safeEmployeeReturnPath(value: string | null) {
  if (!value || value.includes("\\") || value.startsWith("//")) return "/employee/dashboard";
  if (value === "/employee" || (value.startsWith("/employee/") && !value.startsWith("/employee/login"))) {
    return value;
  }
  return "/employee/dashboard";
}

export async function getEmployeeAccount() {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, name")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (profileError) throw new Error("Could not check your Employee profile. Please try again.");
  return { user: auth.user, profile };
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
