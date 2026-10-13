import { supabase } from "./supabase";
import { draftKey, remoteDraftKey } from "@/features/expenses/data/expenseDraft";

const cacheOwnerKey = "employee-expense-cache-owner-v1";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type EmployeeAccount = {
  user: { id: string; email: string | null };
  profile: { id: string; name: string | null; role: string };
};

export function safeEmployeeReturnPath(value: string | null) {
  if (!value || value.includes("\\") || value.startsWith("//")) return "/employee/dashboard";
  if (value === "/employee" || (value.startsWith("/employee/") && !value.startsWith("/employee/login"))) {
    return value;
  }
  return "/employee/dashboard";
}

export async function employeePasswordAuth(email: string, password: string, signup = false) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Direct Supabase Auth
  try {
    if (signup) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });
      if (error) throw error;
      if (data?.session) {
        return {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          confirmation_required: false,
          user: { id: data.user?.id || "", email: cleanEmail },
          profile: { id: data.user?.id || "", name: cleanEmail.split("@")[0], role: "EMPLOYEE" },
        };
      }
      return {
        confirmation_required: true,
        user: { id: data.user?.id || "", email: cleanEmail },
      };
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;
      if (data?.session) {
        return {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          user: { id: data.user.id, email: data.user.email || cleanEmail },
          profile: { id: data.user.id, name: cleanEmail.split("@")[0], role: "EMPLOYEE" },
        };
      }
    }
  } catch (supabaseErr) {
    throw supabaseErr;
  }

  throw new Error("Authentication failed. Please verify your credentials.");
}

export async function getEmployeeAccount(): Promise<EmployeeAccount | null> {
  // Check active Supabase Auth session JWT
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session?.access_token || !data.session.user) {
      return null;
    }

    const user = data.session.user;
    let profileName = user.user_metadata?.name || user.email?.split("@")[0] || "Employee";
    let profileRole = "EMPLOYEE";

    try {
      const { data: dbProfile } = await supabase
        .from("profiles")
        .select("id, name, role")
        .or(`id.eq.${user.id},email.eq.${user.email?.trim().toLowerCase()}`)
        .maybeSingle();

      if (dbProfile?.name) profileName = dbProfile.name;
      if (dbProfile?.role) profileRole = dbProfile.role;
    } catch {
      if (user.user_metadata?.role) {
        profileRole = user.user_metadata.role;
      }
    }

    return {
      user: { id: user.id, email: user.email ?? null },
      profile: {
        id: user.id,
        name: profileName,
        role: profileRole,
      },
    };
  } catch {
    return null;
  }
}

export function clearEmployeeCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey);
  localStorage.removeItem(remoteDraftKey);
  localStorage.removeItem(cacheOwnerKey);
}

export function assignEmployeeCacheOwner(userId: string) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(cacheOwnerKey) !== userId) clearEmployeeCache();
  localStorage.setItem(cacheOwnerKey, userId);
}
