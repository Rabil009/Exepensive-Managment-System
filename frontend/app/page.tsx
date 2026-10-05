"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Sun, Moon, ShieldCheck, TrendingUp, ChevronDown, Receipt, Landmark } from "lucide-react";
import { useTheme } from "next-themes";
import { HeroAmbientBackground } from "@/components/shared";
import { cn } from "@/lib";

const PORTALS = [
  {
    title: "Employee Portal",
    subtitle: "Expense Ingestion & Personal Claims",
    description: "Submit itemized drafts, attach verified digital receipts, and monitor reimbursement lifecycle across every financial stage.",
    href: "/employee",
    icon: Receipt,
    action: "Learn more",
    // Oceanic Azure / Cyan Radiant Bloom (bottom-left card in reference)
    glowGradient: "radial-gradient(ellipse at 50% 100%, #ffffff 0%, #38bdf8 26%, #2563eb 56%, #1e1b4b 86%, transparent 100%)",
    coreGradient: "radial-gradient(ellipse at 45% 100%, #bae6fd 0%, #38bdf8 40%, transparent 75%)",
    ambientShadow: "hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.45)]",
  },
  {
    title: "Management Portal",
    subtitle: "Review & Budget Oversight",
    description: "Audit team submissions, adjudicate policy warnings, and regulate department capital drawdown limits in real-time.",
    href: "/management",
    icon: ShieldCheck,
    action: "Learn more",
    // Vivid Magenta / Orchid / Fuchsia Radiant Bloom (top-left card in reference)
    glowGradient: "radial-gradient(ellipse at 50% 100%, #ffffff 0%, #ff2a85 28%, #a855f7 58%, #312e81 88%, transparent 100%)",
    coreGradient: "radial-gradient(ellipse at 45% 100%, #fbcfe8 0%, #ec4899 40%, transparent 75%)",
    ambientShadow: "hover:shadow-[0_25px_60px_-15px_rgba(217,70,239,0.45)]",
  },
  {
    title: "Finance Portal",
    subtitle: "Clearinghouse & Payout Settlement",
    description: "Manage disbursement registers, execute corporate reconciliations, record electronic UTR references, and configure audit holds.",
    href: "/finance",
    icon: Landmark,
    action: "Learn more",
    // Electric Emerald / Neon Lime / Mint Bloom (top-right card in reference, zero gold)
    glowGradient: "radial-gradient(ellipse at 50% 100%, #ffffff 0%, #a3e635 25%, #10b981 55%, #064e3b 85%, transparent 100%)",
    coreGradient: "radial-gradient(ellipse at 45% 100%, #dcfce7 0%, #34d399 40%, transparent 75%)",
    ambientShadow: "hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.45)]",
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
    <div className="relative min-h-screen bg-[var(--bg-page)] text-[var(--text-display)] selection:bg-zinc-800 selection:text-white overflow-x-hidden transition-colors duration-300">
      
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-[var(--border-hairline)] px-8 py-5 backdrop-blur-xl sticky top-0 z-30 bg-[var(--bg-page)]/80"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-luxury text-3xl font-semibold tracking-tight text-[var(--text-display)]">
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-all hover:border-zinc-400 hover:text-[var(--text-display)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Full-Screen Hero Section with Monochromatic Atmospheric Background ── */}
      <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center overflow-hidden px-6 py-20 lg:py-28">
        {/* Full-Screen Ambient Lighting Background */}
        <HeroAmbientBackground />

        {/* Hero Content Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center"
        >
          {/* Majestic Hero Headline (Cormorant Garamond) */}
          <motion.h1
            variants={itemVariants}
            className="font-luxury text-6xl sm:text-8xl lg:text-9xl tracking-tight font-normal leading-[0.98] text-[var(--text-display)] drop-shadow-sm max-w-4xl"
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
              className="luxury-btn-primary inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium tracking-wide shadow-lg shadow-zinc-950/20 hover:shadow-xl transition-all"
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
              <TrendingUp className="h-4 w-4 text-emerald-500" />
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
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
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

          {/* Elegant Still Downward Indicator */}
          <div
            className="mt-12 flex flex-col items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-display)] transition-colors cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-light">
              Explore Role Workspaces
            </span>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </div>
        </motion.div>
      </section>

      {/* ── The Three Bespoke Portals Grid Showcase (Radiant Aurora Cards) ── */}
      <section className="mx-auto max-w-7xl px-8 py-16 lg:py-24 w-full relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--border-hairline)] pb-6 mb-12 gap-4">
          <div>
            <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase">
              OPERATIONAL TIERS (PRD ROLES 1, 2 & 3)
            </span>
            <h2 className="font-luxury text-4xl sm:text-5xl font-normal tracking-tight text-[var(--text-display)] mt-1">
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
          className="grid grid-cols-1 gap-7 lg:grid-cols-3"
        >
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.href}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={cn(
                  "relative rounded-[28px] overflow-hidden border border-white/[0.08] bg-[#07070a] p-8 min-h-[430px] flex flex-col justify-between transition-all duration-500 group shadow-2xl",
                  portal.ambientShadow
                )}
              >
                {/* ── Content (Z-Index 10 above the radiant glow) ── */}
                <div className="relative z-10">
                  {/* Top Circular Glass Icon Badge */}
                  <div className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/80 mb-6 backdrop-blur-md transition-transform group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
                    {portal.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-[280px]">
                    {portal.description}
                  </p>

                  {/* Learn More Link with Underline */}
                  <div className="mt-5">
                    <Link
                      href={portal.href}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85 underline underline-offset-4 hover:text-white transition-colors"
                    >
                      <span>{portal.action}</span>
                      <ArrowUpRight className="h-3 w-3 no-underline inline" />
                    </Link>
                  </div>
                </div>

                {/* ── Glowing Radiant Chromatic Ambient Aurora at Bottom ── */}
                <div className="absolute -bottom-14 -left-10 -right-10 h-56 pointer-events-none overflow-hidden select-none">
                  {/* Outer Diffused Radiant Cloud */}
                  <div
                    className="absolute inset-0 blur-3xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    style={{ background: portal.glowGradient }}
                  />
                  {/* Inner Incandescent Core Wave */}
                  <div
                    className="absolute inset-x-6 bottom-0 h-32 blur-2xl opacity-75 group-hover:opacity-90 transition-all duration-700"
                    style={{ background: portal.coreGradient }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Footer Heritage Marks ─────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-hairline)] px-8 py-8 mt-12 bg-[var(--bg-surface)] relative z-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <p className="tracking-widest uppercase text-[10px]">
            FinPulse · Private Expense Clearinghouse · Direct Role Portals
          </p>
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-zinc-400">
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
