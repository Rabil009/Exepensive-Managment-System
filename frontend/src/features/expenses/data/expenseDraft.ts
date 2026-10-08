export type Draft = {
  id: string;
  merchant: string;
  date: string;
  amount: string;
  currency: string;
  category: string;
  report: string;
  paymentMethod: string;
  purpose: string;
  attendees: string[];
  receipt: string;
  linkedTransactionId: string | null;
};
export const draftKey = "aura-expense-draft-v1";
export const remoteDraftKey = "aura-supabase-expense-draft-id-v1";
export const emptyDraft = (): Draft => ({
  id: crypto.randomUUID(),
  merchant: "",
  date: "",
  amount: "",
  currency: "INR",
  category: "",
  report: "Unassigned",
  paymentMethod: "Personal (Out-of-Pocket)",
  purpose: "",
  attendees: [],
  receipt: "",
  linkedTransactionId: null,
});
