"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
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
  CreditCard
} from "lucide-react";
import { HeroAmbientBackground } from "@/components/shared";

const PORTALS = [
  {
    title: "Employee Portal",
    subtitle: "Expense Ingestion & Personal Claims",
    description: "Submit itemized drafts, snap digital receipts, and track reimbursement milestones with zero friction.",
    href: "/employee",
    icon: Receipt,
    badge: "Role 1: Employee",
    action: "Open Workspace",
  },
  {
    title: "Management Portal",
    subtitle: "Review & Budget Oversight",
    description: "Review pending submissions, adjudicate policy exception warnings, and protect quarterly budget reserves.",
    href: "/management",
    icon: Users,
    badge: "Role 2: Manager",
    action: "Review Queue",
  },
  {
    title: "Finance Clearinghouse",
    subtitle: "Disbursement & Payout Settlement",
    description: "Manage disbursement registers, separate corporate card reconciliations, record UTR codes, and configure holds.",
    href: "/finance",
    icon: Building2,
    badge: "Role 3: Finance",
    action: "Access Vault",
  },
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState("/employee");

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

          {/* Quick Portal Switcher Capsule (Pathio Waitlist Box Style) */}
          <div className="mt-8 w-full max-w-md bg-white rounded-full p-1.5 border border-slate-200 shadow-sm flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center gap-2 pl-4">
              <Receipt className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="/employee">Employee Portal (Submit Expenses)</option>
                <option value="/management">Management Portal (Audit & Approvals)</option>
                <option value="/finance">Finance Portal (Payment Settlement)</option>
              </select>
            </div>

            <Link
              href={selectedRole}
              className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Launch</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.href}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Badge & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
                        {portal.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {portal.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-600 mt-0.5">
                      {portal.subtitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={portal.href}
                      className="w-full inline-flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      <span>{portal.action}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
