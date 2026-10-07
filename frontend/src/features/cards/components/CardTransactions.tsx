import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardPanelClass as panel } from "../styles/cardClasses";
import { transactions } from "../data/demoCards";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<
    CardControlsModel,
    | "visible"
    | "query"
    | "setQuery"
    | "payment"
    | "setPayment"
    | "status"
    | "setStatus"
    | "exportTransactions"
  >;
};
export function CardTransactions({ model }: Props) {
  const {
    visible,
    query,
    setQuery,
    payment,
    setPayment,
    status,
    setStatus,
    exportTransactions,
  } = model;
  return (
    <section className={`${panel} overflow-hidden`}>
      <div className="p-space-lg flex items-center justify-between gap-space-md border-b border-outline-variant/20">
        <h2 className="text-headline-lg">Included Transactions</h2>
        <button
          type="button"
          className="aura-card-button"
          onClick={exportTransactions}
        >
          <Icon className="text-base">file_download</Icon>Export CSV
        </button>
      </div>
      <div className="px-space-lg py-space-md flex flex-wrap items-center gap-space-sm border-b border-outline-variant/20">
        <label className="flex items-center bg-surface-container-low px-space-md py-1.5 rounded-lg text-on-surface-variant flex-1 min-w-[180px] max-w-xs border border-outline-variant/30">
          <Icon className="text-base mr-1.5">search</Icon>
          <input
            className="bg-transparent border-none outline-none text-body-sm w-full"
            aria-label="Filter transactions"
            placeholder="Filter merchant, code..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="aura-transaction-filter">
          Payment:{" "}
          <select
            aria-label="Filter by payment"
            value={payment}
            onChange={(event) => setPayment(event.target.value)}
          >
            <option>All</option>
            <option>Corporate</option>
            <option>Personal</option>
          </select>
        </label>
        <label className="aura-transaction-filter">
          Status:{" "}
          <select
            aria-label="Filter by transaction status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </label>
      </div>
      <div className="overflow-x-auto px-space-lg py-space-sm">
        <table className="aura-card-transactions">
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant &amp; Details</th>
              <th>Payment Card</th>
              <th>Status</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.merchant}>
                <td>{item.date}</td>
                <td>
                  <strong>{item.merchant}</strong>
                  <small>{item.purpose}</small>
                </td>
                <td>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="text-base">
                      {item.payment === "Corporate"
                        ? "credit_card"
                        : "receipt_long"}
                    </Icon>
                    {item.payment === "Corporate"
                      ? "Aura Corporate ••4921"
                      : "Personal (Reimbursable)"}
                  </span>
                </td>
                <td>
                  <StatusBadge
                    tone={
                      item.status === "Success"
                        ? "success"
                        : item.status === "Failed"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {item.status}
                  </StatusBadge>
                </td>
                <td className="aura-transaction-amount">
                  {money(item.amount)}
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={5} className="aura-card-empty">
                  No transactions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="aura-transactions-footer">
        <span>
          Showing {visible.length} of {transactions.length} report transactions
        </span>
        <strong>
          TOTAL:{" "}
          {money(visible.reduce((total, item) => total + item.amount, 0))}
        </strong>
      </footer>
    </section>
  );
}
