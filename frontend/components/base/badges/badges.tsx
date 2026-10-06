import React from "react";

export interface BadgeWithDotProps {
  children: React.ReactNode;
  color?: "success" | "warning" | "error" | "gray" | "primary";
  type?: "modern" | "badge" | "pill";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BadgeWithDot({
  children,
  color = "success",
  type = "modern",
  size = "sm",
  className = "",
}: BadgeWithDotProps) {
  const dotColor =
    color === "success"
      ? "bg-emerald-400 ring-emerald-500/30"
      : color === "warning"
      ? "bg-amber-400 ring-amber-500/30"
      : color === "error"
      ? "bg-rose-400 ring-rose-500/30"
      : "bg-zinc-400 ring-zinc-500/30";

  const colorStyles =
    color === "success"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : color === "warning"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : color === "error"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : "bg-white/[0.04] text-zinc-300 border-white/[0.08]";

  const sizeStyles =
    size === "sm"
      ? "px-1.5 py-0.5 text-[10px] gap-1.5"
      : "px-2 py-0.5 text-[11px] gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorStyles} ${sizeStyles} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ring-2 ${dotColor}`} />
      <span>{children}</span>
    </span>
  );
}

