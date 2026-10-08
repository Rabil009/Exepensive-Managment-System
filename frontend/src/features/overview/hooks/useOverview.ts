import { useState } from "react";
import { useExpenses } from "../../expenses/data/ExpensesContext";
export function useOverview() {
  const { expenses, summary, loading, error, refresh } = useExpenses();
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
  return {
    expenses,
    summary,
    loading,
    error,
    refresh,
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
  };
}
export type OverviewModel = ReturnType<typeof useOverview>;
