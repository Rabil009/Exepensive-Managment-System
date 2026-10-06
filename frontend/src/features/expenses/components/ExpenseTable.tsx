import { Link } from "react-router";
import { Paperclip } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/data-display/Table/table";
import { Button } from "@ui/components/actions/Button/button";
import { StatusBadge } from "@ui/components/data-display/StatusBadge/StatusBadge";
import { displayDate, money, type Expense } from "../data/expenses.mock";

export function ExpenseTable({
  expenses,
  showId = false,
}: {
  expenses: Expense[];
  showId?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showId && <TableHead>Expense ID</TableHead>}
          <TableHead>Date</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((item) => (
          <TableRow key={item.id} className="h-[52px]">
            {showId && (
              <TableCell>
                <Link
                  className="font-medium hover:underline"
                  to={`/employee/expenses/${item.id}`}
                >
                  {item.id}
                </Link>
              </TableCell>
            )}
            <TableCell className="text-muted-foreground">
              {displayDate(item.date)}
            </TableCell>
            <TableCell>
              <Link
                className="font-medium hover:underline"
                to={`/employee/expenses/${item.id}`}
              >
                {item.merchant}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.category}
            </TableCell>
            <TableCell className="text-right font-medium">
              {money(item.amount)}
            </TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
            <TableCell>
              {item.receipt ? (
                <Button variant="link" size="sm" asChild>
                  <Link to={`/employee/expenses/${item.id}`}>
                    <Paperclip size={13} />
                    View
                  </Link>
                </Button>
              ) : (
                <span className="muted">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
