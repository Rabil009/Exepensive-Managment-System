import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useExpenses } from "../data/ExpensesContext";
import { draftKey, emptyDraft, type Draft } from "../data/expenseDraft";
import type { ExpenseStatus } from "../types";
import type { UnlinkedTransaction } from "../data/demoTransactions";
export function useExpenseForm() {
  const params = useSearchParams();
  const { expenses, addExpense, removeDraft } = useExpenses();
  const [draft, setDraft] = useState<Draft>(() => {
    const existing = expenses.find((expense) => expense.id === params.get("draft") && expense.status === "Draft");
    if (existing) return {
      ...emptyDraft(), ...existing, amount: String(existing.amount), currency: "INR",
      report: existing.report || "Unassigned", paymentMethod: existing.paymentMethod || "Corporate Card (••4921)",
      purpose: existing.description, attendees: existing.attendees || ["Rabil Khan"], receipt: existing.receipt || "",
    };
    const report = params.get("report");
    try {
      const saved = localStorage.getItem(draftKey);
      const restored = saved
        ? { ...emptyDraft(), ...JSON.parse(saved), currency: "INR" }
        : emptyDraft();
      return report ? { ...restored, report } : restored;
    } catch {
      return { ...emptyDraft(), ...(report ? { report } : {}) };
    }
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const previewUrl = useRef("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(() => {
    try {
      return Boolean(localStorage.getItem(draftKey));
    } catch {
      return false;
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [addingAttendee, setAddingAttendee] = useState(false);
  const [attendee, setAttendee] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ready = Boolean(
    draft.merchant.trim() &&
    draft.date &&
    draft.category &&
    Number(draft.amount) > 0,
  );

  useEffect(() => {
    return () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    };
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setSubmitted(false);
    setMessage("");
    setError("");
  }
  function attach(next?: File) {
    if (!next) return;
    if (next.size > 25 * 1024 * 1024) {
      setError("Choose a receipt smaller than 25 MB.");
      return;
    }
    if (!/\.(pdf|png|jpe?g|heic)$/i.test(next.name)) {
      setError("Choose a PDF, PNG, JPG, or HEIC receipt.");
      return;
    }
    setFile(next);
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current =
      next.type.startsWith("image/") && next.type !== "image/heic"
        ? URL.createObjectURL(next)
        : "";
    setPreview(previewUrl.current);
    update("receipt", next.name);
    if (inputRef.current) inputRef.current.value = "";
  }
  function save(status: ExpenseStatus) {
    if (status === "Pending" && !ready) {
      setError("Enter a merchant, date, positive amount, and category.");
      return;
    }
    try {
      addExpense({
        id: draft.id,
        date: draft.date || "2026-10-07",
        merchant: draft.merchant.trim() || "Untitled expense",
        category: draft.category || "Other",
        amount: Number(draft.amount) || 0,
        status,
        description: draft.purpose,
        receipt: draft.receipt,
        currency: draft.currency,
        report: draft.report,
        paymentMethod: draft.paymentMethod,
        attendees: draft.attendees,
      });
      if (status === "Draft") {
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setSaved(true);
        setMessage("Draft saved in this browser.");
      } else {
        localStorage.removeItem(draftKey);
        setSubmitted(true);
        setSaved(true);
        setMessage("Expense submitted for approval.");
      }
      setError("");
    } catch {
      setError(
        "We couldn't save this expense. Check your browser storage and try again.",
      );
    }
  }
  function discard() {
    try {
      removeDraft(draft.id);
      localStorage.removeItem(draftKey);
      setDraft(emptyDraft());
      setFile(null);
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = "";
      setPreview("");
      setError("");
      setMessage("");
      setSaved(false);
      setSubmitted(false);
    } catch {
      setError(
        "We couldn't discard this draft. Check your browser storage and try again.",
      );
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    save("Pending");
  }
  function addAttendee() {
    const name = attendee.trim();
    if (!name) return;
    if (!draft.attendees.includes(name))
      update("attendees", [...draft.attendees, name]);
    setAttendee("");
    setAddingAttendee(false);
  }

  function linkTransaction(transaction: UnlinkedTransaction) {
    setDraft((current) => ({
      ...current,
      merchant: transaction.merchant,
      amount: transaction.amount,
      paymentMethod: transaction.payment,
      date: transaction.date,
      category: transaction.category,
    }));
    setSaved(false);
    setSubmitted(false);
    setMessage(
      "Sample card transaction linked. Review the details before submitting.",
    );
  }
  return {
    draft,
    file,
    preview,
    error,
    message,
    saved,
    submitted,
    dragging,
    setDragging,
    addingAttendee,
    setAddingAttendee,
    attendee,
    setAttendee,
    inputRef,
    ready,
    update,
    attach,
    save,
    discard,
    submit,
    addAttendee,
    linkTransaction,
    setMessage,
  };
}
export type ExpenseFormModel = ReturnType<typeof useExpenseForm>;
