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
};
export const draftKey = "aura-expense-draft-v1";
export const emptyDraft = (): Draft => ({
  id: crypto.randomUUID(),
  merchant: "",
  date: "",
  amount: "",
  currency: "INR",
  category: "",
  report: "Q4 Design Summit — SFO",
  paymentMethod: "Corporate Card (••4921)",
  purpose: "",
  attendees: ["Rabil Khan"],
  receipt: "",
});
