"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<string, string>;
  }
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactElement;
  }
>(({ className, children, config, style, ...props }, ref) => {
  // Generate CSS variables for each item in config
  const colorVariables = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value.color) {
        vars[`--color-${key}`] = value.color;
      }
    }
    return vars;
  }, [config]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn("w-full text-xs", className)}
        style={{ ...colorVariables, ...style }}
        {...props}
      >
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-lg bg-zinc-100/50 dark:bg-white/[0.03] animate-pulse" />
        )}
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = Tooltip;

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: any;
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
  indicator?: "dot" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  className?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label, payload) : label;

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-zinc-200/80 bg-white p-2.5 text-xs shadow-xl transition-all dark:border-white/[0.08] dark:bg-[#18181D] dark:text-zinc-100",
        className
      )}
    >
      {!hideLabel && formattedLabel && (
        <div className="font-medium text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 pb-1 dark:border-white/[0.06]">
          {formattedLabel}
        </div>
      )}
      <div className="grid gap-1.5 pt-0.5">
        {payload.map((item: any, index: number) => {
          const key = item.dataKey || item.name;
          const configItem = config[key];
          const color = item.color || item.payload?.fill || (configItem && configItem.color) || "currentColor";
          const labelText = configItem?.label || item.name || key;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-1.5">
                {!hideIndicator && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                  {labelText}
                </span>
              </div>
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {item.value?.toLocaleString?.() ?? item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = Legend;

export function ChartLegendContent({ payload }: { payload?: any[] }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-3 text-xs">
      {payload.map((item: any, index: number) => {
        const key = item.dataKey || item.value;
        const configItem = config[key];
        const color = item.color || (configItem && configItem.color);
        const labelText = configItem?.label || item.value || key;

        return (
          <div key={index} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              {labelText}
            </span>
          </div>
        );
      })}
    </div>
  );
}

