import { money } from "../../../shared/utils/format";
import { type Expense } from "../../expenses/types";
export const isPersonal = (item: Expense) =>
  /personal|pocket/i.test(item.paymentMethod || "");
export const isPersonalCard = (item: Expense) =>
  /personal/i.test(item.paymentMethod || "") &&
  !/pocket/i.test(item.paymentMethod || "");
export function formatTotal(items: Expense[], average = false) {
  const totals = items.reduce<Record<string, number>>((result, item) => {
    const currency = item.currency || "INR";
    result[currency] = (result[currency] || 0) + item.amount;
    return result;
  }, {});
  return (
    Object.entries(totals)
      .map(([currency, amount]) =>
        money(
          average
            ? amount /
                items.filter((item) => (item.currency || "INR") === currency)
                  .length
            : amount,
          currency,
        ),
      )
      .join(" · ") || "₹0.00"
  );
}
