"use client";

import React, { ReactNode } from "react";
import { ExpensesProvider } from "@/features/expenses/data/ExpensesContext";
import { ThemeProvider } from "@/lib/theme-store";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ExpensesProvider>{children}</ExpensesProvider>
    </ThemeProvider>
  );
}

