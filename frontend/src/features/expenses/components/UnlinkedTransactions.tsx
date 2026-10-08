"use client";

import React from "react";
import { CreditCard, Link2 } from "lucide-react";
import { money } from "../../../shared/utils/format";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { transactions } from "../data/demoTransactions";

type Props = { model: Pick<ExpenseFormModel, "linkTransaction"> };

export function UnlinkedTransactions({ model }: Props) {
  const { linkTransaction } = model;

  return (
    <section className="rounded-xl p-5 border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#111113] shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-zinc-400 shrink-0" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Unlinked Card Transactions
          </h2>
        </div>
        <span className="text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#18181D] text-zinc-600 dark:text-zinc-300">
          2 available
        </span>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        {transactions.map((transaction) => (
          <button
            key={transaction.merchant}
            type="button"
            onClick={() => linkTransaction(transaction)}
            className="p-3 rounded-lg bg-zinc-50/70 hover:bg-zinc-100/80 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border border-zinc-200/70 dark:border-white/[0.06] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-md bg-zinc-200/80 dark:bg-white/[0.06] border border-zinc-300/60 dark:border-white/[0.08] flex items-center justify-center text-[10px] font-bold tracking-wider uppercase text-zinc-700 dark:text-zinc-300 shrink-0">
                {transaction.card}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {transaction.merchant}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {transaction.note}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <strong className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {money(Number(transaction.amount))}
              </strong>
              <Link2 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default UnlinkedTransactions;
