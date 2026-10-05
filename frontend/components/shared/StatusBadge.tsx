import { cn } from "@/lib";
import type { ClaimStatus } from "@/types/finance";

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

const LUXURY_STATUS: Record<ClaimStatus, { label: string; style: string }> = {
  DRAFT: {
    label: "Draft",
    style: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  SUBMITTED: {
    label: "Awaiting Review",
    style: "bg-[#c5a880]/10 text-[#c5a880] border-[#c5a880]/30",
  },
  MANAGER_APPROVED: {
    label: "Manager Endorsed",
    style: "bg-sky-500/10 text-sky-400 border-sky-500/25",
  },
  MANAGER_REJECTED: {
    label: "Returned for Clarification",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  },
  FINANCE_APPROVED: {
    label: "Verified for Settlement",
    style: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  },
  FINANCE_REJECTED: {
    label: "Declined by Treasury",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  },
  PAYMENT_PENDING: {
    label: "Payment Pending",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  },
  PAID: {
    label: "Settled & Disbursed",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  },
  DISBURSED: {
    label: "Settled & Disbursed",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  },
  CLOSED: {
    label: "Reconciled & Closed",
    style: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = LUXURY_STATUS[status] || LUXURY_STATUS.DRAFT;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-medium tracking-[0.08em] uppercase",
        config.style,
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}
