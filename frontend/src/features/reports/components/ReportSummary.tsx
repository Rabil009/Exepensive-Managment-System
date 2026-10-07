import type { ReportsModel } from "../hooks/useReports";
import { formatTotal, isPersonal, isPersonalCard } from "../utils/reportTotals";

type Props = {
  model: Pick<
    ReportsModel,
    "items" | "corporate" | "personal" | "chartItems" | "total" | "verified"
  >;
};
export function ReportSummary({ model }: Props) {
  const { items, corporate, personal, chartItems, total, verified } = model;
  const personalCard = personal.filter(isPersonalCard);
  const outOfPocket = personal.filter((item) => !isPersonalCard(item));
  const personalCardTotal = chartItems
    .filter(isPersonalCard)
    .reduce((sum, item) => sum + item.amount, 0);
  const outOfPocketTotal = chartItems
    .filter((item) => isPersonal(item) && !isPersonalCard(item))
    .reduce((sum, item) => sum + item.amount, 0);
  return (
    <div className="report-summary grid grid-cols-1 md:grid-cols-3 gap-space-md">
      <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
          <span className="">Total Claimed</span>
          <span className="material-symbols-outlined text-base text-primary">
            receipt_long
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-space-xs">
          <span className="font-financial-display text-financial-display text-on-surface tracking-tight">
            {formatTotal(items)}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            ({items.length} receipts)
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span className="">Avg. transaction</span>
          <span className="font-financial-tabular text-financial-tabular font-medium text-on-surface">
            {formatTotal(items, true)}
          </span>
        </div>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
          <span className="">Payment Breakdown</span>
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            credit_card
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between items-center text-body-sm font-body-sm">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              Corporate Card:
            </span>
            <span className="font-financial-tabular text-financial-tabular font-medium text-on-surface">
              {formatTotal(corporate)}
            </span>
          </div>
          <div className="flex justify-between items-center text-body-sm font-body-sm">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-outline"></span>
              Personal Card:
            </span>
            <span className="font-financial-tabular text-financial-tabular font-medium text-on-surface">
              {formatTotal(personalCard)}
            </span>
          </div>
          <div className="flex justify-between items-center text-body-sm font-body-sm">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              Out of Pocket:
            </span>
            <span className="font-financial-tabular text-financial-tabular font-semibold text-tertiary">
              {formatTotal(outOfPocket)}
            </span>
          </div>
        </div>
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex mt-2">
          <div
            className="bg-primary-container h-full"
            style={{
              width: `${total ? (chartItems.filter((item) => !isPersonal(item)).reduce((sum, item) => sum + item.amount, 0) / total) * 100 : 0}%`,
            }}
          ></div>
          <div
            className="bg-outline h-full"
            style={{
              width: `${total ? (personalCardTotal / total) * 100 : 0}%`,
            }}
          ></div>
          <div
            className="bg-tertiary-container h-full"
            style={{
              width: `${total ? (outOfPocketTotal / total) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
          <span className="">Policy Governance</span>
          <span className="material-symbols-outlined text-base text-tertiary">
            verified_user
          </span>
        </div>
        <div className="mt-2 flex items-center gap-space-xs">
          <span className="px-2.5 py-0.5 rounded font-headline-sm text-headline-sm bg-tertiary-fixed/30 text-on-tertiary-fixed-variant">
            {verified.length === items.length && items.length
              ? "100% Compliant"
              : "Receipts Pending"}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-tertiary">
            check_circle
          </span>
          <span className="">
            {verified.length} of {items.length} receipts verified
          </span>
        </div>
      </div>
    </div>
  );
}
