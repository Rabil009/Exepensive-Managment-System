"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, PanelLeft, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  title?: string;
  rightContent?: React.ReactNode;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
}

export function Header({
  title,
  rightContent,
  onToggleSidebar,
  onOpenSettings,
}: HeaderProps) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("Finance User");
  const [userEmail, setUserEmail] = useState("finance@payout.finance");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("payout_user_name");
      const storedEmail = localStorage.getItem("payout_user_email");
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (user.email) setUserEmail(user.email);
        const name = user.user_metadata?.name || user.email?.split("@")[0] || "Finance User";
        setUserName(name);
      }
    });
  }, []);

  const initials = (userName || "FI").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("payout_user_role");
      localStorage.removeItem("payout_user_email");
      localStorage.removeItem("payout_user_name");
      localStorage.removeItem("payout_employee_token");
    }
    router.push("/");
  };

  return (
    <header className="h-12 w-full border-b flex items-center justify-between px-4 sm:px-6 shrink-0 select-none transition-colors bg-white dark:bg-[#08080A] border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5]">
      {/* Left: Mobile Sidebar Toggle (Title removed per user request) */}
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
        {title && (
          <span className="text-[13.5px] sm:text-[14px] font-medium truncate text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
        )}
      </div>

      {/* Right Content: Optional Action Controls + Theme Toggle + User Profile in Right Corner */}
      <div className="flex items-center gap-2.5">
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

        {/* User Profile Circular Avatar & Dropdown in Right Corner */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            title={`${userName} (${userEmail})`}
            aria-label="User Profile Menu"
            className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all cursor-pointer select-none ${
              isProfileOpen
                ? "ring-2 ring-zinc-900 dark:ring-white bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
                : "bg-zinc-900 text-white dark:bg-white dark:text-black hover:ring-2 hover:ring-zinc-400 dark:hover:ring-white/40"
            }`}
          >
            {initials}
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 top-10 z-50 w-64 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.04]">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center justify-center shrink-0 ring-1 ring-zinc-300 dark:ring-white/20">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold truncate text-zinc-900 dark:text-white leading-tight">
                      {userName}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-white/[0.1] text-zinc-700 dark:text-zinc-300">
                      Finance
                    </span>
                  </div>
                  <span className="text-[11px] truncate text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {userEmail}
                  </span>
                </div>
              </div>

              <div className="h-px bg-zinc-200/80 dark:bg-white/[0.08] my-1.5" />

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span>Account Settings</span>
                </button>
              )}

              <div className="h-px bg-zinc-200/80 dark:bg-white/[0.08] my-1.5" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
