import { Link } from "react-router";
import { AuraIcon } from "../../../shared/components/AuraIcon";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { panelClass } from "../styles/formClasses";
import { ExpenseFormHeader } from "./ExpenseFormHeader";
import { ReceiptCapture } from "./ReceiptCapture";
import { UnlinkedTransactions } from "./UnlinkedTransactions";
import { ExpenseDetailsFields } from "./ExpenseDetailsFields";
import { ExpenseCategorization } from "./ExpenseCategorization";
import { ExpenseAttendees } from "./ExpenseAttendees";
import { ExpenseFormActions } from "./ExpenseFormActions";
import "../styles/expense-form.css";
export function ExpenseForm() {
  const model = useExpenseForm();
  return (
    <form
      className="employee-page aura-expense-form flex flex-col w-full gap-space-lg"
      onSubmit={model.submit}
    >
      <ExpenseFormHeader model={model} />
      {(model.error || model.message) && (
        <div
          className={`aura-form-message ${model.error ? "error" : ""}`}
          role={model.error ? "alert" : "status"}
        >
          {model.error || model.message}
          {model.submitted && (
            <Link to={`/employee/reports?expense=${model.draft.id}`}>
              View expense →
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <ReceiptCapture model={model} />
          <UnlinkedTransactions model={model} />
        </div>
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="rounded-xl bg-primary-fixed/30 border border-primary-fixed-dim/60 p-space-md flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <AuraIcon className="text-lg">auto_awesome</AuraIcon>
            </span>
            <div className="flex flex-col">
              <strong className="text-body-md text-on-primary-fixed">
                Instant Neural Auto-Fill
              </strong>
              <span className="text-body-sm text-on-surface-variant">
                Automatic receipt extraction is not connected yet. Attach a
                receipt on the left and enter the details below.
              </span>
            </div>
          </div>
          <div
            className={`${panelClass} p-space-xl flex flex-col gap-space-lg`}
          >
            <ExpenseDetailsFields model={model} />
            <div className="h-px w-full bg-surface-container-high" />
            <ExpenseCategorization model={model} />
            <div className="h-px w-full bg-surface-container-high" />
            <ExpenseAttendees model={model} />
            <div className="aura-policy-note">
              <AuraIcon className="text-xl">shield</AuraIcon>
              <span>
                <strong>Policy review</strong>
                <small>Policy clearance will be checked during approval.</small>
              </span>
            </div>
          </div>
          <ExpenseFormActions model={model} />
        </div>
      </div>
    </form>
  );
}
