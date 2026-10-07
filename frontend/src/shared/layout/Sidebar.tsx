import { SidebarToggle } from "./SidebarToggle";

import React from "react";
import {
  Settings,
  HelpCircle,
  Search,
  PlusCircle,
  ChevronsUpDown,
} from "lucide-react";
import { useTheme } from "../theme/theme-store";

import type { NavigationItem, SidebarUser } from "./navigation.types";

interface SidebarProps {
  activeView: string;
  onNavigate: (label: string) => void;
  navItems: NavigationItem[];
  user: SidebarUser;
  quickCreateLabel?: string;
  onQuickCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
  onToggleSidebar: () => void;
}

export function Sidebar({
  activeView,
  onNavigate: setActiveView,
  navItems,
  user,
  quickCreateLabel = "Quick Create",
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
  onToggleSidebar,
}: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <aside
      aria-label="Main navigation"
      className={`w-[235px] shrink-0 h-screen border-r flex flex-col justify-between select-none font-sans transition-colors ${
        isDark
          ? "bg-[var(--surface-navigation)] border-white/[0.08] text-[#F4F4F5]"
          : "bg-[var(--surface-navigation)] border-zinc-200/80 text-zinc-900"
      }`}
    >
      {/* Top Section */}
      <div className="p-4 pb-0 flex flex-col">
        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between px-2 py-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-5 w-5 rounded-full border-[1.8px] flex items-center justify-center ${
                isDark ? "border-white" : "border-zinc-900"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-white" : "bg-zinc-900"}`}
              />
            </div>
            <span
              className={`text-[15px] font-semibold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              Payout
            </span>
          </div>
          <SidebarToggle expanded onToggle={onToggleSidebar} />
        </div>

        {/* Primary Navigation List (Airy, crisp, uncluttered) */}
        <nav className="space-y-1">
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-zinc-900 dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <Search className="h-4 w-4 shrink-0 stroke-[1.85]" />
              <span>Search</span>
            </button>
          )}
          {/* Quick Create - aligned seamlessly with nav items, no permanent black background */}
          <button
            type="button"
            onClick={onQuickCreate}
            aria-current={activeView === quickCreateLabel ? "page" : undefined}
            className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] transition-all duration-150 text-left cursor-pointer font-medium ${
              activeView === quickCreateLabel
                ? isDark
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-black text-white font-medium shadow-sm"
                : isDark
                  ? "text-zinc-200 hover:bg-white hover:text-black"
                  : "text-zinc-900 hover:bg-black hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <PlusCircle
                className={`h-4 w-4 shrink-0 stroke-[2] transition-colors ${
                  activeView === quickCreateLabel
                    ? "text-current"
                    : isDark
                      ? "text-zinc-300 group-hover:text-black"
                      : "text-zinc-800 group-hover:text-white"
                }`}
              />
              <span className="transition-colors">{quickCreateLabel}</span>
            </div>
          </button>

          {navItems.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                aria-current={isActive ? "page" : undefined}
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
      </div>

      {/* Bottom Section: Settings, Help, Search, User Profile */}
      <div className="p-4 pt-0 space-y-1">
        {[
          { label: "Settings", icon: Settings, action: onOpenSettings },
          { label: "Get Help", icon: HelpCircle, action: onOpenHelp },
        ]
          .filter((item) => item.action)
          .map((item) => (
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
              <item.icon
                className={`h-4 w-4 shrink-0 stroke-[1.85] transition-colors ${
                  isDark
                    ? "text-zinc-400 group-hover:text-black"
                    : "text-zinc-800 group-hover:text-white"
                }`}
              />
              <span>{item.label}</span>
            </button>
          ))}

        {/* User Profile Card (Shadcn style clean layout) */}
        <div
          className={`pt-2 mt-2 border-t ${isDark ? "border-white/[0.08]" : "border-zinc-200/80"}`}
        >
          <button
            type="button"
            onClick={onOpenSettings}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer text-left group ${
              isDark
                ? "hover:bg-white hover:text-black text-white"
                : "hover:bg-zinc-100 text-zinc-900"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ring-1 shrink-0 text-xs font-semibold ${isDark ? "bg-zinc-800 ring-zinc-700 text-zinc-200" : "bg-zinc-100 ring-zinc-300 text-zinc-900"}`}
              >
                {user.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[13px] font-semibold truncate leading-tight transition-colors ${
                    isDark
                      ? "text-white group-hover:text-black"
                      : "text-zinc-900"
                  }`}
                >
                  {user.name}
                </span>
                <span
                  className={`text-[11px] truncate leading-tight mt-0.5 transition-colors ${
                    isDark
                      ? "text-zinc-400 group-hover:text-zinc-600"
                      : "text-zinc-500"
                  }`}
                >
                  {user.subtitle}
                </span>
              </div>
            </div>
            <ChevronsUpDown
              className={`h-4 w-4 shrink-0 transition-colors ${
                isDark
                  ? "text-zinc-500 group-hover:text-black"
                  : "text-zinc-400 group-hover:text-zinc-700"
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
