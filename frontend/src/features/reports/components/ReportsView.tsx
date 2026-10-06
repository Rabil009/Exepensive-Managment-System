import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/components/data-display/Card/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/components/data-display/Chart/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ExpenseTrendChart } from "../../dashboard/components/ExpenseTrendChart";
import { ExpenseCategoryChart } from "../../dashboard/components/ExpenseCategoryChart";
import { money } from "../../expenses/data/expenses.mock";

const statusData = [
  { name: "Draft", count: 1 },
  { name: "Pending", count: 3 },
  { name: "Approved", count: 4 },
  { name: "Rejected", count: 1 },
  { name: "Reimbursed", count: 5 },
];
export function ReportsView() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Your personal expense activity and spending trends.</p>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Spending Summary</CardTitle>
          <CardDescription>October 2026</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          <div>
            <div className="muted text-xs mb-2">Total submitted</div>
            <div className="text-2xl font-semibold">{money(28500)}</div>
          </div>
          <div>
            <div className="muted text-xs mb-2">Approved</div>
            <div className="text-2xl font-semibold">{money(18800)}</div>
          </div>
          <div>
            <div className="muted text-xs mb-2">Reimbursed</div>
            <div className="text-2xl font-semibold">{money(16500)}</div>
          </div>
        </CardContent>
      </Card>
      <div className="dashboard-grid">
        <ExpenseTrendChart
          title="Monthly Expense Trend"
          subtitle="Your spending over time"
        />
        <ExpenseCategoryChart />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Expense Status Breakdown</CardTitle>
          <CardDescription>Counts by approval stage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ count: { label: "Expenses", color: "var(--chart-1)" } }}
            className="h-[220px] w-full"
          >
            <BarChart data={statusData} margin={{ left: 0, right: 5 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
