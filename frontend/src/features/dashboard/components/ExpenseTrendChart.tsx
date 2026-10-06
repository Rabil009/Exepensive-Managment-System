import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@ui/components/data-display/Card/card";
import { Button } from "@ui/components/actions/Button/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/components/data-display/Chart/chart";
import { trend30 } from "../data/dashboard.mock";

export function ExpenseTrendChart({
  title = "Expense Trend",
  subtitle = "Your expense activity over time",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [period, setPeriod] = useState("30 Days");
  const data =
    period === "7 Days"
      ? trend30.slice(-7)
      : period === "3 Months"
        ? trend30.map((item, index) => ({ ...item, day: `Week ${index + 1}` }))
        : trend30;
  return (
    <Card className="chart-card py-0">
      <CardContent className="p-6">
        <div className="chart-head">
          <div>
            <h2 className="section-heading">{title}</h2>
            <div className="section-subtitle">{subtitle}</div>
          </div>
          <div className="flex gap-1">
            {["7 Days", "30 Days", "3 Months"].map((option) => (
              <Button
                key={option}
                size="sm"
                variant={period === option ? "secondary" : "ghost"}
                onClick={() => setPeriod(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        <div className="chart-wrap">
          <ChartContainer
            className="h-full w-full"
            config={{ amount: { label: "Expenses", color: "var(--chart-1)" } }}
          >
            <AreaChart
              data={data}
              margin={{ left: 0, right: 2, top: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.36}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={18}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${Math.round(Number(value) / 1000)}k`
                }
                width={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#expenseFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
