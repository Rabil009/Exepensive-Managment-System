import React from "react";
import { cn } from "@/lib";
import type { ClaimStatus } from "@/types/finance";

export type StatusTone = "success" | "warning" | "danger" | "neutral";

export interface StatusBadgeProps {
  tone?: StatusTone;
  status?: ClaimStatus;
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

const TONE_CONFIG: Record<StatusTone, { text: string; dot: string }> = {
  success: {
    text: "text-zinc-800 dark:text-zinc-200",
    dot: "bg-[#2E9E74]",
  },
  warning: {
    text: "text-zinc-800 dark:text-zinc-200",
    dot: "bg-amber-500",
  },
  danger: {
    text: "text-zinc-800 dark:text-zinc-200",
    dot: "bg-rose-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

const CLAIM_STATUS_MAP: Record<ClaimStatus, { tone: StatusTone; label: string }> = {
  DRAFT: { tone: "neutral", label: "Draft" },
  SUBMITTED: { tone: "warning", label: "Awaiting review" },
  MANAGER_APPROVED: { tone: "neutral", label: "Manager endorsed" },
  MANAGER_REJECTED: { tone: "danger", label: "Returned" },
  FINANCE_APPROVED: { tone: "warning", label: "Verified" },
  FINANCE_REJECTED: { tone: "danger", label: "Declined" },
  PAYMENT_PENDING: { tone: "warning", label: "Payment pending" },
  PAID: { tone: "success", label: "Paid" },
  DISBURSED: { tone: "success", label: "Paid" },
  CLOSED: { tone: "neutral", label: "Reconciled" },
};

export function StatusBadge({ tone, status, children, label, className }: StatusBadgeProps) {
  let resolvedTone: StatusTone = tone || "neutral";
  let content = children || label;

  if (status && !tone) {
    const claimConfig = CLAIM_STATUS_MAP[status] || { tone: "neutral" as StatusTone, label: status };
    resolvedTone = claimConfig.tone;
    if (!content) {
      content = claimConfig.label;
    }
  }

  const config = TONE_CONFIG[resolvedTone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap bg-transparent",
        config.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {content}
    </span>
  );
}

export type PriorityLevel = "high" | "medium" | "low";

export interface PriorityBadgeProps {
  level: PriorityLevel | "High" | "Medium" | "Low";
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

const PRIORITY_CONFIG: Record<PriorityLevel, { text: string; dot: string }> = {
  high: {
    text: "text-zinc-800 dark:text-zinc-200",
    dot: "bg-rose-500",
  },
  medium: {
    text: "text-zinc-800 dark:text-zinc-200",
    dot: "bg-amber-500",
  },
  low: {
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400 dark:bg-zinc-500",
  },
};

export function PriorityBadge({ level, children, label, className }: PriorityBadgeProps) {
  const normalizedLevel = (level.toLowerCase() as PriorityLevel) || "low";
  const config = PRIORITY_CONFIG[normalizedLevel] || PRIORITY_CONFIG.low;
  const defaultLabel = normalizedLevel.charAt(0).toUpperCase() + normalizedLevel.slice(1);
  const content = children || label || defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap bg-transparent",
        config.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {content}
    </span>
  );
}
