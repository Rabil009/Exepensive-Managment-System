import { money } from "../../../shared/utils/format";
import { type Expense } from "../../expenses/types";
export const reportName = (item: Expense) =>
  item.report?.startsWith("Q4 Design Summit")
    ? "Q4 Design Summit — SFO"
    : item.report || "Unassigned";
export const isPersonal = (item: Expense) =>
  /personal|pocket/i.test(item.paymentMethod || "");
export function formatTotal(items: Expense[], average = false) {
  const totals = items.reduce<Record<string, number>>((result, item) => {
    const currency = item.currency || "USD";
    result[currency] = (result[currency] || 0) + item.amount;
    return result;
  }, {});
  return (
    Object.entries(totals)
      .map(([currency, amount]) =>
        money(
          average
            ? amount /
                items.filter((item) => (item.currency || "USD") === currency)
                  .length
            : amount,
          currency,
        ),
      )
      .join(" · ") || "$0.00"
  );
}
