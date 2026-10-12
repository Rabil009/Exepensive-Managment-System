"use client";

import { supabase } from "@/lib/supabase";

export type UserRole = "EMPLOYEE" | "MANAGER" | "FINANCE" | "ADMIN";

export interface ResolvedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
}

export function roleToPortal(role: UserRole): string {
  if (role === "MANAGER") return "/manager";
  if (role === "FINANCE" || role === "ADMIN") return "/dashboard";
  return "/employee";
}

/**
 * Resolves current user role strictly from Supabase Auth & profiles table.
 */
export async function resolveCurrentUser(): Promise<ResolvedUser | null> {
  // 1. Supabase Auth Session
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const sbUser = sessionData?.session?.user;
    if (sbUser) {
      const email = (sbUser.email || "").trim().toLowerCase();
      let profileName = sbUser.user_metadata?.name || email.split("@")[0];
      let profileRole: UserRole = "EMPLOYEE";
      let department = sbUser.user_metadata?.department;

      try {
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("id, name, role, department")
          .or(`id.eq.${sbUser.id},email.eq.${email}`)
          .maybeSingle();

        if (dbProfile) {
          if (dbProfile.name) profileName = dbProfile.name;
          if (dbProfile.department) department = dbProfile.department;
          const rawRole = (dbProfile.role || "").toUpperCase();
          if (rawRole === "MANAGER") profileRole = "MANAGER";
          else if (rawRole === "FINANCE") profileRole = "FINANCE";
          else if (rawRole === "ADMIN") profileRole = "ADMIN";
          else profileRole = "EMPLOYEE";
        }
      } catch {}

      return {
        id: sbUser.id,
        email,
        name: profileName,
        role: profileRole,
        department,
      };
    }
  } catch {}

  // 2. LocalStorage Fallback (persisted user identity)
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("payout_user_email");
    const storedRole = localStorage.getItem("payout_user_role");
    const storedName = localStorage.getItem("payout_user_name");

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      try {
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("id, name, role, department")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (dbProfile) {
          const rawRole = (dbProfile.role || "").toUpperCase();
          const role: UserRole =
            rawRole === "MANAGER"
              ? "MANAGER"
              : rawRole === "FINANCE"
              ? "FINANCE"
              : rawRole === "ADMIN"
              ? "ADMIN"
              : "EMPLOYEE";

          return {
            id: dbProfile.id,
            email: cleanEmail,
            name: dbProfile.name || storedName || cleanEmail.split("@")[0],
            role,
            department: dbProfile.department,
          };
        }
      } catch {}

      let role: UserRole = "EMPLOYEE";
      if (storedRole?.includes("manager") || storedRole === "MANAGER") role = "MANAGER";
      else if (
        storedRole?.includes("dashboard") ||
        storedRole?.includes("finance") ||
        storedRole === "FINANCE"
      )
        role = "FINANCE";
      else if (storedRole === "ADMIN") role = "ADMIN";

      return {
        id: "local-user",
        email: cleanEmail,
        name: storedName || cleanEmail.split("@")[0],
        role,
      };
    }
  }

  return null;
}

