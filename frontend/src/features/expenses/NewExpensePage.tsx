import { ExpenseForm } from "./components/ExpenseForm";
import { AuraShell } from "../../shared/layout/AuraShell";
export default function NewExpensePage() {
  return (
    <AuraShell active="New Expense">
      <ExpenseForm />
    </AuraShell>
  );
}
