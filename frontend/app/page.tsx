"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Search, 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Receipt,
  Users,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  Check,
  CheckCircle2,
  Lock,
  Zap,
  Layers,
  BarChart3,
  Clock,
  Sparkles,
  FileText,
  Sliders,
  Shield,
  Activity,
  Cpu
} from "lucide-react";
import { HeroAmbientBackground } from "@/components/shared";

const ROLE_OPTIONS = [
  {
    value: "/employee",
    label: "Employee Portal",
    badge: "Submit & Track",
    desc: "Neural OCR receipt scanner, claim assembly & payout status",
    icon: Receipt,
    color: "text-emerald-700 bg-emerald-50 border border-emerald-200/80",
  },
  {
    value: "/management",
    label: "Management Portal",
    badge: "Approvals & Audit",
    desc: "Policy exception adjudication, budget caps & 1-click approvals",
    icon: Users,
    color: "text-indigo-700 bg-indigo-50 border border-indigo-200/80",
  },
  {
    value: "/finance",
    label: "Finance Portal",
    badge: "Clearinghouse",
    desc: "Treasury disbursement batches, bank UTR ledger & ERP reconciliation",
    icon: Building2,
    color: "text-teal-700 bg-teal-50 border border-teal-200/80",
  },
];

/* ── Interactive Desktop Cockpit Sub-Views ─────────────────────────────────── */

function EmployeeWorkspaceView() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 p-3.5 sm:p-4 text-left">
      {/* Left: Neural OCR Document Inspector */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3.5 sm:p-4 flex flex-col justify-between relative overflow-hidden min-w-0">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-200 tracking-wide uppercase">
              Neural OCR Scanner
            </span>
          </div>
          <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/50">
            99.8% Match
          </span>
        </div>

        {/* Realistic Invoice Document Preview with Bounding Box Highlights */}
        <div className="my-3 bg-slate-950/90 rounded-xl p-3 border border-slate-800/70 font-mono text-[10px] leading-relaxed relative">
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-2 mb-2">
            <div>
              <p className="text-white font-bold text-[11px] tracking-tight">AWS Cloud Services</p>
              <p className="text-slate-400 text-[9px]">Invoice #INV-2026-981</p>
            </div>
            <div className="text-right">
              <span className="inline-block text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/40">
                GSTIN MATCHED
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="p-1 rounded bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
              <span className="text-slate-300">GSTIN: 29AABCS1429B1Z</span>
              <span className="text-[8px] text-emerald-400 font-sans font-semibold">Valid</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[9px] px-1">
              <span>Compute (c6i.4xlarge)</span>
              <span className="text-slate-200 font-medium">₹21,093.22</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[9px] px-1">
              <span>CGST + SGST (18%)</span>
              <span className="text-slate-200 font-medium">₹3,796.78</span>
            </div>
            <div className="p-1.5 rounded bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-between mt-1">
              <span className="text-emerald-300 font-bold">Total Paid</span>
              <span className="text-emerald-300 font-bold text-[11px]">₹24,890.00</span>
            </div>
          </div>

          {/* SHA-256 Anti-Fraud Verification Badge */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[8px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="truncate">Hash: 8f9b4...2a19 (Zero duplicate)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span>Target Category</span>
          <span className="text-slate-200 font-medium">Cloud Infrastructure</span>
        </div>
      </div>

      {/* Right: Normalized Claim Entry & Policy Evaluation */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Normalized Claim Entry</h4>
              <p className="text-[10px] text-slate-400">Synthesized from raw receipt</p>
            </div>
            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40 flex items-center gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> Auto-Assembled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-3">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Merchant</span>
              <span className="block text-[11px] font-bold text-slate-100 mt-0.5">AWS India</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Total Claim</span>
              <span className="block text-[11px] font-mono font-bold text-emerald-400 mt-0.5">₹24,890.00</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
              <span className="block text-[9px] uppercase font-bold text-slate-500">Department</span>
              <span className="block text-[11px] font-bold text-slate-100 mt-0.5">Engineering</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
              <span className="block text-[9px] uppercase font-bold text-slate-500">GST Input Credit</span>
              <span className="block text-[11px] font-mono font-bold text-teal-400 mt-0.5">₹3,796.78</span>
            </div>
          </div>

          {/* Policy Guardrails Status Check */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-2.5 flex items-start gap-2 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-emerald-300">Policy: Passed</p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Within monthly Engineering Cloud cap (₹50,000 limit).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Action Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">Status: Ready</span>
          <button
            type="button"
            onClick={() => setSubmitted(!submitted)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              submitted 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {submitted ? (
              <>
                <Check className="h-3 w-3 stroke-[3]" />
                <span>Claim #9021 Submitted</span>
              </>
            ) : (
              <>
                <span>Submit for Signoff</span>
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ManagerAuditView() {
  const [approvedIds, setApprovedIds] = useState<number[]>([1]);

  const toggleApproval = (id: number) => {
    setApprovedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full p-3.5 sm:p-4 text-left space-y-3.5">
      {/* Top Department Budget Velocity Bar */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Department Audit</span>
            <h4 className="text-xs font-bold text-white tracking-tight mt-0.5">Engineering Q4 Budget Velocity</h4>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-bold text-emerald-400">₹18,42,000</span>
            <span className="text-slate-400 text-[10px] font-mono"> / ₹25.0L (73.6%)</span>
          </div>
        </div>

        <div className="mt-2.5">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[73.68%]" />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
            <span>₹6,58,000 remaining</span>
            <span className="text-emerald-400 font-medium">Optimal Velocity · 47 Days Left</span>
          </div>
        </div>
      </div>

      {/* Approval Docket List */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3 sm:p-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
          <span className="text-[11px] font-bold text-slate-200">Pending Review Queue (3 items)</span>
          <span className="text-[9px] font-mono text-slate-400">Priority Sorted</span>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                AS
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-100 truncate">Aditi Sharma · Staff Infra</span>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/40">
                    Compliant
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 truncate">AWS Compute Cluster · #98124</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-white">₹24,890</span>
              <button
                type="button"
                onClick={() => toggleApproval(1)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  approvedIds.includes(1)
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {approvedIds.includes(1) ? "✓ Approved" : "Signoff"}
              </button>
            </div>
          </div>

          {/* Item 2: Policy Exception */}
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-amber-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                RV
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-100 truncate">Rahul Verma · Product</span>
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-950/80 px-1 py-0.5 rounded border border-amber-800/40 flex items-center gap-0.5">
                    <AlertTriangle className="h-2 w-2" /> +₹3.2k Cap
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 truncate">Client Hospitality · Pre-authorized</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-white">₹8,200</span>
              <button
                type="button"
                onClick={() => toggleApproval(2)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  approvedIds.includes(2)
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-amber-600 hover:bg-amber-500 text-white"
                }`}
              >
                {approvedIds.includes(2) ? "✓ Approved" : "Override"}
              </button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                RP
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-100 truncate">Rohan Patel · Tech Lead</span>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/40">
                    Compliant
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 truncate">BLR → DEL On-site Travel Fare</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-white">₹12,400</span>
              <button
                type="button"
                onClick={() => toggleApproval(3)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  approvedIds.includes(3)
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {approvedIds.includes(3) ? "✓ Approved" : "Signoff"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceSettlementView() {
  const [batchSettled, setBatchSettled] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 p-3.5 sm:p-4 text-left">
      {/* Left: Treasury Liquidity & Rail Summary */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Treasury Clearinghouse</span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/40">
              NEFT / RTGS Live
            </span>
          </div>

          <div className="my-3 space-y-2.5">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/70">
              <span className="text-[9px] text-slate-400 font-medium">Pending Treasury Disbursement</span>
              <p className="text-lg font-mono font-extrabold text-white mt-0.5">₹1,48,200.00</p>
              <span className="text-[9px] text-emerald-400">14 Verified Claims Across 3 Teams</span>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/70">
              <span className="text-[9px] text-slate-400 font-medium">Active Bank Account</span>
              <p className="text-[11px] font-bold text-slate-200 mt-0.5">HDFC Corporate Virtual Account</p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">VA-HDFC-9948201 · ₹84.20 Lakhs</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-2 flex items-center gap-1.5 text-[9px] text-emerald-300">
          <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
          <span>Zero ledger reconciliation drift</span>
        </div>
      </div>

      {/* Right: Disbursement Batches & UTR Hashing */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800/90 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2.5">
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Active Settlement Batches</h4>
              <p className="text-[10px] text-slate-400">Direct banking transmission</p>
            </div>
            <span className="text-[9px] font-mono text-slate-400">ERP Synced</span>
          </div>

          <div className="space-y-2.5">
            {/* Batch 1: Cleared */}
            <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-white">#BATCH-8402 (NEFT)</span>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/40">
                    Cleared
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">₹82,400</span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>UTR: 2026-HDFC-9842104</span>
                <span className="text-slate-300 font-sans">8 Accounts Disbursed</span>
              </div>
            </div>

            {/* Batch 2: Interactive Settlement */}
            <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-white">#BATCH-8403 (RTGS)</span>
                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${
                    batchSettled
                      ? "text-emerald-400 bg-emerald-950/80 border-emerald-800/40"
                      : "text-amber-400 bg-amber-950/80 border-amber-800/40"
                  }`}>
                    {batchSettled ? "Cleared" : "Ready"}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-white">₹65,800</span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>{batchSettled ? "UTR: 2026-HDFC-9842105" : "Bank File Ready"}</span>
                <span className="text-slate-300 font-sans">6 Accounts Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">Gateway: HDFC API</span>
          <button
            type="button"
            onClick={() => setBatchSettled(!batchSettled)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              batchSettled
                ? "bg-emerald-500 text-slate-950"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {batchSettled ? (
              <>
                <Check className="h-3 w-3 stroke-[3]" />
                <span>UTR Stamped</span>
              </>
            ) : (
              <>
                <span>Disburse Batch</span>
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Landing Page Component ───────────────────────────────────────────── */

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState("/employee");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState<"employee" | "manager" | "finance">("employee");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = ROLE_OPTIONS.find((opt) => opt.value === selectedRole) || ROLE_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 selection:bg-emerald-500 selection:text-white font-sans antialiased flex flex-col">
      
      {/* ── Top Navbar (Edge-to-Edge Desktop Navigation) ──────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between border-b border-slate-100/90 sticky top-0 z-40 bg-white/90 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-600 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/20 border border-slate-700/40">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            FinPulse
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
          <Link href="/employee" className="hover:text-emerald-800 transition-colors">
            Employee Portal
          </Link>
          <Link href="/management" className="hover:text-emerald-800 transition-colors">
            Manager Audit
          </Link>
          <Link href="/finance" className="hover:text-emerald-800 transition-colors">
            Finance Treasury
          </Link>
          <a href="#capabilities" className="hover:text-emerald-800 transition-colors">
            Capabilities
          </a>
          <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">
            Orchestration
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/employee"
            className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
          >
            Launch System
          </Link>
        </div>
      </header>

      {/* ── Hero Section (Title on One Side + Desktop Cockpit on the Other) ── */}
      <main className="w-full relative flex flex-col items-center justify-start pt-10 sm:pt-14 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Hairline Dot Matrix Background (Clean, No 3D Shapes) */}
        <HeroAmbientBackground />

        {/* 2-Column Asymmetric Grid: Title on Left Side, App Cockpit on Right Side */}
        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (lg:col-span-5): Title, Value Prop & Portal Switcher ON ONE SIDE */}
          <div className={`relative w-full min-w-0 lg:col-span-5 flex flex-col items-start text-left transition-all ${isDropdownOpen ? "z-50" : "z-30"}`}>
            
            {/* Security & Standard Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/5 border border-slate-200 text-slate-600 text-[11px] font-semibold mb-5 whitespace-nowrap shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>SOC-2 Type II Certified · Sub-Second OCR</span>
            </div>

            {/* Punchy Industry Headline on ONE SIDE */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] font-extrabold tracking-tight text-slate-950 leading-[1.1] text-left">
              Enterprise expenses.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900">
                Deterministic accuracy.
              </span>
            </h1>

            {/* Value Proposition Description */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg text-left">
              FinPulse eliminates manual reimbursement friction with neural receipt extraction, deterministic policy adjudication, and instant UTR bank settlement in a single unified platform.
            </p>

            {/* Portal Switcher Capsule with Luxury Dropdown */}
            <div ref={dropdownRef} className="relative mt-7 w-full max-w-md z-50">
              <div className="w-full bg-white rounded-full p-1.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex-1 flex items-center justify-between pl-3 pr-2 py-1 text-left cursor-pointer group rounded-full focus:outline-none"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${activeOption.color}`}>
                      <ActiveIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {activeOption.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium truncate">
                        {activeOption.badge}
                      </span>
                    </div>
                  </div>

                  <div className="pl-2 pr-1 text-slate-400 group-hover:text-slate-700 transition-colors">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </div>
                </button>

                <Link
                  href={selectedRole}
                  className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shrink-0 inline-flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <span>Launch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-2xl border border-slate-200/95 rounded-3xl p-2 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] z-50 overflow-hidden ring-1 ring-black/5"
                  >
                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Target Operational Tier
                    </div>
                    <div className="space-y-1 mt-1">
                      {ROLE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedRole === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setSelectedRole(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                              isSelected
                                ? "bg-emerald-50/70 border border-emerald-100"
                                : "hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${option.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${isSelected ? "text-emerald-950" : "text-slate-900"}`}>
                                    {option.label}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/60">
                                    {option.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                  {option.desc}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Performance & Trust Tags on the Title Side */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>99.8% Field Extraction</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Direct Bank Rails</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero Drift</span>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-7): The Interactive Desktop Cockpit */}
          <div className="relative z-20 w-full min-w-0 lg:col-span-7">
            {/* Subtle Ambient Floor Reflection */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900/30 rounded-3xl blur-2xl opacity-40 -z-10" />

            {/* The Desktop Application Showcase Window */}
            <div className="w-full bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)] overflow-hidden">
              
              {/* macOS / Web Application Window Chrome */}
              <div className="w-full bg-slate-900/90 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 backdrop-blur-md">
                {/* Left: Window Controls & Mini Route Bar */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
                    <Lock className="h-2.5 w-2.5 text-emerald-400" />
                    <span className="text-slate-300">finpulse.internal</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-emerald-400">{showcaseTab}</span>
                  </div>
                </div>

                {/* Center: Live Interactive Showcase Tab Switchers */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800/90 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowcaseTab("employee")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      showcaseTab === "employee"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Receipt className="h-3 w-3 text-emerald-400" />
                    <span>Employee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowcaseTab("manager")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      showcaseTab === "manager"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Users className="h-3 w-3 text-indigo-400" />
                    <span>Manager</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowcaseTab("finance")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      showcaseTab === "finance"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Building2 className="h-3 w-3 text-teal-400" />
                    <span>Finance</span>
                  </button>
                </div>

                {/* Right: Live Sync Indicator */}
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">18ms</span>
                </div>
              </div>

              {/* Showcase Viewport */}
              <div className="w-full bg-[#090d16] min-h-[350px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {showcaseTab === "employee" && (
                    <motion.div
                      key="employee-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EmployeeWorkspaceView />
                    </motion.div>
                  )}

                  {showcaseTab === "manager" && (
                    <motion.div
                      key="manager-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ManagerAuditView />
                    </motion.div>
                  )}

                  {showcaseTab === "finance" && (
                    <motion.div
                      key="finance-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FinanceSettlementView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* ── Enterprise Performance Metrics Strip ────────────────────────── */}
        <div className="relative z-10 mt-14 sm:mt-16 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="p-2">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
                99.8%
              </span>
              <span className="block text-xs font-semibold text-slate-600 mt-1">
                OCR Field Extraction Accuracy
              </span>
            </div>
            <div className="p-2 border-l border-slate-200/80">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">
                &lt; 4.2 hrs
              </span>
              <span className="block text-xs font-semibold text-slate-600 mt-1">
                Average Reimbursement Turnaround
              </span>
            </div>
            <div className="p-2 border-t md:border-t-0 md:border-l border-slate-200/80">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
                100%
              </span>
              <span className="block text-xs font-semibold text-slate-600 mt-1">
                Deterministic Policy Enforcement
              </span>
            </div>
            <div className="p-2 border-t md:border-t-0 border-l border-slate-200/80">
              <span className="block text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono tracking-tight">
                ₹0 Drift
              </span>
              <span className="block text-xs font-semibold text-slate-600 mt-1">
                General Ledger Reconciliation
              </span>
            </div>
          </div>
        </div>

        {/* ── Enterprise Ecosystem Trust Strip ───────────────────────────── */}
        <div className="relative z-10 mt-10 text-center w-full max-w-5xl mx-auto">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">
            Designed for high-throughput finance teams, fast-growing startups & enterprise controllers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm tracking-tight grayscale opacity-70">
            <span className="hover:text-slate-800 transition-colors">Stripe Connect</span>
            <span className="hover:text-slate-800 transition-colors">Tally Prime</span>
            <span className="hover:text-slate-800 transition-colors">HDFC Corporate</span>
            <span className="hover:text-slate-800 transition-colors">NetSuite ERP</span>
            <span className="hover:text-slate-800 transition-colors">Zoho Books</span>
            <span className="hover:text-slate-800 transition-colors">SAP S/4HANA</span>
          </div>
        </div>
      </main>

      {/* ── Platform Capabilities Bento Grid ──────────────────────────────── */}
      <section id="capabilities" className="w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              Engineered for Deterministic Financial Control.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Four architectural pillars designed to eliminate reimbursement leakages and audit overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Neural OCR Engine (Span 2) */}
            <div className="md:col-span-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-7 text-white border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/50">
                  Sub-Second Extraction
                </span>
                <span className="text-xs font-mono text-slate-400">SHA-256 Protected</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Neural Receipt Parsing & Anti-Fraud Fingerprinting
                </h3>
                <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                  Extracts vendor name, GSTIN, line-item totals, and tax breakdowns in under 800ms. Every receipt image is cryptographically fingerprinted to eliminate duplicate submissions across the entire organization.
                </p>
              </div>

              {/* Micro Visual */}
              <div className="mt-6 bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Line Extraction</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">Automated Itemization</p>
                  <span className="text-[9px] text-slate-500">Subtotal + GST calculated</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">GSTIN Engine</span>
                  <p className="text-xs font-bold text-teal-400 mt-0.5">Direct Verification</p>
                  <span className="text-[9px] text-slate-500">Government portal matched</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Duplicate Guard</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">Zero Double Dipping</p>
                  <span className="text-[9px] text-slate-500">Image hash ledger verified</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Deterministic Policy Guardrails (Span 1) */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  Deterministic Policy Guardrails
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Configure department spending velocity, per-diem dining limits, and category caps. Submissions violating caps trigger mandatory executive justification prior to sign-off.
                </p>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Policy Enforcer</span>
                  <span className="text-emerald-600">Active</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Soft warnings prompt justification; hard ceilings reject submission automatically.
                </p>
              </div>
            </div>

            {/* Bento Card 3: 1-Click Signoff Hierarchy (Span 1) */}
            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                  Cryptographic Sign-off Matrix
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Tiered manager and director approvals with contextual spend history. Every sign-off event is stamped with employee identity, role, timestamp, and audit trail.
                </p>
              </div>

              <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Signoff Traceability</span>
                  <span className="text-indigo-600">Tamper-Proof</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Full lineage inspection from employee upload to manager signoff.
                </p>
              </div>
            </div>

            {/* Bento Card 4: Direct UTR Settlement (Span 2) */}
            <div className="md:col-span-2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-7 text-white border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800/50">
                  Bank Rails & Clearing
                </span>
                <span className="text-xs font-mono text-slate-400">Zero Reconciliation Drift</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Direct UTR Bank Settlement & ERP Journal Sync
                </h3>
                <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                  Eliminate manual payment files. Batch-approve reimbursements directly through corporate banking rails (NEFT / RTGS) with instant UTR transaction hashing and automatic general ledger reconciliation.
                </p>
              </div>

              {/* Micro Visual */}
              <div className="mt-6 bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Batch #SET-8402 Executed</span>
                    <span className="block text-[10px] font-mono text-slate-400">UTR-2026-HDFC-9842104 · ₹82,400 Cleared</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/40">
                    ERP Reconciled
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3-Stage Orchestration Pipeline ("How FinPulse Works") ───────── */}
      <section id="how-it-works" className="w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-slate-50/70">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              ORCHESTRATION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              From Receipt Capture to Bank Settlement in 3 Steps.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              A synchronized, deterministic chain connecting employees, team managers, and the finance treasury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-extrabold text-slate-300">01</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Capture & Parse
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Employee Submits & OCR Parses
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Employees snap receipts or upload tax invoices. The neural OCR instantly parses merchant, GSTIN, dates, and amounts with 99.8% field accuracy while checking for duplicates.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" /> Under 800ms extraction
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-extrabold text-slate-300">02</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Policy Adjudication
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Manager Audits Exceptions
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Submissions are automatically matched against departmental quarterly budgets. Managers execute 1-click batch approvals or review policy exception justifications with complete spend context.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-indigo-700 font-semibold flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" /> Cryptographic sign-off stamp
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-extrabold text-slate-300">03</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    Treasury Clearing
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Finance Settles via Direct Rails
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Finance generates batch payout files and executes NEFT/RTGS disbursements directly through corporate bank accounts. Bank UTR numbers are captured and reconciled with zero accounting drift.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-mono text-teal-700 font-semibold flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" /> Instant UTR hash logging
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Operational Portals Launch Grid ──────────────────────────────── */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              OPERATIONAL TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              One Unified System. Three Dedicated Portals.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select your role to access purpose-built workspaces designed for each stage of expense management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Card 1: Employee */}
            <Link
              href="/employee"
              className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-[32px] p-7 text-white border border-slate-800 shadow-xl shadow-slate-950/10 relative overflow-hidden flex flex-col justify-between min-h-[440px] group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 inline-block mb-3">
                  Capture & Track
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Employee Portal
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  Submit itemized expense claims, snap digital receipts, and track reimbursement milestones with zero friction.
                </p>
              </div>

              {/* In-app Preview Card */}
              <div className="my-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Recent Claim</span>
                  <span className="text-[10px] font-mono text-emerald-400">99.8% Match</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">Cloud Hosting (AWS)</p>
                    <p className="text-[10px] text-slate-400">GSTIN Verified</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">₹24,890</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">Employee Workspace</span>
                <div className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Card 2: Management */}
            <Link
              href="/management"
              className="bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b0f19] rounded-[32px] p-7 text-white border border-slate-800 shadow-xl shadow-slate-950/10 relative overflow-hidden flex flex-col justify-between min-h-[440px] group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 inline-block mb-3">
                  Audit & Approvals
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Manager Portal
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  Audit team submissions, adjudicate policy exception warnings, and protect quarterly budgets in real-time.
                </p>
              </div>

              {/* In-app Preview Card */}
              <div className="my-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Department Velocity</span>
                  <span className="text-[10px] font-mono text-emerald-400">73.6% Spent</span>
                </div>
                <div className="mt-2.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[73.6%]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Optimal spend pacing across Q4</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">Manager Review</span>
                <div className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-indigo-400 group-hover:text-slate-950 transition-all shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Card 3: Finance */}
            <Link
              href="/finance"
              className="bg-gradient-to-b from-[#064e3b]/80 via-[#022c22] to-[#090d16] rounded-[32px] p-7 text-white border border-emerald-900/40 shadow-xl shadow-emerald-950/10 relative overflow-hidden flex flex-col justify-between min-h-[440px] group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 inline-block mb-3">
                  Clearinghouse
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Finance Portal
                </h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  Execute consolidated disbursement batches, reconcile corporate cards, and log bank UTR references.
                </p>
              </div>

              {/* In-app Preview Card */}
              <div className="my-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Disbursement Registry</span>
                  <span className="text-[10px] font-mono text-emerald-400">Batch #8402</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">HDFC Corporate NEFT</p>
                    <p className="text-[10px] text-slate-400">UTR-2026-9482 · Cleared</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">₹1,48,200</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">Finance Settlement</span>
                <div className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Enterprise Security & Compliance Section ─────────────────────── */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 border-t border-slate-100 bg-slate-50/50">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Bank-Grade Security Architecture
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Enterprise Trust & Compliance Standards
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Engineered with end-to-end 256-bit TLS/AES encryption, granular role-based access control (RBAC), and immutable audit logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <span className="block text-xs font-bold text-slate-900">SOC-2 Type II</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Certified</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <span className="block text-xs font-bold text-slate-900">ISO 27001</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Compliant</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <span className="block text-xs font-bold text-slate-900">GST Portal</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">API Verified</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <span className="block text-xs font-bold text-slate-900">256-Bit AES</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (True Full Width Edge-to-Edge) ─────────────────────────── */}
      <footer className="w-full px-6 sm:px-12 lg:px-16 py-10 border-t border-slate-100 bg-white">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-950 flex items-center justify-center text-emerald-400">
              <Receipt className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">FinPulse Enterprise Systems</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <Link href="/employee" className="hover:text-slate-900 transition-colors">Employee Workspace</Link>
            <Link href="/management" className="hover:text-slate-900 transition-colors">Manager Review</Link>
            <Link href="/finance" className="hover:text-slate-900 transition-colors">Finance Settlement</Link>
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">Orchestration</a>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            © 2026 FinPulse Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
