import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useExpenses } from "../data/ExpensesContext";
import {
  draftKey,
  remoteDraftKey,
  emptyDraft,
  type Draft,
} from "../data/expenseDraft";
import type { Expense, ExpenseStatus } from "../types";
import {
  discardNewExpense,
  loadExpenseOptions,
  loadNewExpense,
  saveNewExpense,
  type ExpenseOptions,
} from "../data/newExpenseApi";

function paymentMethodLabel(value?: string | null) {
  const normalized = (value || "").toUpperCase();
  if (normalized.includes("CORPORATE") || normalized.startsWith("CORP"))
    return "Corporate Card";
  if (normalized.startsWith("PERSONAL") || !value)
    return "Personal (Out-of-Pocket)";
  return value;
}

export function useExpenseForm() {
  const router = useRouter();
  const params = useSearchParams();
  const draftParam = params.get("draft");
  const { expenses, refresh, upsertDraft, removeDraft } = useExpenses();
  const expensesRef = useRef(expenses);
  useEffect(() => {
    expensesRef.current = expenses;
  }, [expenses]);
  const [draft, setDraft] = useState<Draft>(() => {
    const existing = expenses.find(
      (expense) =>
        expense.id === params.get("draft") && expense.status === "Draft",
    );
    if (existing)
      return {
        ...emptyDraft(),
        ...existing,
        amount: String(existing.amount),
        currency: "INR",
        report: existing.report || "Unassigned",
        paymentMethod: paymentMethodLabel(existing.paymentMethod),
        purpose: existing.description,
        attendees: existing.attendees || [],
        receipt: existing.receipt || "",
      };
    const report = params.get("report");
    try {
      const saved = localStorage.getItem(draftKey);
      const restored = saved
        ? { ...emptyDraft(), ...JSON.parse(saved), currency: "INR" }
        : emptyDraft();
      if (localStorage.getItem(remoteDraftKey) !== restored.id)
        restored.receipt = "";
      return report ? { ...restored, report } : restored;
    } catch {
      return { ...emptyDraft(), ...(report ? { report } : {}) };
    }
  });
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ExpenseOptions>({
    categories: [],
    reports: [],
  });
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
    loadExpenseOptions()
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load expense options.",
          );
      });
    return () => {
      active = false;
    };
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
    } catch {
      /* Invalid browser cache is ignored. */
    }
    const id = draftParam || cachedId;
    if (!id) return;
    if (draftParam) window.scrollTo({ top: 0, behavior: "smooth" });

    const listedDraft = expensesRef.current.find(
      (expense) => expense.id === id && expense.status === "Draft",
    );
    if (listedDraft) {
      setDraft({
        ...emptyDraft(),
        id: listedDraft.id,
        merchant: listedDraft.merchant || "",
        date: listedDraft.date || "",
        amount: String(listedDraft.amount ?? ""),
        category: listedDraft.category || "",
        report: listedDraft.report || "Unassigned",
        paymentMethod: paymentMethodLabel(listedDraft.paymentMethod),
        purpose: listedDraft.description || "",
        attendees: listedDraft.attendees || [],
        receipt: listedDraft.receipt || "",
      });
      setSaved(true);
      setSubmitted(false);
      remoteDraft.current = true;
      setFile(null);
      setPreview("");
      setError("");
      setMessage("Draft loaded. Make changes and submit when ready.");
    }

    let active = true;
    loadNewExpense(id)
      .then((stored) => {
        if (!active) return;
        setDraft({
          ...emptyDraft(),
          id: stored.id,
          merchant: stored.merchant || "",
          date: stored.expense_date || "",
          amount: String(stored.amount ?? ""),
          category: stored.category || "",
          report: stored.report_name || "Unassigned",
          paymentMethod: paymentMethodLabel(stored.payment_method),
          purpose: stored.business_purpose || "",
          attendees: stored.attendees || [],
          receipt: stored.receipt_name || "",
          linkedTransactionId: stored.linked_transaction_id,
        });
        setSaved(true);
        remoteDraft.current = true;
        setFile(null);
        setPreview("");
        setError("");
        setMessage("Draft loaded. Make changes and submit when ready.");
      })
      .catch((cause: unknown) => {
        if (active && !listedDraft) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load this draft.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [draftParam]);

  useEffect(() => {
    if (submitted || saved) return;
    if (
      !draft.merchant &&
      !draft.date &&
      !draft.amount &&
      !draft.category &&
      !draft.purpose &&
      !draft.receipt
    )
      return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      /* Keep editing in memory. */
    }
  }, [draft, submitted, saved]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === "paymentMethod" && value !== "Corporate Card"
        ? { linkedTransactionId: null }
        : {}),
    }));
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
      if (status === "Draft") {
        remoteDraft.current = true;
        upsertDraft({
          id: draft.id,
          date: draft.date,
          merchant: draft.merchant.trim() || "Untitled draft",
          category: draft.category || "Other",
          amount: Number(draft.amount) || 0,
          status: "Draft",
          description: draft.purpose,
          receipt: draft.receipt || undefined,
          currency: draft.currency,
          report: draft.report,
          paymentMethod: draft.paymentMethod,
          attendees: draft.attendees,
          raw_status: "DRAFT",
          source: "draft",
        } satisfies Expense);
        setSaved(true);
        setSubmitted(false);
        setMessage("Draft saved to Supabase.");
        setFile(null);
        try {
          localStorage.setItem(draftKey, JSON.stringify(draft));
        } catch {
          /* Optional cache. */
        }
        try {
          localStorage.setItem(remoteDraftKey, draft.id);
        } catch {
          /* Optional cache. */
        }
      } else {
        remoteDraft.current = false;
        removeDraft(draft.id);
        setDraft(emptyDraft());
        setFile(null);
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
        previewUrl.current = "";
        setPreview("");
        setSaved(false);
        setSubmitted(false);
        setMessage(
          "Expense submitted successfully. You can enter another expense.",
        );
        try {
          localStorage.removeItem(draftKey);
        } catch {
          /* Optional cache. */
        }
        try {
          localStorage.removeItem(remoteDraftKey);
        } catch {
          /* Optional cache. */
        }
        router.replace("/employee/expenses/new");
      }
      await refresh();
      void loadExpenseOptions()
        .then(setOptions)
        .catch(() => {});
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save the expense.",
      );
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
      removeDraft(draft.id);
      await refresh();
      void loadExpenseOptions()
        .then(setOptions)
        .catch(() => {});
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
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not discard this draft.",
      );
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
    editingDraft: Boolean(draftParam),
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
  };
}
export type ExpenseFormModel = ReturnType<typeof useExpenseForm>;
