"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  LogOut,
  X,
} from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleSidebar?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onQuickCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onToggleSidebar,
  isMobileOpen = false,
  onCloseMobile,
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
}: SidebarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <>
      <aside
        style={{ willChange: "width" }}
        aria-label="Finance Navigation"
        className={`hidden md:flex shrink-0 h-screen border-r flex-col justify-between overflow-hidden select-none font-sans px-2.5 py-3 ${
          mounted ? "transition-[width] duration-300 ease-in-out" : ""
        } ${
          isCollapsed ? "w-[64px]" : "w-[240px]"
        } bg-[#F7F7F8] dark:bg-[#131316] border-zinc-200/90 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5]`}
      >
      {/* Top Group: Brand Header & Navigation */}
      <div className="flex flex-col w-full">
        {/* Workspace Brand Header */}
        <div className="flex items-center h-9 px-1 mb-3 relative overflow-hidden">
          {/* Workspace Brand Logo & Name */}
          <div
            className={`flex items-center gap-2.5 transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "w-0 opacity-0 -translate-x-3 pointer-events-none"
                : "w-auto opacity-100 translate-x-0"
            }`}
          >
            <div className="h-5 w-5 rounded-full border-[1.8px] border-zinc-900 dark:border-white flex items-center justify-center shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-zinc-900 dark:text-white">
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
              className={`h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer shrink-0 transition-colors text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08] ${
                isCollapsed ? "mx-auto" : "ml-auto"
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
              className="group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 text-zinc-900 hover:bg-black hover:text-white dark:text-zinc-200 dark:hover:bg-white dark:hover:text-black"
            >
              <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                <PlusCircle className="h-4 w-4 stroke-[2] text-zinc-800 group-hover:text-white dark:text-zinc-300 dark:group-hover:text-black transition-colors" />
              </div>

              <div
                className={`flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isCollapsed
                    ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                    : "w-[160px] opacity-100 translate-x-0 ml-2.5"
                }`}
              >
                <span className="text-[13.5px] font-medium truncate">Quick Create</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView("Verification");
                  }}
                  title="Inbox / Pending"
                  className="p-1 rounded hover:bg-zinc-200/80 text-zinc-500 group-hover:text-zinc-300 dark:text-zinc-400 dark:hover:bg-white/20 dark:group-hover:text-black transition-colors"
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
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                    : "text-zinc-900 dark:text-zinc-300 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                <div className="h-7 w-7 shrink-0 flex items-center justify-center relative">
                  <item.icon
                    className={`h-4 w-4 stroke-[1.85] transition-colors ${
                      isActive
                        ? "text-white dark:text-black"
                        : "text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black"
                    }`}
                  />
                  {/* Subtle collapsed notification badge dot */}
                  <span
                    className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-[#F7F7F8] dark:ring-[#131316] transition-opacity duration-300 ${
                      isCollapsed && item.hasBadge ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  />
                </div>

                <div
                  className={`flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed
                      ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                      : "w-[160px] opacity-100 translate-x-0 ml-2.5"
                  }`}
                >
                  <span className="text-[13.5px] font-medium truncate">{item.label}</span>
                  {!isCollapsed && item.count !== undefined && item.count !== null && item.count > 0 && (
                    <span
                      className={`h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-sans font-medium leading-none shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white dark:bg-black/15 dark:text-black font-semibold"
                          : "bg-[#E5E7EB] text-zinc-800 group-hover:bg-white/20 group-hover:text-white dark:bg-white/[0.12] dark:text-zinc-200 dark:group-hover:bg-black/15 dark:group-hover:text-black"
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
        <div className="mt-4 w-full">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "max-h-0 opacity-0 pointer-events-none mb-0" : "max-h-6 opacity-100 mb-1"
            }`}
          >
            <p className="px-2 text-[12px] font-normal text-zinc-500 dark:text-zinc-400">
              Documents
            </p>
          </div>

          <div
            className={`w-6 h-[1px] mx-auto bg-zinc-200/80 dark:bg-white/[0.08] transition-all duration-300 ${
              isCollapsed ? "my-2 opacity-100 max-h-[1px]" : "my-0 opacity-0 max-h-0 pointer-events-none overflow-hidden"
            }`}
          />

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
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                      : "text-zinc-900 dark:text-zinc-300 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  }`}
                >
                  <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                    <item.icon
                      className={`h-4 w-4 stroke-[1.85] transition-colors ${
                        isActive
                          ? "text-white dark:text-black"
                          : "text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black"
                      }`}
                    />
                  </div>

                  <div
                    className={`flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                      isCollapsed
                        ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                        : "w-[160px] opacity-100 translate-x-0 ml-2.5"
                    }`}
                  >
                    <span className="text-[13.5px] font-medium truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* More Option (Expanded Only) */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title={isCollapsed ? "More" : undefined}
                className={`group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer text-left transition-colors duration-150 text-zinc-900 dark:text-zinc-300 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black ${
                  isCollapsed
                    ? "h-0 opacity-0 pointer-events-none my-0 py-0 overflow-hidden"
                    : "h-10 opacity-100"
                }`}
              >
                <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 stroke-[1.85] text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black transition-colors" />
                </div>
                <div
                  className={`flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed
                      ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                      : "w-[160px] opacity-100 translate-x-0 ml-2.5"
                  }`}
                >
                  <span className="text-[13.5px] font-medium truncate">More</span>
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings, Help, Search, User Profile */}
      <div className="w-full space-y-1">
        <div
          className={`w-6 h-[1px] mx-auto bg-zinc-200/80 dark:bg-white/[0.08] transition-all duration-300 ${
            isCollapsed ? "my-2 opacity-100 max-h-[1px]" : "my-0 opacity-0 max-h-0 pointer-events-none overflow-hidden"
          }`}
        />

        {bottomItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            title={isCollapsed ? item.label : undefined}
            className="group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer transition-colors duration-150 text-zinc-900 hover:bg-black hover:text-white dark:text-zinc-300 dark:hover:bg-white dark:hover:text-black"
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <item.icon className="h-4 w-4 stroke-[1.85] text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black transition-colors" />
            </div>

            <div
              className={`flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                  : "w-[160px] opacity-100 translate-x-0 ml-2.5"
              }`}
            >
              <span className="text-[13.5px] font-medium">{item.label}</span>
            </div>
          </button>
        ))}

        {/* User Profile Card */}
        <div className="pt-2 mt-2 border-t border-zinc-200/80 dark:border-white/[0.08] relative" ref={profileRef}>
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
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format&q=80"
                  alt="Aditya Kumar"
                  className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-white/20 shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold truncate text-zinc-900 dark:text-white leading-tight">
                      Aditya Kumar
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-200/70 dark:bg-white/[0.1] text-zinc-700 dark:text-zinc-300">
                      Finance
                    </span>
                  </div>
                  <span className="text-[11px] truncate text-zinc-500 dark:text-zinc-400 mt-0.5">
                    aditya@payout.finance
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
            title={isCollapsed ? "Aditya Kumar - Profile & Logout" : undefined}
            className={`w-full flex items-center h-11 px-1 rounded-xl cursor-pointer text-left group transition-colors duration-150 ${
              isProfileOpen
                ? "bg-zinc-200/70 dark:bg-white/[0.12] text-zinc-950 dark:text-white"
                : "hover:bg-zinc-100 text-zinc-900 dark:text-white dark:hover:bg-white dark:hover:text-black"
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
              className={`flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                  : "w-[160px] opacity-100 translate-x-0 ml-2.5"
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold truncate leading-tight text-zinc-900 dark:text-white dark:group-hover:text-black">
                  Aditya Kumar
                </span>
                <span className="text-[11px] truncate leading-tight mt-0.5 text-zinc-500 dark:text-zinc-400 dark:group-hover:text-zinc-600">
                  aditya@payout.finance
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-black transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Finance Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw] flex flex-col justify-between overflow-y-auto select-none font-sans px-3 py-3.5 bg-[#F7F7F8] dark:bg-[#131316] border-r border-zinc-200/90 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5] shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between h-9 px-1 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-5 rounded-full border-[1.8px] border-zinc-900 dark:border-white flex items-center justify-center shrink-0">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                Payout
              </span>
            </div>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Create */}
          {onQuickCreate && (
            <button
              type="button"
              onClick={() => {
                onQuickCreate();
                onCloseMobile?.();
              }}
              className="group w-full flex items-center h-10 px-2 rounded-xl cursor-pointer transition-colors duration-150 text-zinc-900 hover:bg-black hover:text-white dark:text-zinc-200 dark:hover:bg-white dark:hover:text-black mb-1"
            >
              <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                <PlusCircle className="h-4 w-4 stroke-[2]" />
              </div>
              <span className="text-[13.5px] font-medium ml-2.5">Quick Create</span>
            </button>
          )}

          {/* Main Nav Items */}
          <nav className="space-y-1 w-full">
            {mainNav.map((item) => {
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setActiveView(item.label);
                    onCloseMobile?.();
                  }}
                  className={`group w-full flex items-center justify-between h-10 px-2 rounded-xl cursor-pointer transition-colors duration-150 ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                      : "text-zinc-900 dark:text-zinc-300 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                      <item.icon className="h-4 w-4 stroke-[1.85]" />
                    </div>
                    <span className="text-[13.5px] font-medium">{item.label}</span>
                  </div>
                  {item.count && item.count > 0 && (
                    <span
                      className={`h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-medium leading-none ${
                        isActive
                          ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                          : "bg-[#E5E7EB] text-zinc-800 dark:bg-white/[0.12] dark:text-zinc-200"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Documents */}
          <div className="mt-4 w-full">
            <p className="px-2 text-[12px] font-normal text-zinc-500 dark:text-zinc-400 mb-1">
              Documents
            </p>
            <nav className="space-y-1 w-full">
              {documentsNav.map((item) => {
                const isActive = activeView === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setActiveView(item.label);
                      onCloseMobile?.();
                    }}
                    className={`group w-full flex items-center h-10 px-2 rounded-xl cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                        : "text-zinc-900 dark:text-zinc-300 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    }`}
                  >
                    <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                      <item.icon className="h-4 w-4 stroke-[1.85]" />
                    </div>
                    <span className="text-[13.5px] font-medium ml-2.5">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full space-y-1 mt-4">
          <div className="space-y-0.5">
            {bottomItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.action?.();
                  onCloseMobile?.();
                }}
                className="w-full flex items-center h-9 px-2 rounded-xl cursor-pointer transition-colors duration-150 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]"
              >
                <div className="h-7 w-7 shrink-0 flex items-center justify-center">
                  <item.icon className="h-4 w-4 stroke-[1.85]" />
                </div>
                <span className="text-[13.5px] font-medium ml-2.5">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Profile Card in Drawer */}
          <div className="pt-2 mt-2 border-t border-zinc-200/80 dark:border-white/[0.08] relative">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between h-10 px-2 rounded-xl cursor-pointer text-left bg-red-50/50 hover:bg-red-50 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/15 dark:text-red-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="text-[13px] font-medium">Log out (Aditya)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
