"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { employeeJson } from "@/lib/employee-api";
import type { Expense } from "../types";

export type ExpenseSummary = {
  ready_for_reimbursement: string;
  pending_approval: string;
  card_spending_mtd: string;
  card_limit: string;
  card_limit_remaining: string;
  approved_count: number;
  pending_count: number;
};

type OverviewResponse = { expenses: Expense[]; summary: ExpenseSummary };
type ExpenseStore = {
  expenses: Expense[];
  summary: ExpenseSummary | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

const Context = createContext<ExpenseStore | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeJson<OverviewResponse>("/overview");
      setExpenses(response.expenses);
      setSummary(response.summary);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    employeeJson<OverviewResponse>("/overview").then((response) => {
      if (active) { setExpenses(response.expenses); setSummary(response.summary); setError(""); setLoading(false); }
    }).catch((cause: unknown) => {
      if (active) { setError(cause instanceof Error ? cause.message : "Could not load expenses."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  return <Context.Provider value={{ expenses, summary, loading, error, refresh }}>{children}</Context.Provider>;
}

export function useExpenses() {
  const value = useContext(Context);
  if (!value) throw Error("ExpensesProvider missing");
  return value;
}
