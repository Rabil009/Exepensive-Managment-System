import { ArrowUpRight, Clock3, CheckCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "@ui/components/data-display/Card/card";
import { money } from "../../expenses/data/expenses.mock";

const stats = [
  {
    label: "Total Expenses",
    value: 28500,
    note: "This month",
    icon: ArrowUpRight,
  },
  {
    label: "Pending",
    value: 4200,
    note: "3 expenses awaiting approval",
    icon: Clock3,
  },
  {
    label: "Approved",
    value: 18800,
    note: "Approved this month",
    icon: CheckCheck,
  },
  {
    label: "Reimbursed",
    value: 16500,
    note: "Paid to your account",
    icon: Wallet,
  },
];
export function EmployeeSummaryCards() {
  return (
    <div className="stats-grid">
      {stats.map(({ label, value, note, icon: Icon }) => (
        <Card key={label} className="stat-card py-0">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={16} />
            </div>
            <div className="stat-value">{money(value)}</div>
            <div className="stat-note">{note}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
