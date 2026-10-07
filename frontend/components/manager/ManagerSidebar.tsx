"use client";

import React from "react";
import {
  CheckSquare,
  Wallet,
  PieChart,
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  Settings,
  PanelLeft,
} from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export type ManagerView =
  | "Approvals"
  | "Team Spend"
  | "Budgets"
  | "Exceptions"
  | "Reports"
  | "Policies";

interface ManagerSidebarProps {
  activeView: ManagerView;
  setActiveView: (view: ManagerView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenSettings: () => void;
}

export function ManagerSidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  onOpenSettings,
}: ManagerSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const mainNav: { label: ManagerView; icon: any; count: number | null }[] = [
    { label: "Approvals", icon: CheckSquare, count: 12 },
    { label: "Team Spend", icon: Wallet, count: null },
    { label: "Budgets", icon: PieChart, count: null },
    { label: "Exceptions", icon: AlertTriangle, count: 3 },
  ];

  const documentsNav: { label: ManagerView; icon: any }[] = [
    { label: "Reports", icon: ClipboardList },
    { label: "Policies", icon: ShieldCheck },
  ];

  return (
    <aside
      aria-label="Manager Navigation"
      className={`h-screen sticky top-0 shrink-0 z-30 flex flex-col justify-between border-r select-none transition-all duration-200 ${
        isCollapsed ? "w-14 items-center py-3" : "w-60 p-4"
      } ${
        isDark
          ? "bg-[#09090B] border-white/[0.08] text-[#F4F4F5]"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
    >
      {/* Top Group */}
      <div className="flex flex-col w-full">
        {/* Header / Brand */}
        <div
          className={`flex items-center ${
            isCollapsed
              ? "justify-center mb-3"
              : "justify-between pb-4 mb-4 border-b"
          } ${isDark ? "border-white/[0.08]" : "border-zinc-200"}`}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div
                className={`h-6 w-6 rounded-lg flex items-center justify-center border ${
                  isDark
                    ? "bg-white/[0.08] border-white/[0.12]"
                    : "bg-zinc-100 border-zinc-300"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    isDark ? "bg-emerald-400" : "bg-emerald-600"
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
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Manager
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <PanelLeft className="h-4 w-4 stroke-[1.85]" />
            </button>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
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

        {/* Primary Navigation List */}
        <nav className={`space-y-1 w-full ${isCollapsed ? "px-1" : ""}`}>
          {mainNav.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                title={isCollapsed ? item.label : undefined}
                className={`group w-full flex items-center ${
                  isCollapsed
                    ? "justify-center h-9 w-9 rounded-lg"
                    : "justify-between px-3 py-2 rounded-lg text-[13.5px]"
                } transition-all cursor-pointer font-medium ${
                  isActive
                    ? isDark
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "bg-black text-white font-medium shadow-xs"
                    : isDark
                    ? "text-zinc-300 hover:bg-white hover:text-black"
                    : "text-zinc-900 hover:bg-black hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
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
                  {!isCollapsed && (
                    <span className="transition-colors truncate">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && item.count !== null && (
                  <span
                    className={`h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-medium leading-none shrink-0 transition-colors ${
                      isActive
                        ? isDark
                          ? "bg-black/15 text-black font-semibold"
                          : "bg-white/20 text-white font-semibold"
                        : isDark
                        ? "bg-white/[0.12] text-zinc-200 group-hover:bg-black/15 group-hover:text-black"
                        : "bg-[#E5E7EB] text-zinc-800 group-hover:bg-white/20 group-hover:text-white"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          className={`my-3 ${
            isCollapsed ? "h-px w-7 mx-auto" : "h-px w-full"
          } ${isDark ? "bg-white/[0.08]" : "bg-zinc-200"}`}
        />

        {/* Documents Group */}
        <div className="w-full">
          {!isCollapsed && (
            <p
              className={`px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Documents & Policies
            </p>
          )}
          <nav className={`space-y-1 w-full ${isCollapsed ? "px-1" : ""}`}>
            {documentsNav.map((item) => {
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveView(item.label)}
                  title={isCollapsed ? item.label : undefined}
                  className={`group w-full flex items-center ${
                    isCollapsed
                      ? "justify-center h-9 w-9 rounded-lg"
                      : "justify-between px-3 py-2 rounded-lg text-[13.5px]"
                  } transition-all cursor-pointer font-medium ${
                    isActive
                      ? isDark
                        ? "bg-white text-black font-semibold shadow-xs"
                        : "bg-black text-white font-medium shadow-xs"
                      : isDark
                      ? "text-zinc-300 hover:bg-white hover:text-black"
                      : "text-zinc-900 hover:bg-black hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                    {!isCollapsed && (
                      <span className="transition-colors truncate">
                        {item.label}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & Tejaswini User Profile */}
      <div
        className={`w-full flex flex-col ${
          isCollapsed ? "items-center gap-1.5 px-1 pt-2" : "gap-2 pt-3 border-t"
        } ${isDark ? "border-white/[0.08]" : "border-zinc-200"}`}
      >
        <button
          type="button"
          onClick={onOpenSettings}
          title={isCollapsed ? "Settings" : undefined}
          className={`group flex items-center ${
            isCollapsed
              ? "justify-center h-8 w-8 rounded-lg"
              : "w-full gap-3 px-3 py-2 rounded-lg text-[13.5px]"
          } font-medium transition-all cursor-pointer ${
            isDark
              ? "text-zinc-300 hover:bg-white hover:text-black"
              : "text-zinc-900 hover:bg-black hover:text-white"
          }`}
        >
          <Settings
            className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
              isDark
                ? "text-zinc-400 group-hover:text-black"
                : "text-zinc-800 group-hover:text-white"
            }`}
          />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* User Profile */}
        <div
          onClick={onOpenSettings}
          className={`flex items-center ${
            isCollapsed ? "justify-center p-1" : "gap-3 px-3 py-2 rounded-lg"
          } transition-colors cursor-pointer group ${
            isDark ? "hover:bg-white/[0.04]" : "hover:bg-zinc-100"
          }`}
          title="Tejaswini - Settings"
        >
          <img
            src="/tejaswini.jpg"
            alt="Tejaswini"
            className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-white/20 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces&auto=format&q=80";
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[13px] font-semibold truncate leading-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Tejaswini
              </span>
              <span
                className={`text-[11px] truncate leading-tight mt-0.5 ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                tejaswini@payout.finance
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ManagerSidebar;