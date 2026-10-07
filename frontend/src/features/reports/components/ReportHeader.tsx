import type { ReportsModel } from "../hooks/useReports";
import { StatusBadge } from "../../../shared/components/StatusBadge";

type Props = {
  model: Pick<
    ReportsModel,
    | "groups"
    | "selected"
    | "selectReport"
    | "recalled"
    | "completed"
    | "recallReport"
    | "addItem"
  >;
};
export function ReportHeader({ model }: Props) {
  const {
    groups,
    selected,
    selectReport,
    recalled,
    completed,
    recallReport,
    addItem,
  } = model;
  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/30">
      <div className="flex flex-col gap-1.5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md"
        >
          <a
            className="hover:text-primary transition-colors text-on-surface-variant font-medium"
            href="/employee/dashboard"
          >
            Expense Management
          </a>
          <span className="opacity-60 text-xs">/</span>
          <a
            className="hover:text-primary transition-colors text-on-surface-variant font-medium"
            href="/employee/reports"
          >
            Reports
          </a>
          <span className="opacity-60 text-xs">/</span>
          <select
            aria-label="Select expense report"
            className="report-selector text-primary font-semibold"
            value={selected}
            onChange={(event) => selectReport(event.target.value)}
          >
            {groups.map((name, index) => (
              <option key={name} value={name}>
                {`REP-2025-${String(index + 894).padStart(4, "0")}`} · {name}
              </option>
            ))}
          </select>
        </nav>
        <div className="flex items-center gap-space-md flex-wrap">
          <h1 className="font-display-md text-display-md text-on-surface tracking-tight font-semibold">
            Expense Report
          </h1>
          <StatusBadge
            tone={completed ? "success" : recalled ? "neutral" : "warning"}
          >
            {recalled
              ? "Draft · Recalled"
              : completed
                ? "Reimbursed · Complete"
                : "Submitted · In Review"}
          </StatusBadge>
        </div>
      </div>
      <div className="flex items-center gap-space-sm self-start md:self-auto flex-wrap">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm"
          title="Choose Save as PDF in the print dialog"
          onClick={() => window.print()}
        >
          <span className="material-symbols-outlined text-base">
            picture_as_pdf
          </span>
          <span>Download Summary PDF</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm"
          onClick={addItem}
        >
          <span className="material-symbols-outlined text-base text-primary">
            add_circle
          </span>
          <span className="">Add Item</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 hover:bg-error-container/40 text-error font-label-md text-label-md transition-colors shadow-sm"
          disabled={completed || recalled}
          onClick={recallReport}
        >
          <span className="material-symbols-outlined text-base">undo</span>
          <span className="">Recall Submission</span>
        </button>
      </div>
    </section>
  );
}
