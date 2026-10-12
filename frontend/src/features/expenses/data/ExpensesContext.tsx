"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { employeeJson } from "@/lib/employee-api";
import { supabase } from "@/lib/supabase";
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

export function computeSummaryFromExpenses(expenses: Expense[], cardLimit = 100000): ExpenseSummary {
  let pendingAmount = 0;
  let pendingCount = 0;
  let approvedAmount = 0;
  let approvedCount = 0;
  let cardSpent = 0;

  for (const item of expenses) {
    const amt = Number(item.amount) || 0;
    const isCard =
      (item.paymentMethod || "").toLowerCase().includes("corporate");

    const st = (item.status || "").toLowerCase();
    if (st === "pending") {
      pendingAmount += amt;
      pendingCount += 1;
    } else if (st === "approved") {
      approvedAmount += amt;
      approvedCount += 1;
    }

    if (isCard) {
      cardSpent += amt;
    }
  }

  const limitRemaining = Math.max(0, cardLimit - cardSpent);

  return {
    ready_for_reimbursement: String(approvedAmount),
    pending_approval: String(pendingAmount),
    card_spending_mtd: String(cardSpent),
    card_limit: String(cardLimit),
    card_limit_remaining: String(limitRemaining),
    approved_count: approvedCount,
    pending_count: pendingCount,
  };
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applyResponse = useCallback((response: OverviewResponse) => {
    const derived = computeSummaryFromExpenses(response.expenses, Number(response.summary?.card_limit) || 100000);
    setExpenses(response.expenses);
    setSummary({
      ...derived,
      ...(response.summary || {}),
      approved_count: response.summary?.approved_count ?? derived.approved_count,
      pending_count: response.summary?.pending_count ?? derived.pending_count,
      card_spending_mtd: response.summary?.card_spending_mtd || derived.card_spending_mtd,
      card_limit_remaining: response.summary?.card_limit_remaining || derived.card_limit_remaining,
    });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeJson<OverviewResponse>("/overview");
      applyResponse(response);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load expenses.");
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  useEffect(() => {
    let active = true;

    // Initial fetch
    employeeJson<OverviewResponse>("/overview").then((response) => {
      if (active) {
        applyResponse(response);
        setError("");
        setLoading(false);
      }
    }).catch((cause: unknown) => {
      if (active) {
        setError(cause instanceof Error ? cause.message : "Could not load expenses.");
        setLoading(false);
      }
    });

    // Realtime Supabase Channel Listener
    const channel = supabase
      .channel("employee_claims_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expense_claims" },
        () => {
          employeeJson<OverviewResponse>("/overview")
            .then((res) => {
              if (active) applyResponse(res);
            })
            .catch(() => {});
        }
      )
      .subscribe();

    // 4-second Polling Fallback
    const interval = setInterval(() => {
      employeeJson<OverviewResponse>("/overview")
        .then((res) => {
          if (active) applyResponse(res);
        })
        .catch(() => {});
    }, 4000);

    return () => {
      active = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [applyResponse]);

  return <Context.Provider value={{ expenses, summary, loading, error, refresh }}>{children}</Context.Provider>;
}

export function useExpenses() {
  const value = useContext(Context);
  if (!value) throw Error("ExpensesProvider missing");
  return value;
}
