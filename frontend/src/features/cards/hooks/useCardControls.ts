import { useCallback, useEffect, useState, type FormEvent } from "react";
import { employeeJson } from "@/lib/employee-api";
import { exportCsv } from "../../../shared/utils/exportCsv";

export type EmployeeCard = {
  id: string; display_name: string; kind: "PHYSICAL" | "VIRTUAL"; network: string | null;
  last4: string | null; monthly_limit: string; active: boolean; frozen: boolean;
  wallet_enabled: boolean; travel_limits_enabled: boolean; online_verification_enabled: boolean; atm_lock_enabled: boolean;
};
type CardTransaction = {
  id: string; card_id: string; transaction_date: string; merchant: string; purpose: string | null;
  amount: string; currency: string; status: "PENDING" | "SETTLED" | "DECLINED";
};
type CardRequest = { id: string; request_type: "LIMIT_INCREASE" | "VIRTUAL_CARD"; card_name: string | null; requested_limit: string; status: string };
export type CategoryUsage = { category: string; name: string; spent: string; limit: string; remaining: string };
type CardsResponse = {
  cards: EmployeeCard[]; transactions: CardTransaction[]; requests: CardRequest[];
  usage: { month: string; cards: { id: string; spent: string; limit: string; remaining: string }[]; categories: CategoryUsage[] };
};

export function useCardControls() {
  const [data, setData] = useState<CardsResponse | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [dialogType, setDialogType] = useState<"limit" | "virtual" | null>(null);
  const [requestedAmount, setRequestedAmount] = useState("");
  const [virtualName, setVirtualName] = useState("");
  const [dialogError, setDialogError] = useState("");

  const refresh = useCallback(async () => {
    setData(await employeeJson<CardsResponse>("/cards"));
  }, []);
  useEffect(() => {
    let active = true;
    employeeJson<CardsResponse>("/cards").then((result) => { if (active) setData(result); })
      .catch((cause: unknown) => { if (active) setMessage(cause instanceof Error ? cause.message : "Could not load cards."); });
    return () => { active = false; };
  }, []);

  const card = data?.cards[0] || null;
  const usage = data?.usage.cards.find((item) => item.id === card?.id);
  const spent = Number(usage?.spent || 0);
  const limit = Number(usage?.limit || 0);
  const percent = limit > 0 ? spent / limit * 100 : 0;
  const state = { active: card?.active ?? false, frozen: card?.frozen ?? false,
    controls: [card?.wallet_enabled ?? false, card?.travel_limits_enabled ?? false, card?.online_verification_enabled ?? false, card?.atm_lock_enabled ?? false] };
  const transactions = (data?.transactions || []).map((item) => ({
    id: item.id, date: item.transaction_date, merchant: item.merchant, purpose: item.purpose || "",
    amount: Number(item.amount), currency: item.currency,
    cardLabel: data?.cards.find((assigned) => assigned.id === item.card_id)?.last4,
    status: item.status === "SETTLED" ? "Success" as const : item.status === "DECLINED" ? "Failed" as const : "Pending" as const,
  }));
  const visible = transactions.filter((item) =>
    (status === "All" || item.status === status) &&
    `${item.merchant} ${item.purpose}`.toLowerCase().includes(query.trim().toLowerCase()));

  async function update(next: typeof state) {
    if (!card) return false;
    try {
      const changed = await employeeJson<EmployeeCard>(`/cards/${card.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next.active, frozen: next.frozen, wallet_enabled: next.controls[0],
          travel_limits_enabled: next.controls[1], online_verification_enabled: next.controls[2], atm_lock_enabled: next.controls[3] }) });
      setData((current) => current ? { ...current, cards: current.cards.map((item) => item.id === changed.id ? changed : item) } : current);
      setMessage("Card controls saved.");
      return true;
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not save card controls."); return false; }
  }
  function openDialog(type: "limit" | "virtual") {
    setDialogError(""); setVirtualName(""); setRequestedAmount(type === "limit" ? String(limit + 1) : "500"); setDialogType(type);
  }
  async function saveDialog(event: FormEvent) {
    event.preventDefault();
    const amount = Number(requestedAmount);
    if (!Number.isFinite(amount) || amount <= 0 || (dialogType === "limit" && amount <= limit)) {
      setDialogError(dialogType === "limit" ? `Enter a requested limit above ₹${limit.toLocaleString("en-IN")}.` : "Enter a positive spending limit."); return;
    }
    if (dialogType === "limit" && !card) { setDialogError("No card is assigned."); return; }
    if (dialogType === "virtual" && !virtualName.trim()) { setDialogError("Enter a card purpose or name."); return; }
    try {
      await employeeJson("/cards/requests", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dialogType === "limit"
          ? { request_type: "LIMIT_INCREASE", requested_limit: amount, card_id: card?.id }
          : { request_type: "VIRTUAL_CARD", requested_limit: amount, card_name: virtualName.trim() }) });
      await refresh(); setDialogType(null); setMessage("Request submitted. The card and limit will change after approval.");
    } catch (cause) { setDialogError(cause instanceof Error ? cause.message : "Could not submit request."); }
  }
  function exportTransactions() {
    exportCsv("employee-card-transactions.csv", ["Date", "Merchant", "Purpose", "Card", "Status", "Currency", "Amount"],
      visible.map((item) => [item.date, item.merchant, item.purpose, item.cardLabel || "", item.status, item.currency, item.amount]));
  }
  return { card, cards: data?.cards || [], requests: data?.requests || [], categories: data?.usage.categories || [], month: data?.usage.month || "",
    state, query, setQuery, status, setStatus, message, setMessage, dialogType, setDialogType,
    requestedAmount, setRequestedAmount, virtualName, setVirtualName, dialogError,
    spent, limit, percent, visible, transactionCount: transactions.length, update, openDialog, saveDialog, exportTransactions };
}
export type CardControlsModel = ReturnType<typeof useCardControls>;
