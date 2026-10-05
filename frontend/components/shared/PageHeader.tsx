import { cn } from "@/lib";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  sectionCode?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, sectionCode, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 border-b border-[var(--border-hairline)] pb-7 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {sectionCode && (
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--accent-gold)] mb-1">
            {sectionCode}
          </p>
        )}
        <h1 className="font-forum text-3xl sm:text-4xl text-[var(--text-display)] tracking-[0.02em] font-normal">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-xs text-[var(--text-muted)] tracking-wide max-w-2xl font-light">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
