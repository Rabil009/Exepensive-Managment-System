import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@ui/components/actions/Button/button";
export function EmployeeDashboardHeader() {
  return (
    <div className="page-header">
      <div>
        <h1>Employee Dashboard</h1>
        <p>Track your expenses, approvals, and reimbursements.</p>
      </div>
      <Button asChild>
        <Link to="/employee/expenses/new">
          <Plus size={16} />
          Add Expense
        </Link>
      </Button>
    </div>
  );
}
