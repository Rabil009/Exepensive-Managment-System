"use client";

import React from "react";
import { CheckCircle2, Clock, CircleDot, Circle, GitCommit } from "lucide-react";
import { useTheme } from "@/lib/theme-store";
import type { ReportsModel } from "../hooks/useReports";
import { StatusBadge } from "../../../shared/components/StatusBadge";

type Props = { model: Pick<ReportsModel, "completed" | "recalled" | "workflowStage"> };

const steps = [
  { title: "Report Submitted", owner: "Employee" },
  { title: "Manager Review", owner: "Manager" },
  { title: "Finance Review", owner: "Finance team" },
  { title: "Reimbursement", owner: "Finance team" },
];

export function ApprovalWorkflow({ model }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { completed, recalled, workflowStage } = model;
  const currentStep = workflowStage === "FINANCE_REVIEW" ? 2 : workflowStage === "COMPLETE" ? 4 : workflowStage === "DRAFT" ? 0 : 1;

  return (
    <section
      aria-label="Approval Workflow"
      className={`rounded-xl p-5 border transition-colors ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Approval Progress &amp; Timeline
          </h2>
        </div>
        <span
          className={`text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border ${
            completed
              ? "bg-[#3B9B78]/10 text-[#3B9B78] border-[#3B9B78]/20"
              : recalled
              ? "bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 border-zinc-200/80 dark:border-white/[0.08]"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
          }`}
        >
          {completed
            ? "Approved & Complete"
            : recalled
            ? "Draft · Withdrawn"
            : workflowStage === "REJECTED" ? "Rejected" : `In Review · Step ${currentStep + 1} of 4`}
        </span>
      </div>

      {/* 4 Connected Timeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {steps.map((step, index) => {
          const isDone = completed || index < currentStep;
          const isCurrent = index === currentStep && !completed && !recalled;
          const isUpcoming = index > currentStep && !completed;

          return (
            <div
              key={step.title}
              className={`flex flex-col gap-2 relative ${
                isUpcoming ? "opacity-50" : ""
              }`}
            >
              {/* Step indicator node and horizontal connecting line */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? "bg-[#3B9B78]/15 text-[#3B9B78] border border-[#3B9B78]/30"
                      : isCurrent
                      ? "bg-[#5A78A6]/15 text-[#5A78A6] border border-[#5A78A6]/40"
                      : isDark
                      ? "bg-white/[0.03] text-zinc-500 border border-white/[0.08]"
                      : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>

                {index < 3 && (
                  <div
                    className={`h-0.5 flex-1 hidden md:block rounded-full ${
                      isDone
                        ? "bg-[#3B9B78]/40"
                        : isDark
                        ? "bg-white/[0.08]"
                        : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>

              {/* Step Info */}
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {index + 1}. {step.title}
                  </span>
                  <StatusBadge
                    tone={
                      isDone
                        ? "success"
                        : isCurrent
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {completed
                      ? "Complete"
                      : recalled
                      ? "Not Submitted"
                      : isCurrent ? "In Review" : "Waiting"}
                  </StatusBadge>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                  {step.owner}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {completed
                    ? "Completed"
                    : recalled
                    ? "Awaiting submission"
                    : isCurrent ? "Awaiting review" : "Waiting for the previous step"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ApprovalWorkflow;
