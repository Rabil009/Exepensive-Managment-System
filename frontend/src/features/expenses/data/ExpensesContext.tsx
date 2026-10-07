import { createContext, useContext, useState, type ReactNode } from "react";
import { initialExpenses } from "./demoExpenses";
import { type Expense } from "../types";

type ExpenseStore = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeDraft: (id: string) => void;
};
const Context = createContext<ExpenseStore | null>(null);
const key = "employee-expenses-v1";
export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved
        ? [
            ...(JSON.parse(saved) as Expense[]).map((expense) => ({
              ...expense,
              currency: "INR",
            })),
            ...initialExpenses.filter((base) => !(JSON.parse(saved) as Expense[]).some((expense) => expense.id === base.id)),
          ]
        : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });
  const addExpense = (expense: Expense) => {
    const userExpenses = [
      { ...expense, currency: "INR" },
      ...expenses.filter(
        (item) =>
          item.id !== expense.id &&
          !initialExpenses.includes(item),
      ),
    ];
    localStorage.setItem(key, JSON.stringify(userExpenses));
    setExpenses([...userExpenses, ...initialExpenses.filter((base) => !userExpenses.some((expense) => expense.id === base.id))]);
  };
  const removeDraft = (id: string) => {
    const userExpenses = expenses.filter(
      (item) =>
        !(item.id === id && item.status === "Draft") &&
        !initialExpenses.includes(item),
    );
    localStorage.setItem(key, JSON.stringify(userExpenses));
    setExpenses([...userExpenses, ...initialExpenses.filter((base) => !userExpenses.some((expense) => expense.id === base.id))]);
  };
  return (
    <Context.Provider value={{ expenses, addExpense, removeDraft }}>
      {children}
    </Context.Provider>
  );
}
export function useExpenses() {
  const value = useContext(Context);
  if (!value) throw Error("ExpensesProvider missing");
  return value;
}
