import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { fieldClass } from "../styles/formClasses";
import { categories } from "../data/categories";
type Props = { model: Pick<ExpenseFormModel, "draft" | "update"> };
export function ExpenseCategorization({ model }: Props) {
  const { draft, update } = model;
  return (
    <section className="flex flex-col gap-space-md">
      <h2 className="text-headline-sm">Category &amp; Payment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-category"
            className="text-label-md text-on-surface-variant"
          >
            Category
          </label>
          <div className="aura-select-wrap">
            <Icon className="text-lg">category</Icon>
            <select
              id="expense-category"
              className={fieldClass}
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
              required
            >
              <option value="">Select expense category...</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <Icon className="text-sm">unfold_more</Icon>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expense-report"
            className="text-label-md text-on-surface-variant"
          >
            Expense Report
          </label>
          <div className="aura-select-wrap">
            <Icon className="text-lg">folder_open</Icon>
            <select
              id="expense-report"
              className={fieldClass}
              value={draft.report}
              onChange={(event) => update("report", event.target.value)}
            >
              {[
                "Q4 Design Summit — SFO",
                "Software & Stipends",
                "Equipment & WFH",
                "Unassigned",
              ].map((report) => (
                <option key={report}>{report}</option>
              ))}
            </select>
            <Icon className="text-sm">unfold_more</Icon>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-label-md text-on-surface-variant">
          Payment Method
        </label>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 p-1 bg-surface-container-low border border-outline-variant/30 rounded-lg gap-1"
          role="group"
          aria-label="Payment method"
        >
          {[
            draft.paymentMethod.startsWith("Apple")
              ? "Apple Card (••8814)"
              : "Corporate Card (••4921)",
            "Personal (Out-of-Pocket)",
          ].map((method, index) => (
            <button
              key={method}
              type="button"
              aria-pressed={draft.paymentMethod === method}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-body-md font-semibold transition-all ${draft.paymentMethod === method ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              onClick={() => update("paymentMethod", method)}
            >
              <Icon className="text-lg text-primary-container">
                {index === 0 ? "credit_card" : "account_balance_wallet"}
              </Icon>
              {method}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
