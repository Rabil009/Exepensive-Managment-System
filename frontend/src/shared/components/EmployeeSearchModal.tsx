"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Compass,
  CreditCard,
  PieChart,
  Receipt,
  ClipboardList,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useExpenses } from "@/features/expenses/data/ExpensesContext";
import { money, displayDate } from "../utils/format";

interface EmployeeSearchModalProps {
  onClose: () => void;
}

export function EmployeeSearchModal({ onClose }: EmployeeSearchModalProps) {
  const router = useRouter();
  const { expenses } = useExpenses();
  const [query, setQuery] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Quick navigation pages
  const navPages = useMemo(
    () => [
      {
        title: "Overview",
        description: "Dashboard summary, KPIs, and recent activity",
        path: "/employee/dashboard",
        icon: Compass,
        badge: "Page",
      },
      {
        title: "Cards & Spending Limits",
        description: "Corporate Visa controls, security toggles, and limits",
        path: "/employee/cards",
        icon: CreditCard,
        badge: "Page",
      },
      {
        title: "Expense Analytics",
        description: "Spending trends, category breakdown, and funding split",
        path: "/employee/analytics",
        icon: PieChart,
        badge: "Page",
      },
      {
        title: "Submit New Expense",
        description: "Upload a receipt and submit a business claim",
        path: "/employee/expenses/new",
        icon: Receipt,
        badge: "Action",
      },
      {
        title: "Expense Reports",
        description: "Approval timelines, reports, and claim statuses",
        path: "/employee/reports",
        icon: ClipboardList,
        badge: "Page",
      },
    ],
    []
  );

  // Filtered navigation results
  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navPages;
    return navPages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, navPages]);

  // Filtered expense line items
  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return expenses.filter(
      (e) =>
        (e.merchant && e.merchant.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.report && e.report.toLowerCase().includes(q)) ||
        (e.status && e.status.toLowerCase().includes(q)) ||
        String(e.amount).includes(q)
    );
  }, [query, expenses]);

  function handleNavigate(path: string) {
    router.push(path);
    onClose();
  }

  function handleSelectExpense(expenseId: string) {
    router.push(`/employee/reports?expense=${expenseId}`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-zinc-200/80 dark:border-white/[0.07]">
          <Search className="h-4 w-4 text-zinc-400 shrink-0 ml-1" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, merchants, categories, or expense amounts..."
            className="w-full h-8 pl-3 pr-8 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
          {/* Expenses Matching Query */}
          {filteredExpenses.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Expenses &amp; Claims ({filteredExpenses.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredExpenses.map((expense) => {
                  const isApproved =
                    expense.status === "Approved" ||
                    expense.status === "Reimbursed";
                  const isPending = expense.status === "Pending";

                  return (
                    <button
                      key={expense.id}
                      type="button"
                      onClick={() => handleSelectExpense(expense.id)}
                      className="w-full p-2.5 rounded-lg flex items-center justify-between text-left hover:bg-zinc-100/70 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {expense.merchant}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200/60 dark:border-white/[0.08] text-zinc-500 font-medium">
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                          {displayDate(expense.date)} • {expense.report || "Unassigned"}
                        </p>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 block">
                          {money(Number(expense.amount))}
                        </span>
                        <span
                          className={`text-[10px] font-medium ${
                            isApproved
                              ? "text-[#3B9B78]"
                              : isPending
                              ? "text-amber-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Navigation Pages */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {query.trim() ? "Pages & Navigation" : "Quick Jump"}
              </div>
              <div className="space-y-1 mt-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className="w-full p-2.5 rounded-lg flex items-center justify-between text-left hover:bg-zinc-100/70 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900 text-zinc-500 shrink-0 ml-3">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results Fallback */}
          {query.trim() &&
            filteredExpenses.length === 0 &&
            filteredNav.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  No records or pages matched &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                  Try searching for a merchant like &ldquo;Delta&rdquo;, &ldquo;Uber&rdquo;, or &ldquo;Cards&rdquo;.
                </p>
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-white/[0.01] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Search employee workspace</span>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSearchModal;

