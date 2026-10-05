"use client";

import { useEffect, useRef, useState } from "react";

type View = "Overview" | "Expenses" | "Reports" | "Reimbursements";
type Expense = { id: number; merchant: string; category: string; date: string; amount: number; status: "Draft" | "In review" | "Approved"; receipt: boolean };

const initialExpenses: Expense[] = [
  { id: 1, merchant: "Northline Rail", category: "Travel", date: "Jun 12", amount: 148.2, status: "In review", receipt: true },
  { id: 2, merchant: "The Willow Table", category: "Meals", date: "Jun 11", amount: 92, status: "Draft", receipt: true },
  { id: 3, merchant: "City Transfer", category: "Travel", date: "Jun 10", amount: 106.6, status: "Approved", receipt: true },
];

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function WorkspaceDemo() {
  const [view, setView] = useState<View>("Overview");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [formOpen, setFormOpen] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Travel");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!formOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFormOpen(false);
      if (event.key !== "Tab") return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [formOpen]);

  useEffect(() => () => { if (scanTimer.current) clearTimeout(scanTimer.current); }, []);

  const numericAmount = Number(amount);
  const policyWarning = category === "Meals" && numericAmount > 75;
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const openForm = () => { setError(""); setFormOpen(true); };
  const closeForm = () => { if (scanTimer.current) clearTimeout(scanTimer.current); setScanning(false); setFormOpen(false); };

  function fillSampleReceipt() {
    setScanning(true);
    setError("");
    scanTimer.current = setTimeout(() => {
      setMerchant("Riverdale Station");
      setAmount("15.66");
      setCategory("Travel");
      setDate("2026-06-14");
      setReceiptName("sample-travel-receipt.jpg");
      setScanning(false);
    }, 650);
  }

  function saveExpense() {
    if (!merchant.trim() || !date || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a merchant, date, and amount greater than zero.");
      return;
    }
    const expense: Expense = { id: Date.now(), merchant: merchant.trim(), category, date, amount: numericAmount, status: "Draft", receipt: Boolean(receiptName) };
    setExpenses((current) => [expense, ...current]);
    setMerchant(""); setAmount(""); setCategory("Travel"); setDate(""); setNote(""); setReceiptName(""); setError("");
    setView("Expenses");
    closeForm();
  }

  return (
    <div className="demo-frame" aria-label="Interactive employee workspace preview">
      <div className="demo-topbar"><div className="demo-identity"><span className="demo-logo">E</span><strong>Expense workspace</strong><span className="demo-tag">Interactive preview</span></div><span className="demo-avatar" aria-label="Employee profile">AS</span></div>
      <div className="demo-body">
        <aside className="demo-sidebar" aria-label="Workspace views">
          {(["Overview", "Expenses", "Reports", "Reimbursements"] as View[]).map((item) => <button key={item} type="button" className={view === item ? "demo-nav-item active" : "demo-nav-item"} onClick={() => setView(item)} aria-current={view === item ? "page" : undefined}>{item}</button>)}
          <div className="demo-sidebar-bottom"><span>Need help?</span><small>Your expense guide</small></div>
        </aside>
        <div className="demo-content">
          <div className="demo-content-head"><div><span>EMPLOYEE SPACE</span><h3>{view === "Overview" ? "Good morning, Alex" : view}</h3></div><button className="demo-new-button" type="button" onClick={openForm}>+ New expense</button></div>

          {view === "Overview" && <>
            <div className="demo-summary"><div><span>Awaiting approval</span><strong>{money(expenses.filter((e) => e.status === "In review").reduce((sum, e) => sum + e.amount, 0))}</strong><small>1 report in progress</small></div><div><span>Draft expenses</span><strong>{expenses.filter((e) => e.status === "Draft").length}</strong><small>Ready when you are</small></div><div><span>Tracked spending</span><strong>{money(total)}</strong><small>Current preview</small></div></div>
            <div className="demo-panel-head"><div><h4>Recent expenses</h4><span>All amounts in USD</span></div><button type="button" onClick={() => setView("Expenses")}>View all ↗</button></div>
            <ExpenseTable expenses={expenses.slice(0, 3)} />
            <div className="demo-inline-note"><strong>Next step</strong><span>Add a receipt or open your draft meal expense before sending your report.</span></div>
          </>}

          {view === "Expenses" && <><div className="demo-panel-head"><div><h4>Your expenses</h4><span>{expenses.length} items in this preview</span></div></div><ExpenseTable expenses={expenses} /><div className="demo-inline-note"><strong>Policy in context</strong><span>Meal expenses above $75 need a note for your manager.</span></div></>}

          {view === "Reports" && <div className="demo-report"><div className="demo-report-top"><span>CLAIM REPORT</span><span className="demo-status status-review">In review</span></div><h4>Client visit · June</h4><p>Three related expenses, one place to follow the claim.</p><div><span>Report total</span><strong>$346.80</strong></div><div><span>Receipt coverage</span><strong>3 of 3 attached</strong></div><div><span>Current owner</span><strong>Finance team</strong></div><button type="button" onClick={() => setView("Reimbursements")}>Track reimbursement ↗</button></div>}

          {view === "Reimbursements" && <div className="demo-payments"><div className="demo-payment"><span className="demo-status status-review">Scheduled</span><div><strong>Client visit · June</strong><span>Expected Jun 25</span></div><strong>$346.80</strong></div><div className="demo-payment"><span className="demo-status status-approved">Paid</span><div><strong>Office supplies · May</strong><span>Paid Jun 04</span></div><strong>$84.50</strong></div><p>Payment dates are sample data for this portfolio preview.</p></div>}
        </div>
      </div>

      {formOpen && <div className="form-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
        <div className="expense-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef}>
          <div className="dialog-header"><div><span>NEW EXPENSE</span><h3 id="dialog-title">Add an expense</h3></div><button ref={closeRef} type="button" className="dialog-close" aria-label="Close expense form" onClick={closeForm}>×</button></div>
          <div className="receipt-upload"><div><strong>Receipt</strong><span>{receiptName || "Attach a receipt or try sample entry"}</span></div><label className="upload-label">Upload<input type="file" accept="image/*,.pdf" onChange={(event) => { setReceiptName(event.target.files?.[0]?.name || ""); setError(""); }} /></label></div>
          <button type="button" className="sample-button" onClick={fillSampleReceipt} disabled={scanning}>{scanning ? "Reading sample receipt..." : "Try OCR assisted sample entry"}</button>
          <div className="dialog-fields"><label>Merchant<input value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="Where did you spend?" /></label><div className="field-pair"><label>Amount (USD)<input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Travel</option><option>Meals</option><option>Supplies</option><option>Lodging</option></select></label></div>
          {policyWarning && <div className="form-policy" role="status"><strong>Meal limit exceeded</strong><span>This is {money(numericAmount - 75)} above the $75 daily limit. Add context for your manager.</span><label>Note for manager<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add context for this expense" /></label></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="dialog-actions"><button type="button" onClick={closeForm}>Cancel</button><button type="button" className="demo-new-button" onClick={saveExpense}>Save draft</button></div>
        </div>
      </div>}
    </div>
  );
}

function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>Expense</th><th>Category</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead><tbody>{expenses.map((expense) => <tr key={expense.id}><td><strong>{expense.merchant}</strong><span>{expense.receipt ? "Receipt attached" : "Receipt needed"}</span></td><td>{expense.category}</td><td>{expense.date}</td><td><span className={`demo-status ${expense.status === "Draft" ? "status-draft" : expense.status === "Approved" ? "status-approved" : "status-review"}`}>{expense.status}</span></td><td className="amount-cell">{money(expense.amount)}</td></tr>)}</tbody></table></div>;
}
