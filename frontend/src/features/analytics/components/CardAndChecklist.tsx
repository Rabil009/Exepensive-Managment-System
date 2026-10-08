import { CardLimitUsage } from "./CardLimitUsage";
import { ExpenseChecklist } from "./ExpenseChecklist";

export function CardAndChecklist() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
      <CardLimitUsage />
      <ExpenseChecklist />
    </div>
  );
}

export default CardAndChecklist;
