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

const FALLBACK_CLAIMS: ManagerClaim[] = [
  {
    id: "CLM-8821",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    costCenter: "CC-ENG-104",
    category: "Travel",
    description: "Bangalore client architectural sync flight",
    amount: 8500,
    date: "Oct 06, 2026",
    status: "Pending",
    priority: "High",
    receiptVerified: true,
    policyNotes: "Booked within 7-day domestic cap",
  },
  {
    id: "CLM-8822",
    employeeName: "Priya Nair",
    department: "Product & UX",
    costCenter: "CC-PRD-201",
    category: "Hotel",
    description: "Design sprint conference stay - Grand Hyatt",
    amount: 4200,
    date: "Oct 05, 2026",
    status: "Pending",
    priority: "Medium",
    receiptVerified: true,
    policyNotes: "Within Tier-1 metro nightly allowance",
  },
  {
    id: "CLM-8823",
    employeeName: "Arjun Reddy",
    department: "Sales & Growth",
    costCenter: "CC-SLS-305",
    category: "Meals",
    description: "Enterprise Q4 contract dinner with CFO",
    amount: 6800,
    date: "Oct 05, 2026",
    status: "Pending",
    priority: "High",
    receiptVerified: true,
    policyNotes: "Client attendees listed on invoice",
  },
  {
    id: "CLM-8824",
    employeeName: "Sneha Iyer",
    department: "Marketing",
    costCenter: "CC-MKT-402",
    category: "Transport",
    description: "Product launch shoot logistics transfers",
    amount: 2300,
    date: "Oct 04, 2026",
    status: "Pending",
    priority: "Low",
    receiptVerified: true,
    policyNotes: "Uber for Business verified route",
  },
  {
    id: "CLM-8825",
    employeeName: "Vikram Malhotra",
    department: "Engineering",
    costCenter: "CC-ENG-104",
    category: "Software",
    description: "Cloud GPU training credits on Lambda Labs",
    amount: 14900,
    date: "Oct 03, 2026",
    status: "Approved",
    priority: "Medium",
    receiptVerified: true,
    policyNotes: "Manager pre-approved on budget",
  },
  {
    id: "CLM-8826",
    employeeName: "Ananya Deshmukh",
    department: "Product & UX",
    costCenter: "CC-PRD-201",
    category: "Equipment",
    description: "Ergonomic vertical mouse & testing keyboard",
    amount: 3400,
    date: "Oct 02, 2026",
    status: "Approved",
    priority: "Low",
    receiptVerified: true,
  },
  {
    id: "CLM-8827",
    employeeName: "Rohan Kapoor",
    department: "Sales & Growth",
    costCenter: "CC-SLS-305",
    category: "Travel",
    description: "Personal weekend rental upgrade (unauthorized)",
    amount: 7200,
    date: "Oct 01, 2026",
    status: "Rejected",
    priority: "High",
    receiptVerified: false,
    policyNotes: "Exceeds personal car rental ceiling",
  },
];

const FALLBACK_BUDGETS: DepartmentBudget[] = [
  { name: "Engineering", spent: 184200, cap: 220000, members: 14, color: "#2563eb", status: "On Track" },
  { name: "Product & UX", spent: 92400, cap: 120000, members: 6, color: "#10b981", status: "On Track" },
  { name: "Sales & Growth", spent: 68400, cap: 100000, members: 5, color: "#a855f7", status: "On Track" },
  { name: "Marketing", spent: 39500, cap: 60000, members: 3, color: "#f59e0b", status: "Review" },
];

/**
 * Fetch Manager Claims from FastAPI backend, with Supabase fallback
 */
export async function fetchManagerClaims(params?: {
  status?: string;
  department?: string;
  search?: string;
}): Promise<ManagerClaim[]> {
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
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend API not reachable, attempting Supabase fallback...", err);
  }

  // Fallback to direct Supabase query
  try {
    const { data, error } = await supabase
      .from("expense_claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => {
        const rawStatus = (item.status || "Pending").toUpperCase();
        const normStatus = rawStatus.includes("APPROV")
          ? "Approved"
          : rawStatus.includes("REJECT")
          ? "Rejected"
          : "Pending";

        return {
          id: item.id,
          employeeName: item.employee_name || "Employee",
          department: item.employee_department || "Engineering",
          costCenter: item.cost_center || "CC-ENG-104",
          category: (item.category || "Travel") as any,
          description: item.description || item.title || "",
          amount: Number(item.amount) || 0,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Today",
          status: normStatus,
          priority: Number(item.amount) > 5000 ? "High" : "Medium",
          receiptVerified: Boolean(item.receipt_url),
          policyNotes: item.policy_violation,
          managerRemark: item.manager_remark,
        };
      });
    }
  } catch (supabaseErr) {
    console.error("Supabase fallback failed:", supabaseErr);
  }

  return FALLBACK_CLAIMS;
}

/**
 * Approve claim in Manager Backend and sync to Supabase
 */
export async function approveManagerClaim(
  claimId: string,
  remark: string = "Approved by Manager"
): Promise<ManagerClaim | null> {
  let updatedClaim: ManagerClaim | null = null;

  // 1. Call FastAPI backend
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/approvals/${claimId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remark }),
    });

    if (res.ok) {
      updatedClaim = await res.json();
    }
  } catch (err) {
    console.warn("Backend API approve error, applying Supabase update directly:", err);
  }

  // 2. Sync to Supabase directly
  try {
    await updateClaimInDb(claimId, {
      status: "MANAGER_APPROVED" as any,
      managerRemark: remark,
    });
  } catch (e) {
    console.warn("Supabase update error:", e);
  }

  return updatedClaim;
}

/**
 * Reject claim in Manager Backend and sync to Supabase
 */
export async function rejectManagerClaim(
  claimId: string,
  reason: string
): Promise<ManagerClaim | null> {
  let updatedClaim: ManagerClaim | null = null;

  // 1. Call FastAPI backend
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/approvals/${claimId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      updatedClaim = await res.json();
    }
  } catch (err) {
    console.warn("Backend API reject error, applying Supabase update directly:", err);
  }

  // 2. Sync to Supabase directly
  try {
    await updateClaimInDb(claimId, {
      status: "MANAGER_REJECTED" as any,
      managerRemark: reason,
    });
  } catch (e) {
    console.warn("Supabase update error:", e);
  }

  return updatedClaim;
}

/**
 * Fetch Department Budgets for Manager View
 */
export async function fetchManagerBudgets(): Promise<DepartmentBudget[]> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/budgets`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend budgets API unreachable, using fallback:", err);
  }

  return FALLBACK_BUDGETS;
}

/**
 * Fetch Team Spend Summary Metrics
 */
export async function fetchManagerSpendSummary(): Promise<TeamSpendSummary | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/expenses/summary`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend spend summary API unreachable:", err);
  }
  return null;
}

/**
 * Fetch Manager Policy Settings
 */
export async function fetchManagerPolicies(): Promise<PolicySettings> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/policies/settings`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend policies API unreachable, using local storage/fallback:", err);
  }

  return {
    hotelCap: 5000,
    mealsCap: 1500,
    receiptRequiredAbove: 500,
    currency: "INR",
  };
}

/**
 * Update Manager Policy Settings
 */
export async function updateManagerPolicies(settings: PolicySettings): Promise<PolicySettings> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/policies/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend policies update unreachable, using local storage:", err);
  }

  return settings;
}
