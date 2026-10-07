import type { ReportsModel } from "../hooks/useReports";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import { displayDate, money } from "../../../shared/utils/format";
import { formatTotal, isPersonal } from "../utils/reportTotals";

type Props = {
  model: Pick<
    ReportsModel,
    | "items"
    | "selected"
    | "visible"
    | "query"
    | "setQuery"
    | "category"
    | "setCategory"
    | "payment"
    | "setPayment"
    | "status"
    | "setStatus"
    | "exportTransactions"
    | "clearFilters"
  >;
};
export function ReportTransactions({ model }: Props) {
  const {
    items,
    selected,
    visible,
    query,
    setQuery,
    category,
    setCategory,
    payment,
    setPayment,
    status,
    setStatus,
    exportTransactions,
    clearFilters,
  } = model;
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-md pb-space-xs border-b border-outline-variant/20">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Included Transactions
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Showing all {items.length} transactions associated with {selected}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/30 shadow-sm"
              onClick={exportTransactions}
            >
              <span className="material-symbols-outlined text-sm">
                file_download
              </span>
              <span className="">Export CSV</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-space-sm pt-1">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant w-64">
              <span className="material-symbols-outlined text-base mr-1.5 text-on-surface-variant">
                search
              </span>
              <input
                className="bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant w-full"
                aria-label="Filter merchant or code"
                placeholder="Filter merchant, code..."
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <label className="report-filter">
              <span>Category:</span>
              <select
                aria-label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="All">All</option>
                {[...new Set(items.map((item) => item.category))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <label className="report-filter">
              <span>Payment:</span>
              <select
                aria-label="Payment"
                value={payment}
                onChange={(event) => setPayment(event.target.value)}
              >
                <option value="All">All</option>
                {["Corporate Card", "Out of Pocket"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="report-filter">
              <span>Status:</span>
              <select
                aria-label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="All">All</option>
                {[...new Set(items.map((item) => item.status))].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-on-surface-variant font-label-caps text-label-caps uppercase bg-surface-container-low/50 rounded-lg">
              <th className="py-2.5 px-space-md rounded-l-lg">Date</th>
              <th className="py-2.5 px-space-md">Merchant &amp; Details</th>
              <th className="py-2.5 px-space-md">Category</th>
              <th className="py-2.5 px-space-md">Payment Method</th>
              <th className="py-2.5 px-space-md">Audit Status</th>
              <th className="py-2.5 px-space-md text-right rounded-r-lg">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
            {visible.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low/70">
                <td className="py-3 px-space-md text-financial-tabular text-on-surface-variant whitespace-nowrap">
                  {displayDate(item.date)}
                </td>
                <td className="py-3 px-space-md">
                  <div className="report-merchant">
                    <strong className="text-headline-sm">
                      {item.merchant}
                    </strong>
                    <span className="text-body-sm text-on-surface-variant">
                      ({item.description || item.id})
                    </span>
                  </div>
                </td>
                <td className="py-3 px-space-md">
                  <span className="px-2 py-0.5 rounded text-label-md bg-surface-container-high whitespace-nowrap">
                    {item.category}
                  </span>
                </td>
                <td
                  className={`py-3 px-space-md ${isPersonal(item) ? "text-tertiary" : "text-on-surface-variant"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="text-base">
                      {isPersonal(item) ? "payments" : "credit_card"}
                    </Icon>
                    <span>{item.paymentMethod || "Not assigned"}</span>
                  </div>
                </td>
                <td className="py-3 px-space-md">
                  <StatusBadge tone={item.receipt ? "success" : "warning"}>
                    {item.receipt || "Receipt missing"}
                  </StatusBadge>
                </td>
                <td
                  className={`py-3 px-space-md text-right text-financial-tabular font-semibold whitespace-nowrap ${isPersonal(item) ? "text-tertiary" : ""}`}
                >
                  {money(item.amount, item.currency || "INR")}
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-on-surface-variant"
                >
                  No transactions match your filters.{" "}
                  <button
                    className="text-primary"
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-outline-variant/30 font-headline-sm text-headline-sm">
              <td
                className="py-3 px-space-md text-on-surface-variant font-body-sm text-body-sm"
                colSpan={4}
              >
                Showing {visible.length} of {items.length} report transactions
              </td>
              <td className="py-3 px-space-md text-right font-label-caps text-label-caps uppercase text-on-surface-variant">
                Total:
              </td>
              <td className="py-3 px-space-md text-right font-financial-tabular text-financial-tabular font-bold text-on-surface text-base">
                {formatTotal(visible)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
