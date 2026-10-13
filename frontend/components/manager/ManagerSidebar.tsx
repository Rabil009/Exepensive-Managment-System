"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Wallet,
  PieChart,
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  Settings,
  HelpCircle,
  PanelLeft,
  ChevronsUpDown,
  LogOut,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function ManagerSidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  onOpenSettings,
  isMobileOpen = false,
  onCloseMobile,
}: ManagerSidebarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [managerName, setManagerName] = useState("Manager");
  const [managerEmail, setManagerEmail] = useState("manager@payout.finance");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("payout_user_name");
      const storedEmail = localStorage.getItem("payout_user_email");
      if (storedName) setManagerName(storedName);
      if (storedEmail) setManagerEmail(storedEmail);
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (user.email) setManagerEmail(user.email);
        const name = user.user_metadata?.name || user.email?.split("@")[0] || "Manager";
        setManagerName(name);
      }
    });
  }, []);

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

  const initials = managerName.slice(0, 2).toUpperCase();

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

  const mainNav: { label: ManagerView; icon: any; count: number | null }[] = [
    { label: "Approvals", icon: CheckSquare, count: null },
    { label: "Team Spend", icon: Wallet, count: null },
    { label: "Budgets", icon: PieChart, count: null },
    { label: "Exceptions", icon: AlertTriangle, count: null },
  ];

  const documentsNav: { label: ManagerView; icon: any }[] = [
    { label: "Reports", icon: ClipboardList },
    { label: "Policies", icon: ShieldCheck },
  ];

  return (
    <>
      <aside
        style={{ willChange: "width" }}
        aria-label="Manager Navigation"
        className={`hidden md:flex shrink-0 h-screen border-r flex-col justify-between overflow-hidden select-none font-sans px-2 py-3 transition-[width] duration-300 ease-in-out ${
          isCollapsed ? "w-[56px]" : "w-[200px]"
        } bg-[#F7F7F8] dark:bg-[#131316] border-zinc-200/90 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5]`}
      >
      {/* Top Group */}
      <div className="flex flex-col w-full">
        {/* Workspace Brand Header / Toggle Button */}
        <div className="w-full mb-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="group w-full flex items-center h-9 px-1 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-zinc-200/60 dark:hover:bg-white/[0.08]"
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              <PanelLeft className="h-4 w-4 stroke-[1.85]" />
            </div>
          </button>
        </div>

        {/* Primary Navigation List */}
        <nav className="space-y-1 w-full">
          {mainNav.map((item) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
                title={isCollapsed ? item.label : undefined}
                className={`group w-full flex items-center h-9 px-1 rounded-lg cursor-pointer transition-colors duration-150 ${
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
                  className={`flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed
                      ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                      : "w-[130px] opacity-100 translate-x-0 ml-2"
                  }`}
                >
                  <span className="text-[13px] font-medium truncate">
                    {item.label}
                  </span>
                  {item.count !== null && item.count > 0 && (
                    <span
                      className={`h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center text-[10.5px] font-medium leading-none shrink-0 ${
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
        <div className="mt-2.5 w-full">
          <div className="h-5 w-full flex items-center relative mb-1">
            <span
              className={`text-[11px] font-medium tracking-wide uppercase px-1.5 text-zinc-400 dark:text-zinc-500 whitespace-nowrap transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "opacity-0 -translate-x-2 pointer-events-none"
                  : "opacity-100 translate-x-0"
              }`}
            >
              Documents &amp; Policies
            </span>
            <div
              className={`absolute inset-x-0 flex items-center justify-center transition-opacity duration-300 ${
                isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-5 h-[1px] bg-zinc-200/80 dark:bg-white/[0.08]" />
            </div>
          </div>

          <nav className="space-y-1 w-full">
            {documentsNav.map((item) => {
              const isActive = activeView === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveView(item.label)}
                  title={isCollapsed ? item.label : undefined}
                  className={`group w-full flex items-center h-9 px-1 rounded-lg cursor-pointer transition-colors duration-150 ${
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
                        : "w-[130px] opacity-100 translate-x-0 ml-2"
                    }`}
                  >
                    <span className="text-[13px] font-medium truncate">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings, Help, and Payout Brand */}
      <div className="w-full space-y-0.5">
        <div className="h-3 w-full flex items-center justify-center mb-0.5">
          <div
            className={`w-5 h-[1px] bg-zinc-200/80 dark:bg-white/[0.08] transition-opacity duration-300 ${
              isCollapsed ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          title={isCollapsed ? "Settings" : undefined}
          className="group w-full flex items-center h-9 px-1 rounded-lg cursor-pointer transition-colors duration-150 text-zinc-900 hover:bg-black hover:text-white dark:text-zinc-300 dark:hover:bg-white dark:hover:text-black"
        >
          <div className="h-7 w-7 shrink-0 flex items-center justify-center">
            <Settings className="h-4 w-4 stroke-[1.85] transition-colors text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black" />
          </div>

          <div
            className={`flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                : "w-[130px] opacity-100 translate-x-0 ml-2"
            }`}
          >
            <span className="text-[13px] font-medium">Settings</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => router.push("/manager/help")}
          title={isCollapsed ? "Get Help" : undefined}
          className="group w-full flex items-center h-9 px-1 rounded-lg cursor-pointer transition-colors duration-150 text-zinc-900 hover:bg-black hover:text-white dark:text-zinc-300 dark:hover:bg-white dark:hover:text-black"
        >
          <div className="h-7 w-7 shrink-0 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 stroke-[1.85] transition-colors text-zinc-800 group-hover:text-white dark:text-zinc-400 dark:group-hover:text-black" />
          </div>

          <div
            className={`flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                : "w-[130px] opacity-100 translate-x-0 ml-2"
            }`}
          >
            <span className="text-[13px] font-medium">Get Help</span>
          </div>
        </button>

        {/* Payout Brand Footer below Get Help */}
        <div className="pt-2 pb-0.5 border-t border-zinc-200/70 dark:border-white/[0.06] mt-1.5 w-full overflow-hidden">
          <div className="flex items-center h-8 px-1 rounded-lg select-none">
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <div className="h-5 w-5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-bold tracking-tight shadow-xs">
                P
              </div>
            </div>
            <div
              className={`flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                  : "w-[125px] opacity-100 translate-x-0 ml-2"
              }`}
            >
              <span className="text-[12.5px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">
                Payout
              </span>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                v1.0
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200 touch-none"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Manager Navigation"
        onTouchMove={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw] flex flex-col justify-between overflow-y-auto overscroll-contain select-none font-sans px-3 py-3.5 bg-[#F7F7F8] dark:bg-[#131316] border-r border-zinc-200/90 dark:border-white/[0.08] text-zinc-900 dark:text-[#F4F4F5] shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
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

          {/* Main Nav */}
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
          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onCloseMobile?.();
            }}
            className="w-full flex items-center h-9 px-2 rounded-xl cursor-pointer transition-colors duration-150 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08]"
          >
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <Settings className="h-4 w-4 stroke-[1.85]" />
            </div>
            <span className="text-[13.5px] font-medium ml-2.5">Settings</span>
          </button>

          {/* User Profile Card in Drawer */}
          <div className="pt-2 mt-2 border-t border-zinc-200/80 dark:border-white/[0.08] relative">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between h-10 px-2 rounded-xl cursor-pointer text-left bg-red-50/50 hover:bg-red-50 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/15 dark:text-red-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="text-[13px] font-medium">Log out ({managerName})</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerSidebar;