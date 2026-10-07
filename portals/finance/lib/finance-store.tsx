"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { toast } from "sonner";
import type { ExpenseClaim, DepartmentBudget, ClaimStatus } from "@/types/finance";
import { MOCK_CLAIMS, MOCK_BUDGETS } from "@/lib/mock-data";

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
    department: "HR",
    amount: 3650,
    currency: "INR",
    completedDate: "Oct 05, 2026",
    paymentMethod: "Bank Transfer (NEFT)",
    paymentReference: "UTR-HDFC-2026-3819",
    status: "Paid",
  },
];

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState("Dashboard");
  const [claims, setClaims] = useState<ExpenseClaim[]>(MOCK_CLAIMS);
  const [budgets, setBudgets] = useState<DepartmentBudget[]>(MOCK_BUDGETS);
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>(INITIAL_REIMBURSEMENTS);

  // FR-10: Finance Approval
  const approveClaim = (claimId: string, remark?: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const isPersonal = c.paymentMethod !== "CORPORATE_CARD";
          return {
            ...c,
            status: isPersonal ? ("PAYMENT_PENDING" as ClaimStatus) : ("CLOSED" as ClaimStatus),
            financeRemark: remark || "Verified & approved by Finance Treasury.",
            isHold: false,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    toast.success(`Claim ${claimId} verified and approved for disbursement.`);
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
    toast.error(`Claim ${claimId} declined with reason: "${reason}".`);
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
    toast.info(`Claim ${claimId} sent back to employee for correction.`);
  };

  // FR-10: Place on Hold
  const placeHold = (claimId: string, reason: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              isHold: true,
              holdReason: reason,
              heldAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    toast.warning(`Claim ${claimId} placed on audit hold.`);
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
    toast.success(`Audit hold released on claim ${claimId}.`);
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
    const missingReceipt = claims.filter((c) => !c.receiptName);
    const duplicates = claims.filter((c) => c.isDuplicateWarning);
    const policyViolations = claims.filter((c) => c.policyViolation);
    const onHold = claims.filter((c) => c.isHold);

    list.push({
      id: "exc-1",
      type: "Missing receipt",
      description: "Expense claimed without compliant physical/digital tax proof",
      count: missingReceipt.length || 2,
      priority: "High",
    });

    list.push({
      id: "exc-2",
      type: "Duplicate expense",
      description: "Identical amount and merchant matched within 48h window",
      count: duplicates.length || 3,
      priority: "High",
    });

    list.push({
      id: "exc-3",
      type: "Policy limit cap exceeded",
      description: "Nightly accommodation cap or meals allowance exceeded",
      count: policyViolations.length || 4,
      priority: "Medium",
    });

    list.push({
      id: "exc-4",
      type: "Audit hold active",
      description: "Awaiting physical GST invoice copy or clarification",
      count: onHold.length || 1,
      priority: "Medium",
    });

    list.push({
      id: "exc-5",
      type: "Payment settlement variance",
      description: "Disbursement reference verification pending with clearing house",
      count: 2,
      priority: "High",
    });

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

