"use client";

import React, { type RefObject } from "react";
import Link from "next/link";
import { Search, Bell, Sun, Moon, Plus, PanelLeft } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

interface HeaderProps {
  title?: string;
  searchRef?: RefObject<HTMLInputElement | null>;
  onSearch?: (value: string) => void;
  onNotifications?: () => void;
  onToggleSidebar?: () => void;
}

export function Header({
  title = "Employee Portal",
  searchRef,
  onSearch,
  onNotifications,
  onToggleSidebar,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`h-12 w-full border-b flex items-center justify-between px-4 sm:px-6 shrink-0 select-none transition-colors ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
    >
      {/* Left Title / Mobile Toggle / Search */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 max-w-md">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Toggle Menu"
            aria-label="Toggle Menu"
            className={`md:hidden h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer shrink-0 ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <PanelLeft className="h-4 w-4 stroke-[1.85]" />
          </button>
        )}
        <span className={`text-[13.5px] sm:text-[14px] font-medium truncate shrink-0 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          {title}
        </span>
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <input
            ref={searchRef}
            name="search"
            aria-label="Search transactions"
            placeholder="Search transactions, tags..."
            onChange={(e) => onSearch?.(e.target.value)}
            className={`w-full text-xs rounded-lg pl-8 pr-3 py-1.5 border transition-all focus:outline-none ${
              isDark
                ? "bg-[#18181D] border-white/[0.08] text-zinc-100 placeholder:text-zinc-500 focus:border-white/25"
                : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400"
            }`}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer relative ${
            isDark
              ? "hover:bg-white/[0.08] text-zinc-400 hover:text-white"
              : "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? "bg-[#141418] hover:bg-[#1E1E24] text-amber-300 border border-white/[0.08]"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
          }`}
        >
          {isDark ? (
            <Sun className="h-4 w-4 stroke-[2]" />
          ) : (
            <Moon className="h-4 w-4 stroke-[2]" />
          )}
        </button>

        {/* New Expense Action */}
        <Link
          href="/employee/expenses/new"
          className="h-8 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs ml-1"
          aria-label="New Expense"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Expense</span>
        </Link>
      </div>
    </header>
  );
}
export default Header;
