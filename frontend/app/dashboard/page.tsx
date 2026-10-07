"use client";

import React, { useState } from "react";
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
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

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
    <div className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors ${
      isDark ? "bg-[#09090B] text-zinc-100" : "bg-[#FAFAFA] text-zinc-900"
    }`}>
      {/* Static Left Vertical Sidebar (Expands to full or collapses to slim icon rail) */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onQuickCreate={() => setShowQuickCreate(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSearch={() => setShowSearch(true)}
      />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header with Single Filter Option in Top Right Corner */}
        <Header
          title={getPageTitle()}
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

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
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
