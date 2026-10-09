"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import type { ExpenseClaim, DepartmentBudget, ClaimStatus } from "@/types/finance";
import { getExpenseClaims, updateClaimInDb, getDepartmentBudgets } from "@/lib/api";

export interface ExceptionItem {
  id: string;
  type: string;
  description: string;
  count: number;
  priority: "High" | "Medium" | "Low";
  claimId?: string;
}

export interface ReimbursementItem {
  id: string;
  claimId: string;
  employee: string;
  avatar?: string;
  department: string;
  amount: number;
  currency: string;
  completedDate: string;
  paymentMethod: string;
  paymentReference: string;
  status: "Paid" | "Pending" | "Processing";
}

interface FinanceContextType {
  // Navigation & View
  activeView: string;
  setActiveView: (view: string) => void;

  // Data
  claims: ExpenseClaim[];
  budgets: DepartmentBudget[];
  reimbursements: ReimbursementItem[];
  exceptions: ExceptionItem[];

  // Actions (PRD Functional Requirements)
  approveClaim: (claimId: string, remark?: string) => void;
  rejectClaim: (claimId: string, reason: string) => void;
  sendBackClaim: (claimId: string, reason: string) => void;
  placeHold: (claimId: string, reason: string) => void;
  releaseHold: (claimId: string) => void;
  recordPayment: (claimId: string, utr: string, channel: string, date: string) => void;
  createClaim: (claim: Partial<ExpenseClaim>) => void;
  exportCsv: () => void;

  // Quick Metrics
  awaitingVerificationCount: number;
  awaitingHighPriorityCount: number;
  approvedAmountTotal: number;
  reimbursementsPendingCount: number;
  reimbursementsPendingAmount: number;
  paymentsPendingCount: number;
  paymentsPendingAmount: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const INITIAL_REIMBURSEMENTS: ReimbursementItem[] = [
  {
    id: "RMB-101",
    claimId: "CLM-006",
    employee: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
    department: "Engineering",
    amount: 8450,
    currency: "INR",
    completedDate: "Oct 06, 2026",
    paymentMethod: "Bank Transfer (NEFT)",
    paymentReference: "UTR-NEFT-2026-0925-8812",
    status: "Paid",
  },
  {
    id: "RMB-102",
    claimId: "CLM-008",
    employee: "Priya Singh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
    department: "Operations",
    amount: 4200,
    currency: "INR",
    completedDate: "Oct 06, 2026",
    paymentMethod: "Bank Transfer (IMPS)",
    paymentReference: "UPI-NPCI-2026-44192",
    status: "Paid",
  },
  {
    id: "RMB-103",
    claimId: "CLM-004",
    employee: "Amit Kumar",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
    department: "Sales",
    amount: 12800,
    currency: "INR",
    completedDate: "Oct 05, 2026",
    paymentMethod: "Bank Transfer (RTGS)",
    paymentReference: "RTGS-RBI-2026-99120",
    status: "Paid",
  },
  {
    id: "RMB-104",
    claimId: "CLM-010",
    employee: "Neha Verma",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces&auto=format&q=80",
    department: "HR",
    amount: 3650,
    currency: "INR",
    completedDate: "Oct 05, 2026",
    paymentMethod: "Bank Transfer (NEFT)",
    paymentReference: "UTR-HDFC-2026-3819",
    status: "Paid",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState("Dashboard");
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>([]);

  // Load real claims and budgets directly from Supabase Cloud
  useEffect(() => {
    let isMounted = true;
    getExpenseClaims().then((fetched) => {
      if (isMounted) {
        const claimList = fetched || [];
        setClaims(claimList);
        
        // Populate reimbursements from real paid claims
        const paidReimbursements: ReimbursementItem[] = claimList
          .filter((c) => c.status === "PAID" || c.disbursedAt || c.paymentReference)
          .map((c) => ({
            id: `RMB-${c.id}`,
            claimId: c.id,
            employee: c.employeeName,
            department: c.employeeDepartment,
            amount: c.amount,
            currency: c.currency || "INR",
            completedDate: c.disbursedAt ? new Date(c.disbursedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Recently",
            paymentMethod: c.paymentChannel || c.paymentMethod || "Bank Transfer",
            paymentReference: c.paymentReference || "Direct Settlement",
            status: "Paid" as const,
          }));
        if (paidReimbursements.length > 0) {
          setReimbursements(paidReimbursements);
        }
      }
    });
    getDepartmentBudgets().then((fetchedBudgets) => {
      if (isMounted) {
        setBudgets(fetchedBudgets || []);
      }
    });
    fetch(`${API_URL}/api/finance/reimbursements`)
      .then((response) => response.ok ? response.json() : [])
      .then((rows: Record<string, unknown>[]) => {
        if (!isMounted || !Array.isArray(rows) || rows.length === 0) return;
        setReimbursements(rows.map((row): ReimbursementItem => ({
          id: String(row.id),
          claimId: String(row.claim_id),
          employee: String(row.employee_name ?? ""),
          department: "",
          amount: Number(row.eligible_personal_amount ?? 0),
          currency: String(row.currency ?? "INR"),
          completedDate: String(row.disbursed_at ?? row.created_at ?? ""),
          paymentMethod: String(row.payment_method ?? ""),
          paymentReference: String(row.payment_reference ?? ""),
          status: row.status === "PAID" ? "Paid" : row.status === "PROCESSING" ? "Processing" : "Pending",
        })));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // FR-10: Finance Approval
  const approveClaim = (claimId: string, remark?: string) => {
    const isPersonalClaim = claims.find((c) => c.id === claimId)?.paymentMethod !== "CORPORATE_CARD";
    const newStatus: ClaimStatus = isPersonalClaim ? "PAYMENT_PENDING" : "CLOSED";
    const finalRemark = remark || "Verified & approved by Finance Treasury.";

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: newStatus,
            financeRemark: finalRemark,
            isHold: false,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    updateClaimInDb(claimId, {
      status: newStatus,
      financeRemark: finalRemark,
      isHold: false,
    });
    toast.success(`Claim ${claimId} verified and approved for disbursement.`);
    fetch(`${API_URL}/api/finance/claims/${claimId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", remark }),
    }).catch(() => {});
  };

  // FR-10: Finance Reject
  const rejectClaim = (claimId: string, reason: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: "FINANCE_REJECTED" as ClaimStatus,
              financeRemark: reason,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    updateClaimInDb(claimId, {
      status: "FINANCE_REJECTED",
      financeRemark: reason,
    });
    toast.error(`Claim ${claimId} declined with reason: "${reason}".`);
    fetch(`${API_URL}/api/finance/claims/${claimId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason }),
    }).catch(() => {});
  };

  // FR-10: Send back for correction
  const sendBackClaim = (claimId: string, reason: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: "SUBMITTED" as ClaimStatus,
              financeRemark: `Sent back: ${reason}`,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    updateClaimInDb(claimId, {
      status: "SUBMITTED",
      financeRemark: `Sent back: ${reason}`,
    });
    toast.info(`Claim ${claimId} sent back to employee for correction.`);
    fetch(`${API_URL}/api/finance/claims/${claimId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send_back", reason }),
    }).catch(() => {});
  };

  // FR-10: Place on Hold
  const placeHold = (claimId: string, reason: string) => {
    const now = new Date().toISOString();
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              isHold: true,
              holdReason: reason,
              heldAt: now,
              updatedAt: now,
            }
          : c
      )
    );
    updateClaimInDb(claimId, {
      isHold: true,
      holdReason: reason,
      heldAt: now,
    });
    toast.warning(`Claim ${claimId} placed on audit hold.`);
    fetch(`${API_URL}/api/finance/claims/${claimId}/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "place_hold", reason }),
    }).catch(() => {});
  };

  // FR-10: Release Hold
  const releaseHold = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              isHold: false,
              holdReason: undefined,
              heldAt: undefined,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    updateClaimInDb(claimId, {
      isHold: false,
      holdReason: "",
    });
    toast.success(`Audit hold released on claim ${claimId}.`);
    fetch(`${API_URL}/api/finance/claims/${claimId}/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "release_hold" }),
    }).catch(() => {});
  };

  // FR-12: Record Payment / Disbursement Settlement
  const recordPayment = (claimId: string, utr: string, channel: string, date: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: "PAID" as ClaimStatus,
              paymentReference: utr,
              paymentChannel: channel,
              disbursedAt: date,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    updateClaimInDb(claimId, {
      status: "PAID",
      paymentReference: utr,
      paymentChannel: channel,
      disbursedAt: date,
    });

    // Add to completed reimbursements ledger
    const newReimb: ReimbursementItem = {
      id: `RMB-${Math.floor(100 + Math.random() * 900)}`,
      claimId,
      employee: claim.employeeName,
      department: claim.employeeDepartment,
      amount: claim.amount,
      currency: claim.currency,
      completedDate: new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      paymentMethod: channel,
      paymentReference: utr,
      status: "Paid",
    };

    setReimbursements((prev) => [newReimb, ...prev]);
    toast.success(`Settlement recorded! UTR: ${utr} for ${claim.employeeName}`);
    fetch(`${API_URL}/api/finance/disburse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        claim_id: claimId,
        payment_reference: utr,
        payment_channel: channel,
      }),
    }).catch(() => {});
  };

  // Quick Create Expense Claim
  const createClaim = (claimData: Partial<ExpenseClaim>) => {
    const newId = `CLM-0${claims.length + 1}`;
    const newClaim: ExpenseClaim = {
      id: newId,
      employeeId: "u1",
      employeeName: claimData.employeeName || "Aditya Kumar",
      employeeDepartment: claimData.employeeDepartment || "Engineering",
      title: claimData.title || "Business Expense",
      description: claimData.description,
      amount: claimData.amount || 1000,
      currency: "INR",
      category: claimData.category || "OTHER",
      paymentMethod: claimData.paymentMethod || "PERSONAL_CARD",
      merchant: claimData.merchant || "Vendor",
      receiptName: claimData.receiptName || "receipt_tax.pdf",
      status: "MANAGER_APPROVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      policyViolation: claimData.policyViolation,
      policyExceededAmount: claimData.policyExceededAmount,
    };

    setClaims((prev) => [newClaim, ...prev]);
    toast.success(`New claim ${newId} logged and routed for Finance verification!`);
  };

  // FR-18: CSV Accounting Export
  const exportCsv = () => {
    const headers = [
      "Claim ID",
      "Employee",
      "Department",
      "Title",
      "Category",
      "Payment Method",
      "Amount (INR)",
      "Status",
      "Payment Reference",
      "Disbursement Date",
    ];

    const rows = claims.map((c) => [
      c.id,
      `"${c.employeeName}"`,
      `"${c.employeeDepartment}"`,
      `"${c.title}"`,
      c.category,
      c.paymentMethod,
      c.amount,
      c.status,
      c.paymentReference || "N/A",
      c.disbursedAt || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinPulse_Ledger_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Accounting CSV export generated and downloaded.");
  };

  // Computations
  const awaitingVerification = useMemo(
    () => claims.filter((c) => c.status === "MANAGER_APPROVED" || c.status === "SUBMITTED"),
    [claims]
  );

  const awaitingHighPriority = useMemo(
    () => awaitingVerification.filter((c) => c.policyViolation || c.isDuplicateWarning || c.amount > 10000),
    [awaitingVerification]
  );

  const approvedClaims = useMemo(
    () => claims.filter((c) => c.status === "PAID" || c.status === "FINANCE_APPROVED" || c.status === "PAYMENT_PENDING" || c.status === "CLOSED"),
    [claims]
  );

  const approvedAmountTotal = useMemo(
    () => approvedClaims.reduce((sum, c) => sum + c.amount, 0),
    [approvedClaims]
  );

  const reimbursementsPending = useMemo(
    () =>
      claims.filter(
        (c) =>
          c.paymentMethod !== "CORPORATE_CARD" &&
          (c.status === "MANAGER_APPROVED" || c.status === "FINANCE_APPROVED" || c.status === "PAYMENT_PENDING") &&
          !c.isHold
      ),
    [claims]
  );

  const reimbursementsPendingAmount = useMemo(
    () => reimbursementsPending.reduce((sum, c) => sum + c.amount, 0),
    [reimbursementsPending]
  );

  const paymentsPending = useMemo(
    () => claims.filter((c) => c.status === "PAYMENT_PENDING" && !c.isHold),
    [claims]
  );

  const paymentsPendingAmount = useMemo(
    () => paymentsPending.reduce((sum, c) => sum + c.amount, 0),
    [paymentsPending]
  );

  const exceptions: ExceptionItem[] = useMemo(() => {
    const list: ExceptionItem[] = [];
    const missingReceipt = claims.filter((c) => !c.receiptName || c.receiptName.trim() === "");
    const duplicates = claims.filter((c) => c.isDuplicateWarning);
    const policyViolations = claims.filter((c) => Boolean(c.policyViolation));
    const onHold = claims.filter((c) => c.isHold);

    if (missingReceipt.length > 0) {
      list.push({
        id: "exc-1",
        type: "Missing receipt",
        description: "Expense claimed without compliant physical/digital tax proof",
        count: missingReceipt.length,
        priority: "High",
      });
    }

    if (duplicates.length > 0) {
      list.push({
        id: "exc-2",
        type: "Duplicate expense",
        description: "Identical amount and merchant matched within 48h window",
        count: duplicates.length,
        priority: "High",
      });
    }

    if (policyViolations.length > 0) {
      list.push({
        id: "exc-3",
        type: "Policy limit cap exceeded",
        description: "Nightly accommodation cap or meals allowance exceeded",
        count: policyViolations.length,
        priority: "Medium",
      });
    }

    if (onHold.length > 0) {
      list.push({
        id: "exc-4",
        type: "Audit hold active",
        description: "Awaiting physical GST invoice copy or clarification",
        count: onHold.length,
        priority: "Medium",
      });
    }

    return list;
  }, [claims]);

  return (
    <FinanceContext.Provider
      value={{
        activeView,
        setActiveView,
        claims,
        budgets,
        reimbursements,
        exceptions,
        approveClaim,
        rejectClaim,
        sendBackClaim,
        placeHold,
        releaseHold,
        recordPayment,
        createClaim,
        exportCsv,
        awaitingVerificationCount: awaitingVerification.length,
        awaitingHighPriorityCount: awaitingHighPriority.length,
        approvedAmountTotal,
        reimbursementsPendingCount: reimbursementsPending.length,
        reimbursementsPendingAmount,
        paymentsPendingCount: paymentsPending.length,
        paymentsPendingAmount,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinanceStore() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinanceStore must be used within a FinanceProvider");
  }
  return context;
}

