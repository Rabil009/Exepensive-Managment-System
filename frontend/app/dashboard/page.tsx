"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { Compass, CheckSquare, Receipt, Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { GlobalFilters, FilterState, DEFAULT_FILTERS } from "@/components/dashboard/GlobalFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ExceptionsQueue } from "@/components/dashboard/ExceptionsQueue";
import { BudgetVsActualChart } from "@/components/dashboard/BudgetVsActualChart";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { DepartmentSpendChart } from "@/components/dashboard/DepartmentSpendChart";
import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive";
import { BudgetBreakdownTable } from "@/components/dashboard/BudgetBreakdownTable";
import { RecentReimbursementsTable } from "@/components/dashboard/RecentReimbursementsTable";

// Screen Views for PRD Finance Navigation
import { VerificationQueueView } from "@/components/dashboard/VerificationQueueView";
import { ReimbursementsView } from "@/components/dashboard/ReimbursementsView";
import { PaymentsView } from "@/components/dashboard/PaymentsView";
import { ExceptionsView } from "@/components/dashboard/ExceptionsView";
import { BudgetsView } from "@/components/dashboard/BudgetsView";
import { ReportsView } from "@/components/dashboard/ReportsView";

// Working Modals
import { QuickCreateModal } from "@/components/dashboard/QuickCreateModal";
import { SettingsModal } from "@/components/dashboard/SettingsModal";
import { SearchModal } from "@/components/dashboard/SearchModal";
import { HelpModal } from "@/components/dashboard/HelpModal";

import { FinanceProvider, useFinanceStore } from "@/lib/finance-store";
import { ThemeProvider, useTheme } from "@/lib/theme-store";

function DashboardContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    activeView,
    setActiveView,
    awaitingVerificationCount,
    awaitingHighPriorityCount,
    approvedAmountTotal,
    reimbursementsPendingCount,
    reimbursementsPendingAmount,
    paymentsPendingCount,
    paymentsPendingAmount,
  } = useFinanceStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Auto-collapse sidebar on mobile/tablet screens for clean full-width view
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, []);

  // Modals state
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getPageTitle = () => {
    switch (activeView) {
      case "Verification":
        return "Finance Verification Queue";
      case "Reimbursements":
        return "Employee Reimbursements";
      case "Payments":
        return "Disbursement & Payments";
      case "Exceptions":
        return "Exceptions & Policy Violations";
      case "Budgets":
        return "Treasury Budgets & Limits";
      case "Reports":
        return "Accounting Reports & CSV Export";
      default:
        return "Finance Operations";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans antialiased transition-colors bg-[#FAFAFB] dark:bg-[#08080A] text-zinc-900 dark:text-zinc-100">
      {/* Sidebar with Desktop rail and Mobile slide-over drawer */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        onQuickCreate={() => setShowQuickCreate(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSearch={() => setShowSearch(true)}
      />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header with Mobile Hamburger and Actions */}
        <Header
          title={getPageTitle()}
          onToggleSidebar={() => setMobileDrawerOpen(true)}
          rightContent={
            activeView === "Dashboard" ? (
              <GlobalFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            ) : null
          }
        />

        {/* Scrollable Main Content (optimized mobile padding) */}
        <main className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
          {/* Main Dashboard Overview View */}
          {activeView === "Dashboard" && (
            <>
              {/* 2. Top KPI Cards */}
              <div
                onClick={(e) => {
                  const target = (e.target as HTMLElement).closest("div");
                  if (!target) return;
                  if (target.textContent?.includes("Awaiting")) setActiveView("Verification");
                  else if (target.textContent?.includes("Reimbursements")) setActiveView("Reimbursements");
                  else if (target.textContent?.includes("Payments")) setActiveView("Payments");
                }}
                className="cursor-pointer"
              >
                <KpiCards
                  data={{
                    awaitingVerificationCount,
                    awaitingVerificationHighPriority: awaitingHighPriorityCount,
                    approvedAmount: `₹${(approvedAmountTotal / 100000).toFixed(2)}L`,
                    reimbursementsPendingCount,
                    reimbursementsPendingAmount: `₹${reimbursementsPendingAmount.toLocaleString("en-IN")} total`,
                    paymentsPendingCount,
                    paymentsPendingAmount: `₹${paymentsPendingAmount.toLocaleString("en-IN")} total`,
                  }}
                />
              </div>

              {/* 2.5 Interactive Trends Area Chart */}
              <ChartAreaInteractive />

              {/* 3. Visual Bento Grid: Budget vs Actual Bar Chart (7 cols) + Category Donut Chart (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <BudgetVsActualChart />
                </div>
                <div className="lg:col-span-5">
                  <CategoryDonutChart />
                </div>
              </div>

              {/* 4. Secondary Visual Grid: Department Utilization (6 cols) + Exceptions Queue (6 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <DepartmentSpendChart />
                </div>
                <div className="lg:col-span-6">
                  <ExceptionsQueue
                    onViewAll={() => setActiveView("Exceptions")}
                    onReviewException={() => setActiveView("Verification")}
                  />
                </div>
              </div>

              {/* 5. Budget Breakdown & Threshold Indicators */}
              <BudgetBreakdownTable />

              {/* 6. Recent Completed Reimbursements */}
              <RecentReimbursementsTable
                onViewAll={() => setActiveView("Reimbursements")}
              />
            </>
          )}

          {/* Verification Queue View (PRD FR-10) */}
          {activeView === "Verification" && <VerificationQueueView />}

          {/* Reimbursements View (PRD FR-11) */}
          {activeView === "Reimbursements" && <ReimbursementsView />}

          {/* Payments View (PRD FR-12) */}
          {activeView === "Payments" && <PaymentsView />}

          {/* Exceptions View (PRD FR-05 & FR-06) */}
          {activeView === "Exceptions" && <ExceptionsView />}

          {/* Budgets View (PRD FR-14) */}
          {activeView === "Budgets" && <BudgetsView />}

          {/* Reports View (PRD FR-18) */}
          {activeView === "Reports" && <ReportsView />}
        </main>

        {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden shrink-0 border-t bg-white/95 dark:bg-[#131316]/95 backdrop-blur-md border-zinc-200/80 dark:border-white/[0.08] px-2 py-1.5 flex items-center justify-around z-30 select-none"
        >
          <button
            type="button"
            onClick={() => setActiveView("Dashboard")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeView === "Dashboard" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="text-[10px]">Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("Verification")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium relative transition-colors ${
              activeView === "Verification" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            {awaitingVerificationCount > 0 && (
              <span className="absolute top-0.5 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#131316]" />
            )}
            <span className="text-[10px]">Verify</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("Reimbursements")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              activeView === "Reimbursements" ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span className="text-[10px]">Reimburse</span>
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

      {/* Interactive Modals */}
      {showQuickCreate && (
        <QuickCreateModal onClose={() => setShowQuickCreate(false)} />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showSearch && (
        <SearchModal onClose={() => setShowSearch(false)} />
      )}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <DashboardContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}
