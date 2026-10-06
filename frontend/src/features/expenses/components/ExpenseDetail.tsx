import { Link, useParams } from "react-router";
import { ArrowLeft, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/data-display/Card/card";
import { Button } from "@ui/components/actions/Button/button";
import { StatusBadge } from "@ui/components/data-display/StatusBadge/StatusBadge";
import { DetailPageTemplate } from "../../../../../templates/detail-page/DetailPageTemplate";
import { useExpenses } from "../data/ExpensesContext";
import { displayDate, money } from "../data/expenses.mock";

export function ExpenseDetail() {
  const { expenseId } = useParams();
  const { expenses } = useExpenses();
  const item = expenses.find((expense) => expense.id === expenseId);
  if (!item)
    return (
      <div>
        <h1 className="text-xl font-semibold">Expense not found</h1>
        <Button variant="link" asChild>
          <Link to="/employee/expenses">Back to My Expenses</Link>
        </Button>
      </div>
    );
  const steps = ["Submitted", "Pending Approval", "Approved", "Reimbursed"];
  const complete =
    item.status === "Reimbursed"
      ? 4
      : item.status === "Approved"
        ? 3
        : item.status === "Pending"
          ? 2
          : item.status === "Rejected"
            ? 2
            : 0;
  return (
    <DetailPageTemplate
      header={
        <div className="page-header">
          <div>
            <Button variant="link" className="-ml-3 mb-3" asChild>
              <Link to="/employee/expenses">
                <ArrowLeft size={15} />
                My Expenses
              </Link>
            </Button>
            <h1>{item.id}</h1>
            <p>Expense details and approval progress.</p>
          </div>
          <StatusBadge status={item.status} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="detail-list">
            <div className="detail-item">
              <dt>Amount</dt>
              <dd className="text-2xl font-semibold">{money(item.amount)}</dd>
            </div>
            <div className="detail-item">
              <dt>Status</dt>
              <dd>
                <StatusBadge status={item.status} />
              </dd>
            </div>
            <div className="detail-item">
              <dt>Merchant</dt>
              <dd>{item.merchant}</dd>
            </div>
            <div className="detail-item">
              <dt>Category</dt>
              <dd>{item.category}</dd>
            </div>
            <div className="detail-item">
              <dt>Expense Date</dt>
              <dd>{displayDate(item.date)}</dd>
            </div>
            <div className="detail-item">
              <dt>Expense ID</dt>
              <dd>{item.id}</dd>
            </div>
            <div className="detail-item col-span-2">
              <dt>Description</dt>
              <dd>{item.description || "—"}</dd>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="section-heading">Receipt</h2>
            <div className="mt-3 flex items-center gap-3 rounded-md border border-border p-4">
              <FileText size={20} className="text-muted-foreground" />
              <span>{item.receipt || "No receipt attached"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Approval History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="timeline">
            {steps.map((step, index) => (
              <div
                className={`timeline-step ${index < complete ? "done" : ""}`}
                key={step}
              >
                <span className="timeline-dot" />
                <div>
                  <strong className="text-sm font-medium">{step}</strong>
                  <div className="section-subtitle">
                    {index < complete
                      ? index === 0
                        ? displayDate(item.date)
                        : "Completed"
                      : "Awaiting update"}
                  </div>
                </div>
              </div>
            ))}
            {item.status === "Rejected" && (
              <div className="text-red-400">Expense was rejected</div>
            )}
          </div>
        </CardContent>
      </Card>
    </DetailPageTemplate>
  );
}
