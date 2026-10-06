import { createContext, useContext, useState, type ReactNode } from "react";
import { initialExpenses, type Expense } from "./expenses.mock";

type ExpenseStore = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
};
const Context = createContext<ExpenseStore | null>(null);
const key = "employee-expenses-v1";
export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved
        ? [...(JSON.parse(saved) as Expense[]), ...initialExpenses]
        : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });
  const addExpense = (expense: Expense) => {
    const userExpenses = [
      expense,
      ...expenses.filter(
        (item) => !initialExpenses.some((base) => base.id === item.id),
      ),
    ];
    localStorage.setItem(key, JSON.stringify(userExpenses));
    setExpenses([...userExpenses, ...initialExpenses]);
  };
  return (
    <Context.Provider value={{ expenses, addExpense }}>
      {children}
    </Context.Provider>
  );
}
export function useExpenses() {
  const value = useContext(Context);
  if (!value) throw Error("ExpensesProvider missing");
  return value;
}
