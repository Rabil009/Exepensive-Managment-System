import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { Link } from "react-router";
type Props = { model: Pick<ExpenseFormModel, "save" | "submitted" | "ready"> };
export function ExpenseFormHeader({ model }: Props) {
  const { save, submitted, ready } = model;
  return (
    <div className="employee-page-header flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-xs">
      <div className="flex flex-col gap-1.5">
        <nav
          className="flex items-center gap-2 text-label-md text-on-surface-variant pt-1"
          aria-label="Breadcrumb"
        >
          <Link to="/employee/dashboard" className="hover:text-on-surface">
            Overview
          </Link>
          <Icon className="text-xs">chevron_right</Icon>
          <span className="text-on-surface font-medium">New Expense</span>
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="text-display-lg">New Expense</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/60 text-primary text-label-caps font-semibold uppercase tracking-wider">
            <Icon className="text-xs">auto_awesome</Icon>Smart Capture
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          Drop a receipt, bill, or invoice and enter your expense details.
        </p>
      </div>
      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          className="aura-draft-button"
          onClick={() => save("Draft")}
          disabled={submitted}
        >
          Save Draft
        </button>
        <button
          className="aura-submit-button"
          disabled={!ready || submitted}
          type="submit"
        >
          <Icon className="text-base">check</Icon>Submit
        </button>
      </div>
    </div>
  );
}
