"use client";

import React from "react";
import { useTheme } from "@/lib/theme-store";

interface ManagerHeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
}

export function ManagerHeader({
  title = "Manager Cockpit & Approvals",
  rightContent,
}: ManagerHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`h-12 w-full border-b flex items-center justify-between px-6 shrink-0 select-none transition-colors ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
    >
      {/* Left Title */}
      <div className="flex items-center gap-3">
        <span
          className={`text-[14px] font-medium ${
            isDark ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          {title}
        </span>
      </div>

      {/* Right Content */}
      {rightContent && (
        <div className="flex items-center gap-2">
          {rightContent}
        </div>
      )}
    </header>
  );
}

export default ManagerHeader;