"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  CheckSquare,
  Wallet,
  PieChart,
  AlertTriangle,
  AlertCircle,
  ClipboardList,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  Download,
  Eye,
  Check,
  X,
  FileText,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ChevronDown,
  RefreshCw,
  Menu,
  CreditCard,
  Paperclip,
} from "lucide-react";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import { EmployeeAvatar, EmployeeCell } from "@/components/manager/EmployeeAvatar";
import { ThemeProvider, useTheme } from "@/lib/theme-store";
import { supabase } from "@/lib/supabase";
import {
  fetchManagerClaims,
  approveManagerClaim,
  rejectManagerClaim,
  fetchManagerBudgets,
  fetchCardRequests,
  approveCardRequest,
  rejectCardRequest,
  type ManagerClaim,
  type DepartmentBudget,
  type CardApprovalRequest,
} from "@/lib/manager-api";

// Modals from shared dashboard suite
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";
import { ReceiptModal } from "@/components/shared/ReceiptModal";
import { QuarterlyFinancialStatements } from "@/components/manager/QuarterlyFinancialStatements";

export type ManagerView =
  | "Approvals"
  | "Team Spend"
  | "Budgets"
  | "Exceptions"
  | "Reports"
  | "Policies";

export interface PolicyViolation {
  claim: ManagerClaim;
  severity: "high" | "medium" | "low";
  policyName: string;
  reason: string;
}

export function getClaimPolicyViolation(claim: ManagerClaim): {
  severity: "high" | "medium" | "low";
  policyName: string;
  reason: string;
} | null {
  // 1. Explicit policy violation from database / backend
  if (claim.policyNotes && claim.policyNotes.trim()) {
    const isHigh =
      claim.priority === "High" ||
      claim.amount >= 5000 ||
      /unauthorized|critical|violation|exceed/i.test(claim.policyNotes);
    return {
      severity: isHigh ? "high" : "medium",
      policyName:
        claim.category === "Hotel"
          ? "Policy: Accommodation & Hotel 2.1"
          : claim.category === "Meals"
          ? "Policy: Meals & Per Diem 3.1"
          : claim.category === "Travel"
          ? "Policy: Travel & Conveyance 4.2"
          : "Policy: Corporate Compliance 1.1",
      reason: claim.policyNotes,
    };
  }

  // 2. Mandatory tax invoice / receipt missing above ₹500
  if (!claim.receiptVerified && claim.amount > 500) {
    return {
      severity: claim.amount >= 5000 ? "high" : "medium",
      policyName: "Policy: Tax Invoice & Receipts 1.3",
      reason: `Mandatory itemized tax invoice or receipt missing for expense of ₹${claim.amount.toLocaleString("en-IN")} (exceeds ₹500 threshold).`,
    };
  }

  // 3. Nightly hotel accommodation ceiling (₹5,000)
  if (claim.category === "Hotel" && claim.amount > 5000) {
    return {
      severity: "high",
      policyName: "Policy: Accommodation & Hotel 2.1",
      reason: `Nightly hotel accommodation of ₹${claim.amount.toLocaleString("en-IN")} exceeds standard corporate ceiling of ₹5,000.`,
    };
  }

  // 4. Per diem food & beverage ceiling (₹1,500)
  if (claim.category === "Meals" && claim.amount > 1500) {
    return {
      severity: claim.amount > 3000 ? "high" : "medium",
      policyName: "Policy: Meals & Per Diem 3.1",
      reason: `Meal claim of ₹${claim.amount.toLocaleString("en-IN")} exceeds daily per-diem ceiling of ₹1,500.`,
    };
  }

  // 5. Domestic travel ceiling (₹9,000)
  if (claim.category === "Travel" && claim.amount > 9000) {
    return {
      severity: "high",
      policyName: "Policy: Air Travel & Conveyance 4.1",
      reason: `Travel expenditure of ₹${claim.amount.toLocaleString("en-IN")} exceeds pre-approved domestic travel threshold of ₹9,000.`,
    };
  }

  // 6. Unverified receipt for any non-zero claim
  if (!claim.receiptVerified && claim.amount > 0) {
    return {
      severity: "low",
      policyName: "Policy: Receipt Verification 1.2",
      reason: `Receipt attachment is pending verification for claim of ₹${claim.amount.toLocaleString("en-IN")}.`,
    };
  }

  return null;
}

const INITIAL_CLAIMS: ManagerClaim[] = [];
const DEPARTMENT_BUDGETS: DepartmentBudget[] = [];

function ManagerDashboardInner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const searchParams = useSearchParams();

  const [activeView, setActiveView] = useState<ManagerView>("Approvals");

  useEffect(() => {
    const v = searchParams.get("view");
    if (v) {
      const normalized = v.toLowerCase();
      if (normalized.includes("approval")) setActiveView("Approvals");
      else if (normalized.includes("spend") || normalized.includes("cost")) setActiveView("Team Spend");
      else if (normalized.includes("budget") || normalized.includes("threshold")) setActiveView("Budgets");
      else if (normalized.includes("exception") || (normalized.includes("audit") && !normalized.includes("report"))) setActiveView("Exceptions");
      else if (normalized.includes("report")) setActiveView("Reports");
      else if (normalized.includes("policy") || normalized.includes("policies")) setActiveView("Policies");
    }
  }, [searchParams]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Approvals & Claim State
  const [claims, setClaims] = useState<ManagerClaim[]>([]);
  const [cardRequests, setCardRequests] = useState<CardApprovalRequest[]>([]);
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectClaim, setInspectClaim] = useState<ManagerClaim | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [exceptionSeverityFilter, setExceptionSeverityFilter] = useState<"All" | "high" | "medium" | "low" | "pending">("All");
  const [exceptionSearch, setExceptionSearch] = useState("");

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const [claimsResult, budgetsResult, cardsResult] = await Promise.allSettled([
        fetchManagerClaims(),
        fetchManagerBudgets(),
        fetchCardRequests(),
      ]);
      if (claimsResult.status === "fulfilled" && claimsResult.value) {
        setClaims(claimsResult.value);
      }
      if (budgetsResult.status === "fulfilled" && budgetsResult.value) {
        setBudgets(budgetsResult.value);
      }
      if (cardsResult.status === "fulfilled" && cardsResult.value) {
        setCardRequests(cardsResult.value);
      }
    } catch (e) {
      console.warn("Backend sync notice:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();

    // 1. Polling fallback for guaranteed responsiveness
    const interval = setInterval(() => {
      refreshData();
    }, 4000);

    // 2. Real-time Supabase postgres_changes listener for instant live update
    const channel = supabase
      .channel("manager-dashboard-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expense_claims" },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!inspectClaim) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectClaim(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectClaim]);

  const notify = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleApprove = async (claim: ManagerClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Approved" as const } : c))
    );
    notify(`Approved ${claim.employeeName}'s claim of ₹${claim.amount.toLocaleString("en-IN")}`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Approved" });
    }

    try {
      await approveManagerClaim(claim.id, "Approved by Manager");
      await refreshData();
    } catch (e) {
      console.warn("Backend approval sync notice:", e);
    }
  };

  const handleReject = async (claim: ManagerClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Rejected" as const } : c))
    );
    notify(`Rejected ${claim.employeeName}'s claim of ₹${claim.amount.toLocaleString("en-IN")}`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Rejected" });
    }

    try {
      await rejectManagerClaim(claim.id, "Policy non-compliance or unauthorized expense");
      await refreshData();
    } catch (e) {
      console.warn("Backend rejection sync notice:", e);
    }
  };

  const handleApproveCard = async (req: CardApprovalRequest) => {
    setCardRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Approved" as const } : r))
    );
    notify(`Approved card request for ${req.employeeName}: ₹${req.requestedLimit.toLocaleString("en-IN")}`);
    try {
      await approveCardRequest(req);
      await refreshData();
    } catch (e) {
      console.warn("Card approval sync notice:", e);
    }
  };

  const handleRejectCard = async (req: CardApprovalRequest) => {
    setCardRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Rejected" as const } : r))
    );
    notify(`Rejected card request for ${req.employeeName}`);
    try {
      await rejectCardRequest(req.id);
      await refreshData();
    } catch (e) {
      console.warn("Card rejection sync notice:", e);
    }
  };

  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const approvedClaims = claims.filter((c) => c.status === "Approved");
  const rejectedClaims = claims.filter((c) => c.status === "Rejected");

  const totalSpent = claims.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const pendingAmount = pendingClaims.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const approvedAmount = approvedClaims.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const [activeExceptionTab, setActiveExceptionTab] = useState<"all" | "missing" | "duplicates" | "policy_caps" | "on_hold">("all");

  const duplicateClaimMap = useMemo(() => {
    const map = new Map<string, string>();
    for (let i = 0; i < claims.length; i++) {
      const a = claims[i];
      if (!a.amount || a.amount <= 0) continue;
      for (let j = i + 1; j < claims.length; j++) {
        const b = claims[j];
        if (
          a.employeeName.toLowerCase() === b.employeeName.toLowerCase() &&
          a.amount === b.amount
        ) {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          if (Math.abs(timeA - timeB) <= 48 * 3600 * 1000 || a.date === b.date) {
            map.set(
              a.id,
              `Identical amount ₹${a.amount.toLocaleString("en-IN")} and merchant matched ${b.id} within 48h audit window`
            );
            map.set(
              b.id,
              `Identical amount ₹${b.amount.toLocaleString("en-IN")} and merchant matched ${a.id} within 48h audit window`
            );
          }
        }
      }
    }
    return map;
  }, [claims]);

  const allExceptions = useMemo(() => {
    const list: {
      claim: ManagerClaim;
      severity: "high" | "medium" | "low";
      policyName: string;
      reason: string;
      isMissingReceipt: boolean;
      isDuplicate: boolean;
      isPolicyCap: boolean;
      isOnHold: boolean;
    }[] = [];

    claims.forEach((claim) => {
      const isMissingReceipt = !claim.receiptVerified && claim.amount > 0;
      const isDuplicate = duplicateClaimMap.has(claim.id);
      const isPolicyCap =
        (claim.category === "Hotel" && claim.amount > 5000) ||
        (claim.category === "Meals" && claim.amount > 1500) ||
        (claim.category === "Travel" && claim.amount > 9000) ||
        Boolean(claim.policyNotes && claim.policyNotes.trim());
      const isOnHold = claim.status === "Pending";

      if (isMissingReceipt || isDuplicate || isPolicyCap || isOnHold) {
        let reason = "";
        let severity: "high" | "medium" | "low" = "medium";
        let policyName = "Policy: Corporate Compliance 1.1";

        if (isDuplicate) {
          reason = duplicateClaimMap.get(claim.id)!;
          severity = "high";
          policyName = "Policy: Duplicate Expense 5.1";
        } else if (claim.policyNotes && claim.policyNotes.trim()) {
          reason = claim.policyNotes;
          severity = claim.priority === "High" || claim.amount >= 5000 ? "high" : "medium";
          policyName =
            claim.category === "Hotel"
              ? "Policy: Accommodation & Hotel 2.1"
              : claim.category === "Meals"
              ? "Policy: Meals & Per Diem 3.1"
              : "Policy: Travel & Conveyance 4.2";
        } else if (isPolicyCap) {
          if (claim.category === "Hotel" && claim.amount > 5000) {
            reason = `Nightly accommodation cap exceeded (Standard limit ₹5,000).`;
            severity = "high";
            policyName = "Policy: Accommodation & Hotel 2.1";
          } else if (claim.category === "Meals" && claim.amount > 1500) {
            reason = `Per diem meal limit exceeded (Daily cap ₹1,500).`;
            severity = "medium";
            policyName = "Policy: Meals & Per Diem 3.1";
          } else {
            reason = `Domestic travel ceiling exceeded without pre-authorized travel desk clearance.`;
            severity = "high";
            policyName = "Policy: Air Travel & Conveyance 4.1";
          }
        } else if (isMissingReceipt) {
          reason = `Expense claimed without compliant physical/digital tax proof or invoice attachment.`;
          severity = claim.amount >= 5000 ? "high" : "medium";
          policyName = "Policy: Tax Invoice & Receipts 1.3";
        } else if (isOnHold) {
          reason = `Submitted expense awaiting formal manager verification and clearance.`;
          severity = "low";
          policyName = "Policy: Manager Verification 1.0";
        }

        list.push({
          claim,
          severity,
          policyName,
          reason,
          isMissingReceipt,
          isDuplicate,
          isPolicyCap,
          isOnHold,
        });
      }
    });

    return list;
  }, [claims, duplicateClaimMap]);

  const missingReceiptsCount = useMemo(
    () => allExceptions.filter((e) => e.isMissingReceipt).length,
    [allExceptions]
  );
  const duplicatesCount = useMemo(
    () => allExceptions.filter((e) => e.isDuplicate).length,
    [allExceptions]
  );
  const policyCapsCount = useMemo(
    () => allExceptions.filter((e) => e.isPolicyCap).length,
    [allExceptions]
  );
  const onHoldCount = useMemo(
    () => allExceptions.filter((e) => e.isOnHold).length,
    [allExceptions]
  );

  const exceptionsCount = allExceptions.length;

  const complianceRate = claims.length > 0
    ? Math.max(0, Math.round(((claims.length - allExceptions.length) / claims.length) * 1000) / 10)
    : 100;

  const filteredExceptions = useMemo(() => {
    return allExceptions.filter((item) => {
      let matchTab = true;
      if (activeExceptionTab === "missing") matchTab = item.isMissingReceipt;
      else if (activeExceptionTab === "duplicates") matchTab = item.isDuplicate;
      else if (activeExceptionTab === "policy_caps") matchTab = item.isPolicyCap;
      else if (activeExceptionTab === "on_hold") matchTab = item.isOnHold;

      const q = exceptionSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.claim.id.toLowerCase().includes(q) ||
        item.claim.employeeName.toLowerCase().includes(q) ||
        item.claim.department.toLowerCase().includes(q) ||
        (item.claim.merchant || "").toLowerCase().includes(q) ||
        item.claim.category.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [allExceptions, activeExceptionTab, exceptionSearch]);

  const getExceptionDisplayDetail = (item: (typeof allExceptions)[0], activeTab: string) => {
    if (activeTab === "missing" || (activeTab === "all" && item.isMissingReceipt && !item.isDuplicate && !item.isPolicyCap)) {
      return {
        severity: item.claim.amount >= 5000 ? ("high" as const) : ("medium" as const),
        policyName: "Policy: Tax Invoice & Receipts 1.3",
        reason: "Expense claimed without compliant physical/digital tax proof or invoice attachment.",
      };
    }
    if (activeTab === "duplicates" || (activeTab === "all" && item.isDuplicate)) {
      return {
        severity: "high" as const,
        policyName: "Policy: Duplicate Expense 5.1",
        reason: duplicateClaimMap.get(item.claim.id) || "Identical amount and merchant matched within 48h audit window.",
      };
    }
    if (activeTab === "policy_caps" || (activeTab === "all" && item.isPolicyCap)) {
      let capReason = item.claim.policyNotes;
      if (!capReason || !capReason.trim()) {
        if (item.claim.category === "Hotel" && item.claim.amount > 5000) {
          capReason = `Nightly accommodation cap exceeded (Standard limit ₹5,000).`;
        } else if (item.claim.category === "Meals" && item.claim.amount > 1500) {
          capReason = `Per diem meal limit exceeded (Daily cap ₹1,500).`;
        } else {
          capReason = `Spending cap exceeded for ${item.claim.category}. Requires manager justification.`;
        }
      }
      return {
        severity: "medium" as const,
        policyName:
          item.claim.category === "Hotel"
            ? "Policy: Accommodation & Hotel 2.1"
            : item.claim.category === "Meals"
            ? "Policy: Meals & Per Diem 3.1"
            : "Policy: Air Travel & Conveyance 4.1",
        reason: capReason,
      };
    }
    if (activeTab === "on_hold" || item.isOnHold) {
      return {
        severity: "low" as const,
        policyName: "Policy: Manager Verification 1.0",
        reason: "Submitted expense awaiting formal manager verification and audit clearance.",
      };
    }
    return {
      severity: item.severity,
      policyName: item.policyName,
      reason: item.reason,
    };
  };

  const filteredClaims = claims.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch =
      c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getPageTitle = () => {
    switch (activeView) {
      case "Approvals":
        return "Manager Approvals";
      case "Team Spend":
        return "Team Spend & Cost Centers";
      case "Budgets":
        return "Department Budgets";
      case "Exceptions":
        return "Exceptions & Policy Violations";
      case "Reports":
        return "Financial Reports";
      case "Policies":
        return "Expense Compliance Policies";
      default:
        return "Manager Approvals";
    }
  };

  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors ${
        isDark ? "bg-[#08080A] text-zinc-100" : "bg-[#FAFAFB] text-zinc-900"
      }`}
    >
      {/* Self-contained Manager Sidebar (Collapsible Rail & Full Expanded View) */}
      <ManagerSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={!sidebarOpen}
        setIsCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
        isMobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Content Workspace */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden min-w-0 ${
        isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
      }`}>
        {/* Core Manager Header */}
        <ManagerHeader
          title={getPageTitle()}
          onToggleSidebar={() => setMobileDrawerOpen(true)}
        />

        {/* Scrollable Main Application Space */}
        <main className={`flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6 ${
          isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
        }`}>
          {/* Toast Notification */}
          {feedbackNotice && (
            <div
              className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 shadow-xl border animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                isDark
                  ? "bg-[#18181D] text-zinc-100 border-white/[0.12]"
                  : "bg-white text-zinc-900 border-zinc-200 shadow-md"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{feedbackNotice}</span>
              <button
                type="button"
                onClick={() => setFeedbackNotice(null)}
                className="ml-2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Standardized Flat KPI Cards Matching Finance Dashboard */}
          {activeView !== "Exceptions" && (
            <section aria-label="Manager Key Metrics">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total Team Spend */}
                <div
                  onClick={() => setActiveView("Team Spend")}
                  className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors cursor-pointer border ${
                    isDark
                      ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                      : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Team Total Spend
                    </span>
                    <Wallet className={`h-4 w-4 shrink-0 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`} />
                  </div>
                  <div className="mt-3.5 flex items-center">
                    <span
                      className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                        isDark ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      ₹{totalSpent.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Card 2: Awaiting Approval */}
                <div
                  onClick={() => setActiveView("Approvals")}
                  className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors cursor-pointer border ${
                    isDark
                      ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                      : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Awaiting Verification
                    </span>
                    <Clock className={`h-4 w-4 shrink-0 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`} />
                  </div>
                  <div className="mt-3.5 flex items-center">
                    <span
                      className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                        isDark ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      {pendingClaims.length}
                    </span>
                  </div>
                </div>

                {/* Card 3: Approved This Month */}
                <div
                  onClick={() => setActiveView("Approvals")}
                  className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors cursor-pointer border ${
                    isDark
                      ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                      : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Approved This Month
                    </span>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`} />
                  </div>
                  <div className="mt-3.5 flex items-center">
                    <span
                      className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                        isDark ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      ₹{approvedAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Card 4: Policy Exceptions */}
                <div
                  onClick={() => setActiveView("Exceptions")}
                  className={`rounded-xl px-5 py-4 flex flex-col justify-between transition-colors cursor-pointer border ${
                    isDark
                      ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                      : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Policy Exceptions
                    </span>
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`} />
                  </div>
                  <div className="mt-3.5 flex items-center">
                    <span
                      className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                        isDark ? "text-zinc-100" : "text-zinc-900"
                      }`}
                    >
                      {exceptionsCount}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* VIEW 1: Approvals */}
          {activeView === "Approvals" && (
            <div
              className={`rounded-xl overflow-hidden transition-colors border ${
                isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
              }`}
            >
              {/* Table Toolbar */}
              <div
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                  isDark ? "border-white/[0.06]" : "border-zinc-200/60"
                }`}
              >
                {/* Tabs */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-lg border w-fit ${
                    isDark ? "bg-[#18181D] border-white/[0.06]" : "bg-zinc-100 border-zinc-200/80"
                  }`}
                >
                  {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        statusFilter === tab
                          ? isDark
                            ? "bg-white text-black shadow-xs font-semibold"
                            : "bg-black text-white shadow-xs font-semibold"
                          : isDark
                          ? "text-zinc-400 hover:text-white"
                          : "text-zinc-600 hover:text-black"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search & Backend Sync */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search claim, employee, ID..."
                      className={`w-full text-xs rounded-lg pl-8 pr-3 py-1.5 border transition-all focus:outline-none ${
                        isDark
                          ? "bg-[#18181D] border-white/[0.08] text-zinc-100 placeholder:text-zinc-500 focus:border-white/25"
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={refreshData}
                    disabled={isRefreshing}
                    title="Sync with backend database"
                    className={`p-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                      isDark
                        ? "bg-[#18181D] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Flat Table */}
              <div className="overflow-x-auto px-2 pb-2">
                <table className="w-full min-w-[720px] text-left border-collapse">
                  <thead>
                    <tr
                      className={`text-xs font-medium border-b ${
                        isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
                      }`}
                    >
                      <th className="py-2.5 px-4 font-medium">Claim ID</th>
                      <th className="py-2.5 px-4 font-medium">Employee</th>
                      <th className="py-2.5 px-4 font-medium">Cost Center</th>
                      <th className="py-2.5 px-4 font-medium">Description</th>
                      <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                      <th className="py-2.5 px-4 font-medium">Date</th>
                      <th className="py-2.5 px-4 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium text-right">1-Click Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-zinc-500">
                          No claims found in this queue.
                        </td>
                      </tr>
                    ) : (
                      filteredClaims.map((claim) => (
                        <tr
                          key={claim.id}
                          className={`transition-colors cursor-pointer ${
                            isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"
                          }`}
                          onClick={() => setInspectClaim(claim)}
                        >
                          <td className="py-2.5 px-4 font-mono text-xs text-zinc-400">
                            {claim.id}
                          </td>
                          <td className="py-2.5 px-4">
                            <EmployeeCell
                              name={claim.employeeName}
                              department={claim.department}
                            />
                          </td>
                          <td className="py-2.5 px-4 font-mono text-xs text-zinc-500">
                            {claim.costCenter}
                          </td>
                          <td className="py-2.5 px-4 max-w-xs truncate text-zinc-700 dark:text-zinc-300">
                            {claim.description}
                          </td>
                          <td className="py-2.5 px-4 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                            ₹{claim.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-4 text-[13px] text-zinc-500 whitespace-nowrap">
                            {claim.date}
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <StatusBadge
                              tone={
                                claim.status === "Approved"
                                  ? "success"
                                  : claim.status === "Pending"
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {claim.status === "Pending"
                                ? "Pending Approval"
                                : claim.status === "Approved"
                                ? "Approved"
                                : "Rejected"}
                            </StatusBadge>
                          </td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {claim.status === "Pending" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(claim)}
                                  title="Approve immediately"
                                  className="text-xs font-medium px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/25 transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(claim)}
                                  title="Reject request"
                                  className="text-xs font-medium px-2.5 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/25 transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setInspectClaim(claim)}
                                className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                                  isDark
                                    ? "text-zinc-300 hover:bg-white/[0.06] border-white/[0.08]"
                                    : "text-zinc-600 hover:bg-zinc-100 border-zinc-200"
                                }`}
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Corporate Card & Limit Requests Queue */}
              <div
                className={`rounded-xl border transition-colors mt-6 ${
                  isDark
                    ? "bg-[#111113] border-white/[0.07]"
                    : "bg-white border-zinc-200/80 shadow-xs"
                }`}
              >
                <div
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                    isDark ? "border-white/[0.06]" : "border-zinc-200/60"
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      <span>Corporate Card &amp; Limit Requests</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Review virtual corporate card requests and credit limit adjustments from team members.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 self-start sm:self-auto">
                    {cardRequests.filter((r) => r.status === "Pending").length} Pending
                  </span>
                </div>

                <div className="overflow-x-auto px-2 pb-2">
                  <table className="w-full min-w-[700px] text-left border-collapse">
                    <thead>
                      <tr
                        className={`text-xs font-medium border-b ${
                          isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
                        }`}
                      >
                        <th className="py-2.5 px-4 font-medium">Employee</th>
                        <th className="py-2.5 px-4 font-medium">Department</th>
                        <th className="py-2.5 px-4 font-medium">Request Type</th>
                        <th className="py-2.5 px-4 font-medium">Card / Details</th>
                        <th className="py-2.5 px-4 font-medium text-right">Requested Limit</th>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 font-medium text-right">1-Click Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
                      {cardRequests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs text-zinc-500">
                            No corporate card requests found.
                          </td>
                        </tr>
                      ) : (
                        cardRequests.map((req) => (
                          <tr
                            key={req.id}
                            className={`transition-colors ${
                              isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"
                            }`}
                          >
                            <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                              {req.employeeName}
                            </td>
                            <td className="py-2.5 px-4 text-xs text-zinc-500">
                              {req.department}
                            </td>
                            <td className="py-2.5 px-4 text-xs font-medium">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300">
                                {req.requestType === "VIRTUAL_CARD" ? "Virtual Card" : "Limit Increase"}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-xs text-zinc-700 dark:text-zinc-300">
                              {req.cardName}
                            </td>
                            <td className="py-2.5 px-4 text-right text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                              ₹{req.requestedLimit.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2.5 px-4">
                              {req.status === "Approved" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                  Approved
                                </span>
                              ) : req.status === "Rejected" ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 animate-pulse">
                                  Pending Review
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              {req.status === "Pending" ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleApproveCard(req)}
                                    className="text-xs font-medium px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/25 transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectCard(req)}
                                    className="text-xs font-medium px-2.5 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/25 transition-colors cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-400">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Team Spend */}
          {activeView === "Team Spend" && (
            <div className="space-y-6">
              {/* Cost Center Breakdown Grid */}
              <div
                className={`rounded-xl p-5 border transition-colors ${
                  isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
                }`}
              >
                <div
                  className={`pb-4 mb-4 flex items-center justify-between border-b ${
                    isDark ? "border-white/[0.06]" : "border-zinc-200/60"
                  }`}
                >
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Cost Center Budget Allocations
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Quarterly spend ledger across internal managerial cost codes.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
                      isDark
                        ? "bg-[#18181D] hover:bg-[#202026] text-zinc-200 border-white/[0.08]"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    <Download className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Export Ledger</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgets.map((dept) => {
                    const percent = Math.round((dept.spent / dept.cap) * 100);
                    return (
                      <div
                        key={dept.name}
                        className={`p-4 rounded-xl border transition-colors ${
                          isDark
                            ? "bg-[#161619] border-white/[0.05] hover:border-white/[0.1]"
                            : "bg-zinc-50/80 border-zinc-200/60 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="font-medium text-[13px] text-zinc-900 dark:text-zinc-100">
                              {dept.name}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500">{dept.members} Submitters</span>
                        </div>

                        <div className="flex items-baseline justify-between mt-3">
                          <span className="text-base font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
                            ₹{dept.spent.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-zinc-500 tabular-nums">
                            Cap: ₹{dept.cap.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Progress Meter */}
                        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/[0.08] mt-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: dept.color,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-zinc-500 font-medium tabular-nums">{percent}% utilized</span>
                          <StatusBadge tone={percent > 85 ? "warning" : "success"}>
                            {percent > 85 ? "Near limit" : "Healthy"}
                          </StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Budgets */}
          {activeView === "Budgets" && (
            <div
              className={`rounded-xl p-5 border transition-colors ${
                isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
              }`}
            >
              <div
                className={`pb-4 mb-4 flex items-center justify-between border-b ${
                  isDark ? "border-white/[0.06]" : "border-zinc-200/60"
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Live Department Spend vs Thresholds
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Hard limits prevent department over-expenditure without secondary VP approval.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {budgets.map((dept) => {
                  const percent = Math.round((dept.spent / dept.cap) * 100);
                  const remaining = dept.cap - dept.spent;
                  return (
                    <div
                      key={dept.name}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50/80 border-zinc-200/60"
                      }`}
                    >
                      <div className="space-y-1 min-w-[200px]">
                        <div className="font-medium text-[13px] text-zinc-900 dark:text-zinc-100">
                          {dept.name}
                        </div>
                        <div className="text-xs text-zinc-500 tabular-nums">
                          Buffer remaining: ₹{remaining.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="flex-1 max-w-md mx-4">
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                          <span>Progress</span>
                          <span className="tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/[0.08] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: dept.color,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge tone={percent > 80 ? "warning" : "success"}>
                          {percent > 80 ? "Near limit" : "Healthy"}
                        </StatusBadge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: Exceptions (100% Data-Driven from Real Claims Matching Reference UI) */}
          {activeView === "Exceptions" && (
            <div className="space-y-4">
              {/* Top Banner */}
              <div
                className={`rounded-xl p-5 border transition-colors ${
                  isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className={`text-base font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        Exceptions &amp; Policy Violation Center
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isDark
                            ? "bg-[#18181D] text-zinc-300 border-white/[0.08]"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}
                      >
                        {missingReceiptsCount} missing receipts &bull; {allExceptions.length} active violations
                      </span>
                    </div>
                    <p className={`text-xs mt-1.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Track missing tax receipts, policy breaches, duplicate expenses, and audit holds. Click any card below to view all items.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 KPI Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Missing receipt */}
                <div
                  onClick={() => setActiveExceptionTab(activeExceptionTab === "missing" ? "all" : "missing")}
                  className={`rounded-xl p-5 flex flex-col justify-between border transition-all cursor-pointer ${
                    activeExceptionTab === "missing"
                      ? "border-2 border-[#E11D48] ring-1 ring-[#E11D48]/30 bg-[#161214]"
                      : isDark
                      ? "bg-[#111113] border-white/[0.07] hover:border-white/[0.15]"
                      : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        Missing receipt
                      </span>
                      <span className="flex items-center text-xs font-semibold text-rose-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                        High
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Expense claimed without compliant physical/digital tax proof
                    </p>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <span className={`text-xl font-bold tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {missingReceiptsCount} items
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        activeExceptionTab === "missing"
                          ? "text-zinc-400"
                          : "text-emerald-500 hover:text-emerald-400"
                      }`}
                    >
                      {activeExceptionTab === "missing" ? "Filtering list ↗" : `Click to view all ${missingReceiptsCount} ↗`}
                    </span>
                  </div>
                </div>

                {/* Card 2: Duplicate expense */}
                <div
                  onClick={() => setActiveExceptionTab(activeExceptionTab === "duplicates" ? "all" : "duplicates")}
                  className={`rounded-xl p-5 flex flex-col justify-between border transition-all cursor-pointer ${
                    activeExceptionTab === "duplicates"
                      ? "border-2 border-[#E11D48] ring-1 ring-[#E11D48]/30 bg-[#161214]"
                      : isDark
                      ? "bg-[#111113] border-white/[0.07] hover:border-white/[0.15]"
                      : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        Duplicate expense
                      </span>
                      <span className="flex items-center text-xs font-semibold text-rose-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                        High
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Identical amount and merchant matched within 48h audit window
                    </p>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <span className={`text-xl font-bold tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {duplicatesCount} items
                    </span>
                    <span className="text-xs font-medium text-zinc-400">
                      {activeExceptionTab === "duplicates" ? "Filtering list ↗" : "Click to view ↗"}
                    </span>
                  </div>
                </div>

                {/* Card 3: Policy limit cap exceeded */}
                <div
                  onClick={() => setActiveExceptionTab(activeExceptionTab === "policy_caps" ? "all" : "policy_caps")}
                  className={`rounded-xl p-5 flex flex-col justify-between border transition-all cursor-pointer ${
                    activeExceptionTab === "policy_caps"
                      ? "border-2 border-[#E11D48] ring-1 ring-[#E11D48]/30 bg-[#161214]"
                      : isDark
                      ? "bg-[#111113] border-white/[0.07] hover:border-white/[0.15]"
                      : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                        Policy limit cap exceeded
                      </span>
                      <span className="flex items-center text-xs font-semibold text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
                        Medium
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Nightly accommodation cap or meals daily allowance exceeded
                    </p>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <span className={`text-xl font-bold tabular-nums ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {policyCapsCount} items
                    </span>
                    <span className="text-xs font-medium text-zinc-400">
                      {activeExceptionTab === "policy_caps" ? "Filtering list ↗" : "Click to view ↗"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter Tabs and Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: "all", label: `All Active (${allExceptions.length})` },
                    { id: "missing", label: `Missing Receipts (${missingReceiptsCount})`, hasIcon: true },
                    { id: "duplicates", label: `Duplicates (${duplicatesCount})` },
                    { id: "policy_caps", label: `Policy Caps (${policyCapsCount})` },
                    { id: "on_hold", label: `On Hold (${onHoldCount})` },
                  ].map((tab) => {
                    const isSelected = activeExceptionTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveExceptionTab(tab.id as typeof activeExceptionTab)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#E11D48] text-white shadow-xs font-semibold"
                            : isDark
                            ? "bg-[#16161A] text-zinc-400 hover:text-zinc-200 border border-white/[0.08]"
                            : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                        }`}
                      >
                        {tab.hasIcon && <Paperclip className="h-3 w-3 shrink-0" />}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px] sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search claim, employee, merchant..."
                    value={exceptionSearch}
                    onChange={(e) => setExceptionSearch(e.target.value)}
                    className={`w-full text-xs pl-9 pr-7 py-2 rounded-lg border outline-none transition-colors ${
                      isDark
                        ? "bg-[#16161A] border-white/[0.08] text-zinc-200 placeholder-zinc-500 focus:border-zinc-400"
                        : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
                    }`}
                  />
                  {exceptionSearch && (
                    <button
                      type="button"
                      onClick={() => setExceptionSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Exceptions Table */}
              <div
                className={`rounded-xl overflow-hidden border transition-colors ${
                  isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className={`text-xs font-medium border-b ${
                          isDark
                            ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
                            : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
                        }`}
                      >
                        <th className="py-3 px-4 font-medium">Claim ID</th>
                        <th className="py-3 px-4 font-medium">Employee &amp; Dept</th>
                        <th className="py-3 px-4 font-medium">Merchant &amp; Category</th>
                        <th className="py-3 px-4 font-medium">Amount</th>
                        <th className="py-3 px-4 font-medium">Exception Detail</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y text-xs ${
                        isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
                      }`}
                    >
                      {filteredExceptions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className={`py-16 text-center text-xs ${
                              isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            No claims match the selected filter or search query.
                          </td>
                        </tr>
                      ) : (
                        filteredExceptions.map((item) => {
                          const { claim } = item;
                          const detail = getExceptionDisplayDetail(item, activeExceptionTab);
                          return (
                            <tr
                              key={claim.id}
                              className={`transition-colors ${
                                isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                              }`}
                            >
                              {/* Claim ID */}
                              <td className={`py-3.5 px-4 font-mono text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                {claim.id}
                              </td>

                              {/* Employee & Dept */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <EmployeeAvatar name={claim.employeeName} />
                                  <div>
                                    <span className={`font-semibold block text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                                      {claim.employeeName}
                                    </span>
                                    <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                      {claim.department}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Merchant & Category */}
                              <td className="py-3.5 px-4">
                                <span className={`font-semibold block text-xs ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                                  {claim.merchant || claim.description || "Corporate Vendor"}
                                </span>
                                <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {claim.category}
                                </span>
                              </td>

                              {/* Amount */}
                              <td className="py-3.5 px-4">
                                <span className={`font-bold tabular-nums text-xs sm:text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                  ₹{Number(claim.amount).toLocaleString("en-IN")}
                                </span>
                              </td>

                              {/* Exception Detail */}
                              <td className="py-3.5 px-4 max-w-sm">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span
                                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                                      detail.severity === "high"
                                        ? "bg-rose-500"
                                        : detail.severity === "medium"
                                        ? "bg-amber-400"
                                        : "bg-blue-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-[11px] font-semibold ${
                                      detail.severity === "high"
                                        ? "text-rose-500"
                                        : detail.severity === "medium"
                                        ? "text-amber-400"
                                        : "text-blue-400"
                                    }`}
                                  >
                                    {detail.severity === "high" ? "High" : detail.severity === "medium" ? "Medium" : "Low"}
                                  </span>
                                  <span className={`text-[10px] font-mono truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                    &bull; {detail.policyName}
                                  </span>
                                </div>
                                <p className={`text-xs leading-snug line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                  {detail.reason}
                                </p>
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4">
                                <StatusBadge
                                  tone={
                                    claim.status === "Approved"
                                      ? "success"
                                      : claim.status === "Pending"
                                      ? "warning"
                                      : "danger"
                                  }
                                >
                                  {claim.status}
                                </StatusBadge>
                              </td>

                              {/* Action */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setInspectClaim(claim)}
                                    className={`h-7 px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                                      isDark
                                        ? "bg-[#18181D] hover:bg-[#222228] text-zinc-200 border-white/[0.08]"
                                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                                    }`}
                                  >
                                    Inspect Flag
                                  </button>
                                  {claim.status === "Pending" && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleApprove(claim)}
                                        className="h-7 px-2.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium cursor-pointer transition-colors"
                                        title="Approve Claim"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleReject(claim)}
                                        className="h-7 px-2.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-medium cursor-pointer transition-colors"
                                        title="Reject Claim"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: Reports */}
          {activeView === "Reports" && <QuarterlyFinancialStatements />}

          {/* VIEW 6: Policies */}
          {activeView === "Policies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Domestic Flights & Airfare",
                  rules: [
                    "Economy class required for all domestic flights.",
                    "Maximum allowable domestic one-way fare is ₹15,000.",
                    "Bookings should be made at least 7 days prior to travel.",
                  ],
                },
                {
                  title: "Hotel & Accommodations",
                  rules: [
                    "Tier 1 Metro nightly allowance cap is ₹5,500 inclusive of taxes.",
                    "Itemized GST invoice addressed to corporate entity required.",
                    "Personal incidentals (minibar, laundry) are non-reimbursable.",
                  ],
                },
                {
                  title: "Client Meals & Entertainment",
                  rules: [
                    "Capped at ₹3,000 per attendee for client dinners.",
                    "All client attendee names and company affiliations must be noted.",
                    "Daily working travel meal limit is ₹1,500/day.",
                  ],
                },
                {
                  title: "Local Conveyance & Mileage",
                  rules: [
                    "Uber for Business and Ola Prime are preferred ground transport.",
                    "Personal vehicle mileage rate is fixed at ₹12/km.",
                    "Odometer photo log required for road travel claims over 50 km.",
                  ],
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className={`p-5 rounded-xl border transition-colors ${
                    isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                      {p.title}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {p.rules.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="md:hidden shrink-0 border-t bg-white/95 dark:bg-[#131316]/95 backdrop-blur-md border-zinc-200/80 dark:border-white/[0.08] px-2 py-1.5 flex items-center justify-around z-30 select-none">
          <button
            type="button"
            onClick={() => setActiveView("Approvals")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeView === "Approvals" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span className="text-[10px]">Approvals</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("Team Spend")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeView === "Team Spend" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span className="text-[10px]">Team Spend</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("Budgets")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeView === "Budgets" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span className="text-[10px]">Budgets</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <Menu className="h-4 w-4" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>

      {/* Slide-out Claim Inspector Drawer */}
      {inspectClaim && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setInspectClaim(null)}
        >
          <div
            className={`w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 cursor-default ${
              isDark ? "bg-[#111113] text-zinc-100 border-l border-white/[0.08]" : "bg-white text-zinc-900 border-l border-zinc-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b dark:border-white/[0.08] border-zinc-200">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    Claim Details &bull; {inspectClaim.id}
                  </span>
                  <h3 className="text-sm font-semibold mt-0.5 text-zinc-900 dark:text-zinc-100">
                    {inspectClaim.description}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectClaim(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Claim Overview Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className={`p-3 rounded-lg border ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Employee</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <EmployeeAvatar name={inspectClaim.employeeName} department={inspectClaim.department} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {inspectClaim.employeeName}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">{inspectClaim.department}</p>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Cost Center</span>
                  <p className="text-xs font-semibold mt-1 text-zinc-900 dark:text-zinc-100">
                    {inspectClaim.costCenter}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Amount</span>
                  <p className="text-sm font-semibold mt-1 tabular-nums text-zinc-900 dark:text-zinc-100">
                    ₹{inspectClaim.amount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Status</span>
                  <div className="mt-1">
                    <StatusBadge
                      tone={
                        inspectClaim.status === "Approved"
                          ? "success"
                          : inspectClaim.status === "Pending"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {inspectClaim.status}
                    </StatusBadge>
                  </div>
                </div>
              </div>

              {/* Policy Validation Details */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Compliance Audit
                </h4>
                <div className={`p-3.5 rounded-lg border text-xs space-y-2 ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Receipt Attached:</span>
                    <span className={inspectClaim.receiptVerified ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>
                      {inspectClaim.receiptVerified ? "Verified (GST Compliant)" : "Missing / Non-Compliant"}
                    </span>
                  </div>
                  {inspectClaim.receiptVerified && (
                    <div className="flex items-center justify-between pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                      <span className="text-zinc-500">Document:</span>
                      <button
                        type="button"
                        onClick={() => setShowReceiptModal(true)}
                        className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {inspectClaim.receiptName || "View Receipt & Tax Invoice"}
                      </button>
                    </div>
                  )}
                  {inspectClaim.policyNotes && (
                    <div className="flex items-start justify-between pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                      <span className="text-zinc-500">Audit Heuristic:</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right">
                        {inspectClaim.policyNotes}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                    <span className="text-zinc-500">Invoice Voucher:</span>
                    <button
                      type="button"
                      onClick={() => setShowReceiptModal(true)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{inspectClaim.receiptName || "View Tax Invoice & Receipt"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t dark:border-white/[0.08] border-zinc-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setInspectClaim(null)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isDark ? "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.08]" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                }`}
              >
                Close
              </button>
              {inspectClaim.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(inspectClaim)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/25 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Reject Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(inspectClaim)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Approve Claim
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showReceiptModal && inspectClaim && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          claimId={inspectClaim.id}
          receiptName={inspectClaim.receiptName}
          receiptUrl={inspectClaim.receiptUrl}
          merchant={inspectClaim.merchant || inspectClaim.description}
          amount={inspectClaim.amount}
          currency="INR"
          date={inspectClaim.date}
          employeeName={inspectClaim.employeeName}
          category={inspectClaim.category}
        />
      )}
    </div>
  );
}

export default function ManagerDashboardPage() {
  return (
    <ThemeProvider>
      <React.Suspense fallback={<div className="h-screen w-full bg-transparent" />}>
        <ManagerDashboardInner />
      </React.Suspense>
    </ThemeProvider>
  );
}

