import { useState } from "react";
import { useExpenses } from "../../expenses/data/ExpensesContext";
import { exportCsv } from "../../../shared/utils/exportCsv";
import { tabs } from "../data/overview";
export function useOverview() {
  const { expenses } = useExpenses();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [notice, setNotice] = useState("");
  const [hideReceipt, setHideReceipt] = useState(false);
  const visible = expenses.filter(
    (item) =>
      (tab === "all" ||
        item.status.toLowerCase() === (tab === "drafts" ? "draft" : tab)) &&
      `${item.merchant} ${item.description} ${item.report}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const countFor = (value: string) =>
    expenses.filter(
      (item) =>
        value === "all" ||
        item.status.toLowerCase() === (value === "drafts" ? "draft" : value),
    ).length;
  function cycleFilter() {
    setTab(
      tabs[(tabs.findIndex((item) => item.value === tab) + 1) % tabs.length]
        .value,
    );
  }
  function exportExpenses() {
    exportCsv(
      "aura-expenses.csv",
      ["Merchant", "Date", "Report", "Currency", "Amount", "Status"],
      visible.map((item) => [
        item.merchant,
        item.date,
        item.report || "Unassigned",
        item.currency || "INR",
        item.amount,
        item.status,
      ]),
    );
  }
  return {
    expenses,
    visible,
    query,
    setQuery,
    tab,
    setTab,
    notice,
    setNotice,
    hideReceipt,
    setHideReceipt,
    countFor,
    cycleFilter,
    exportExpenses,
  };
}
export type OverviewModel = ReturnType<typeof useOverview>;
