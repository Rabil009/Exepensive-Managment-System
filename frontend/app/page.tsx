"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
    title: "Finance & Treasury",
    subtitle: "Settlement & Master Ledger",
    description: "Final verification, manual payment disbursement recording, and export of audit-grade general ledger records.",
    href: "/finance",
    image: "/images/vault.jpg",
    action: "Open Treasury",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-[var(--bg-page)] text-[var(--text-display)] flex flex-col justify-between selection:bg-[var(--accent-gold)] selection:text-black overflow-x-hidden transition-colors duration-300">
      {/* Top Header Heritage Bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-[var(--border-hairline)] px-8 py-5 backdrop-blur-md sticky top-0 z-30 bg-[var(--bg-page)]/85"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-forum text-2xl tracking-[0.2em] uppercase text-[var(--text-display)]">
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

      {/* Main Luxury Hero Section */}
      <main className="mx-auto max-w-7xl px-8 py-16 lg:py-24 w-full">
        {/* Editorial Subheader & Title */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--accent-gold)]">
              Corporate Treasury & Expense Operations
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-forum text-5xl sm:text-7xl lg:text-8xl tracking-[0.01em] font-normal leading-[1.02] text-[var(--text-display)]"
          >
            Discipline in Capital.<br />
            Purity in Accounting.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm sm:text-base text-[var(--text-body)] max-w-2xl font-light leading-relaxed tracking-wide"
          >
            A bespoke financial architecture connecting employee expense capture, managerial governance, and treasury settlement under one immutable system of record.
          </motion.p>
        </motion.div>

        {/* Featured Hero Vault Showcase (High Quality Visual Hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="mt-14 relative rounded-3xl overflow-hidden border border-[var(--border-hairline)] group shadow-2xl"
        >
          <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden">
            <Image
              src="/images/vault.jpg"
              alt="Swiss Private Bank Treasury Vault"
              fill
              priority
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Crisp High-Contrast Legibility Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#e6d5b8] block mb-1">
                  CLEARINGHOUSE SYSTEM ARCHITECTURE
                </span>
                <h3 className="font-forum text-2xl sm:text-3xl text-white">
                  The Sovereign Expense Clearinghouse
                </h3>
                <p className="text-xs text-zinc-300 font-light max-w-lg mt-1">
                  Explore the unified 3-tier expense lifecycle across Employee, Management, and Finance workspaces.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/finance"
                  className="luxury-btn-primary inline-flex items-center gap-2 backdrop-blur-md"
                >
                  <span>Explore Vault</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Three Bespoke Portals Grid with Images & Animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.href}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="luxury-card group flex flex-col justify-between rounded-3xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-sm"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative h-52 w-full overflow-hidden border-b border-[var(--border-subtle)]">
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
                  <h2 className="font-forum text-2xl tracking-wide text-[var(--text-display)]">
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
      </main>

      {/* Footer Heritage Marks */}
      <footer className="border-t border-[var(--border-hairline)] px-8 py-8 mt-12 bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <p className="tracking-widest uppercase text-[10px]">
            FinPulse · Private Expense Clearinghouse · Direct Role Portals
          </p>
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-[var(--accent-gold)]">
            <span>Employee</span>
            <span>·</span>
            <span>Manager</span>
            <span>·</span>
            <span>Finance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
