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
  Plane, 
  ChevronRight, 
  Star,
  Receipt,
  Users,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  Check
} from "lucide-react";
import { HeroAmbientBackground } from "@/components/shared";

const ROLE_OPTIONS = [
  {
    value: "/employee",
    label: "Employee Portal",
    badge: "Submit & Track",
    desc: "Snap receipts, auto-scan OCR, track payouts",
    icon: Receipt,
    color: "text-emerald-700 bg-emerald-50 border border-emerald-200/80",
  },
  {
    value: "/management",
    label: "Management Portal",
    badge: "Approvals & Audit",
    desc: "Review claims, policy exceptions, dept budgets",
    icon: Users,
    color: "text-indigo-700 bg-indigo-50 border border-indigo-200/80",
  },
  {
    value: "/finance",
    label: "Finance Portal",
    badge: "Clearinghouse",
    desc: "Disbursement register, UTR ledger, settlements",
    icon: Building2,
    color: "text-teal-700 bg-teal-50 border border-teal-200/80",
  },
];

function EmployeeLedgerPreview() {
  return (
    <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-md shadow-inner text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Receipt className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200">Receipt OCR Stream</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
          99.4% Match
        </span>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-100 truncate">Software Subscription</p>
              <p className="text-[9px] text-slate-400">JetBrains IDE · GSTIN Verified</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">₹14,500</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-100 truncate">Client Hospitality</p>
              <p className="text-[9px] text-slate-400">Olive Beach · Auto-Extracted</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-teal-400 shrink-0">₹3,200</span>
        </div>
      </div>
    </div>
  );
}

function ManagerAuditPreview() {
  return (
    <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-md shadow-inner text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200">Policy Audit Guard</span>
        </div>
        <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
          Dual Signoff
        </span>
      </div>

      <div className="space-y-2 mt-3">
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center justify-between text-[10px] font-semibold mb-1.5">
            <span className="text-slate-300">Engineering Q4 Budget</span>
            <span className="text-emerald-400">68% Utilized</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[68%]" />
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-100 truncate">Policy Cap Warning</p>
              <p className="text-[9px] text-slate-400">Exceeded by ₹1,000 · Justified</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/40">
            Approved
          </span>
        </div>
      </div>
    </div>
  );
}

function FinanceSettlementPreview() {
  return (
    <div className="w-full bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-md shadow-inner text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200">Disbursement Registry</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
          Batch #SET-8402
        </span>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <CreditCard className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-100 truncate">HDFC Corporate NEFT</p>
              <p className="text-[9px] text-slate-400">UTR-2026-9482 · Cleared</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">₹1,48,200</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-100 truncate">14 Claims Disbursed</p>
              <p className="text-[9px] text-slate-400">Zero Reconciliation Drift</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800/40">
            Settled
          </span>
        </div>
      </div>
    </div>
  );
}

const PORTALS = [
  {
    title: "Employee Portal",
    description: "Submit itemized expense claims, snap digital receipts, and track reimbursement milestones with zero friction.",
    href: "/employee",
    pillText: "Employee Workspace",
    badge: "Capture & Track",
    cardBg: "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 shadow-xl shadow-slate-950/20",
    pillStyle: "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60",
    renderArt: EmployeeLedgerPreview,
  },
  {
    title: "Manager Portal",
    description: "Audit team submissions, adjudicate policy exception warnings, and protect quarterly budgets in real-time.",
    href: "/management",
    pillText: "Manager Review",
    badge: "Audit & Approvals",
    cardBg: "bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b0f19] border border-slate-800/90 shadow-xl shadow-slate-950/20",
    pillStyle: "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60",
    renderArt: ManagerAuditPreview,
  },
  {
    title: "Finance Portal",
    description: "Execute consolidated disbursement batches, reconcile corporate cards, and log bank UTR references.",
    href: "/finance",
    pillText: "Finance Settlement",
    badge: "Clearinghouse",
    cardBg: "bg-gradient-to-b from-[#064e3b]/80 via-[#022c22] to-[#090d16] border border-emerald-900/40 shadow-xl shadow-emerald-950/20",
    pillStyle: "bg-emerald-900/80 text-emerald-300 border border-emerald-700/60",
    renderArt: FinanceSettlementPreview,
  },
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState("/employee");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      
      {/* ── Pathio Navbar (True Edge-to-Edge Full Width) ──────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between border-b border-slate-100/90 sticky top-0 z-30 bg-white/85 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-600 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/20 border border-slate-700/40">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            FinPulse
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
          <Link href="/employee" className="hover:text-emerald-800 transition-colors">
            Employee Portal
          </Link>
          <Link href="/management" className="hover:text-emerald-800 transition-colors">
            Manager Review
          </Link>
          <Link href="/finance" className="hover:text-emerald-800 transition-colors">
            Finance Treasury
          </Link>
          <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Action Pills */}
        <div className="flex items-center gap-3">
          <Link
            href="/employee"
            className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
          >
            Launch Portal
          </Link>
        </div>
      </header>

      {/* ── Enterprise Hero Section (Clean, Grounded, Bespoke Modern Grid) ─────────── */}
      <main className="w-full relative flex flex-col items-center justify-start pt-14 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Precision Dot Matrix & Subtle Emerald Atmosphere */}
        <HeroAmbientBackground />

        {/* Hero Header Content */}
        <div className={`relative max-w-3xl mx-auto text-center flex flex-col items-center transition-all ${isDropdownOpen ? "z-50" : "z-30"}`}>
          {/* Punchy Headline with High-End Emerald / Slate Gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.06] max-w-3xl">
            Stop chasing receipts.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900">
              Start scanning.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
            The automated expense management platform that simplifies enterprise finances.
            Snap a receipt, enforce policy limits, and let real-time workflows handle the rest.
          </p>

          {/* Quick Portal Switcher Capsule with Custom Luxury Dropdown */}
          <div ref={dropdownRef} className="relative mt-8 w-full max-w-md z-50">
            {/* The Main Capsule Pill */}
            <div className="w-full bg-white rounded-full p-1.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-2">
              {/* Dropdown Toggle Button */}
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

              {/* Launch Action Button */}
              <Link
                href={selectedRole}
                className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shrink-0 inline-flex items-center gap-1.5 shadow-sm hover:shadow"
              >
                <span>Launch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Custom Luxury Floating Dropdown Popover */}
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
                    Select Target Portal
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

          {/* Rating Stars & Trust Pill */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center text-emerald-500">
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
              <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            </div>
            <span className="text-slate-300">|</span>
            <span>Trusted by 1,200+ enterprise finance teams & employees</span>
          </div>
        </div>

        {/* ── Pathio Hero Centerpiece: Smartphone & Floating Interactive Cards ── */}
        <div className="relative z-10 mt-16 sm:mt-24 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          
          {/* ── Floating Card 1: Top-Left (Policy Exception Alert) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            transition={{ duration: 0.6 }}
            whileHover={{ rotate: -4, scale: 1.03 }}
            className="absolute left-2 sm:left-6 lg:left-12 top-2 sm:top-6 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[200px] sm:max-w-[240px] text-left cursor-default hidden sm:block"
          >
            <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              Policy Exception Alert
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Mandatory justification required when budget caps exceed
            </p>
          </motion.div>

          {/* ── Floating Card 2: Bottom-Left (Corporate Card) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ rotate: -2, scale: 1.03 }}
            className="absolute left-4 sm:left-10 lg:left-16 bottom-6 sm:bottom-12 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[190px] sm:max-w-[220px] text-left cursor-default hidden sm:block"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700">Corporate Card</p>
              <div className="h-4 px-1.5 rounded bg-slate-900 text-emerald-400 border border-slate-700 flex items-center justify-center text-[9px] font-bold tracking-wider">
                CORP
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900">Direct Bank Feed</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated Receipt Matching</p>
          </motion.div>

          {/* ── Floating Card 3: Top-Right (Budget Health) ──────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 8 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ rotate: 4, scale: 1.03 }}
            className="absolute right-2 sm:right-6 lg:right-12 top-4 sm:top-8 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[200px] sm:max-w-[230px] text-left cursor-default hidden sm:block"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2.5">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              Department Budget
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Real-time expenditure tracking vs quarterly caps
            </p>
          </motion.div>

          {/* ── Floating Card 4: Bottom-Right (Compliance Check) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ rotate: 2, scale: 1.03 }}
            className="absolute right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-14 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[190px] sm:max-w-[220px] text-left cursor-default hidden sm:block"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700">Audit Compliance</p>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-900">Zero Duplicates</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Receipt SHA-256 Verified</p>
          </motion.div>

          {/* ── The Center Smartphone Frame ─────────────────────────── */}
          <div className="relative w-[280px] sm:w-[320px] h-[510px] sm:h-[550px] bg-slate-950 p-2.5 rounded-[44px] shadow-[0_30px_90px_-20px_rgba(15,23,42,0.22)] border-[5px] border-slate-900/90 overflow-hidden flex flex-col justify-between">
            
            {/* Phone Inner Screen with Clean Neutral Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-slate-100 via-slate-50 to-white rounded-[36px] p-4 pt-3 flex flex-col justify-between overflow-hidden relative">
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pb-2 border-b border-slate-200/60">
                <span>9:41</span>
                <div className="h-3 w-16 bg-slate-900 rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="h-2 w-3.5 border border-slate-700 rounded-sm" />
                </div>
              </div>

              {/* Profile Header Row */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-900 to-emerald-700 text-emerald-200 text-xs font-bold flex items-center justify-center shadow-sm">
                    AK
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium leading-none">
                      Good Morning
                    </span>
                    <span className="block text-xs font-bold text-slate-800 mt-0.5">
                      Aditya Kumar · ID #EMP-4573
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button className="h-7 w-7 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs">
                    <Search className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs">
                    <Bell className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Personalized Greeting */}
              <div className="mt-2.5 text-left">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Hello, Aditya
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  3 recent activity updates & messages
                </p>
              </div>

              {/* Quick Reimbursement Summary Bar */}
              <div className="mt-2.5 bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div className="text-left pl-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Claimed</span>
                  <p className="text-xs font-extrabold text-slate-900 tracking-tight">₹17,700</p>
                </div>
                <div className="h-5 w-px bg-slate-200/60" />
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Approved</span>
                  <p className="text-xs font-extrabold text-emerald-600 tracking-tight">₹8,500</p>
                </div>
                <div className="h-5 w-px bg-slate-200/60" />
                <div className="text-left pr-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">In Review</span>
                  <p className="text-xs font-extrabold text-slate-700 tracking-tight">₹9,200</p>
                </div>
              </div>

              {/* ── Activity & Notification Messages (Sleek Obsidian & Emerald Cards) ── */}
              <div className="mt-auto space-y-2 z-10 pb-1">
                {/* Message 1: Manager Sign-off */}
                <div className="bg-slate-900 text-white rounded-2xl p-2.5 shadow-sm border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold leading-tight truncate text-slate-100">Manager Approved</p>
                        <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-full font-medium border border-emerald-800/40 shrink-0">
                          Just now
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-normal mt-0.5 line-clamp-1">
                        Expense claim #CLM-104 approved by Tejasvini Rao.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message 2: OCR Scan Verified */}
                <div className="bg-slate-900 text-white rounded-2xl p-2.5 shadow-sm border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                      <Receipt className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold leading-tight truncate text-slate-100">Receipt Scanned</p>
                        <span className="text-[9px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded-full font-medium border border-teal-800/40 shrink-0">
                          14m ago
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-normal mt-0.5 line-clamp-1">
                        GST invoice parsed with 99.4% OCR accuracy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message 3: Bank Disbursement Settlement */}
                <div className="bg-slate-900 text-white rounded-2xl p-2.5 shadow-sm border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold leading-tight truncate text-slate-100">Payout Disbursed</p>
                        <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-full font-medium border border-emerald-800/40 shrink-0">
                          Today
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-normal mt-0.5 line-clamp-1">
                        ₹8,500 settled to bank account (UTR #FIN-89421).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Proof / Partner Bar ─────────────── */}
        <div className="relative z-10 mt-16 sm:mt-24 text-center w-full max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-6">
            Trusted by modern enterprise teams & fast-growing startups
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm tracking-tight grayscale opacity-75">
            <span className="hover:text-slate-800 transition-colors cursor-pointer">HubSpót</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">asana</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">GUMROAD</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Spotify</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">webflow</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Notion</span>
          </div>
        </div>
      </main>

      {/* ── 3 Operational Portals Section (Full Width, Centered Max-Width) ── */}
      <section id="how-it-works" className="w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-slate-50/60">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80">
              OPERATIONAL TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              One Unified System. Three Purpose-Built Portals.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Fast, deterministic expense workflows tailored to each organizational role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {PORTALS.map((portal) => {
              const PreviewArt = portal.renderArt;
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className={`${portal.cardBg} rounded-[32px] p-7 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[490px] transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer`}
                >
                  {/* Subtle Top Ambient Horizon */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_65%)] pointer-events-none" />

                  {/* Top Content: Badge, Title & Enterprise Description */}
                  <div className="relative z-10 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${portal.pillStyle}`}>
                        {portal.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white leading-tight">
                      {portal.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-[13px] text-slate-300 font-normal leading-relaxed max-w-[280px]">
                      {portal.description}
                    </p>
                  </div>

                  {/* Real Micro-UI Interactive Ledger / Audit Preview */}
                  <div className="relative z-10 my-4 transform group-hover:scale-[1.02] transition-transform duration-300">
                    <PreviewArt />
                  </div>

                  {/* Bottom Controls Row: Pill Tag + Arrow Button */}
                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-xs font-bold text-slate-200">
                      {portal.pillText}
                    </span>

                    <div className="h-9 w-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer (True Full Width Edge-to-Edge) ─────────────────────────── */}
      <footer className="w-full px-4 sm:px-8 lg:px-10 py-8 border-t border-slate-100 bg-white">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 FinPulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/employee" className="hover:text-slate-900">Employee Workspace</Link>
            <Link href="/management" className="hover:text-slate-900">Manager Docket</Link>
            <Link href="/finance" className="hover:text-slate-900">Finance Settlement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
