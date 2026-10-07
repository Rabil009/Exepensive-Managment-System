"use client";

import React from "react";
import {
  Compass,
  CheckSquare,
  Receipt,
  Wallet,
  AlertTriangle,
  PieChart,
  ClipboardList,
  Settings,
  HelpCircle,
  Search,
  PlusCircle,
  PanelLeft,
} from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";

interface SlideOutIconRailProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPinSidebar: () => void;
  onQuickCreate: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenSearch: () => void;
}

export function SlideOutIconRail({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onPinSidebar,
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
}: SlideOutIconRailProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    activeView,
    setActiveView,
    awaitingVerificationCount,
    reimbursementsPendingCount,
    paymentsPendingCount,
    exceptions,
  } = useFinanceStore();

  const totalExceptions = exceptions.reduce((sum, e) => sum + e.count, 0);

  const navItems = [
    { label: "Dashboard", icon: Compass, badge: null },
    {
      label: "Verification",
      icon: CheckSquare,
      badge: awaitingVerificationCount > 0 ? awaitingVerificationCount : null,
    },
    {
      label: "Reimbursements",
      icon: Receipt,
      badge: reimbursementsPendingCount > 0 ? reimbursementsPendingCount : null,
    },
    {
      label: "Payments",
      icon: Wallet,
      badge: paymentsPendingCount > 0 ? paymentsPendingCount : null,
    },
    {
      label: "Exceptions",
      icon: AlertTriangle,
      badge: totalExceptions > 0 ? totalExceptions : null,
    },
  ];

  const documentItems = [
    { label: "Budgets", icon: PieChart },
    { label: "Reports", icon: ClipboardList },
  ];

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Slide-out Navigation"
      className={`fixed left-0 top-0 bottom-0 w-14 z-50 flex flex-col justify-between py-3 items-center border-r select-none transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform overflow-y-auto overflow-x-hidden ${
        isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
      } ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5] shadow-[6px_0_28px_rgba(0,0,0,0.65)]"
          : "bg-white border-zinc-200/80 text-zinc-900 shadow-[6px_0_24px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Top Group: Brand Logo & Navigation */}
      <div className="flex flex-col items-center w-full gap-2">
        {/* Pin / Expand Sidebar Button */}
        <button
          type="button"
          onClick={onPinSidebar}
          title="Pin sidebar open"
          className={`group relative flex items-center justify-center h-9 w-9 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
          }`}
        >
          <PanelLeft className="h-4 w-4 stroke-[1.85]" />

          {/* Floating Tooltip */}
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Pin sidebar open</span>
          </div>
        </button>

        {/* Quick Create Action Icon */}
        <button
          type="button"
          onClick={onQuickCreate}
          className={`group relative flex items-center justify-center h-9 w-9 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-300 hover:bg-white hover:text-black"
              : "text-zinc-800 hover:bg-black hover:text-white"
          }`}
        >
          <PlusCircle className="h-4 w-4 stroke-[2]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Quick Create</span>
          </div>
        </button>

        {/* Divider */}
        <div className={`h-px w-7 my-0.5 ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`} />

        {/* Main Navigation Icons */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {navItems.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                className={`group relative flex items-center justify-center h-9 w-9 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "bg-black text-white shadow-xs font-semibold"
                    : isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[1.85]" />

                {/* Badge Indicator Dot */}
                {item.badge !== null && !isActive && (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}

                {/* Floating Tooltip */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200 flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="text-[10px] opacity-75 font-semibold">({item.badge})</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className={`h-px w-7 my-0.5 ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`} />

        {/* Documents Navigation Icons */}
        <div className="flex flex-col items-center gap-1 w-full px-2">
          {documentItems.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                className={`group relative flex items-center justify-center h-9 w-9 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "bg-black text-white shadow-xs font-semibold"
                    : isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <item.icon className="h-4 w-4 stroke-[1.85]" />

                {/* Floating Tooltip */}
                <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Group: Quick Tools & Profile */}
      <div className="flex flex-col items-center w-full gap-1 px-2 pt-2">
        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className={`group relative flex items-center justify-center h-8 w-8 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
          }`}
        >
          <Search className="h-3.5 w-3.5 stroke-[1.85]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Search</span>
          </div>
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`group relative flex items-center justify-center h-8 w-8 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
          }`}
        >
          <Settings className="h-3.5 w-3.5 stroke-[1.85]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Settings</span>
          </div>
        </button>

        {/* Help */}
        <button
          type="button"
          onClick={onOpenHelp}
          className={`group relative flex items-center justify-center h-8 w-8 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5 stroke-[1.85]" />
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Get Help</span>
          </div>
        </button>

        {/* Divider */}
        <div className={`h-px w-7 my-1 ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`} />

        {/* User Avatar */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="group relative flex items-center justify-center h-8 w-8 rounded-lg cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
            alt="Aditya Kumar"
            className="h-7 w-7 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/[0.2]"
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-100 ease-out pointer-events-none z-50 shadow-xl border bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200">
            <span>Aditya Kumar (Settings)</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
