import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useExpenses } from "../../expenses/data/ExpensesContext";
import { reportName, isPersonal } from "../utils/reportTotals";
import { exportCsv } from "../../../shared/utils/exportCsv";
export function useReports() {
  const { expenses } = useExpenses();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const groups = [...new Set(expenses.map(reportName))];
  const [selected, setSelected] = useState(() =>
    reportName(
      expenses.find((item) => item.id === params.get("expense")) ||
        expenses.find((item) => item.report?.startsWith("Q4 Design Summit")) ||
        expenses[0],
    ),
  );
  const [query, setQuery] = useState(params.get("search") || "");
  const [category, setCategory] = useState("All");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");
  const [recalls, setRecalls] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("aura-recalled-reports") || "[]");
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState("");
  const items = expenses.filter((item) => reportName(item) === selected);
  const corporate = items.filter((item) => !isPersonal(item));
  const personal = items.filter(isPersonal);
  const chartCurrency = items[0]?.currency || "USD";
  const chartItems = items.filter(
    (item) => (item.currency || "USD") === chartCurrency,
  );
  const total = chartItems.reduce((sum, item) => sum + item.amount, 0);
  const verified = items.filter((item) =>
    /Verified|Matched/.test(item.receipt || ""),
  );
  const completed =
    items.length > 0 && items.every((item) => item.status === "Reimbursed");
  const recalled = recalls.includes(selected);
  const visible = items.filter(
    (item) =>
      `${item.merchant} ${item.description} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()) &&
      (category === "All" || item.category === category) &&
      (payment === "All" ||
        isPersonal(item) === (payment === "Out of Pocket")) &&
      (status === "All" || item.status === status),
  );
  const quarterItems = expenses.filter(
    (item) =>
      item.date >= "2025-10-01" &&
      item.date <= "2025-12-31" &&
      (item.currency || "USD") === "USD",
  );
  const quarterTotal = quarterItems.reduce((sum, item) => sum + item.amount, 0);
  const distribution = [
    {
      name: "Travel & Lodging",
      description: "Flights, Hotels",
      categories: ["Travel", "Accommodation"],
      color: "#0059b5",
    },
    {
      name: "Software & SaaS",
      description: "Subscriptions, Licenses",
      categories: ["Software"],
      color: "#abc7ff",
    },
    {
      name: "Meals & Other",
      description: "Meals, Team expenses",
      categories: ["Food", "Other"],
      color: "#006a26",
    },
    {
      name: "Hardware & Gear",
      description: "Monitors, Ergonomics",
      categories: ["Office"],
      color: "#c8c6c8",
    },
  ].map((group) => {
    const records = quarterItems.filter((item) =>
      group.categories.includes(item.category),
    );
    return {
      ...group,
      items: records,
      total: records.reduce((sum, item) => sum + item.amount, 0),
    };
  });
  function recallReport() {
    const next = [...recalls, selected];
    setRecalls(next);
    localStorage.setItem("aura-recalled-reports", JSON.stringify(next));
    setNotice(
      "Submission recalled in this demo. Expense records are preserved.",
    );
  }
  function exportTransactions() {
    exportCsv(
      "aura-report-transactions.csv",
      [
        "Date",
        "Merchant",
        "Details",
        "Category",
        "Payment",
        "Status",
        "Currency",
        "Amount",
      ],
      visible.map((item) => [
        item.date,
        item.merchant,
        item.description,
        item.category,
        item.paymentMethod || "",
        item.status,
        item.currency || "USD",
        item.amount,
      ]),
    );
  }
  function addItem() {
    navigate(`/employee/expenses/new?report=${encodeURIComponent(selected)}`);
  }
  function selectReport(name: string) {
    setSelected(name);
    clearFilters();
  }
  function clearFilters() {
    setQuery("");
    setCategory("All");
    setPayment("All");
    setStatus("All");
  }
  return {
    groups,
    selected,
    selectReport,
    query,
    setQuery,
    category,
    setCategory,
    payment,
    setPayment,
    status,
    setStatus,
    notice,
    setNotice,
    items,
    corporate,
    personal,
    chartItems,
    total,
    verified,
    completed,
    recalled,
    visible,
    quarterItems,
    quarterTotal,
    distribution,
    recallReport,
    exportTransactions,
    addItem,
    clearFilters,
  };
}
export type ReportsModel = ReturnType<typeof useReports>;
