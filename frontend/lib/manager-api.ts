import { supabase } from "@/lib/supabase";
import { updateClaimInDb } from "@/lib/api";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/manager";

export interface ManagerClaim {
  id: string;
  employeeName: string;
  department: string;
  costCenter: string;
  category: "Travel" | "Hotel" | "Meals" | "Software" | "Transport" | "Equipment";
  description: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  priority: "High" | "Medium" | "Low";
  receiptVerified: boolean;
  receiptUrl?: string;
  receiptName?: string;
  policyNotes?: string;
  managerRemark?: string;
}

export interface DepartmentBudget {
  name: string;
  spent: number;
  cap: number;
  members: number;
  color: string;
  status: string;
}

export interface TeamSpendSummary {
  totalSpent: number;
  pendingAmount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  averageClaimAmount: number;
}

export interface PolicySettings {
  hotelCap: number;
  mealsCap: number;
  receiptRequiredAbove: number;
  currency: string;
}

export interface QuarterlyReport {
  quarter: string;
  totalClaimsProcessed: number;
  approvedTotal: number;
  rejectedTotal: number;
  approvalRatePercent: number;
  auditExceptionsCount: number;
  topDepartment: string;
}

const isClaimPending = (status: string) => {
  const s = (status || "").toUpperCase();
  return s === "SUBMITTED" || s === "PENDING" || s === "DRAFT";
};

const isClaimApproved = (status: string) => {
  const s = (status || "").toUpperCase();
  return (
    s.includes("APPROV") ||
    s === "PAID" ||
    s === "CLOSED" ||
    s === "DISBURSED" ||
    s === "PAYMENT_PENDING"
  );
};

const isClaimRejected = (status: string) => {
  const s = (status || "").toUpperCase();
  return s.includes("REJECT");
};

/**
 * Fetch Manager Claims directly from Supabase Cloud first (source of truth for employee submissions),
 * falling back to FastAPI backend if Supabase is offline.
 */
export async function fetchManagerClaims(params?: {
  status?: string;
  department?: string;
  search?: string;
}): Promise<ManagerClaim[]> {
  // 1. Direct Supabase Query (Real-time live claims submitted by employees)
  try {
    const { data, error } = await supabase
      .from("expense_claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      let filtered = data;

      if (params?.status && params.status !== "All") {
        if (params.status === "Pending") {
          filtered = filtered.filter((item: any) => isClaimPending(item.status));
        } else if (params.status === "Approved") {
          filtered = filtered.filter((item: any) => isClaimApproved(item.status));
        } else if (params.status === "Rejected") {
          filtered = filtered.filter((item: any) => isClaimRejected(item.status));
        }
      }

      if (params?.department && params.department !== "All") {
        const targetDept = params.department.toLowerCase();
        filtered = filtered.filter(
          (item: any) => (item.employee_department || "").toLowerCase() === targetDept
        );
      }

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (item: any) =>
            (item.employee_name || "").toLowerCase().includes(q) ||
            (item.title || "").toLowerCase().includes(q) ||
            (item.merchant || "").toLowerCase().includes(q) ||
            (item.description || "").toLowerCase().includes(q) ||
            (item.id || "").toLowerCase().includes(q)
        );
      }

      return filtered.map((item: any) => {
        const rawStatus = (item.status || "Pending").toUpperCase();
        const normStatus: "Pending" | "Approved" | "Rejected" = isClaimApproved(rawStatus)
          ? "Approved"
          : isClaimRejected(rawStatus)
          ? "Rejected"
          : "Pending";

        return {
          id: item.id,
          employeeName: item.employee_name || "Employee",
          department: item.employee_department || "Engineering",
          costCenter: item.cost_center || "CC-ENG-104",
          category: (item.category || "Travel") as any,
          description: item.description || item.title || item.merchant || "Expense claim",
          amount: Number(item.amount) || 0,
          date: item.expense_date
            ? item.expense_date
            : item.created_at
            ? item.created_at.slice(0, 10)
            : "Today",
          status: normStatus,
          priority: Number(item.amount) > 5000 ? "High" : "Medium",
          receiptVerified: Boolean(item.receipt_url || item.receipt_name),
          receiptUrl: item.receipt_url,
          receiptName: item.receipt_name,
          policyNotes: item.policy_violation,
          managerRemark: item.manager_remark,
        };
      });
    }
  } catch (supabaseErr) {
    console.warn("Supabase claims direct query note:", supabaseErr);
  }

  // 2. Fallback: FastAPI backend if reachable
  if (BACKEND_BASE_URL) {
    try {
      const url = new URL(`${BACKEND_BASE_URL}/approvals`);
      if (params?.status && params.status !== "All") url.searchParams.set("status", params.status);
      if (params?.department && params.department !== "All") url.searchParams.set("department", params.department);
      if (params?.search) url.searchParams.set("search", params.search);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch {
      // Backend offline
    }
  }

  return [];
}

/**
 * Approve claim in Manager Backend and sync to Supabase
 */
export async function approveManagerClaim(
  claimId: string,
  remark: string = "Approved by Manager"
): Promise<ManagerClaim | null> {
  // 1. Sync to Supabase directly
  try {
    await updateClaimInDb(claimId, {
      status: "MANAGER_APPROVED" as any,
      managerRemark: remark,
    });
  } catch (e) {
    console.warn("Supabase update error:", e);
  }

  // 2. Call FastAPI backend if online
  if (BACKEND_BASE_URL) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/approvals/${claimId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  return null;
}

/**
 * Reject claim in Manager Backend and sync to Supabase
 */
export async function rejectManagerClaim(
  claimId: string,
  reason: string
): Promise<ManagerClaim | null> {
  // 1. Sync to Supabase directly
  try {
    await updateClaimInDb(claimId, {
      status: "MANAGER_REJECTED" as any,
      managerRemark: reason,
    });
  } catch (e) {
    console.warn("Supabase update error:", e);
  }

  // 2. Call FastAPI backend if online
  if (BACKEND_BASE_URL) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/approvals/${claimId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) return await res.json();
    } catch {}
  }

  return null;
}

/**
 * Fetch Department Budgets for Manager View from Supabase Cloud
 */
export async function fetchManagerBudgets(): Promise<DepartmentBudget[]> {
  try {
    const { data, error } = await supabase
      .from("department_budgets")
      .select("*")
      .order("name");

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        name: b.name || b.department,
        spent: Number(b.spent_amount) || 0,
        cap: Number(b.allocated_amount) || 0,
        members: 8,
        color:
          b.department === "Engineering"
            ? "#2563eb"
            : b.department === "Product"
            ? "#10b981"
            : b.department === "Sales"
            ? "#a855f7"
            : "#f59e0b",
        status: Number(b.spent_amount) > Number(b.allocated_amount) * 0.9 ? "Review" : "On Track",
      }));
    }
  } catch (err) {
    console.warn("Department budgets query error:", err);
  }

  return [];
}

/**
 * Fetch Team Spend Summary Metrics dynamically from Supabase
 */
export async function fetchManagerSpendSummary(): Promise<TeamSpendSummary | null> {
  try {
    const { data: claims } = await supabase.from("expense_claims").select("amount, status");
    const all = claims || [];
    const totalSpent = all.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const pendingClaims = all.filter(
      (c) => (c.status || "").toUpperCase().includes("SUBMIT") || (c.status || "").toUpperCase().includes("PEND")
    );
    const pendingAmount = pendingClaims.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const approvedCount = all.filter((c) => (c.status || "").toUpperCase().includes("APPROV")).length;
    const rejectedCount = all.filter((c) => (c.status || "").toUpperCase().includes("REJECT")).length;

    return {
      totalSpent,
      pendingAmount,
      approvedCount,
      pendingCount: pendingClaims.length,
      rejectedCount,
      averageClaimAmount: all.length > 0 ? Math.round(totalSpent / all.length) : 0,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Fetch Manager Policy Settings from Supabase
 */
export async function fetchManagerPolicies(): Promise<PolicySettings> {
  try {
    const { data: policies } = await supabase.from("expense_policies").select("*");
    if (policies && policies.length > 0) {
      const hotel = policies.find((p: any) => p.category === "HOTEL");
      const meals = policies.find((p: any) => p.category === "MEALS");
      return {
        hotelCap: hotel ? Number(hotel.max_limit) : 5000,
        mealsCap: meals ? Number(meals.max_limit) : 2500,
        receiptRequiredAbove: 500,
        currency: "INR",
      };
    }
  } catch {}

  return {
    hotelCap: 5000,
    mealsCap: 2500,
    receiptRequiredAbove: 500,
    currency: "INR",
  };
}

/**
 * Update Manager Policy Settings
 */
export async function updateManagerPolicies(settings: PolicySettings): Promise<PolicySettings> {
  return settings;
}

/**
 * Fetch Manager Quarterly Report metrics
 */
export async function fetchManagerQuarterlyReport(): Promise<QuarterlyReport | null> {
  // 1. Try FastAPI backend if reachable
  if (BACKEND_BASE_URL) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/reports/quarterly`, {
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
  }

  // 2. Dynamic aggregation from real claims
  try {
    const claims = await fetchManagerClaims();
    if (claims && claims.length > 0) {
      const approved = claims.filter((c) => c.status === "Approved");
      const rejected = claims.filter((c) => c.status === "Rejected");
      const approvedSum = approved.reduce((s, c) => s + (Number(c.amount) || 0), 0);
      const rejectedSum = rejected.reduce((s, c) => s + (Number(c.amount) || 0), 0);
      const totalDecided = approved.length + rejected.length;
      const approvalRate = totalDecided > 0 ? (approved.length / totalDecided) * 100 : 100;
      const exceptionsCount = claims.filter((c) => c.policyNotes || !c.receiptVerified).length;

      return {
        quarter: "Q4 FY2026",
        totalClaimsProcessed: claims.length,
        approvedTotal: approvedSum,
        rejectedTotal: rejectedSum,
        approvalRatePercent: Math.round(approvalRate * 10) / 10,
        auditExceptionsCount: exceptionsCount,
        topDepartment: "Engineering",
      };
    }
  } catch {}

  return null;
}

