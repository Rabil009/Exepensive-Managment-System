import React from "react";

export type StatusVariant = "pending" | "approved" | "rejected" | "attention" | "neutral";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  variant,
  className = "",
  showDot = true,
}: StatusBadgeProps) {
  const normalized = (variant || status.toLowerCase()) as string;

  let pillClasses = "bg-zinc-800/60 text-zinc-300 border-zinc-700/50";
  let dotClasses = "bg-zinc-400";

  if (normalized.includes("pending")) {
    pillClasses = "bg-amber-500/[0.10] text-amber-300 border-amber-500/25";
    dotClasses = "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]";
  } else if (normalized.includes("approved")) {
    pillClasses = "bg-emerald-500/[0.10] text-emerald-300 border-emerald-500/25";
    dotClasses = "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]";
  } else if (normalized.includes("rejected")) {
    pillClasses = "bg-purple-500/[0.10] text-purple-300 border-purple-500/25";
    dotClasses = "bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]";
  } else if (normalized.includes("attention")) {
    pillClasses = "bg-rose-500/[0.10] text-rose-300 border-rose-500/25";
    dotClasses = "bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-xs transition-colors ${pillClasses} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses}`} />}
      <span>{status}</span>
    </span>
  );
}

// Category / Expense Type Badge with icon
interface ExpenseTypeBadgeProps {
  type: "Travel" | "Hotel" | "Meals" | "Transport" | string;
  icon?: React.ReactNode;
  className?: string;
}

export function ExpenseTypeBadge({ type, icon, className = "" }: ExpenseTypeBadgeProps) {
  const normalized = type.toLowerCase();

  let style = "bg-white/[0.04] text-zinc-300 border-white/[0.08]";

  if (normalized.includes("travel")) {
    style = "bg-blue-500/[0.10] text-blue-300 border-blue-500/20";
  } else if (normalized.includes("hotel")) {
    style = "bg-purple-500/[0.10] text-purple-300 border-purple-500/20";
  } else if (normalized.includes("meal")) {
    style = "bg-emerald-500/[0.10] text-emerald-300 border-emerald-500/20";
  } else if (normalized.includes("transport")) {
    style = "bg-cyan-500/[0.10] text-cyan-300 border-cyan-500/20";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${style} ${className}`}
    >
      {icon && <span className="shrink-0 opacity-80">{icon}</span>}
      <span>{type}</span>
    </span>
  );
}

