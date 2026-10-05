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
    color: "text-blue-600 bg-blue-50 border border-blue-100",
  },
  {
    value: "/management",
    label: "Management Portal",
    badge: "Approvals & Audit",
    desc: "Review claims, policy exceptions, dept budgets",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50 border border-indigo-100",
  },
  {
    value: "/finance",
    label: "Finance Portal",
    badge: "Clearinghouse",
    desc: "Disbursement register, UTR ledger, settlements",
    icon: Building2,
    color: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  },
];

const PORTALS = [
  {
    title: "Employee Portal",
    subtitle: "Expense Ingestion & Personal Claims",
    description: "Submit itemized drafts, snap digital receipts with instant OCR matching, and track reimbursement milestones.",
    href: "/employee",
    icon: Receipt,
    badge: "Role 1: Employee",
    action: "Open Workspace",
    accentColor: "from-blue-600 via-sky-500 to-sky-400",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100/80 group-hover:bg-blue-600 group-hover:text-white",
    dotColor: "bg-blue-600",
    tags: ["OCR Auto-Extract", "Live Policy Pre-check", "Instant Payout Track"],
    preview: {
      tag: "Smart OCR Receipt Scan",
      status: "Verified 99.4%",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
      item: "Air India Boarding Pass",
      amount: "₹8,500.00",
      meta: "Flight · Auto-Categorized",
    },
  },
  {
    title: "Management Portal",
    subtitle: "Review & Budget Oversight",
    description: "Review team submissions, adjudicate policy exception warnings with 1-click approvals, and safeguard quarterly budgets.",
    href: "/management",
    icon: Users,
    badge: "Role 2: Manager",
    action: "Review Queue",
    accentColor: "from-indigo-600 via-indigo-500 to-blue-500",
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100/80 group-hover:bg-indigo-600 group-hover:text-white",
    dotColor: "bg-indigo-600",
    tags: ["Policy Enforcement", "Budget Thresholds", "1-Click Approvals"],
    preview: {
      tag: "Approval Adjudication",
      status: "Cap: ₹5,000 OK",
      statusColor: "text-blue-700 bg-blue-50 border-blue-100",
      item: "Aditya Kumar · Oberoi Grand",
      amount: "₹6,000.00",
      meta: "Exception Justification Attached",
    },
  },
  {
    title: "Finance Clearinghouse",
    subtitle: "Disbursement & Payout Settlement",
    description: "Execute batch reimbursement runs, reconcile corporate cards, log official bank UTR tracking codes, and manage holds.",
    href: "/finance",
    icon: Building2,
    badge: "Role 3: Finance",
    action: "Access Treasury",
    accentColor: "from-emerald-600 via-teal-500 to-cyan-500",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100/80 group-hover:bg-emerald-600 group-hover:text-white",
    dotColor: "bg-emerald-600",
    tags: ["Batch Direct Payout", "Bank UTR Ledger", "Audit Integrity"],
    preview: {
      tag: "Disbursement Register",
      status: "Settled & Logged",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
      item: "Disbursement Batch #OCT-26",
      amount: "₹38,400.00",
      meta: "UTR #928410924719",
    },
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
    <div className="min-h-screen w-full bg-white text-slate-900 selection:bg-sky-500 selection:text-white font-sans antialiased flex flex-col">
      
      {/* ── Pathio Navbar (True Edge-to-Edge Full Width) ──────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between border-b border-slate-100/90 sticky top-0 z-30 bg-white/85 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            FinPulse
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
          <Link href="/employee" className="hover:text-slate-900 transition-colors">
            Employee Portal
          </Link>
          <Link href="/management" className="hover:text-slate-900 transition-colors">
            Manager Review
          </Link>
          <Link href="/finance" className="hover:text-slate-900 transition-colors">
            Finance Treasury
          </Link>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
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

      {/* ── Pathio Hero Section with Full-Screen Sky-Blue Glow ─────────── */}
      <main className="w-full relative flex flex-col items-center justify-start pt-14 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Full-Screen Ambient Sky-Blue Glow Backdrop */}
        <HeroAmbientBackground />

        {/* Hero Header Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Pathio Punchy Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.06] max-w-2xl">
            Stop chasing receipts.<br />
            Start scanning.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
            The automated expense management platform that simplifies enterprise finances.
            Snap a receipt, enforce policy limits, and let real-time workflows handle the rest.
          </p>

          {/* Quick Portal Switcher Capsule with Custom Luxury Dropdown */}
          <div ref={dropdownRef} className="relative mt-8 w-full max-w-md z-40">
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
                    <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
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
                      isDropdownOpen ? "rotate-180 text-blue-600" : ""
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
                  className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-2 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] z-50 overflow-hidden"
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
                              ? "bg-blue-50/70 border border-blue-100"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${option.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isSelected ? "text-blue-950" : "text-slate-900"}`}>
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
                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
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
            <div className="flex items-center text-blue-500">
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
            </div>
            <span className="text-slate-300">|</span>
            <span>Trusted by 1,200+ finance teams & employees</span>
          </div>
        </div>

        {/* ── Pathio Hero Centerpiece: Smartphone & Floating Interactive Cards ── */}
        <div className="relative z-10 mt-14 sm:mt-20 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          
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
              Hotel claim ₹6,000 exceeds ₹5,000 daily cap
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
              <div className="h-4 px-1.5 rounded bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white tracking-wider">
                CORP
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900">AWS Cloud Infra</p>
            <p className="text-[11px] text-slate-400 mt-0.5">₹15,400 · Auto-reconciled</p>
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
              Budget Health
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Engineering is 18% under Q4 allocated budget
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
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Zero Duplicates</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Receipt SHA-256 Verified</p>
          </motion.div>

          {/* ── The Center Smartphone Frame ─────────────────────────── */}
          <div className="relative w-[280px] sm:w-[320px] h-[490px] sm:h-[540px] bg-slate-950 p-2.5 rounded-[44px] shadow-[0_30px_90px_-20px_rgba(15,23,42,0.22)] border-[5px] border-slate-900/90 overflow-hidden flex flex-col justify-between">
            
            {/* Phone Inner Screen with Sky-Blue Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-sky-100 via-sky-50 to-white rounded-[36px] p-4 pt-3 flex flex-col justify-between overflow-hidden relative">
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pb-2 border-b border-sky-200/40">
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
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
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
              <div className="mt-3 text-left">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Hello, Aditya
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  3 expense claims pending approval
                </p>
              </div>

              {/* Quick Reimbursement Summary Bar */}
              <div className="mt-3 bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 border border-sky-100/90 shadow-xs flex items-center justify-between">
                <div className="text-left pl-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Claimed</span>
                  <p className="text-sm font-extrabold text-slate-900 tracking-tight">₹17,700</p>
                </div>
                <div className="h-6 w-px bg-slate-200/60" />
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Approved</span>
                  <p className="text-sm font-extrabold text-emerald-600 tracking-tight">₹8,500</p>
                </div>
                <div className="h-6 w-px bg-slate-200/60" />
                <div className="text-left pr-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">In Review</span>
                  <p className="text-sm font-extrabold text-blue-600 tracking-tight">₹9,200</p>
                </div>
              </div>

              {/* ── Active Enterprise Expense Claims (Pathio Signature Blue Capsules) ── */}
              <div className="mt-auto space-y-2 z-10 pb-1">
                {/* Pill 1: Flight / Travel */}
                <div className="bg-[#2563eb] text-white rounded-2xl p-2.5 flex items-center justify-between shadow-lg shadow-blue-500/25">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                      <Plane className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">Air India · BLR to DEL</p>
                      <p className="text-[10px] text-blue-100 font-medium">₹8,500 · Manager Approved</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-200 shrink-0" />
                </div>

                {/* Pill 2: Hotel / Accommodation */}
                <div className="bg-[#2563eb] text-white rounded-2xl p-2.5 flex items-center justify-between shadow-lg shadow-blue-500/25">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">The Oberoi · Client Sync</p>
                      <p className="text-[10px] text-blue-100 font-medium">₹6,000 · Exception Review</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-200 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Proof / Partner Bar (Pathio Style) ─────────────── */}
        <div className="relative z-10 mt-16 sm:mt-24 text-center w-full max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-6">
            Trusted by modern founders and remote teams
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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              OPERATIONAL TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              One Unified System. Three Purpose-Built Portals.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Fast, deterministic expense workflows tailored to each organizational role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.href}
                  className="bg-white rounded-[32px] p-7 sm:p-8 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_50px_-12px_rgba(15,23,42,0.14)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Subtle Top Gradient Accent Strip */}
                  <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${portal.accentColor} opacity-90 group-hover:h-2 transition-all`} />

                  <div>
                    {/* Top Row: Icon & Role Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200 border ${portal.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/60 text-slate-600 text-[11px] font-semibold">
                        <span className={`h-1.5 w-1.5 rounded-full ${portal.dotColor}`} />
                        <span>{portal.badge}</span>
                      </div>
                    </div>

                    {/* Titles */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-1">
                      {portal.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-normal">
                      {portal.description}
                    </p>

                    {/* Interactive UI Mockup Preview Box */}
                    <div className="my-5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-100 group-hover:border-slate-200/80 transition-colors">
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-bold text-slate-700">
                          {portal.preview.tag}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${portal.preview.statusColor}`}>
                          {portal.preview.status}
                        </span>
                      </div>

                      <div className="bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-2xs flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {portal.preview.item}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                            {portal.preview.meta}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                          {portal.preview.amount}
                        </span>
                      </div>
                    </div>

                    {/* Micro Feature Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {portal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-slate-600 bg-slate-100/70 px-2.5 py-1 rounded-lg border border-slate-200/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={portal.href}
                      className="w-full inline-flex items-center justify-between group/link"
                    >
                      <span className="text-xs font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors">
                        {portal.action}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-700 transition-all duration-200 shadow-2xs">
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </Link>
                  </div>
                </div>
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
