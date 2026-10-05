"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Sun, Moon, ShieldCheck, TrendingUp, Sparkles, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { HeroAmbientBackground } from "@/components/shared";

const PORTALS = [
  {
    title: "Employee Portal",
    subtitle: "Expense Ingestion & Personal Claims",
    description: "Submit itemized drafts, attach verified digital receipts, and monitor reimbursement lifecycle across every financial stage.",
    href: "/employee",
    image: "/images/executive_ledger.jpg",
    action: "Enter Portal",
  },
  {
    title: "Management Portal",
    subtitle: "Review & Budget Oversight",
    description: "Audit team submissions, adjudicate policy warnings, and regulate department capital drawdown limits in real-time.",
    href: "/management",
    image: "/images/management_chamber.jpg",
    action: "Review Queue",
  },
  {
    title: "Finance Portal",
    subtitle: "Clearinghouse & Payout Settlement",
    description: "Manage disbursement registers, execute corporate reconciliations, record electronic UTR references, and configure audit holds.",
    href: "/finance",
    image: "/images/vault.jpg",
    action: "Access Vault",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-[var(--bg-page)] text-[var(--text-display)] selection:bg-[var(--accent-gold)] selection:text-black overflow-x-hidden transition-colors duration-300">
      
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-[var(--border-hairline)] px-8 py-5 backdrop-blur-xl sticky top-0 z-30 bg-[var(--bg-page)]/80"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-outfit text-2xl font-bold tracking-tight text-[var(--text-display)]">
              FinPulse
            </span>
            <span className="hidden sm:inline-block h-3.5 w-px bg-[var(--border-hairline)]" />
            <span className="hidden sm:inline-block font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)]">
              Sovereign Capital Architecture // Ed. 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Capsule */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-display)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Full-Screen Hero Section with Cinematic Atmospheric Video Background ── */}
      <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center overflow-hidden px-6 py-20 lg:py-28">
        {/* Full-Screen Ambient Video & Volumetric Lighting Background */}
        <HeroAmbientBackground />

        {/* Hero Content Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center"
        >
          {/* Subtle Institutional Kicker */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)]/80 backdrop-blur-md mb-6 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent-gold)] font-medium">
              Sovereign Capital Architecture // Direct Portals
            </span>
          </motion.div>

          {/* Majestic Hero Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-outfit text-5xl sm:text-7xl lg:text-8xl tracking-tight font-semibold leading-[1.03] text-[var(--text-display)] drop-shadow-sm max-w-4xl"
          >
            Discipline in Capital.<br />
            Purity in Accounting.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm sm:text-base lg:text-lg text-[var(--text-body)] max-w-2xl font-light leading-relaxed tracking-normal"
          >
            A bespoke financial architecture connecting employee expense capture, managerial governance, and treasury settlement under one immutable system of record.
          </motion.p>

          {/* Direct Workspace Launcher Group (No Auth Barrier) */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl"
          >
            <Link
              href="/employee"
              className="luxury-btn-primary inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium tracking-wide shadow-lg shadow-amber-900/10 hover:shadow-xl transition-all"
            >
              <span>Employee Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/management"
              className="luxury-btn-secondary inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium tracking-wide backdrop-blur-md bg-[var(--bg-surface)]/75 hover:bg-[var(--bg-surface)] transition-all"
            >
              <span>Manager Review</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/finance"
              className="luxury-btn-secondary inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium tracking-wide backdrop-blur-md bg-[var(--bg-surface)]/75 hover:bg-[var(--bg-surface)] transition-all"
            >
              <span>Finance Clearinghouse</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Live Financial Telemetry Strip */}
          <motion.div
            variants={itemVariants}
            className="mt-14 inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 border border-[var(--border-hairline)] bg-[var(--bg-surface)]/70 backdrop-blur-xl px-7 py-3 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="h-4 w-4 text-[var(--accent-gold)]" />
              <div className="text-left">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Reserve Capital
                </span>
                <span className="font-mono-nums text-xs font-semibold text-[var(--text-display)]">
                  ₹4.20M Active
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-[var(--border-subtle)] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <div className="text-left">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Policy Adjudication
                </span>
                <span className="font-mono-nums text-xs font-semibold text-[var(--text-display)]">
                  100% Deterministic
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-[var(--border-subtle)] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Settlement Cycle
                </span>
                <span className="font-mono-nums text-xs font-semibold text-[var(--text-display)]">
                  FastAPI Direct Link
                </span>
              </div>
            </div>
          </motion.div>

          {/* Elegant Downward Scroll Prompt */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-display)] transition-colors cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-light">
              Explore Role Workspaces
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-[var(--accent-gold)]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── The Three Bespoke Portals Grid Showcase ───────────────────── */}
      <section className="mx-auto max-w-7xl px-8 py-16 lg:py-24 w-full relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--border-hairline)] pb-6 mb-12 gap-4">
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-gold)] uppercase">
              OPERATIONAL TIERS (PRD ROLES 1, 2 & 3)
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-display)] mt-1">
              Integrated Enterprise Portals
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-md font-light leading-relaxed">
            Role-separated portals purpose-built for instant access. Select any terminal to inspect live workflows.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.href}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="luxury-card group flex flex-col justify-between rounded-3xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-sm hover:shadow-xl transition-all"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-56 w-full overflow-hidden border-b border-[var(--border-subtle)]">
                  <Image
                    src={portal.image}
                    alt={portal.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-black/20" />
                </div>

                {/* Card Content */}
                <div className="p-7">
                  <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[var(--text-display)]">
                    {portal.title}
                  </h2>
                  
                  <p className="text-[10px] font-mono tracking-wider uppercase text-[var(--accent-gold)] mt-1">
                    {portal.subtitle}
                  </p>

                  <p className="mt-4 text-xs text-[var(--text-body)] leading-relaxed font-light">
                    {portal.description}
                  </p>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-7 pt-0">
                <Link
                  href={portal.href}
                  className="luxury-btn-secondary w-full flex items-center justify-between text-center group-hover:bg-[var(--accent-gold)] group-hover:text-black group-hover:border-[var(--accent-gold)] transition-all"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em]">{portal.action}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Footer Heritage Marks ─────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-hairline)] px-8 py-8 mt-12 bg-[var(--bg-surface)] relative z-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <p className="tracking-widest uppercase text-[10px]">
            FinPulse · Private Expense Clearinghouse · Direct Role Portals
          </p>
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-[var(--accent-gold)]">
            <Link href="/employee" className="hover:text-[var(--text-display)]">Employee</Link>
            <span>·</span>
            <Link href="/management" className="hover:text-[var(--text-display)]">Manager</Link>
            <span>·</span>
            <Link href="/finance" className="hover:text-[var(--text-display)]">Finance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
