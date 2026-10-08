import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { employeeJson } from "@/lib/employee-api";
import { useExpenses } from "../../expenses/data/ExpensesContext";
import type { Expense } from "../../expenses/types";
import { isPersonal } from "../utils/reportTotals";
import { exportCsv } from "../../../shared/utils/exportCsv";

type Report = {
  name: string;
  items: Expense[];
  workflow_stage: "DRAFT" | "REJECTED" | "COMPLETE" | "FINANCE_REVIEW" | "MANAGER_REVIEW";
  can_withdraw: boolean;
  can_submit: boolean;
};

export function useReports() {
  const { refresh: refreshExpenses } = useExpenses();
  const params = useSearchParams();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState(params.get("search") || "");
  const [category, setCategory] = useState("All");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const result = await employeeJson<{ reports: Report[] }>("/reports");
    setReports(result.reports);
    setSelected((current) => current && result.reports.some((report) => report.name === current)
      ? current
      : result.reports.find((report) => report.items.some((item) => item.id === params.get("expense")))?.name || result.reports[0]?.name || "");
  }
  useEffect(() => { void refresh().catch((cause: unknown) => setNotice(cause instanceof Error ? cause.message : "Could not load reports.")); }, []);

  const groups = reports.map((report) => report.name);
  const currentReport = reports.find((report) => report.name === selected);
  const items = currentReport?.items || [];
  const corporate = items.filter((item) => !isPersonal(item));
  const personal = items.filter(isPersonal);
  const chartCurrency = items[0]?.currency || "INR";
  const chartItems = items.filter((item) => (item.currency || "INR") === chartCurrency);
  const total = chartItems.reduce((sum, item) => sum + item.amount, 0);
  const verified = items.filter((item) => Boolean(item.receipt));
  const completed = currentReport?.workflow_stage === "COMPLETE";
  const recalled = currentReport?.workflow_stage === "DRAFT";
  const workflowStage = currentReport?.workflow_stage || "DRAFT";
  const canWithdraw = Boolean(currentReport?.can_withdraw) && !busy;
  const canSubmit = Boolean(currentReport?.can_submit) && !busy;
  const visible = items.filter((item) =>
    `${item.merchant} ${item.description} ${item.id}`.toLowerCase().includes(query.toLowerCase().trim()) &&
    (category === "All" || item.category === category) &&
    (payment === "All" || isPersonal(item) === (payment === "Out of Pocket")) &&
    (status === "All" || item.status === status));

  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const start = `${now.getFullYear()}-${String(quarter * 3 + 1).padStart(2, "0")}-01`;
  const end = `${now.getFullYear()}-${String(quarter * 3 + 4).padStart(2, "0")}-01`;
  const quarterItems = reports.flatMap((report) => report.items).filter((item) => item.date >= start && item.date < end && (item.currency || "INR") === "INR");
  const quarterTotal = quarterItems.reduce((sum, item) => sum + item.amount, 0);
  const distribution = [
    { name: "Travel & Lodging", description: "Flights, Hotels", categories: ["Travel", "Accommodation"], color: "var(--chart-blue)" },
    { name: "Software & SaaS", description: "Subscriptions, Licenses", categories: ["Software"], color: "var(--chart-emerald)" },
    { name: "Meals & Other", description: "Meals, Team expenses", categories: ["Food", "Other"], color: "var(--chart-amber)" },
    { name: "Equipment & Devices", description: "Devices, Office equipment", categories: ["Office"], color: "var(--chart-violet)" },
  ].map((group) => {
    const records = quarterItems.filter((item) => group.categories.includes(item.category));
    return { ...group, items: records, total: records.reduce((sum, item) => sum + item.amount, 0) };
  });

  async function reportAction(action: "withdraw" | "submit") {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await employeeJson("/reports/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: selected, action }) });
      await Promise.all([refresh(), refreshExpenses()]);
      setNotice(action === "withdraw" ? "Report withdrawn." : "Report submitted for approval.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Could not update the report.");
    } finally { setBusy(false); }
  }

  function exportTransactions() {
    exportCsv("employee-report-transactions.csv", ["Date", "Merchant", "Details", "Category", "Payment", "Status", "Currency", "Amount"],
      visible.map((item) => [item.date, item.merchant, item.description, item.category, item.paymentMethod || "", item.status, item.currency || "INR", item.amount]));
  }
  function addItem() { router.push(`/employee/expenses/new?report=${encodeURIComponent(selected)}`); }
  function clearFilters() { setQuery(""); setCategory("All"); setPayment("All"); setStatus("All"); }
  function selectReport(name: string) { setSelected(name); clearFilters(); }

  return { groups, selected, selectReport, query, setQuery, category, setCategory, payment, setPayment, status, setStatus,
    notice, setNotice, items, corporate, personal, chartItems, total, verified, completed, recalled, workflowStage,
    canWithdraw, canSubmit, visible, quarterItems, quarterTotal, distribution,
    recallReport: () => void reportAction("withdraw"), submitReport: () => void reportAction("submit"), exportTransactions, addItem, clearFilters };
}

export type ReportsModel = ReturnType<typeof useReports>;
