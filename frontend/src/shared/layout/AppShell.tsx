"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { EmployeeSearchModal } from "../components/EmployeeSearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";
import { useTheme } from "@/lib/theme-store";
import { toast } from "sonner";

export function AppShell({
  children,
  active,
  onSearch,
}: {
  children: ReactNode;
  active: string;
  onSearch?: (value: string) => void;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          rightContent={active === "New Expense" ? null : undefined}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {children}
        </main>
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
