import type { ReportsModel } from "../hooks/useReports";
import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import { steps } from "../data/demoWorkflow";
import { StatusBadge } from "../../../shared/components/StatusBadge";

type Props = { model: Pick<ReportsModel, "completed" | "recalled"> };
export function ApprovalWorkflow({ model }: Props) {
  const { completed, recalled } = model;
  return (
    <div className="report-workflow p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-space-md">
      <div className="flex items-center justify-between gap-2 pb-space-xs border-b border-outline-variant/20">
        <Icon className="text-primary text-lg">account_tree</Icon>
        <span className="text-label-md text-on-surface-variant">
          {completed
            ? "Review complete"
            : recalled
              ? "Submission recalled — ready for editing"
              : "Demo approval workflow · Est. completion: Oct 28, 2025"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md pt-2">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex flex-col gap-2 ${index > 1 && !completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-space-sm">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${completed || (index === 0 && !recalled) ? "bg-tertiary-container text-white" : index === 1 && !recalled ? "bg-surface-container-lowest text-primary ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container-low" : "bg-surface-container-highest text-on-surface-variant"}`}
              >
                <Icon className="text-base">
                  {completed || (index === 0 && !recalled)
                    ? "check"
                    : index === 1 && !recalled
                      ? "hourglass_top"
                      : "schedule"}
                </Icon>
              </div>
              {index < 3 && (
                <div
                  className={`h-0.5 flex-1 hidden md:block ${completed || (index === 0 && !recalled) ? "bg-tertiary-container" : "bg-surface-variant"}`}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-headline-sm">
                  {index + 1}. {step.title}
                </span>
                <StatusBadge
                  tone={
                    completed || (index === 0 && !recalled)
                      ? "success"
                      : index === 1 && !recalled
                        ? "warning"
                        : "neutral"
                  }
                >
                  {completed ? "Passed" : recalled ? "Queued" : step.status}
                </StatusBadge>
              </div>
              <p className="text-body-sm mt-0.5">{step.owner}</p>
              <p className="text-label-caps text-on-surface-variant mt-1">
                {completed
                  ? "Completed"
                  : recalled
                    ? "Awaiting submission"
                    : step.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
