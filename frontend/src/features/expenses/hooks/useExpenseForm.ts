import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useExpenses } from "../data/ExpensesContext";
import { draftKey, remoteDraftKey, emptyDraft, type Draft } from "../data/expenseDraft";
import type { ExpenseStatus } from "../types";
import { discardNewExpense, loadExpenseOptions, loadNewExpense, saveNewExpense, type ExpenseOptions } from "../data/newExpenseApi";
export function useExpenseForm() {
  const params = useSearchParams();
  const draftParam = params.get("draft");
  const { expenses, refresh } = useExpenses();
  const [draft, setDraft] = useState<Draft>(() => {
    const existing = expenses.find((expense) => expense.id === params.get("draft") && expense.status === "Draft");
    if (existing) return {
      ...emptyDraft(), ...existing, amount: String(existing.amount), currency: "INR",
      report: existing.report || "Unassigned", paymentMethod: existing.paymentMethod || "Personal (Out-of-Pocket)",
      purpose: existing.description, attendees: existing.attendees || [], receipt: existing.receipt || "",
    };
    const report = params.get("report");
    try {
      const saved = localStorage.getItem(draftKey);
      const restored = saved
        ? { ...emptyDraft(), ...JSON.parse(saved), currency: "INR" }
        : emptyDraft();
      if (localStorage.getItem(remoteDraftKey) !== restored.id) restored.receipt = "";
      return report ? { ...restored, report } : restored;
    } catch {
      return { ...emptyDraft(), ...(report ? { report } : {}) };
    }
  });
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ExpenseOptions>({ categories: [], reports: [], unlinked_transactions: [] });
  const [preview, setPreview] = useState("");
  const previewUrl = useRef("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const remoteDraft = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
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
    let active = true;
    loadExpenseOptions().then((result) => { if (active) setOptions(result); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load expense options."); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    };
  }, []);

  useEffect(() => {
    let cachedId: string | null = null;
    try {
      cachedId = localStorage.getItem(remoteDraftKey);
    } catch { /* Invalid browser cache is ignored. */ }
    const id = draftParam || cachedId;
    if (!id) return;
    let active = true;
    loadNewExpense(id).then((stored) => {
      if (!active) return;
      setDraft({
        ...emptyDraft(), id: stored.id, merchant: stored.merchant || "",
        date: stored.expense_date || "", amount: String(stored.amount || ""),
        category: stored.category || "", report: stored.report_name || "Unassigned",
        paymentMethod: stored.payment_method || "Personal (Out-of-Pocket)",
        purpose: stored.business_purpose || "", attendees: stored.attendees || [],
        receipt: stored.receipt_name || "",
        linkedTransactionId: stored.linked_transaction_id,
      });
      setSaved(true);
      remoteDraft.current = true;
      setFile(null);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Could not load this draft.");
    });
    return () => { active = false; };
  }, [draftParam]);

  useEffect(() => {
    if (submitted || saved) return;
    if (!draft.merchant && !draft.date && !draft.amount && !draft.category && !draft.purpose && !draft.receipt) return;
    try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Keep editing in memory. */ }
  }, [draft, submitted, saved]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value,
      ...(key === "paymentMethod" && value !== "Corporate Card" ? { linkedTransactionId: null } : {}) }));
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
  async function save(status: ExpenseStatus) {
    if (saving) return;
    if (status === "Pending" && !ready) {
      setError("Enter a merchant, date, positive amount, and category.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveNewExpense(draft, file, status === "Pending");
      remoteDraft.current = status === "Draft";
      setSaved(true);
      setSubmitted(status === "Pending");
      setMessage(status === "Draft" ? "Draft saved to Supabase." : "Expense submitted to Supabase for approval.");
      setFile(null);
      await refresh();
      void loadExpenseOptions().then(setOptions).catch(() => {});
      if (status === "Draft") {
        try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Optional cache. */ }
        try { localStorage.setItem(remoteDraftKey, draft.id); } catch { /* Optional cache. */ }
      } else {
        try { localStorage.removeItem(draftKey); } catch { /* Optional cache. */ }
        try { localStorage.removeItem(remoteDraftKey); } catch { /* Optional cache. */ }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the expense.");
    } finally {
      setSaving(false);
    }
  }
  async function discard() {
    if (saving) return;
    try {
      setSaving(true);
      if (remoteDraft.current && !submitted) await discardNewExpense(draft.id);
      remoteDraft.current = false;
      await refresh();
      void loadExpenseOptions().then(setOptions).catch(() => {});
      localStorage.removeItem(draftKey);
      localStorage.removeItem(remoteDraftKey);
      setDraft(emptyDraft());
      setFile(null);
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = "";
      setPreview("");
      setError("");
      setMessage("");
      setSaved(false);
      setSubmitted(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not discard this draft.");
    } finally {
      setSaving(false);
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

  function linkTransaction(transaction: ExpenseOptions["unlinked_transactions"][number]) {
    setDraft((current) => ({
      ...current,
      merchant: transaction.merchant,
      amount: transaction.amount,
      paymentMethod: "Corporate Card",
      date: transaction.transaction_date,
      linkedTransactionId: transaction.id,
    }));
    setSaved(false);
    setSubmitted(false);
    setMessage(
      "Card transaction selected. Choose a category and review the details before submitting.",
    );
  }
  return {
    draft,
    options,
    file,
    preview,
    error,
    message,
    saved,
    submitted,
    saving,
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
  };
}
export type ExpenseFormModel = ReturnType<typeof useExpenseForm>;
