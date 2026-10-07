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
  MoreHorizontal,
  Settings,
  HelpCircle,
  Search,
  PlusCircle,
  Mail,
  ChevronsUpDown,
  PanelLeft,
} from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleSidebar?: () => void;
  onQuickCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onToggleSidebar,
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
}: SidebarProps) {
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

  const mainNav = [
    { label: "Dashboard", icon: Compass, count: null, hasBadge: false },
    {
      label: "Verification",
      icon: CheckSquare,
      count: awaitingVerificationCount,
      hasBadge: awaitingVerificationCount > 0,
    },
    {
      label: "Reimbursements",
      icon: Receipt,
      count: reimbursementsPendingCount,
      hasBadge: reimbursementsPendingCount > 0,
    },
    {
      label: "Payments",
      icon: Wallet,
      count: paymentsPendingCount,
      hasBadge: paymentsPendingCount > 0,
    },
    {
      label: "Exceptions",
      icon: AlertTriangle,
      count: totalExceptions,
      hasBadge: totalExceptions > 0,
    },
  ];

  const documentsNav = [
    { label: "Budgets", icon: PieChart },
    { label: "Reports", icon: ClipboardList },
  ];

  const bottomItems = [
    { label: "Settings", icon: Settings, action: onOpenSettings },
    { label: "Get Help", icon: HelpCircle, action: onOpenHelp },
    { label: "Search", icon: Search, action: onOpenSearch },
  ];

  const handleToggle = onToggleCollapse || onToggleSidebar;

  return (
    <aside
      style={{ willChange: "width" }}
      className={`shrink-0 h-screen border-r flex flex-col justify-between overflow-hidden select-none font-sans px-2.5 py-3 transition-[width] duration-200 ease-in-out ${
        isCollapsed ? "w-[64px]" : "w-[240px]"
      } ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
          : "bg-white border-zinc-200/80 text-zinc-900"
      }`}
    >
      {/* Top Group: Brand Header & Navigation */}
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
          {handleToggle && (
            <button
              type="button"
              onClick={handleToggle}
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
          )}
        </div>

        {/* Primary Navigation List */}
        <nav className="space-y-1 w-full">
          {/* Quick Create */}
          {onQuickCreate && (
            <button
              type="button"
              onClick={onQuickCreate}
              title={isCollapsed ? "Quick Create" : undefined}
              className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                isDark
                  ? "text-zinc-200 hover:bg-white hover:text-black"
                  : "text-zinc-900 hover:bg-black hover:text-white"
              }`}
            >
              <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                <PlusCircle
                  className={`h-4 w-4 stroke-[2] ${
                    isDark ? "text-zinc-300 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
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
                <span className="text-[13.5px] font-medium">Quick Create</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView("Verification");
                  }}
                  title="Inbox / Pending"
                  className={`p-1 rounded ${
                    isDark
                      ? "hover:bg-white/20 text-zinc-400 group-hover:text-black"
                      : "hover:bg-zinc-200/80 text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 stroke-[1.8]" />
                </div>
              </div>
            </button>
          )}

          {/* Main Nav Items */}
          {mainNav.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                title={isCollapsed ? item.label : undefined}
                className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                  isActive
                    ? isDark
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-black text-white font-medium shadow-sm"
                    : isDark
                    ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                    : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                }`}
              >
                <div className="h-7 w-7 shrink-0 flex items-center justify-center relative">
                  <item.icon
                    className={`h-4 w-4 stroke-[1.85] ${
                      isActive
                        ? isDark
                          ? "text-black"
                          : "text-white"
                        : isDark
                        ? "text-zinc-400 group-hover:text-black"
                        : "text-zinc-800 group-hover:text-white"
                    }`}
                  />
                  {isCollapsed && item.hasBadge && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#09090B]" />
                  )}
                </div>

                <div
                  className={`flex items-center justify-between flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                    isCollapsed
                      ? "max-w-0 opacity-0 pointer-events-none ml-0"
                      : "max-w-[170px] opacity-100"
                  }`}
                >
                  <span className="text-[13.5px] font-medium truncate">{item.label}</span>
                  {item.count && item.count > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums shrink-0 ${
                        isActive
                          ? isDark
                            ? "bg-black text-white"
                            : "bg-white text-black"
                          : isDark
                          ? "bg-white/10 text-zinc-300"
                          : "bg-zinc-200 text-zinc-800"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Documents Group */}
        <div className="mt-4">
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isCollapsed ? "max-h-0 opacity-0 pointer-events-none mb-0" : "max-h-6 opacity-100 mb-1"
            }`}
          >
            <p className={`px-2 text-[12px] font-normal ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Documents
            </p>
          </div>
          {isCollapsed && (
            <div className={`w-6 h-[1px] my-2 mx-auto ${isDark ? "bg-white/[0.08]" : "bg-zinc-200/80"}`} />
          )}

          <nav className="space-y-1 w-full">
            {documentsNav.map((item) => {
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveView(item.label)}
                  title={isCollapsed ? item.label : undefined}
                  className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                    isActive
                      ? isDark
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "bg-black text-white font-medium shadow-sm"
                      : isDark
                      ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                      : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                  }`}
                >
                  <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                    <item.icon
                      className={`h-4 w-4 stroke-[1.85] ${
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
                    className={`flex items-center flex-1 whitespace-nowrap ml-2.5 overflow-hidden transition-all duration-200 ${
                      isCollapsed
                        ? "max-w-0 opacity-0 pointer-events-none ml-0"
                        : "max-w-[170px] opacity-100"
                    }`}
                  >
                    <span className="text-[13.5px] font-medium">{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* More Option (Expanded Only) */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
                  isDark
                    ? "text-zinc-300 hover:bg-white hover:text-black"
                    : "text-zinc-900 hover:bg-black hover:text-white"
                } ${isCollapsed ? "hidden" : ""}`}
              >
                <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                  <MoreHorizontal
                    className={`h-4 w-4 stroke-[1.85] ${
                      isDark ? "text-zinc-400 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
                    }`}
                  />
                </div>
                <div className="ml-2.5 whitespace-nowrap">
                  <span className="text-[13.5px] font-medium">More</span>
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings, Help, Search, User Profile */}
      <div className="w-full space-y-1">
        {isCollapsed && (
          <div className={`w-6 h-[1px] my-2 mx-auto ${isDark ? "bg-white/[0.08]" : "bg-zinc-200/80"}`} />
        )}

        {bottomItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            title={isCollapsed ? item.label : undefined}
            className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 ${
              isDark
                ? "text-zinc-300 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <item.icon
                className={`h-4 w-4 stroke-[1.85] ${
                  isDark ? "text-zinc-400 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
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
              <span className="text-[13.5px] font-medium">{item.label}</span>
            </div>
          </button>
        ))}

        {/* User Profile Card */}
        <div className={`pt-2 mt-2 border-t ${isDark ? "border-white/[0.08]" : "border-zinc-200/80"}`}>
          <button
            type="button"
            onClick={onOpenSettings}
            title={isCollapsed ? "Aditya Kumar - Settings" : undefined}
            className={`w-full flex items-center h-11 px-1 rounded-xl cursor-pointer text-left group transition-colors duration-150 ${
              isDark ? "hover:bg-white hover:text-black text-white" : "hover:bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="h-8 w-8 shrink-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
                alt="Aditya Kumar"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20"
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
                  Aditya Kumar
                </span>
                <span
                  className={`text-[11px] truncate leading-tight mt-0.5 ${
                    isDark ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500"
                  }`}
                >
                  aditya@payout.finance
                </span>
              </div>
              <ChevronsUpDown
                className={`h-4 w-4 shrink-0 ${
                  isDark ? "text-zinc-500 group-hover:text-black" : "text-zinc-400 group-hover:text-zinc-700"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
