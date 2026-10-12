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
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      return null;
    }

    const sbUser = sessionData.session.user;
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
      } else if (sbUser.user_metadata?.role) {
        const rawRole = (sbUser.user_metadata.role || "").toUpperCase();
        if (rawRole === "MANAGER") profileRole = "MANAGER";
        else if (rawRole === "FINANCE") profileRole = "FINANCE";
        else if (rawRole === "ADMIN") profileRole = "ADMIN";
        else profileRole = "EMPLOYEE";
      }
    } catch (profileErr) {
      console.warn("Profile fetch warning:", profileErr);
    }

    return {
      id: sbUser.id,
      email,
      name: profileName,
      role: profileRole,
      department,
    };
  } catch (err) {
    console.error("resolveCurrentUser error:", err);
    return null;
  }
}

