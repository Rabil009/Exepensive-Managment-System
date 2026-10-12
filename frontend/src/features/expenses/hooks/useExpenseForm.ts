import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useExpenses } from "../data/ExpensesContext";
import { draftKey, remoteDraftKey, emptyDraft, type Draft } from "../data/expenseDraft";
import type { ExpenseStatus } from "../types";
import { discardNewExpense, loadExpenseOptions, loadNewExpense, saveNewExpense, type ExpenseOptions } from "../data/newExpenseApi";
import { scanReceiptFile } from "../utils/receiptScanner";
export function useExpenseForm() {
  const router = useRouter();
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
  const [scanning, setScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState("");
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

    // Automatic Receipt OCR & Form Auto-fill (Supports both PDFs and Images!)
    const isPdf = next.name.toLowerCase().endsWith(".pdf") || next.type === "application/pdf";
    const isImage = next.type.startsWith("image/") || /\.(png|jpe?g|webp|heic)$/i.test(next.name);

    if (isImage || isPdf) {
      setScanning(true);
      setScanNotice(isPdf ? "Reading PDF receipt & extracting details..." : "Scanning receipt text & extracting details...");
      scanReceiptFile(next)
        .then((extracted) => {
          setDraft((prev) => {
            const updated = { ...prev };
            if (extracted.merchant) updated.merchant = extracted.merchant;
            if (extracted.amount) updated.amount = extracted.amount;
            if (extracted.date) updated.date = extracted.date;
            else if (!updated.date) updated.date = new Date().toISOString().slice(0, 10);
            if (extracted.category) {
              const upper = extracted.category.toUpperCase();
              const matched = options.categories.find(
                (c) => c.toUpperCase() === upper || upper.includes(c.toUpperCase())
              );
              updated.category = matched || options.categories[0] || extracted.category;
            }
            if (extracted.paymentMethod) updated.paymentMethod = extracted.paymentMethod;
            if (extracted.purpose && (!prev.purpose || prev.purpose.trim() === "")) {
              updated.purpose = extracted.purpose;
            }
            return updated;
          });

          const parts = [
            extracted.merchant ? `Merchant: ${extracted.merchant}` : "",
            extracted.amount ? `₹${extracted.amount}` : "",
            extracted.date ? `Date: ${extracted.date}` : "",
            extracted.category ? `Category: ${extracted.category}` : "",
          ]
            .filter(Boolean)
            .join(" • ");

          setScanNotice(
            parts
              ? `✨ Receipt auto-scanned: ${parts}`
              : "✨ Receipt scanned successfully."
          );
        })
        .catch((err) => {
          console.warn("Receipt scan note:", err);
          setScanNotice("");
        })
        .finally(() => {
          setScanning(false);
        });
    }
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
      if (status === "Draft") {
        setFile(null);
        await refresh();
        void loadExpenseOptions().then(setOptions).catch(() => {});
        try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Optional cache. */ }
        try { localStorage.setItem(remoteDraftKey, draft.id); } catch { /* Optional cache. */ }
      } else {
        try { localStorage.removeItem(draftKey); } catch { /* Optional cache. */ }
        try { localStorage.removeItem(remoteDraftKey); } catch { /* Optional cache. */ }
        setDraft(emptyDraft());
        setFile(null);
        if (typeof window !== "undefined") {
          window.location.href = "/employee/dashboard";
        } else {
          router.push("/employee/dashboard");
        }
        return;
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
      if (typeof window !== "undefined") {
        window.location.href = "/employee/dashboard";
      } else {
        router.push("/employee/dashboard");
      }
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
    scanning,
    scanNotice,
    setScanNotice,
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
