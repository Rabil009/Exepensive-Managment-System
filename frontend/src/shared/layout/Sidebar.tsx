"use client";

import React from "react";
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
}

export function Sidebar({
  activeView,
  onNavigate,
  isCollapsed = false,
  onToggleSidebar,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
}: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <aside
      style={{ willChange: "width" }}
      aria-label="Employee Navigation"
      className={`shrink-0 h-screen border-r flex flex-col justify-between overflow-hidden select-none font-sans px-2.5 py-3 transition-[width] duration-200 ease-in-out ${
        isCollapsed ? "w-[64px]" : "w-[240px]"
      } ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
          : "bg-white border-zinc-200/80 text-zinc-900"
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
          className={`pt-2 mt-2 border-t ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
        >
          <button
            type="button"
            onClick={onOpenSettings}
            title={isCollapsed ? "Rabil Khan - Settings" : undefined}
            className={`w-full flex items-center h-11 px-1 rounded-xl cursor-pointer text-left group transition-colors duration-150 ${
              isDark
                ? "hover:bg-white hover:text-black text-white"
                : "hover:bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 ring-1 ring-zinc-300 dark:ring-white/20 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              RK
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
  );
}

export default Sidebar;
