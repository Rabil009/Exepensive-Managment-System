"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, PanelLeft } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

interface ManagerHeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
  onToggleSidebar?: () => void;
}

export function ManagerHeader({
  title = "Manager Cockpit & Approvals",
  rightContent,
  onToggleSidebar,
}: ManagerHeaderProps) {
  const { toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-12 w-full border-b flex items-center justify-between px-4 sm:px-6 shrink-0 select-none transition-colors bg-white dark:bg-[#08080A] border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5]">
      {/* Left Title + Mobile Hamburger Toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Toggle Menu"
            aria-label="Toggle Menu"
            className="md:hidden h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]"
          >
            <PanelLeft className="h-4 w-4 stroke-[1.85]" />
          </button>
        )}
        <span className="text-[13.5px] sm:text-[14px] font-medium truncate text-zinc-900 dark:text-zinc-100">
          {title}
        </span>
      </div>

      {/* Right Content: Action controls + Theme Toggle Button */}
      <div className="flex items-center gap-2">
        {rightContent}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title="Toggle Theme"
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-[#141418] dark:hover:bg-[#1E1E24] dark:text-amber-300 dark:border dark:border-white/[0.08]"
        >
          {mounted ? (
            <>
              <Sun className="h-4 w-4 stroke-[2] hidden dark:block" />
              <Moon className="h-4 w-4 stroke-[2] block dark:hidden" />
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