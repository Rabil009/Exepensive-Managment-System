import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
import { panelClass } from "../styles/formClasses";
type Props = {
  model: Pick<ExpenseFormModel, "saved" | "submitted" | "ready" | "discard">;
};
export function ExpenseFormActions({ model }: Props) {
  const { saved, submitted, ready, discard } = model;
  return (
    <div
      className={`${panelClass} p-space-md flex items-center justify-between gap-2`}
    >
      <span className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant">
        <span
          className={`w-2 h-2 rounded-full ${saved ? "bg-tertiary" : "bg-outline-variant"}`}
        />
        {submitted ? "Submitted" : saved ? "Draft saved" : "Unsaved draft"}
      </span>
      <div className="flex items-center gap-space-sm">
        <button type="button" className="aura-draft-button" onClick={discard}>
          Discard
        </button>
        <button
          type="submit"
          className="aura-submit-button"
          disabled={!ready || submitted}
        >
          <Icon className="text-base">send</Icon>Submit Expense
        </button>
      </div>
    </div>
  );
}
