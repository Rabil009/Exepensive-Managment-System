import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  defaultState,
  demoCardAccount,
  storageKey,
  transactions,
  type CardState,
} from "../data/demoCards";
import { exportCsv } from "../../../shared/utils/exportCsv";
export function useCardControls() {
  const [state, setState] = useState<CardState>(() => {
    try {
      const value = localStorage.getItem(storageKey);
      return value ? { ...defaultState, ...JSON.parse(value) } : defaultState;
    } catch {
      return defaultState;
    }
  });
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [dialogType, setDialogType] = useState<"limit" | "virtual" | null>(
    null,
  );
  const [requestedAmount, setRequestedAmount] = useState("10000");
  const [virtualName, setVirtualName] = useState("");
  const [dialogError, setDialogError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const spent = demoCardAccount.sampleSpend;
  const limit = demoCardAccount.monthlyLimit;
  const percent = (spent / limit) * 100;
  const visible = transactions.filter(
    (item) =>
      (payment === "All" || item.payment === payment) &&
      (status === "All" || item.status === status) &&
      `${item.merchant} ${item.purpose}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (dialogType) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [dialogType]);

  function update(next: CardState) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setState(next);
      return true;
    } catch {
      setMessage("We couldn't save these demo settings in this browser.");
      return false;
    }
  }
  function openDialog(type: "limit" | "virtual") {
    setDialogError("");
    setVirtualName("");
    setRequestedAmount(type === "limit" ? "10000" : "500");
    setDialogType(type);
  }
  function saveDialog(event: FormEvent) {
    event.preventDefault();
    const amount = Number(requestedAmount);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      (dialogType === "limit" && amount <= limit)
    ) {
      setDialogError(
        dialogType === "limit"
          ? "Enter a requested limit above $7,500."
          : "Enter a positive spending limit.",
      );
      return;
    }
    if (dialogType === "virtual") {
      if (!virtualName.trim()) {
        setDialogError("Enter a name for this demo card.");
        return;
      }
      const card = {
        name: virtualName.trim(),
        limit: amount,
        last4: String(1000 + Math.floor(Math.random() * 9000)),
      };
      if (!update({ ...state, virtualCards: [...state.virtualCards, card] }))
        return;
      setMessage("Demo virtual card created in this browser.");
    } else {
      if (!update({ ...state, requestedLimit: amount })) return;
      setMessage("Demo limit request saved. The active limit remains $7,500.");
    }
    setDialogType(null);
  }
  function exportTransactions() {
    exportCsv(
      "aura-card-transactions.csv",
      ["Date", "Merchant", "Purpose", "Payment", "Status", "Amount (USD)"],
      visible.map((item) => [
        item.date,
        item.merchant,
        item.purpose,
        item.payment,
        item.status,
        item.amount.toFixed(2),
      ]),
    );
  }
  return {
    state,
    setRevealed,
    revealed,
    query,
    setQuery,
    payment,
    setPayment,
    status,
    setStatus,
    message,
    setMessage,
    dialogType,
    setDialogType,
    requestedAmount,
    setRequestedAmount,
    virtualName,
    setVirtualName,
    dialogError,
    dialogRef,
    spent,
    limit,
    percent,
    visible,
    update,
    openDialog,
    saveDialog,
    exportTransactions,
  };
}
export type CardControlsModel = ReturnType<typeof useCardControls>;
