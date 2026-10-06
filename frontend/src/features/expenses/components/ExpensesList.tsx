import { useState } from "react";
import { Link } from "react-router";
import { Plus, ReceiptText } from "lucide-react";
import { Button } from "@ui/components/actions/Button/button";
import { Card } from "@ui/components/data-display/Card/card";
import { ListPageTemplate } from "../../../../../templates/list-page/ListPageTemplate";
import { useExpenses } from "../data/ExpensesContext";
import {
  ExpenseFilters,
  emptyFilters,
  type ExpenseFilterState,
} from "./ExpenseFilters";
import { ExpenseTable } from "./ExpenseTable";

export function ExpensesList() {
  const { expenses } = useExpenses();
  const [filters, setFilters] = useState<ExpenseFilterState>(emptyFilters);
  const filtered = expenses.filter((item) => {
    const query = filters.search.toLowerCase();
    return (
      (!query ||
        `${item.id} ${item.merchant} ${item.category}`
          .toLowerCase()
          .includes(query)) &&
      (filters.status === "all" || item.status === filters.status) &&
      (filters.category === "all" || item.category === filters.category) &&
      (!filters.date || item.date === filters.date)
    );
  });
  return (
    <ListPageTemplate
      header={
        <div className="page-header">
          <div>
            <h1>My Expenses</h1>
            <p>View and track all your submitted expenses.</p>
          </div>
          <Button asChild>
            <Link to="/employee/expenses/new">
              <Plus size={16} />
              Add Expense
            </Link>
          </Button>
        </div>
      }
      filters={<ExpenseFilters filters={filters} onChange={setFilters} />}
    >
      {filtered.length ? (
        <Card className="table-card py-0">
          <ExpenseTable expenses={filtered} showId />
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <ReceiptText size={28} className="text-muted-foreground" />
          <h2 className="section-heading">No expenses found</h2>
          <p className="muted">
            Try changing your filters or add a new expense.
          </p>
          <Button variant="outline" onClick={() => setFilters(emptyFilters)}>
            Clear filters
          </Button>
        </Card>
      )}
    </ListPageTemplate>
  );
}
