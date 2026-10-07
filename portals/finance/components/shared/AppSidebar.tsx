"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib";
import type { UserRole } from "@/types/finance";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  EMPLOYEE: [
    { label: "Executive Ledger", href: "/employee", icon: LayoutDashboard },
    { label: "Claims & Receipts", href: "/employee", icon: Receipt },
  ],
  MANAGER: [
    { label: "Review Chamber", href: "/management", icon: LayoutDashboard },
    { label: "Verification Queue", href: "/management", icon: CheckSquare },
  ],
  FINANCE: [
    { label: "Treasury Balance", href: "/finance", icon: LayoutDashboard },
    { label: "Disbursement Vault", href: "/finance", icon: Wallet },
  ],
  ADMIN: [
    { label: "Global Governance", href: "/admin", icon: LayoutDashboard },
  ],
};

interface AppSidebarProps {
  role: UserRole;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.EMPLOYEE;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--border-hairline)] bg-[var(--bg-surface)] backdrop-blur-2xl transition-colors">
      {/* Brand Logo Header */}
      <div className="flex h-20 flex-col justify-center border-b border-[var(--border-hairline)] px-6">
        <Link href="/" className="group block">
          <span className="font-luxury text-2xl font-semibold tracking-tight text-[var(--text-display)] group-hover:text-emerald-500 transition-colors">
            FinPulse
          </span>
          <span className="block font-mono text-[9px] tracking-[0.24em] text-zinc-400 uppercase mt-0.5">
            Sovereign Ledger // 2026
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        <p className="px-3 pb-2 font-mono text-[9px] font-medium tracking-[0.25em] uppercase text-[var(--text-muted)]">
          {role} Workspace
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs tracking-wider transition-all duration-200",
                isActive
                  ? "bg-zinc-500/10 text-[var(--text-display)] border border-[var(--border-hairline)] font-medium"
                  : "text-[var(--text-body)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-display)]"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-emerald-500" : "text-[var(--text-muted)]"
                )} />
                <span className="font-sans text-[12px]">{item.label}</span>
              </div>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Role Switcher */}
      <div className="border-t border-[var(--border-hairline)] p-4">
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/60 px-3.5 py-2.5 text-xs text-[var(--text-muted)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-display)]"
        >
          <div className="flex items-center gap-2.5">
            <ArrowLeftRight className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
            <span className="font-mono text-[11px] tracking-wider uppercase">Switch Portal</span>
          </div>
          <span className="font-mono text-[10px] text-[var(--accent-gold)]">ESC</span>
        </Link>
      </div>
    </aside>
  );
}
