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
  MoreVertical,
  ChevronsUpDown,
  PanelLeft,
} from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";

interface SidebarProps {
  onToggleSidebar?: () => void;
  onQuickCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  onToggleSidebar,
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
}: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { activeView, setActiveView, awaitingVerificationCount, exceptions } = useFinanceStore();

  const totalExceptions = exceptions.reduce((sum, e) => sum + e.count, 0);

  const mainNav = [
    { label: "Dashboard", icon: Compass, count: null },
    { label: "Verification", icon: CheckSquare, count: null },
    { label: "Reimbursements", icon: Receipt, count: null },
    { label: "Payments", icon: Wallet, count: null },
    { label: "Exceptions", icon: AlertTriangle, count: null },
  ];

  const documentsNav = [
    { label: "Budgets", icon: PieChart, count: null },
    { label: "Reports", icon: ClipboardList, count: null },
  ];

  return (
    <aside className={`w-[235px] shrink-0 h-screen border-r flex flex-col justify-between select-none font-sans transition-colors ${
      isDark
        ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
        : "bg-white border-zinc-200/80 text-zinc-900"
    }`}>
      {/* Top Section */}
      <div className="p-4 pb-0 flex flex-col">
        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between px-2 py-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`h-5 w-5 rounded-full border-[1.8px] flex items-center justify-center ${
              isDark ? "border-white" : "border-zinc-900"
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-white" : "bg-zinc-900"}`} />
            </div>
            <span className={`text-[15px] font-semibold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              Payout
            </span>
          </div>

          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title="Close sidebar"
              aria-label="Close sidebar"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <PanelLeft className="h-4 w-4 stroke-[1.85]" />
            </button>
          )}
        </div>



        {/* Primary Navigation List (Airy, crisp, uncluttered) */}
        <nav className="space-y-1">
          {/* Quick Create - aligned seamlessly with nav items, no permanent black background */}
          <button
            type="button"
            onClick={onQuickCreate}
            className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] transition-all duration-150 text-left cursor-pointer font-medium ${
              isDark
                ? "text-zinc-200 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <PlusCircle className={`h-4 w-4 shrink-0 stroke-[2] transition-colors ${
                isDark ? "text-zinc-300 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
              }`} />
              <span className="transition-colors">Quick Create</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveView("Verification");
              }}
              title="Inbox / Pending"
              className={`p-1 rounded transition-colors ${
                isDark
                  ? "hover:bg-white/20 text-zinc-400 group-hover:text-black"
                  : "hover:bg-zinc-200/80 text-zinc-500 group-hover:text-zinc-300"
              }`}
            >
              <Mail className="h-3.5 w-3.5 stroke-[1.8]" />
            </div>
          </button>

          {mainNav.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-black text-white font-medium shadow-sm"
                    : isDark
                    ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                    : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
                      isActive
                        ? isDark
                          ? "text-black"
                          : "text-white"
                        : isDark
                        ? "text-zinc-400 group-hover:text-black"
                        : "text-zinc-800 group-hover:text-white"
                    }`}
                  />
                  <span className="transition-colors">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Documents / Treasury Group (Soft Sentence-case, airy spacing) */}
        <div className="mt-7">
          <p className={`px-3 pb-2 text-[13px] font-normal ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Documents
          </p>
          <nav className="space-y-1">
            {documentsNav.map((item) => {
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveView(item.label)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? isDark
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "bg-black text-white font-medium shadow-sm"
                      : isDark
                      ? "text-zinc-300 font-medium hover:bg-white hover:text-black"
                      : "text-zinc-900 font-medium hover:bg-black hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
                        isActive
                          ? isDark
                            ? "text-black"
                            : "text-white"
                          : isDark
                          ? "text-zinc-400 group-hover:text-black"
                          : "text-zinc-800 group-hover:text-white"
                      }`}
                    />
                    <span className="transition-colors">{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* More Option */}
            <button
              type="button"
              onClick={onOpenSettings}
              className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 text-left cursor-pointer ${
                isDark
                  ? "text-zinc-300 hover:bg-white hover:text-black"
                  : "text-zinc-900 hover:bg-black hover:text-white"
              }`}
            >
              <MoreHorizontal className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
                isDark ? "text-zinc-400 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
              }`} />
              <span>More</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings, Help, Search, User Profile */}
      <div className="p-4 pt-0 space-y-1">
        {[
          { label: "Settings", icon: Settings, action: onOpenSettings },
          { label: "Get Help", icon: HelpCircle, action: onOpenHelp },
          { label: "Search", icon: Search, action: onOpenSearch },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 text-left cursor-pointer ${
              isDark
                ? "text-zinc-300 hover:bg-white hover:text-black"
                : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <item.icon className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
              isDark ? "text-zinc-400 group-hover:text-black" : "text-zinc-800 group-hover:text-white"
            }`} />
            <span>{item.label}</span>
          </button>
        ))}

        {/* User Profile Card (Shadcn style clean layout) */}
        <div className={`pt-2 mt-2 border-t ${isDark ? "border-white/[0.08]" : "border-zinc-200/80"}`}>
          <button
            type="button"
            onClick={onOpenSettings}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-left group ${
              isDark ? "hover:bg-white hover:text-black text-white" : "hover:bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
                alt="Aditya Kumar"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className={`text-[13px] font-semibold truncate leading-tight transition-colors ${
                  isDark ? "text-white group-hover:text-black" : "text-zinc-900"
                }`}>
                  Aditya Kumar
                </span>
                <span className={`text-[11px] truncate leading-tight mt-0.5 transition-colors ${
                  isDark ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500"
                }`}>
                  aditya@payout.finance
                </span>
              </div>
            </div>
            <ChevronsUpDown className={`h-4 w-4 shrink-0 transition-colors ${
              isDark ? "text-zinc-500 group-hover:text-black" : "text-zinc-400 group-hover:text-zinc-700"
            }`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
