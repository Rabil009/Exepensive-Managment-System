"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

interface HeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
}

export function Header({
  title = "Finance Operations",
  rightContent,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className={`h-12 w-full border-b flex items-center justify-between px-6 shrink-0 select-none transition-colors ${
      isDark
        ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
        : "bg-white border-zinc-200 text-zinc-900"
    }`}>
      {/* Left Title */}
      <div className="flex items-center gap-3">
        <span className={`text-[14px] font-medium ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
          {title}
        </span>
      </div>

      {/* Right Content: Global Filters + Dark/Light Theme Toggle */}
      <div className="flex items-center gap-2">
        {rightContent}

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
      </div>
    </header>
  );
}
