import { cn } from "@/lib";
import type { MetricCardData } from "@/types/finance";

interface MetricCardProps extends MetricCardData {
  className?: string;
  serialNumber?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend = "neutral",
  trendValue,
  serialNumber,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "luxury-card group rounded-2xl p-6 relative overflow-hidden backdrop-blur-md",
        className
      )}
    >
      {/* Top Ledger Metadata */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[var(--text-muted)]">
          {serialNumber || "SEC // METRIC"}
        </span>
        {trendValue && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--accent-gold)]">
            {trend === "up" ? "▲ " : trend === "down" ? "▼ " : "● "}
            {trendValue}
          </span>
        )}
      </div>

      {/* Main Figures */}
      <div className="mt-4">
        <h3 className="font-outfit text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
          {title}
        </h3>
        <p className="font-mono-nums text-3xl font-light tracking-tight text-[var(--text-display)] mt-1.5">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-[var(--text-muted)] mt-2 font-sans tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
