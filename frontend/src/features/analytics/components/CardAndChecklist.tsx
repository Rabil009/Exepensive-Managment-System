import { CardLimitUsage } from "./CardLimitUsage";
import { ExpenseChecklist } from "./ExpenseChecklist";
import type { AnalyticsData } from "../data/useEmployeeAnalytics";

export function CardAndChecklist({ data }: { data: AnalyticsData | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
      <CardLimitUsage data={data} />
      <ExpenseChecklist />
    </div>
  );
}

export default CardAndChecklist;
