import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { displayDate, money } from "../../../shared/utils/format";
import { tabs, categoryIcons } from "../data/overview";
import type { OverviewModel } from "../hooks/useOverview";
type Props = {
  model: Pick<
    OverviewModel,
    | "visible"
    | "expenses"
    | "tab"
    | "setTab"
    | "countFor"
    | "setNotice"
    | "hideReceipt"
    | "setHideReceipt"
  >;
};
export function OverviewExpenseTable({ model }: Props) {
  const {
    visible,
    expenses,
    tab,
    setTab,
    countFor,
    setNotice,
    hideReceipt,
    setHideReceipt,
  } = model;
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-space-md bg-surface-container-lowest gap-space-md">
        <div
          className="inline-flex flex-wrap p-1 rounded-lg bg-surface-container gap-1"
          role="group"
          aria-label="Expense status"
        >
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-label-md font-label-md transition-all ${tab === value ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {label}
              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-outline/10 px-1 text-[11px] leading-none font-medium tabular-nums text-on-surface-variant">
                {countFor(value)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-space-sm text-on-surface-variant">
          <span className="text-body-sm">
            Displaying {visible.length} of {expenses.length} records
          </span>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <button
            type="button"
            className="p-1 hover:bg-surface-container rounded"
            title="Refresh Expenses"
            onClick={() => setNotice("Expense records are up to date.")}
          >
            <Icon className="text-base">sync</Icon>
          </button>
          <button
            type="button"
            className="p-1 hover:bg-surface-container rounded"
            title="Columns Visibility"
            aria-pressed={!hideReceipt}
            onClick={() => setHideReceipt((value) => !value)}
          >
            <Icon className="text-base">view_column</Icon>
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider h-10 select-none">
              <th className="py-2 px-space-lg font-label-caps">
                Merchant &amp; Purpose
              </th>
              <th className="py-2 px-space-md font-label-caps">Date</th>
              <th className="py-2 px-space-md font-label-caps">
                Expense Report
              </th>
              <th className="py-2 px-space-md font-label-caps">
                Payment Method
              </th>
              {!hideReceipt && (
                <th className="py-2 px-space-md font-label-caps">
                  Receipt Status
                </th>
              )}
              <th className="py-2 px-space-md font-label-caps text-right">
                Amount
              </th>
              <th className="py-2 px-space-lg font-label-caps text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent font-body-md text-body-md text-on-surface">
            {visible.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-low/70 transition-colors h-14"
              >
                <td className="py-3 px-space-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                      <Icon className="text-base">
                        {categoryIcons[item.category] ?? "receipt_long"}
                      </Icon>
                    </span>
                    <span className="flex flex-col">
                      <strong className="font-headline-sm text-headline-sm">
                        {item.merchant}
                      </strong>
                      <small className="text-body-sm text-on-surface-variant">
                        {item.description}
                      </small>
                    </span>
                  </div>
                </td>
                <td className="py-3 px-space-md whitespace-nowrap text-financial-tabular">
                  {displayDate(item.date)}
                </td>
                <td className="py-3 px-space-md whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-body-sm">
                    {item.report || "Unassigned"}
                  </span>
                </td>
                <td className="py-3 px-space-md whitespace-nowrap text-body-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="text-base text-primary">
                      {item.paymentMethod?.includes("Card") ||
                      item.paymentMethod?.includes("Visa")
                        ? "credit_card"
                        : "wallet"}
                    </Icon>
                    {item.paymentMethod || "Out of Pocket"}
                  </span>
                </td>
                {!hideReceipt && (
                  <td className="py-3 px-space-md whitespace-nowrap text-label-md">
                    <span
                      className={`inline-flex items-center gap-1 ${item.receipt ? "text-tertiary" : "text-on-surface-variant"}`}
                    >
                      <Icon className="text-base">
                        {item.receipt ? "attachment" : "receipt_long"}
                      </Icon>
                      {item.receipt === "Auto-Matched Invoice" ? "Invoice Attached" : item.receipt === "Verified Receipt" ? "Receipt Attached" : item.receipt || "No receipt"}
                    </span>
                  </td>
                )}
                <td className="py-3 px-space-md text-right font-financial-tabular whitespace-nowrap">
                  {money(item.amount, item.currency)}
                </td>
                <td className="py-3 px-space-lg text-left align-middle">
                  <StatusBadge
                    tone={
                      item.status === "Rejected"
                        ? "danger"
                        : item.status === "Pending"
                          ? "warning"
                          : item.status === "Draft"
                            ? "neutral"
                            : "success"
                    }
                  >
                    {item.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td
                  colSpan={hideReceipt ? 6 : 7}
                  className="text-center p-8 text-on-surface-variant"
                >
                  No expenses match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-space-md bg-surface-container-low/40 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-tertiary">
            check_circle
          </span>
          <span className="">
            Your saved expenses are shown above.
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface shadow-sm disabled:opacity-40"
            disabled
          >
            Previous
          </button>
          <span className="px-2 font-label-md text-label-md text-on-surface">
            Page 1 of 1
          </span>
          <button
            type="button"
            className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors shadow-sm"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
