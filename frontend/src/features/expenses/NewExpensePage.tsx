"use client";

import { ExpenseForm } from "./components/ExpenseForm";
import { AppShell } from "../../shared/layout/AppShell";
export default function NewExpensePage() {
  return (
    <AppShell active="New Expense">
      <ExpenseForm />
    </AppShell>
  );
}
