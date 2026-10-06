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
};

export const initialExpenses: Expense[] = [
  {
    id: "EXP-1048",
    date: "2026-10-05",
    merchant: "Uber",
    category: "Travel",
    amount: 850,
    status: "Pending",
    description: "Client meeting commute",
    receipt: "uber-oct-05.pdf",
  },
  {
    id: "EXP-1047",
    date: "2026-10-04",
    merchant: "Swiggy",
    category: "Food",
    amount: 420,
    status: "Approved",
    description: "Meal during site visit",
    receipt: "swiggy-oct-04.pdf",
  },
  {
    id: "EXP-1046",
    date: "2026-10-03",
    merchant: "Amazon",
    category: "Office",
    amount: 1250,
    status: "Reimbursed",
    description: "Office supplies",
    receipt: "amazon-oct-03.pdf",
  },
  {
    id: "EXP-1045",
    date: "2026-10-02",
    merchant: "OYO",
    category: "Accommodation",
    amount: 3500,
    status: "Approved",
    description: "Overnight client visit",
    receipt: "oyo-oct-02.pdf",
  },
  {
    id: "EXP-1044",
    date: "2026-09-27",
    merchant: "IndiGo",
    category: "Travel",
    amount: 6200,
    status: "Reimbursed",
    description: "Flight for client workshop",
    receipt: "indigo-sep-27.pdf",
  },
  {
    id: "EXP-1043",
    date: "2026-09-24",
    merchant: "Adobe",
    category: "Software",
    amount: 1890,
    status: "Rejected",
    description: "Design software subscription",
  },
  {
    id: "EXP-1042",
    date: "2026-09-19",
    merchant: "Blue Tokai",
    category: "Food",
    amount: 340,
    status: "Draft",
    description: "Team coffee",
  },
];
export const categories = [
  "Travel",
  "Food",
  "Accommodation",
  "Office",
  "Software",
  "Other",
];
export const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
export const displayDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
