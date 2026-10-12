import type { AnalyticsData } from "../data/useEmployeeAnalytics";
import { ExpenseApprovalChart } from "./ExpenseApprovalChart";

export function CardLimitUsage({ data }: { data: AnalyticsData | null }) {
  return (
    <section
      aria-label="Expense approval status"
      className="h-full rounded-xl border border-zinc-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#111113]"
    >
      <ExpenseApprovalChart data={data} />
    </section>
  );
}

export default CardLimitUsage;
