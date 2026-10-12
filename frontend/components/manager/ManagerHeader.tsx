"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, PanelLeft, Bell } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

interface ManagerHeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
  onToggleSidebar?: () => void;
  pendingCount?: number;
}

export function ManagerHeader({
  title = "Manager Cockpit & Approvals",
  rightContent,
  onToggleSidebar,
  pendingCount,
}: ManagerHeaderProps) {
  const { toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bellShaking, setBellShaking] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Subtle initial bell shake notice if pending items exist
    const timer = setTimeout(() => {
      setBellShaking(true);
      setTimeout(() => setBellShaking(false), 500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBellClick = () => {
    setBellShaking(true);
    setTimeout(() => setBellShaking(false), 500);
  };

  return (
    <header className="h-12 w-full border-b flex items-center justify-between px-4 sm:px-6 shrink-0 select-none transition-colors duration-200 bg-white dark:bg-[#08080A] border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5]">
      {/* Left Title + Mobile Hamburger Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Toggle Menu"
            aria-label="Toggle Menu"
            className="md:hidden h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]"
          >
            <PanelLeft className="h-4 w-4 stroke-[1.85]" />
          </button>
        )}
        <span className="text-[13.5px] sm:text-[14px] font-medium truncate text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          {title}
        </span>
      </div>

      {/* Right Content: Action controls + Notification Bell + Theme Toggle Button */}
      <div className="flex items-center gap-2">
        {rightContent}

        {/* Notification Bell with Badge & Shake */}
        <button
          type="button"
          onClick={handleBellClick}
          title={pendingCount && pendingCount > 0 ? `${pendingCount} approvals pending` : "Notifications"}
          aria-label="Notifications"
          className="relative h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 ease-out active:scale-95 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-[#141418] dark:hover:bg-[#1E1E24] dark:text-zinc-300 dark:border dark:border-white/[0.08]"
        >
          <Bell className={`h-4 w-4 stroke-[1.85] transition-transform duration-200 ${bellShaking ? "animate-bell-shake text-amber-500 dark:text-amber-400" : ""}`} />
          {(pendingCount === undefined || pendingCount > 0) && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#141418] transition-transform duration-200 hover:scale-110" />
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title="Toggle Theme"
          className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 ease-out active:scale-95 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-[#141418] dark:hover:bg-[#1E1E24] dark:text-amber-300 dark:border dark:border-white/[0.08]"
        >
          {mounted ? (
            <>
              <Sun className="h-4 w-4 stroke-[2] hidden dark:block transition-transform duration-200 hover:rotate-45" />
              <Moon className="h-4 w-4 stroke-[2] block dark:hidden transition-transform duration-200 hover:-rotate-12" />
            </>
          ) : (
            <span className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}

export default ManagerHeader;