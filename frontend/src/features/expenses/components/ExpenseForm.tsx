import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/components/data-display/Card/card";
import { Button } from "@ui/components/actions/Button/button";
import { Input } from "@ui/components/forms/Input/input";
import { Textarea } from "@ui/components/forms/Textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/forms/Select/select";
import { FormPageTemplate } from "../../../../../templates/form-page/FormPageTemplate";
import { categories, type ExpenseStatus } from "../data/expenses.mock";
import { useExpenses } from "../data/ExpensesContext";

export function ExpenseForm() {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");
  const save = (status: ExpenseStatus) => {
    if (
      !category ||
      !merchant.trim() ||
      !amount ||
      Number(amount) <= 0 ||
      !date
    ) {
      setError("Complete category, merchant, amount, and expense date.");
      return;
    }
    if (status === "Pending" && !receipt) {
      setError("Attach a receipt before submitting.");
      return;
    }
    addExpense({
      id: `EXP-${Date.now().toString().slice(-6)}`,
      category,
      merchant: merchant.trim(),
      amount: Number(amount),
      date,
      description,
      receipt,
      status,
    });
    navigate("/employee/expenses");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save("Pending");
  };
  return (
    <FormPageTemplate
      header={
        <div className="page-header">
          <div>
            <h1>Add Expense</h1>
            <p>Submit a new expense for approval.</p>
          </div>
        </div>
      }
    >
      <form onSubmit={submit}>
        <Card>
          <CardHeader>
            <CardTitle>Expense details</CardTitle>
            <CardDescription>
              Enter the purchase details and attach your receipt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="category">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="field">
                <label htmlFor="merchant">Merchant</label>
                <Input
                  id="merchant"
                  placeholder="e.g. Uber"
                  value={merchant}
                  onChange={(event) => setMerchant(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="amount">Amount (₹)</label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="date">Expense Date</label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <div className="field full">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="field full">
                <label htmlFor="receipt">Receipt</label>
                <div className="flex items-center gap-3">
                  <Upload size={17} className="text-muted-foreground" />
                  <Input
                    id="receipt"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(event) =>
                      setReceipt(event.target.files?.[0]?.name ?? "")
                    }
                  />
                </div>
                <span className="field-help">PDF, PNG, or JPG receipt.</span>
              </div>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/employee/expenses")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => save("Draft")}
              >
                Save Draft
              </Button>
              <Button type="submit">Submit Expense</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormPageTemplate>
  );
}
