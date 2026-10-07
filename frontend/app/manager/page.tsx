"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  CheckSquare,
  Wallet,
  PieChart,
  AlertTriangle,
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
} from "lucide-react";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import { EmployeeAvatar, EmployeeCell } from "@/components/manager/EmployeeAvatar";
import { ThemeProvider, useTheme } from "@/lib/theme-store";

// Modals from shared dashboard suite
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";
import { QuarterlyFinancialStatements } from "@/components/manager/QuarterlyFinancialStatements";

export type ManagerView =
  | "Approvals"
  | "Team Spend"
  | "Budgets"
  | "Exceptions"
  | "Reports"
  | "Policies";

interface ManagerClaim {
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
}

const INITIAL_CLAIMS: ManagerClaim[] = [
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

const DEPARTMENT_BUDGETS = [
  { name: "Engineering", spent: 184200, cap: 220000, members: 14, color: "#2563eb", status: "On Track" },
  { name: "Product & UX", spent: 92400, cap: 120000, members: 6, color: "#10b981", status: "On Track" },
  { name: "Sales & Growth", spent: 68400, cap: 100000, members: 5, color: "#a855f7", status: "On Track" },
  { name: "Marketing", spent: 39500, cap: 60000, members: 3, color: "#f59e0b", status: "Review" },
];

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

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Approvals & Claim State
  const [claims, setClaims] = useState<ManagerClaim[]>(INITIAL_CLAIMS);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectClaim, setInspectClaim] = useState<ManagerClaim | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

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

  const handleApprove = (claim: ManagerClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Approved" as const } : c))
    );
    notify(`Approved ${claim.employeeName}'s claim of ₹${claim.amount.toLocaleString("en-IN")}`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Approved" });
    }
  };

  const handleReject = (claim: ManagerClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Rejected" as const } : c))
    );
    notify(`Rejected ${claim.employeeName}'s claim of ₹${claim.amount.toLocaleString("en-IN")}`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Rejected" });
    }
  };

  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const approvedClaims = claims.filter((c) => c.status === "Approved");
  const rejectedClaims = claims.filter((c) => c.status === "Rejected");

  const totalSpent = claims.reduce((acc, c) => acc + (c.status === "Approved" ? c.amount : 0), 0) + 384500;
  const pendingAmount = pendingClaims.reduce((acc, c) => acc + c.amount, 0);

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
        return "Policy Exceptions & Audit";
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
        isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#FAFAFA] text-zinc-900"
      }`}
    >
      {/* Self-contained Manager Sidebar (Collapsible Rail & Full Expanded View) */}
      <ManagerSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={!sidebarOpen}
        setIsCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Core Manager Header */}
        <ManagerHeader title={getPageTitle()} />

        {/* Scrollable Main Application Space */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
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

          {/* Standardized Flat KPI Cards */}
          <section aria-label="Manager Key Metrics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Team Spend */}
              <div
                onClick={() => setActiveView("Team Spend")}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer border ${
                  isDark
                    ? "bg-[#111113] border-white/[0.08] hover:bg-[#161619] hover:border-white/15 shadow-sm"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}>
                    Team Total Spend
                  </span>
                  <Wallet className={`h-[18px] w-[18px] shrink-0 stroke-[1.75] ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`} />
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-[32px] font-bold tracking-tight tabular-nums leading-none ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                    style={{ fontSize: "32px", lineHeight: "1" }}
                  >
                    ₹3,84,500
                  </span>
                </div>
              </div>

              {/* Card 2: Awaiting Approval */}
              <div
                onClick={() => setActiveView("Approvals")}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer border ${
                  isDark
                    ? "bg-[#111113] border-white/[0.08] hover:bg-[#161619] hover:border-white/15 shadow-sm"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}>
                    Awaiting Verification
                  </span>
                  <Clock className={`h-[18px] w-[18px] shrink-0 stroke-[1.75] ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`} />
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-[32px] font-bold tracking-tight tabular-nums leading-none ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                    style={{ fontSize: "32px", lineHeight: "1" }}
                  >
                    {pendingClaims.length}
                  </span>
                </div>
              </div>

              {/* Card 3: Approved This Month */}
              <div
                onClick={() => setActiveView("Approvals")}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer border ${
                  isDark
                    ? "bg-[#111113] border-white/[0.08] hover:bg-[#161619] hover:border-white/15 shadow-sm"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}>
                    Approved This Month
                  </span>
                  <CheckCircle2 className={`h-[18px] w-[18px] shrink-0 stroke-[1.75] ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`} />
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-[32px] font-bold tracking-tight tabular-nums leading-none ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                    style={{ fontSize: "32px", lineHeight: "1" }}
                  >
                    ₹2,48,200
                  </span>
                </div>
              </div>

              {/* Card 4: Policy Exceptions */}
              <div
                onClick={() => setActiveView("Exceptions")}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 cursor-pointer border ${
                  isDark
                    ? "bg-[#111113] border-white/[0.08] hover:bg-[#161619] hover:border-white/15 shadow-sm"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}>
                    Policy Exceptions
                  </span>
                  <AlertTriangle className={`h-[18px] w-[18px] shrink-0 stroke-[1.75] ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`} />
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-[32px] font-bold tracking-tight tabular-nums leading-none ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                    style={{ fontSize: "32px", lineHeight: "1" }}
                  >
                    3
                  </span>
                </div>
              </div>
            </div>
          </section>

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

                {/* Search */}
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
              </div>

              {/* Flat Table */}
              <div className="overflow-x-auto px-2 pb-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`text-xs font-medium border-b ${
                        isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
                      }`}
                    >
                      <th className="py-3 px-4 font-medium">Claim ID</th>
                      <th className="py-3 px-4 font-medium">Employee</th>
                      <th className="py-3 px-4 font-medium">Cost Center</th>
                      <th className="py-3 px-4 font-medium">Description</th>
                      <th className="py-3 px-4 font-medium text-right">Amount</th>
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium text-right">1-Click Actions</th>
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
                          <td className="py-3 px-4 font-mono text-xs text-zinc-400">
                            {claim.id}
                          </td>
                          <td className="py-3 px-4">
                            <EmployeeCell
                              name={claim.employeeName}
                              department={claim.department}
                            />
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-zinc-500">
                            {claim.costCenter}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-zinc-700 dark:text-zinc-300">
                            {claim.description}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                            ₹{claim.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 text-xs text-zinc-500 whitespace-nowrap">
                            {claim.date}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
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
                          <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                  {DEPARTMENT_BUDGETS.map((dept) => {
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
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                              {dept.name}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500">{dept.members} Submitters</span>
                        </div>

                        <div className="flex items-baseline justify-between mt-3">
                          <span className="text-xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
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
                          <span
                            className={
                              percent > 85 ? "text-amber-500 font-medium" : "text-emerald-500 font-medium"
                            }
                          >
                            {dept.status}
                          </span>
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
                {DEPARTMENT_BUDGETS.map((dept) => {
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
                        <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
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
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            percent > 80
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}
                        >
                          {percent > 80 ? "Near Threshold" : "Healthy Buffer"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: Exceptions */}
          {activeView === "Exceptions" && (
            <div
              className={`rounded-xl overflow-hidden transition-colors border ${
                isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
              }`}
            >
              <div
                className={`p-5 flex items-center justify-between border-b ${
                  isDark ? "border-white/[0.06]" : "border-zinc-200/60"
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Policy Violation Exceptions Requiring Review
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Flagged by Payout automated compliance heuristics.
                  </p>
                </div>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                    isDark ? "bg-[#18181D] text-zinc-300 border-white/[0.08]" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                  }`}
                >
                  Compliance: 98.6%
                </span>
              </div>

              <div className="divide-y text-[13px] dark:divide-white/[0.04] divide-zinc-200/60">
                <div className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        CLM-8827 &bull; Rohan Kapoor
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Claimed ₹7,200 for weekend private car upgrade without manager pre-authorization.
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <PriorityBadge level="high">High Severity</PriorityBadge>
                        <span className="text-[11px] text-zinc-400">Policy: Local Conveyance 4.2</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const c = claims.find((i) => i.id === "CLM-8827");
                      if (c) setInspectClaim(c);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                      isDark
                        ? "bg-[#18181D] hover:bg-[#202026] text-zinc-200 border-white/[0.08]"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    Inspect Flag
                  </button>
                </div>

                <div className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                }`}>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        CLM-8823 &bull; Arjun Reddy
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        Client dinner claim (₹6,800) is close to the per-event executive entertainment cap.
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <PriorityBadge level="medium">Medium Severity</PriorityBadge>
                        <span className="text-[11px] text-zinc-400">Policy: Meals & Per Diem 3.1</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const c = claims.find((i) => i.id === "CLM-8823");
                      if (c) setInspectClaim(c);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                      isDark
                        ? "bg-[#18181D] hover:bg-[#202026] text-zinc-200 border-white/[0.08]"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    Inspect Flag
                  </button>
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
                  <h3 className="text-base font-semibold mt-0.5 text-zinc-900 dark:text-zinc-100">
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
                  <p className="text-sm font-bold mt-1 tabular-nums text-zinc-900 dark:text-zinc-100">
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
                  {inspectClaim.policyNotes && (
                    <div className="flex items-start justify-between pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                      <span className="text-zinc-500">Audit Heuristic:</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right">
                        {inspectClaim.policyNotes}
                      </span>
                    </div>
                  )}
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
    </div>
  );
}

export default function ManagerDashboardPage() {
  return (
    <React.Suspense fallback={<div className="h-screen w-full bg-transparent" />}>
      <ManagerDashboardInner />
    </React.Suspense>
  );
}

