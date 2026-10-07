import { money } from "../../../shared/utils/format";
export const cardMoney = (amount: number) => money(amount, "USD");
