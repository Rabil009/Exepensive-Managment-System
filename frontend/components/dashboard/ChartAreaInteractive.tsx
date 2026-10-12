"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartConfig = {
  desktop: {
    label: "Corporate Cards",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Employee Reimbursements",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const { claims } = useFinanceStore()

  const liveChartData = React.useMemo(() => {
    if (!claims || claims.length === 0) return [];

    const map: Record<string, { date: string; desktop: number; mobile: number }> = {};
    claims.forEach((c: any) => {
      const dateStr = c.createdAt ? c.createdAt.split("T")[0] : new Date().toISOString().split("T")[0];
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, desktop: 0, mobile: 0 };
      }
      if (c.paymentMethod === "CORPORATE_CARD") {
        map[dateStr].desktop += Number(c.amount) || 0;
      } else {
        map[dateStr].mobile += Number(c.amount) || 0;
      }
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [claims]);

  const filteredData = React.useMemo(() => {
    if (liveChartData.length === 0) return [];
    const latestDateStr = liveChartData[liveChartData.length - 1].date;
    const referenceDate = new Date(latestDateStr);
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return liveChartData.filter((item) => new Date(item.date) >= startDate);
  }, [liveChartData, timeRange]);

  return (
    <Card className="rounded-xl overflow-hidden p-0 border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-white/[0.06] px-5 py-4">
        <div className="grid gap-1">
          <CardTitle>Disbursements & Volume Trend</CardTitle>
          <CardDescription>
            Interactive daily clearing and employee reimbursement trends
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[140px] rounded-lg flex shrink-0"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="w-[140px] rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-5 pt-4 pb-5">
        {filteredData.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-zinc-500">
            No claims data registered in Supabase for the selected time range.
          </div>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop, var(--chart-1))"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop, var(--chart-1))"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile, var(--chart-2))"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile, var(--chart-2))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              className="text-zinc-200/60 dark:text-white/[0.05]"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              className="text-zinc-500 dark:text-zinc-400 text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile, var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop, var(--chart-1))"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
