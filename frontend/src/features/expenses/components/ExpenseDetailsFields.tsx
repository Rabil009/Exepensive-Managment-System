import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { fieldClass } from "../styles/formClasses";
type Props = { model: Pick<ExpenseFormModel, "draft" | "update"> };
export function ExpenseDetailsFields({ model }: Props) {
  const { draft, update } = model;
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm">Expense Details</h2>
        <span className="text-label-caps text-on-surface-variant">
          Enter details from your receipt
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="merchant"
            className="text-label-md text-on-surface-variant"
          >
            Merchant
          </label>
          <input
            id="merchant"
            className={fieldClass}
            placeholder="Enter the merchant name"
            value={draft.merchant}
            onChange={(event) => update("merchant", event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-date"
            className="text-label-md text-on-surface-variant"
          >
            Date
          </label>
          <input
            id="expense-date"
            type="date"
            className={fieldClass}
            value={draft.date}
            onChange={(event) => update("date", event.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="amount"
          className="text-label-md text-on-surface-variant"
        >
          Amount
        </label>
        <div className="flex items-center rounded-lg border border-outline-variant/50 focus-within:ring-2 focus-within:ring-primary-container overflow-hidden shadow-sm">
          <select
            aria-label="Currency"
            className="aura-currency-select px-3.5 py-2.5 bg-surface-container-low border-r border-outline-variant/30 text-label-md font-semibold"
            value={draft.currency}
            onChange={(event) => update("currency", event.target.value)}
          >
            <option value="INR">INR (₹)</option>
          </select>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            className="aura-amount-input w-full min-w-0 bg-transparent text-financial-display px-3 py-2 focus:outline-none font-semibold tabular-nums placeholder:text-outline/40"
            placeholder="0.00"
            value={draft.amount}
            onChange={(event) => update("amount", event.target.value)}
            required
          />
          <span className="aura-entry-state mr-3 px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 text-label-caps text-on-surface-variant whitespace-nowrap">
            {Number(draft.amount) > 0 ? "Entered" : "Enter amount"}
          </span>
        </div>
      </div>
    </section>
  );
}
