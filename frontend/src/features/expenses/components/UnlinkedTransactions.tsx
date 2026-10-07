import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { panelClass } from "../styles/formClasses";
import { transactions } from "../data/demoTransactions";
type Props = { model: Pick<ExpenseFormModel, "linkTransaction"> };
export function UnlinkedTransactions({ model }: Props) {
  const { linkTransaction } = model;
  return (
    <section className={`${panelClass} p-space-md flex flex-col gap-space-sm`}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-headline-sm">
          <Icon className="text-base text-primary-container">credit_card</Icon>
          Unlinked Card Transactions
        </h2>
        <span className="text-label-caps px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
          2 available
        </span>
      </div>
      <p className="text-body-sm text-on-surface-variant">
        Pair your receipt with a sample corporate card transaction:
      </p>
      <div className="flex flex-col gap-2 pt-1">
        {transactions.map((transaction) => (
          <button
            key={transaction.merchant}
            type="button"
            className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 flex items-center justify-between gap-2 text-left transition-colors"
            onClick={() => linkTransaction(transaction)}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-md bg-surface-container-highest flex items-center justify-center text-xs font-semibold shrink-0">
                {transaction.card}
              </span>
              <span className="flex flex-col min-w-0">
                <strong className="text-label-md truncate">
                  {transaction.merchant}
                </strong>
                <span className="text-[11px] text-on-surface-variant">
                  {transaction.note}
                </span>
              </span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <strong className="text-body-md tabular-nums">
                ${transaction.amount}
              </strong>
              <Icon className="text-base text-on-surface-variant">
                add_link
              </Icon>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
