import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/data-display/Card/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/data-display/Table/table";
import { StatusBadge } from "@ui/components/data-display/StatusBadge/StatusBadge";
import { displayDate, money } from "../../expenses/data/expenses.mock";
import { useExpenses } from "../../expenses/data/ExpensesContext";

export function ReimbursementsView() {
  const { expenses } = useExpenses();
  const rows = expenses.filter(
    (item) => item.status === "Approved" || item.status === "Reimbursed",
  );
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Reimbursements</h1>
          <p>Track payments for your approved expenses.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-[820px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Reimbursed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {money(16500)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Pending Reimbursement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {money(4200)}
          </CardContent>
        </Card>
      </div>
      <Card className="table-card py-0">
        <div className="table-title">
          <div>
            <h2 className="section-heading">Recent Reimbursements</h2>
            <div className="section-subtitle">
              Your approved and paid expenses
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead className="text-right">Approved Amount</TableHead>
              <TableHead>Reimbursement Status</TableHead>
              <TableHead>Processed Date</TableHead>
              <TableHead>Payment Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item, index) => (
              <TableRow key={item.id} className="h-[52px]">
                <TableCell>
                  <Link
                    className="font-medium hover:underline"
                    to={`/employee/expenses/${item.id}`}
                  >
                    {item.merchant}{" "}
                    <span className="muted ml-2">{item.id}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {money(item.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={
                      item.status === "Reimbursed"
                        ? "Paid"
                        : index === 0
                          ? "Processing"
                          : "Pending"
                    }
                  />
                </TableCell>
                <TableCell className="muted">
                  {displayDate(item.date)}
                </TableCell>
                <TableCell className="muted">
                  {item.status === "Reimbursed" ? displayDate(item.date) : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
