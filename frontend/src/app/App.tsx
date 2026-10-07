import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ExpensesProvider } from "../features/expenses/data/ExpensesContext";

const OverviewPage = lazy(() => import("../features/overview/OverviewPage"));
const NewExpensePage = lazy(
  () => import("../features/expenses/NewExpensePage"),
);
const ReportsPage = lazy(() => import("../features/reports/ReportsPage"));
const CardsPage = lazy(() => import("../features/cards/CardsPage"));

const AnalyticsPage = lazy(() => import("../features/analytics/AnalyticsPage"));
const EmployeeLogin = lazy(() => import("../features/auth/EmployeeLogin"));

export default function App() {
  return (
    <ExpensesProvider>
      <Suspense
        fallback={
          <div className="aura-loading" role="status">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route
            path="/"
            element={<Navigate to="/employee/dashboard" replace />}
          />
          <Route path="/employee/dashboard" element={<OverviewPage />} />
          <Route path="/employee/expenses/new" element={<NewExpensePage />} />
          <Route path="/employee/reports" element={<ReportsPage />} />
          <Route path="/employee/cards" element={<CardsPage />} />
          <Route path="/employee/analytics" element={<AnalyticsPage />} />
          <Route
            path="*"
            element={<Navigate to="/employee/dashboard" replace />}
          />
        </Routes>
      </Suspense>
    </ExpensesProvider>
  );
}
