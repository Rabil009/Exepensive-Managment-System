export type ExpenseStatus =
  "Draft" | "Pending" | "Approved" | "Rejected" | "Reimbursed";
export type Expense = {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  status: ExpenseStatus;
  description: string;
  receipt?: string;
  currency?: string;
  report?: string;
  paymentMethod?: string;
  attendees?: string[];
  raw_status?: string;
  source?: "claim" | "draft";
};
