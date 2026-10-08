"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  X,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building2,
  Download,
  RefreshCw,
} from "lucide-react";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";
import { EmployeeAvatar, EmployeeCell } from "@/components/manager/EmployeeAvatar";
import { ThemeProvider, useTheme } from "@/lib/theme-store";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";
import { useRouter } from "next/navigation";
import {
  fetchManagerClaims,
  approveManagerClaim,
  rejectManagerClaim,
} from "@/lib/manager-api";

interface ApprovalClaim {
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
  merchant: string;
  gstNumber?: string;
  policyNotes?: string;
}

const INITIAL_APPROVAL_CLAIMS: ApprovalClaim[] = [
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
    merchant: "IndiGo Airlines Ltd",
    gstNumber: "29AABCU9603R1ZX",
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
    merchant: "Hyatt Hotels India",
    gstNumber: "27AAACH2133D1ZK",
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
    merchant: "The Table Colaba",
    gstNumber: "27AABCT4321P1Z9",
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
    merchant: "Uber India Technology",
    gstNumber: "29AABCU9603R1ZX",
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
    merchant: "Lambda Labs Inc",
    gstNumber: "9917USA290021Z4",
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
    merchant: "Amazon Commercial Services",
    gstNumber: "27AAACA6527R1ZU",
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
    merchant: "Avis Rent-A-Car",
    policyNotes: "Exceeds personal car rental ceiling",
  },
];

function ApprovalsPageInner() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Claims & Inspection
  const [claims, setClaims] = useState<ApprovalClaim[]>(INITIAL_APPROVAL_CLAIMS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectClaim, setInspectClaim] = useState<ApprovalClaim | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const fetched = await fetchManagerClaims();
      if (fetched && fetched.length > 0) {
        setClaims(fetched as any);
      }
    } catch (e) {
      console.warn("Backend claims fetch notice:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
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

  const handleApprove = async (claim: ApprovalClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Approved" as const } : c))
    );
    notify(`Approved claim ${claim.id} for ${claim.employeeName} (₹${claim.amount.toLocaleString("en-IN")})`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Approved" });
    }

    try {
      await approveManagerClaim(claim.id, "Approved by Manager");
    } catch (e) {
      console.warn("Backend approve notice:", e);
    }
  };

  const handleReject = async (claim: ApprovalClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "Rejected" as const } : c))
    );
    notify(`Rejected claim ${claim.id} for ${claim.employeeName}`);
    if (inspectClaim?.id === claim.id) {
      setInspectClaim({ ...claim, status: "Rejected" });
    }

    try {
      await rejectManagerClaim(claim.id, "Policy non-compliance or unauthorized expense");
    } catch (e) {
      console.warn("Backend reject notice:", e);
    }
  };

  const pendingCount = claims.filter((c) => c.status === "Pending").length;
  const approvedCount = claims.filter((c) => c.status === "Approved").length;
  const rejectedCount = claims.filter((c) => c.status === "Rejected").length;

  const filteredClaims = claims.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch =
      c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors ${
        isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#FAFAFA] text-zinc-900"
      }`}
    >
      {/* Self-contained Manager Sidebar */}
      <ManagerSidebar
        activeView="Approvals"
        setActiveView={(label) => {
          if (label !== "Approvals") {
            router.push(`/manager?view=${encodeURIComponent(label)}`);
          }
        }}
        isCollapsed={!sidebarOpen}
        setIsCollapsed={(collapsed) => setSidebarOpen(!collapsed)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Workspace */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden min-w-0 ${
        isDark ? "bg-[#09090B]" : "bg-[#FAFAFA]"
      }`}>
        <ManagerHeader
          title="Manager Approvals"
          rightContent={
            <div className="flex items-center gap-2">
              <Link
                href="/manager"
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-medium ${
                  isDark
                    ? "bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-white/[0.08]"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                }`}
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Cockpit</span>
              </Link>
            </div>
          }
        />

        <main className={`flex-1 overflow-y-auto overscroll-contain p-6 space-y-6 ${
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

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setStatusFilter("Pending")}
              className={`rounded-xl px-5 py-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                statusFilter === "Pending"
                  ? isDark
                    ? "bg-[#161619] border-white/20 shadow-sm"
                    : "bg-zinc-50 border-zinc-400 shadow-xs"
                  : isDark
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
                  {pendingCount}
                </span>
              </div>
            </div>

            <div
              onClick={() => setStatusFilter("Approved")}
              className={`rounded-xl px-5 py-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                statusFilter === "Approved"
                  ? isDark
                    ? "bg-[#161619] border-white/20 shadow-sm"
                    : "bg-zinc-50 border-zinc-400 shadow-xs"
                  : isDark
                  ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                  : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Approved Claims
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
                  {approvedCount}
                </span>
              </div>
            </div>

            <div
              onClick={() => setStatusFilter("Rejected")}
              className={`rounded-xl px-5 py-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                statusFilter === "Rejected"
                  ? isDark
                    ? "bg-[#161619] border-white/20 shadow-sm"
                    : "bg-zinc-50 border-zinc-400 shadow-xs"
                  : isDark
                  ? "bg-[#111113] border-white/[0.07] hover:bg-[#161619]"
                  : "bg-white border-zinc-200/80 hover:bg-zinc-50/80 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Returned / Rejected
                </span>
                <XCircle className={`h-4 w-4 shrink-0 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`} />
              </div>
              <div className="mt-3.5 flex items-center">
                <span
                  className={`text-[26px] font-semibold tracking-tight tabular-nums leading-none ${
                    isDark ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {rejectedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Main Table Container */}
          <div
            className={`rounded-xl overflow-hidden transition-colors border ${
              isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            {/* Toolbar */}
            <div
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${
                isDark ? "border-white/[0.06]" : "border-zinc-200/60"
              }`}
            >
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
                    placeholder="Filter by name, claim ID, or dept..."
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

            {/* Table */}
            <div className="overflow-x-auto px-2 pb-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`text-xs font-medium border-b ${
                      isDark ? "text-zinc-400 border-white/[0.06]" : "text-zinc-500 border-zinc-200/60"
                    }`}
                  >
                    <th className="py-2.5 px-4 font-medium">Claim ID</th>
                    <th className="py-2.5 px-4 font-medium">Employee</th>
                    <th className="py-2.5 px-4 font-medium">Category</th>
                    <th className="py-2.5 px-4 font-medium">Description</th>
                    <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                    <th className="py-2.5 px-4 font-medium">Date</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-[13px] ${isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"}`}>
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-zinc-500">
                        No approval claims found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredClaims.map((claim) => (
                      <tr
                        key={claim.id}
                        onClick={() => setInspectClaim(claim)}
                        className={`transition-colors cursor-pointer ${
                          isDark ? "hover:bg-white/[0.03]" : "hover:bg-zinc-50/80"
                        }`}
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
                        <td className="py-2.5 px-4 text-xs text-zinc-600 dark:text-zinc-300">
                          {claim.category}
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
                            {claim.status}
                          </StatusBadge>
                        </td>
                        <td className="py-2.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {claim.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApprove(claim)}
                                className="text-xs font-medium px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/25 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(claim)}
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
                              Inspect
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
                  <p className="text-xs font-semibold mt-1 text-zinc-900 dark:text-zinc-100 font-mono">
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

              {/* Merchant & GST Compliance */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Tax & Invoice Details
                </h4>
                <div className={`p-3.5 rounded-lg border text-xs space-y-2.5 ${isDark ? "bg-[#161619] border-white/[0.05]" : "bg-zinc-50 border-zinc-200/80"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Merchant / Vendor:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{inspectClaim.merchant}</span>
                  </div>
                  {inspectClaim.gstNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">GSTIN / Tax ID:</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-100">{inspectClaim.gstNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                    <span className="text-zinc-500">Audit Status:</span>
                    <span className={inspectClaim.receiptVerified ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>
                      {inspectClaim.receiptVerified ? "Original Tax Invoice Attached" : "Missing Receipt"}
                    </span>
                  </div>
                  {inspectClaim.policyNotes && (
                    <div className="pt-2 border-t dark:border-white/[0.06] border-zinc-200/60">
                      <span className="text-zinc-500 block mb-0.5">Policy Assessment:</span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                        {inspectClaim.policyNotes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
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

export default function ApprovalsPage() {
  return (
    <ThemeProvider>
      <ApprovalsPageInner />
    </ThemeProvider>
  );
}

