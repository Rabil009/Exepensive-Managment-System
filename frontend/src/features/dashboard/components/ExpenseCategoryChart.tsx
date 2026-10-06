import { Card, CardContent } from "@ui/components/data-display/Card/card";
import { categories } from "../data/dashboard.mock";
import { money } from "../../expenses/data/expenses.mock";
export function ExpenseCategoryChart() {
  return (
    <Card className="chart-card py-0">
      <CardContent className="p-6">
        <h2 className="section-heading">Expense by Category</h2>
        <div className="section-subtitle">Where your spending goes</div>
        <div className="category-list">
          {categories.map((item) => (
            <div className="category-row" key={item.name}>
              <span>{item.name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="right muted">{money(item.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
