import React from "react";

export type MetricAccent = "red" | "emerald" | "purple" | "blue" | "amber";

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  accent: MetricAccent;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  trend,
  accent,
  icon,
  className = "",
}: MetricCardProps) {
  const accentConfigs = {
    red: {
      iconBg: "bg-[#33151b] text-[#f87171] shadow-[inset_0_1px_0_rgba(248,113,113,0.2)]",
    },
    amber: {
      iconBg: "bg-[#2a1e0b] text-[#eab308] shadow-[inset_0_1px_0_rgba(234,179,8,0.2)]",
    },
    emerald: {
      iconBg: "bg-[#09291b] text-[#22c55e] shadow-[inset_0_1px_0_rgba(34,197,94,0.2)]",
    },
    purple: {
      iconBg: "bg-[#281335] text-[#c084fc] shadow-[inset_0_1px_0_rgba(192,132,252,0.2)]",
    },
    blue: {
      iconBg: "bg-[#0d223f] text-[#38bdf8] shadow-[inset_0_1px_0_rgba(56,189,248,0.2)]",
    },
  };

  const cfg = accentConfigs[accent] || accentConfigs.blue;

  return (
    <div
      className={`bg-[#0b0c10] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-[22px] shadow-[0_8px_24px_rgba(0,0,0,0.45),_inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 h-full min-h-[124px] flex items-center justify-center ${className}`}
    >
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Left: Rounded squarish icon box (52–56px) */}
        {icon && (
          <div
            className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center shrink-0 [&>svg]:w-7 [&>svg]:h-7 [&_svg]:w-7 [&_svg]:h-7 ${cfg.iconBg}`}
          >
            {icon}
          </div>
        )}

        {/* Right: Content stack */}
        <div className="min-w-0">
          {/* Top row: Label / Heading */}
          <div className="text-xs sm:text-sm text-zinc-200 font-semibold tracking-tight truncate">
            {label}
          </div>

          {/* Middle row: Large Value (32px, bold) */}
          <div
            className="text-[32px] font-bold text-white tracking-tight leading-none my-0.5 tabular-nums truncate"
            style={{ fontSize: "32px", lineHeight: "1" }}
          >
            {value}
          </div>

          {/* Bottom row: Subtitle / trend context text */}
          {trend && (
            <div className="text-xs text-zinc-400 font-normal truncate">
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;

