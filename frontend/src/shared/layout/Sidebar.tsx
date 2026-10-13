"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  CreditCard,
  PieChart,
  ClipboardList,
  Receipt,
  Settings,
  HelpCircle,
  Search,
  PanelLeft,
  ChevronsUpDown,
  LogOut,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import { supabase } from "@/lib/supabase";
import { clearEmployeeCache } from "@/lib/employee-auth";
import { useEmployeeSession } from "@/lib/employee-session";
import type { NavigationItem } from "./navigation.types";

interface SidebarProps {
  activeView: string;
  onNavigate: (label: string) => void;
  isCollapsed?: boolean;
  onToggleSidebar: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  isCollapsed = false,
  onToggleSidebar,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const router = useRouter();
  const account = useEmployeeSession();
  const profileName = account.profile.name?.trim() || account.user.email?.split("@")[0] || "Employee";
  const email = account.user.email || "";
  const initials = profileName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isMobileOpen]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    clearEmployeeCache();
    if (typeof window !== "undefined") {
      localStorage.removeItem("payout_user_role");
      localStorage.removeItem("payout_user_email");
      localStorage.removeItem("payout_user_name");
      localStorage.removeItem("payout_employee_token");
    }
    router.replace("/?portal=employee");
  };

  const mainNav = [
    { label: "Overview", icon: Compass, path: "/employee/dashboard" },
    { label: "Cards & Limits", icon: CreditCard, path: "/employee/cards" },
    { label: "Analytics", icon: PieChart, path: "/employee/analytics" },
  ];

  const expensesNav = [
    { label: "New Expense", icon: Receipt, path: "/employee/expenses/new" },
    { label: "Reports", icon: ClipboardList, path: "/employee/reports" },
  ];

  const renderNavButton = (item: NavigationItem & { path: string }) => {
    const isActive = activeView === item.label;
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => onNavigate(item.label)}
        title={isCollapsed ? item.label : undefined}
        className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
          isActive
            ? isDark
              ? "bg-white text-black font-semibold shadow-xs"
              : "bg-black text-white font-medium shadow-xs"
            : isDark
            ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
            : "text-zinc-900 font-medium hover:bg-black hover:text-white"
        }`}
      >
        <div className="h-7 w-7 shrink-0 flex items-center justify-center">
          <item.icon
            className={`h-4 w-4 stroke-[1.85] transition-colors ${
              isActive
                ? isDark
                  ? "text-black"
                  : "text-white"
                : isDark
                ? "text-zinc-400 group-hover:text-black"
                : "text-zinc-800 group-hover:text-white"
            }`}
          />
        </div>

        <div
          className={`flex items-center justify-between flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
            isCollapsed
              ? "max-w-0 opacity-0 pointer-events-none ml-0"
              : "max-w-[170px] opacity-100"
          }`}
        >
          <span className="text-[13.5px] font-medium truncate">
            {item.label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        style={{ willChange: "width" }}
        aria-label="Employee Navigation"
        className={`hidden md:flex shrink-0 h-screen border-r flex-col justify-between overflow-hidden select-none font-sans px-2.5 py-3 transition-[width] duration-200 ease-in-out ${
          isCollapsed ? "w-[64px]" : "w-[240px]"
        } ${
          isDark
            ? "bg-[#131316] border-white/[0.08] text-[#F4F4F5]"
            : "bg-[#F7F7F8] border-zinc-200/90 text-zinc-900"
        }`}
      >
      {/* Top Group */}
      <div className="flex flex-col w-full">
        {/* Workspace Brand Header / Toggle Button */}
        <div className="w-full mb-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
              isDark
                ? "hover:bg-white/[0.08]"
                : "hover:bg-zinc-200/60"
            }`}
          >
            <div className={`h-7 w-7 shrink-0 flex items-center justify-center transition-colors ${
              isDark
                ? "text-zinc-400 group-hover:text-white"
                : "text-zinc-700 group-hover:text-zinc-950"
            }`}>
              <PanelLeft className="h-4 w-4 stroke-[1.85]" />
            </div>

            <div
              className={`flex items-center flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none ml-0"
                  : "max-w-[170px] opacity-100"
              }`}
            >
              <span className={`text-[15px] font-semibold tracking-tight truncate ${
                isDark ? "text-white" : "text-zinc-900"
              }`}>
                Payout
              </span>
            </div>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1 w-full">
          {mainNav.map(renderNavButton)}
        </nav>

        {/* Expenses Group */}
        <div className="mt-4 w-full">
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isCollapsed
                ? "max-h-0 opacity-0 pointer-events-none mb-0"
                : "max-h-6 opacity-100 mb-1"
            }`}
          >
            <p
              className={`px-2 text-[12px] font-normal ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Expenses & Claims
            </p>
          </div>
          {isCollapsed && (
            <div
              className={`w-6 h-[1px] my-2 mx-auto ${
                isDark ? "bg-white/[0.08]" : "bg-zinc-200/80"
              }`}
            />
          )}

          <nav className="space-y-1 w-full">
            {expensesNav.map(renderNavButton)}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & User Profile */}
      <div className="w-full space-y-1">
        {isCollapsed && (
          <div
            className={`w-6 h-[1px] my-2 mx-auto ${
              isDark ? "bg-white/[0.08]" : "bg-zinc-200/80"
            }`}
          />
        )}

        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            title={isCollapsed ? "Get Help" : undefined}
            className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
              isDark
                ? "text-zinc-300 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <HelpCircle
                className={`h-4 w-4 stroke-[1.85] transition-colors ${
                  isDark
                    ? "text-zinc-400 group-hover:text-black"
                    : "text-zinc-800 group-hover:text-white"
                }`}
              />
            </div>
            <div
              className={`flex items-center flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none ml-0"
                  : "max-w-[170px] opacity-100"
              }`}
            >
              <span className="text-[13.5px] font-medium">Get Help</span>
            </div>
          </button>
        )}

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            title={isCollapsed ? "Settings" : undefined}
            className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
              isDark
                ? "text-zinc-300 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <Settings
                className={`h-4 w-4 stroke-[1.85] transition-colors ${
                  isDark
                    ? "text-zinc-400 group-hover:text-black"
                    : "text-zinc-800 group-hover:text-white"
                }`}
              />
            </div>
            <div
              className={`flex items-center flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none ml-0"
                  : "max-w-[170px] opacity-100"
              }`}
            >
              <span className="text-[13.5px] font-medium">Settings</span>
            </div>
          </button>
        )}

      </div>
      </aside>

      {/* Mobile Drawer (Full Slide-Over with Backdrop) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs touch-none"
            onClick={onCloseMobile}
            onTouchMove={(e) => e.preventDefault()}
          />
          {/* Drawer Panel */}
          <div
            onTouchMove={(e) => e.stopPropagation()}
            className={`relative w-[280px] max-w-[85vw] h-full flex flex-col justify-between p-3.5 shadow-2xl z-10 overflow-y-auto overscroll-contain animate-in slide-in-from-left duration-200 ${
              isDark
                ? "bg-[#131316] text-[#F4F4F5] border-r border-white/[0.08]"
                : "bg-[#F7F7F8] text-zinc-900 border-r border-zinc-200"
            }`}
          >
            <div className="flex flex-col w-full">
              {/* Header */}
              <div className="flex items-center justify-between h-9 px-1 mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-5 w-5 rounded-full border-[1.8px] flex items-center justify-center shrink-0 ${
                      isDark ? "border-white" : "border-zinc-900"
                    }`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        isDark ? "bg-white" : "bg-zinc-900"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[15px] font-semibold tracking-tight ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    Payout
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Main Navigation */}
              <nav className="space-y-1 w-full">
                {mainNav.map((item) => {
                  const isActive = activeView === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onNavigate(item.label);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center h-10 px-3 rounded-xl cursor-pointer transition-colors ${
                        isActive
                          ? isDark
                            ? "bg-white text-black font-semibold shadow-xs"
                            : "bg-black text-white font-medium shadow-xs"
                          : isDark
                          ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                          : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="text-[13.5px] font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Expenses Section */}
              <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
                <p
                  className={`px-3 mb-2 text-[12px] font-normal ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Expenses & Claims
                </p>
                <nav className="space-y-1 w-full">
                  {expensesNav.map((item) => {
                    const isActive = activeView === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          onNavigate(item.label);
                          onCloseMobile?.();
                        }}
                        className={`w-full flex items-center h-10 px-3 rounded-xl cursor-pointer transition-colors ${
                          isActive
                            ? isDark
                              ? "bg-white text-black font-semibold shadow-xs"
                            : "bg-black text-white font-medium shadow-xs"
                            : isDark
                            ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                            : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="text-[13.5px] font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="w-full space-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08]">
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobile?.();
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <Settings className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[13.5px] font-medium">Settings</span>
                </button>
              )}
              {onOpenHelp && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobile?.();
                    onOpenHelp();
                  }}
                  className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[13.5px] font-medium">Help</span>
                </button>
              )}

              {/* User Profile Card */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-100/80 dark:bg-white/[0.04] mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src="/rabil.jpg"
                      alt="Rabil Khan"
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80";
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-white truncate">
                        Rabil Khan
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        rabil@payout.finance
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
