import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Employee Dashboard | Expense Management System",
  description: "Employee expenses, reports, approvals, and reimbursements in one workspace.",
};

export default function EmployeeDashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
