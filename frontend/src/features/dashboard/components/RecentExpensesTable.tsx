import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Card } from "@ui/components/data-display/Card/card";
import { Button } from "@ui/components/actions/Button/button";
import { ExpenseTable } from "../../expenses/components/ExpenseTable";
import { useExpenses } from "../../expenses/data/ExpensesContext";
export function RecentExpensesTable() {
  const { expenses } = useExpenses();
  return (
    <Card className="table-card py-0">
      <div className="table-title">
        <div>
          <h2 className="section-heading">Recent Expenses</h2>
          <div className="section-subtitle">Your latest submissions</div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/employee/expenses">
            View all <ArrowRight size={14} />
          </Link>
        </Button>
      </div>
      <ExpenseTable expenses={expenses.slice(0, 4)} />
    </Card>
  );
}
