import type { ReportsModel } from "../hooks/useReports";
import { Link } from "react-router";
import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import { formatTotal } from "../utils/reportTotals";

type Props = {
  model: Pick<ReportsModel, "distribution" | "quarterTotal" | "quarterItems">;
};
export function SpendDistribution({ model }: Props) {
  const { distribution, quarterTotal, quarterItems } = model;
  return (
    <div className="rounded-xl bg-surface-container-low border border-outline-variant/20 p-space-md flex flex-col gap-space-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="text-primary text-base">public</Icon>
          <h2 className="text-headline-sm">Quarterly Spend Distribution</h2>
        </div>
        <Link
          className="text-label-md text-primary hover:underline"
          to="/employee/analytics"
        >
          Full Analytics →
        </Link>
      </div>
      <p className="text-body-sm text-on-surface-variant">
        USD expense receipts across your Q4 FY25 reports
      </p>
      <div className="flex h-2 rounded-full overflow-hidden bg-surface-container-high my-1">
        {distribution.map((group) => (
          <div
            key={group.name}
            style={{
              width: `${quarterTotal ? (group.total / quarterTotal) * 100 : 0}%`,
              background: group.color,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
        {distribution.map((group) => (
          <div
            key={group.name}
            className="p-2.5 rounded-lg bg-white border border-outline-variant/20 flex flex-col gap-1"
          >
            <div className="report-distribution-value flex items-center justify-between gap-2 text-body-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: group.color }}
                />
                {group.name}
              </span>
              <strong>{formatTotal(group.items)}</strong>
            </div>
            <div className="flex items-center justify-between text-label-caps text-on-surface-variant">
              <span>{group.description}</span>
              <span>
                {quarterTotal
                  ? Math.round((group.total / quarterTotal) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-outline-variant/20 flex justify-between gap-2 text-body-sm text-on-surface-variant">
        <span>{quarterItems.length} expense records</span>
        <span>
          Total Claimed:{" "}
          <strong className="text-on-surface">
            {formatTotal(quarterItems)}
          </strong>
        </span>
      </div>
    </div>
  );
}
