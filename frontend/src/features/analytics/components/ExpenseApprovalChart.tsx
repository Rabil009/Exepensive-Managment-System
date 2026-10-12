import type { AnalyticsData } from "../data/useEmployeeAnalytics";

const statuses = [
  { key: "approved", label: "Approved", color: "#3B9B78" },
  { key: "rejected", label: "Rejected", color: "#D66565" },
  { key: "pending", label: "Pending", color: "#C98642" },
] as const;

export function ExpenseApprovalChart({ data }: { data: AnalyticsData | null }) {
  const counts = data?.approval_counts;
  const total = statuses.reduce(
    (sum, status) => sum + (counts?.[status.key] ?? 0),
    0,
  );

  return (
    <div
      aria-label="Monthly expense approval status"
      className="flex h-full flex-col"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-white/[0.07]">
        <div>
          <h3 className="text-sm font-semibold">Expense Approval Status</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Expense count for {data?.month || "the selected month"}
          </p>
        </div>
        <span className="shrink-0 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 dark:border-white/[0.1] dark:text-zinc-300">
          {total} total
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-evenly gap-3">
        {statuses.map((status) => {
          const count = counts?.[status.key] ?? 0;
          const percentage = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={status.key}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span>{status.label}</span>
                <strong className="tabular-nums">{count}</strong>
              </div>
              <div
                role="progressbar"
                aria-label={`${status.label}: ${count} expenses`}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.08]"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: status.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-white/[0.07]">
        <span>Total expenses</span>
        <strong className="font-medium text-zinc-600 dark:text-zinc-300">
          {total}
        </strong>
      </div>
    </div>
  );
}

export default ExpenseApprovalChart;
