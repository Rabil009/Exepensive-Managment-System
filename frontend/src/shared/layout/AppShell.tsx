"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Compass, CreditCard, Receipt, Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { EmployeeSearchModal } from "../components/EmployeeSearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";
import { useTheme } from "@/lib/theme-store";

export function AppShell({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut for Search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function onNavigate(label: string) {
    setMobileDrawerOpen(false);
    switch (label) {
      case "Overview":
        router.push("/employee/dashboard");
        break;
      case "Cards & Limits":
        router.push("/employee/cards");
        break;
      case "Analytics":
        router.push("/employee/analytics");
        break;
      case "New Expense":
        router.push("/employee/expenses/new");
        break;
      case "Reports":
        router.push("/employee/reports");
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors ${
        isDark ? "bg-[#08080A] text-zinc-100" : "bg-[#FAFAFB] text-zinc-900"
      }`}
    >
      {/* Left Vertical Sidebar */}
      <Sidebar
        activeView={active}
        onNavigate={onNavigate}
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSearch={() => setShowSearch(true)}
        isMobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          title={
            active === "Overview" || !active
              ? "Employee Portal"
              : active === "Cards & Limits"
              ? "Corporate Cards & Limits"
              : active === "Analytics"
              ? "Spending Analytics"
              : active === "New Expense"
              ? "Submit New Expense"
              : active === "Reports"
              ? "Expense Reports"
              : active
          }
          onToggleSidebar={() => setMobileDrawerOpen(true)}
          rightContent={active === "New Expense" ? null : undefined}
        />

        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav className="md:hidden shrink-0 border-t bg-white/95 dark:bg-[#131316]/95 backdrop-blur-md border-zinc-200/80 dark:border-white/[0.08] px-2 py-1.5 flex items-center justify-around z-30 select-none">
          <button
            type="button"
            onClick={() => onNavigate("Overview")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              active === "Overview" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="text-[10px]">Overview</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("Cards & Limits")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              active === "Cards & Limits" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px]">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("New Expense")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              active === "New Expense" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span className="text-[10px]">New Expense</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <Menu className="h-4 w-4" />
            <span className="text-[10px]">Menu</span>
          </button>
        </nav>
      </div>

      {/* Shared Dashboard Modals */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showSearch && (
        <EmployeeSearchModal onClose={() => setShowSearch(false)} />
      )}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}

export default AppShell;
