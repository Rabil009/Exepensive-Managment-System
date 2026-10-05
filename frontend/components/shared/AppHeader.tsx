"use client";

import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import type { User } from "@/types/finance";

interface AppHeaderProps {
  currentUser: User;
  pageTitle?: string;
}

export function AppHeader({ currentUser, pageTitle }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border-hairline)] bg-[var(--bg-page)]/85 px-8 backdrop-blur-xl transition-colors">
      <div className="flex items-center gap-4">
        {pageTitle && (
          <span className="font-outfit text-sm font-medium tracking-tight text-[var(--text-muted)]">
            {pageTitle}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Pill */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-display)]"
          aria-label="Toggle visual theme"
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Notifications */}
        <button 
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition-all hover:border-zinc-400 hover:text-[var(--text-display)]"
          aria-label="Audit notices"
        >
          <Bell className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

        {/* User Pill Badge */}
        <div className="flex items-center gap-3 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-500/30 bg-zinc-500/10 font-outfit text-xs font-semibold text-[var(--text-display)]">
            {currentUser.avatarInitials}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-[var(--text-display)] tracking-wide leading-none">
              {currentUser.name}
            </p>
            <p className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider mt-1 uppercase">
              {currentUser.department} // {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
