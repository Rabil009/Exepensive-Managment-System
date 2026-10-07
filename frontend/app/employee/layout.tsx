"use client";

import React, { ReactNode } from "react";
import { ExpensesProvider } from "@/features/expenses/data/ExpensesContext";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return <ExpensesProvider>{children}</ExpensesProvider>;
}
