"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { employeeJson } from "@/lib/employee-api";
import { supabase } from "@/lib/supabase";
import type { Expense } from "../types";

export type ExpenseSummary = {
  total_spend: number;
  approved_total: number;
  approved_count: number;
  pending_total: number;
  pending_count: number;
  corporate_card_spend: number;
  card_spending_mtd: number;
  card_limit_remaining: number;
  card_limit: number;
  ready_for_reimbursement?: string | number;
  pending_approval?: string | number;
};

type OverviewResponse = {
  expenses: Expense[];
  summary: Partial<ExpenseSummary>;
};

type ExpenseStore = {
  expenses: Expense[];
  summary: ExpenseSummary;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  upsertDraft: (draft: Expense) => void;
  removeDraft: (id: string) => void;
};

const Context = createContext<ExpenseStore | null>(null);

export function computeSummaryFromExpenses(
  expenses: Expense[],
  cardLimit = 100000,
): ExpenseSummary {
  let pendingAmount = 0;
  let pendingCount = 0;
  let approvedAmount = 0;
  let approvedCount = 0;
  let cardSpend = 0;

  for (const item of expenses) {
    const amt = Number(item.amount) || 0;
    const isCard = (item.paymentMethod || "")
      .toLowerCase()
      .includes("corporate");

    const st = (item.status || "").toLowerCase();
    if (st === "pending") {
      pendingAmount += amt;
      pendingCount += 1;
    } else if (
      st === "approved" ||
      st === "reimbursed" ||
      st === "paid" ||
      item.raw_status === "MANAGER_APPROVED" ||
      item.raw_status === "FINANCE_APPROVED" ||
      item.raw_status === "DISBURSED"
    ) {
      approvedAmount += amt;
      approvedCount += 1;
    }

    if (isCard) {
      cardSpend += amt;
    }
  }

  return {
    total_spend: approvedAmount + pendingAmount,
    approved_total: approvedAmount,
    approved_count: approvedCount,
    pending_total: pendingAmount,
    pending_count: pendingCount,
    corporate_card_spend: cardSpend,
    card_spending_mtd: cardSpend,
    card_limit_remaining: Math.max(0, cardLimit - cardSpend),
    card_limit: cardLimit,
    ready_for_reimbursement: approvedAmount,
    pending_approval: pendingAmount,
  };
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    total_spend: 0,
    approved_total: 0,
    approved_count: 0,
    pending_total: 0,
    pending_count: 0,
    corporate_card_spend: 0,
    card_spending_mtd: 0,
    card_limit_remaining: 100000,
    card_limit: 100000,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const upsertDraft = useCallback((draft: Expense) => {
    setExpenses((current) =>
      [draft, ...current.filter((item) => item.id !== draft.id)].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    );
  }, []);

  const removeDraft = useCallback((id: string) => {
    setExpenses((current) => current.filter((item) => item.id !== id));
  }, []);

  const applyResponse = useCallback((response: OverviewResponse) => {
    const derived = computeSummaryFromExpenses(
      response.expenses,
      Number(response.summary?.card_limit) || 100000,
    );
    setExpenses(response.expenses);
    setSummary({
      ...derived,
      ...(response.summary || {}),
      approved_count:
        response.summary?.approved_count ?? derived.approved_count,
      pending_count: response.summary?.pending_count ?? derived.pending_count,
      card_spending_mtd:
        response.summary?.card_spending_mtd || derived.card_spending_mtd,
      card_limit_remaining:
        response.summary?.card_limit_remaining || derived.card_limit_remaining,
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeJson<OverviewResponse>("/overview");
      applyResponse(response);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load expenses.",
      );
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  useEffect(() => {
    let active = true;

    // Initial fetch
    employeeJson<OverviewResponse>("/overview")
      .then((response) => {
        if (active) {
          applyResponse(response);
          setError("");
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Could not load expenses.",
          );
          setLoading(false);
        }
      });

    // Realtime Supabase Channel Listener
    const channel = supabase
      .channel("employee_expenses_sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expense_claims" },
        () => {
          employeeJson<OverviewResponse>("/overview")
            .then((res) => {
              if (active) applyResponse(res);
            })
            .catch(() => {});
        },
      )
      .subscribe();

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

  return (
    <Context.Provider
      value={{
        expenses,
        summary,
        loading,
        error,
        refresh,
        upsertDraft,
        removeDraft,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useExpenses() {
  const value = useContext(Context);
  if (!value) {
    return {
      expenses: [],
      summary: {
        total_spend: 0,
        approved_total: 0,
        approved_count: 0,
        pending_total: 0,
        pending_count: 0,
        corporate_card_spend: 0,
        card_spending_mtd: 0,
        card_limit_remaining: 100000,
        card_limit: 100000,
      },
      loading: false,
      error: "",
      refresh: async () => {},
      upsertDraft: () => {},
      removeDraft: () => {},
    };
  }
  return value;
}
