import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { Navigate, Route, Routes } from "react-router";
import {
  SidebarProvider,
  SidebarInset,
} from "@ui/components/navigation/Sidebar/sidebar";
import { TooltipProvider } from "@ui/components/overlays/Tooltip/tooltip";
import { EmployeeSidebar } from "../layouts/Sidebar/EmployeeSidebar";
import { EmployeeHeader } from "../layouts/Header/EmployeeHeader";
import { ExpensesProvider } from "../features/expenses/data/ExpensesContext";
import { Skeleton } from "@ui/components/feedback/Skeleton/skeleton";

const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const ExpensesPage = lazy(() => import("../pages/Expenses/ExpensesPage"));
const AddExpensePage = lazy(() => import("../pages/AddExpense/AddExpensePage"));
const ExpenseDetailsPage = lazy(
  () => import("../pages/ExpenseDetails/ExpenseDetailsPage"),
);
const ReimbursementsPage = lazy(
  () => import("../pages/Reimbursements/ReimbursementsPage"),
);
const ReportsPage = lazy(() => import("../pages/Reports/ReportsPage"));
const SettingsPage = lazy(() => import("../pages/Settings/SettingsPage"));

function PageLoading() {
  return (
    <div className="space-y-6" aria-label="Loading page">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-36" key={index} />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default function App() {
  const pathname = useLocation().pathname;
  if (pathname === "/" || pathname === "/employee/dashboard") {
    return <Suspense fallback={<PageLoading />}><DashboardPage /></Suspense>;
  }
  return (
    <div className="dark">
      <TooltipProvider>
        <ExpensesProvider>
          <SidebarProvider
            style={{ "--sidebar-width": "240px" } as React.CSSProperties}
          >
            <EmployeeSidebar />
            <SidebarInset className="min-w-0 bg-background">
              <EmployeeHeader />
              <main className="content w-full">
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/employee/dashboard" replace />}
                    />
                    <Route
                      path="/employee/dashboard"
                      element={<DashboardPage />}
                    />
                    <Route
                      path="/employee/expenses"
                      element={<ExpensesPage />}
                    />
                    <Route
                      path="/employee/expenses/new"
                      element={<AddExpensePage />}
                    />
                    <Route
                      path="/employee/expenses/:expenseId"
                      element={<ExpenseDetailsPage />}
                    />
                    <Route
                      path="/employee/reimbursements"
                      element={<ReimbursementsPage />}
                    />
                    <Route path="/employee/reports" element={<ReportsPage />} />
                    <Route
                      path="/employee/settings"
                      element={<SettingsPage />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/employee/dashboard" replace />}
                    />
                  </Routes>
                </Suspense>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ExpensesProvider>
      </TooltipProvider>
    </div>
  );
}
