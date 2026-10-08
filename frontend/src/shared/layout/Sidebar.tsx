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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("payout_user_role");
      localStorage.removeItem("payout_user_email");
    }
    router.push("/");
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

  const renderNavButton = (item: { label: string; icon: any; path: string }) => {
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
        {/* Workspace Brand Header */}
        <div
          className={`flex items-center h-9 px-1 mb-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 overflow-hidden transition-all duration-200 ${
              isCollapsed
                ? "max-w-0 opacity-0 pointer-events-none"
                : "max-w-[140px] opacity-100"
            }`}
          >
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
              className={`text-[15px] font-semibold tracking-tight whitespace-nowrap ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Payout
            </span>
          </div>

          {/* Collapse/Expand Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            <PanelLeft className="h-4 w-4 stroke-[1.85]" />
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

        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            title={isCollapsed ? "Search" : undefined}
            className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
              isDark
                ? "text-zinc-300 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <Search
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
              <span className="text-[13.5px] font-medium">Search</span>
            </div>
          </button>
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

        {/* User Profile Card */}
        <div
          className={`pt-2 mt-2 border-t relative ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
          ref={profileRef}
        >
          {isProfileOpen && (
            <div
              className={`z-50 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/50 p-1.5 transition-all animate-in fade-in zoom-in-95 duration-150 ${
                isCollapsed
                  ? "fixed left-[72px] bottom-3 w-60"
                  : "absolute bottom-[calc(100%+8px)] left-0 right-0"
              }`}
            >
              {/* Profile info header */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.04]">
                <img
                  src="/rabil.jpg"
                  alt="Rabil Khan"
                  className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80";
                  }}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold truncate text-zinc-900 dark:text-white leading-tight">
                      Rabil Khan
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-white/[0.1] text-zinc-700 dark:text-zinc-300">
                      Employee
                    </span>
                  </div>
                  <span className="text-[11px] truncate text-zinc-500 dark:text-zinc-400 mt-0.5">
                    rabil@payout.finance
                  </span>
                </div>
              </div>

              <div className="h-px bg-zinc-200/80 dark:bg-white/[0.08] my-1" />

              {/* Account Settings */}
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

              {/* Divider */}
              <div className="h-px bg-zinc-200/80 dark:bg-white/[0.08] my-1" />

              {/* Log Out Button */}
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

          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            title={isCollapsed ? "Rabil Khan - Profile & Logout" : undefined}
            className={`w-full flex items-center h-11 px-1 rounded-xl cursor-pointer text-left group transition-colors duration-150 ${
              isProfileOpen
                ? isDark
                  ? "bg-white/[0.12] text-white"
                  : "bg-zinc-200/70 text-zinc-950"
                : isDark
                ? "hover:bg-white hover:text-black text-white"
                : "hover:bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center">
              <img
                src="/rabil.jpg"
                alt="Rabil Khan"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces&auto=format&q=80";
                }}
              />
            </div>

            <div
              className={`flex items-center justify-between flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                isCollapsed
                  ? "max-w-0 opacity-0 pointer-events-none ml-0"
                  : "max-w-[170px] opacity-100"
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[13px] font-semibold truncate leading-tight ${
                    isDark ? "text-white group-hover:text-black" : "text-zinc-900"
                  }`}
                >
                  Rabil Khan
                </span>
                <span
                  className={`text-[11px] truncate leading-tight mt-0.5 ${
                    isDark
                      ? "text-zinc-400 group-hover:text-zinc-600"
                      : "text-zinc-500"
                  }`}
                >
                  rabil@payout.finance
                </span>
              </div>
              <ChevronsUpDown
                className={`h-4 w-4 shrink-0 ${
                  isDark
                    ? "text-zinc-500 group-hover:text-black"
                    : "text-zinc-400 group-hover:text-zinc-700"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
      </aside>

      {/* Mobile Drawer (Full Slide-Over with Backdrop) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div
            className={`relative w-[280px] max-w-[85vw] h-full flex flex-col justify-between p-3.5 shadow-2xl z-10 animate-in slide-in-from-left duration-200 ${
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
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobile?.();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[13.5px] font-medium">Search</span>
                </button>
              )}
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
