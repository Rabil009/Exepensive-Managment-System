"use client";

import { useMemo, useState } from "react";
import {
  SquaresFourIcon, ReceiptIcon, FileTextIcon, CreditCardIcon, ChartBarIcon,
  WalletIcon, MagnifyingGlassIcon, BellIcon, GearIcon, PlusIcon,
  ArrowUpRightIcon, CaretDownIcon, FunnelIcon, CameraIcon, CheckIcon,
  ClockIcon, XIcon, ArrowRightIcon, ListIcon,
} from "@phosphor-icons/react";
import styles from "./page.module.css";

type Expense = {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  status: "Draft" | "Manager review" | "Finance review" | "Approved" | "Paid";
  receipt: boolean;
};

const initialExpenses: Expense[] = [
  { id: 1, name: "Northline Rail", category: "Travel", date: "05 Oct 2026", amount: 148.2, status: "Manager review", receipt: true },
  { id: 2, name: "The Willow Table", category: "Meals", date: "03 Oct 2026", amount: 92, status: "Draft", receipt: true },
  { id: 3, name: "City Transfer", category: "Travel", date: "01 Oct 2026", amount: 106.6, status: "Finance review", receipt: true },
  { id: 4, name: "Stationery Studio", category: "Supplies", date: "29 Sep 2026", amount: 84.5, status: "Paid", receipt: true },
];
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const trend = { Month: [36, 40, 48, 54, 50, 66, 76, 69, 83, 72, 80, 75], Week: [42, 51, 45, 59, 74, 68, 82, 75, 88, 71, 80, 86] };
const nav = [
  { label: "Overview", icon: SquaresFourIcon, href: "#overview" },
  { label: "Expenses", icon: ReceiptIcon, href: "#expenses" },
  { label: "Reports", icon: FileTextIcon, href: "#reports" },
  { label: "Reimbursements", icon: WalletIcon, href: "#reimbursements" },
  { label: "Cards", icon: CreditCardIcon, href: "#cards" },
  { label: "Insights", icon: ChartBarIcon, href: "#insights" },
];

function Sparkline({ values }: { values: number[] }) {
  const points = values.map((value, i) => `${(i / (values.length - 1)) * 100},${100 - value}`).join(" ");
  const comparison = [14, 17, 26, 61, 68, 62, 59, 72, 81, 73, 78, 86].map((value, i) => `${(i / 11) * 100},${100 - value}`).join(" ");
  const area = `0,100 ${points} 100,100`;
  return <svg className={styles.sparkline} viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Expense trend: ${values.join(", ")}`}>
    <defs><linearGradient id="expense-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00cd61" stopOpacity=".48" /><stop offset="100%" stopColor="#00cd61" stopOpacity="0" /></linearGradient></defs>
    <polygon points={area} fill="url(#expense-area)" />
    <polyline points={points} fill="none" stroke="#06d46a" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={comparison} fill="none" stroke="#2864db" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export default function EmployeeDashboard() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<"Month" | "Week">("Month");
  const [filter, setFilter] = useState<"All" | "Needs action" | "In review" | "Paid">("All");
  const [modal, setModal] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Travel");
  const [date, setDate] = useState("2026-10-05");
  const [receipt, setReceipt] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const visible = useMemo(() => expenses.filter((expense) => {
    const matchesSearch = `${expense.name} ${expense.category} ${expense.status}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || (filter === "Needs action" && expense.status === "Draft") || (filter === "In review" && ["Manager review", "Finance review"].includes(expense.status)) || (filter === "Paid" && expense.status === "Paid");
    return matchesSearch && matchesFilter;
  }), [expenses, search, filter]);
  const mealWarning = category === "Meals" && Number(amount) > 75;
  const pending = expenses.filter((e) => e.status === "Manager review" || e.status === "Finance review").reduce((sum, e) => sum + e.amount, 0);

  function saveExpense() {
    const value = Number(amount);
    if (!merchant.trim() || !date || !Number.isFinite(value) || value <= 0) { setError("Add a merchant, date, and amount greater than zero."); return; }
    setExpenses((current) => [{ id: Date.now(), name: merchant.trim(), category, date: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), amount: value, status: "Draft", receipt: !!receipt }, ...current]);
    setModal(false); setMerchant(""); setAmount(""); setCategory("Travel"); setReceipt(""); setNote(""); setError(""); setFilter("All");
    document.getElementById("expenses")?.scrollIntoView({ behavior: "smooth" });
  }

  return <div className={styles.canvas}>
    <div className={styles.dashboard} id="overview">
      <aside className={`${styles.rail} ${mobileNav ? styles.railOpen : ""}`} aria-label="Employee navigation">
        <a href="#overview" className={styles.workspace} aria-label="Expense home"><span className={styles.logo}><span>E</span><i /></span><span className={styles.workspaceName}><small>Workspace</small><strong>Orbit Expense</strong></span><CaretDownIcon size={13} /></a>
        <nav className={styles.railNav}>{nav.map(({ label, icon: Icon, href }, i) => <a key={label} href={href} aria-label={label} title={label} className={i === 0 ? styles.railActive : ""} onClick={() => setMobileNav(false)}><Icon size={19} weight={i === 0 ? "fill" : "regular"} /><span>{label}</span></a>)}</nav>
        <div className={styles.railDivider} /><span className={styles.railLabel}>WORKFLOWS</span>
        <div className={styles.railWorkflow}><a href="#expenses"><CheckIcon size={18} /> Approvals</a><a href="#reimbursements"><WalletIcon size={18} /> Claim history</a></div>
        <div className={styles.railHelp}><FileTextIcon size={20} /><strong>Ready to submit?</strong><p>Group draft expenses into a report for review.</p><a href="#reports">View reports <ArrowRightIcon size={14} /></a></div>
        <a href="#overview" className={styles.railBottom} aria-label="Back to top"><ArrowRightIcon size={19} weight="bold" /></a>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.titleGroup}><button className={styles.mobileMenuButton} aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}><ListIcon size={20} /></button><span>Overview</span></div>
          <div className={styles.topActions}>
            <label className={styles.search}><MagnifyingGlassIcon size={15} /><input aria-label="Search expenses" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses" /></label>
            <button type="button" className={styles.iconButton} title="Settings" aria-label="Settings"><GearIcon size={19} weight="fill" /></button>
            <button type="button" className={styles.iconButton} title="Notifications" aria-label="Notifications"><BellIcon size={18} weight="fill" /><i /></button>
            <div className={styles.profile}><span className={styles.avatar}>AM</span><div><strong>Alex Morgan</strong><small>Employee <b>Active</b></small></div></div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.pageHeading}><div><span>EMPLOYEE WORKSPACE</span><h1>Overview</h1><p>Your expenses, approvals, and reimbursements at a glance.</p></div><div className={styles.headingActions}><a href="#reports"><FileTextIcon size={17} /> Create report</a><button onClick={() => setModal(true)}><PlusIcon size={17} /> Add expense</button></div></div>
          <div className={styles.pageTabs}><a href="#overview" className={styles.tabActive}>Overview</a><a href="#expenses">My expenses</a><a href="#reports">Reports</a></div>
          <section className={styles.primaryGrid} aria-label="Expense summary">
            <div className={styles.balanceCard}>
              <div className={styles.balanceTop}><span>Available budget</span><button type="button" onClick={() => setModal(true)} aria-label="Add expense"><PlusIcon size={17} /></button></div>
              <div className={styles.balanceAmount}>$20,670 <span>USD</span></div>
              <p>Remaining from your annual allowance</p>
              <div className={styles.balanceActions}><button type="button" onClick={() => setModal(true)}>Add expense</button><a href="#reimbursements">View claims</a></div>
            </div>

            <div className={styles.trendCard} id="insights">
              <div className={styles.cardHeader}><div><h2>Expense activity</h2><span className={styles.growth}>↑ 14.4%</span></div><button className={styles.periodButton} onClick={() => setPeriod(period === "Month" ? "Week" : "Month")}>{period} <CaretDownIcon size={12} /></button></div>
              <div className={styles.trendValue}>$1,060 <span>this {period.toLowerCase()}</span></div>
              <Sparkline values={trend[period]} />
              <div className={styles.trendAxis}>{(period === "Month" ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]).map((label) => <span key={label}>{label}</span>)}</div>
            </div>

            <div className={styles.cardsPanel} id="cards">
              <div className={styles.cardHeader}><div><h2>Corporate cards</h2><span className={styles.cardsHint}>Cards assigned to your employee account</span></div><CreditCardIcon size={19} /></div>
              <div className={styles.cardPair}><div className={styles.cardUnit}><div className={styles.paymentCard}><div className={styles.cardBrand}>ORBIT<span>VISA</span></div><div className={styles.cardChip} /><p>••••  ••••  ••••  3507</p><div><strong>Alex Morgan</strong><span>02/30</span></div></div><div className={styles.cardCaption}><strong>Travel card</strong><span>Active · ending 3507</span></div></div><div className={styles.cardUnit}><div className={styles.paymentCard + " " + styles.secondCard}><div className={styles.cardBrand}>ORBIT<span>VISA</span></div><div className={styles.cardChip} /><p>••••  ••••  ••••  1024</p><div><strong>Alex Morgan</strong><span>02/30</span></div></div><div className={styles.cardCaption}><strong>General expenses</strong><span>Active · ending 1024</span></div></div></div>
            </div>
          </section>

          <section className={styles.middleGrid} aria-label="Expense metrics and actions">
            <div className={styles.metricCard}><div className={styles.metricIcon}><ReceiptIcon size={21} /></div><div className={styles.ring} style={{ "--ring": "75%" } as React.CSSProperties}><span>75%</span></div><h2>Submitted</h2><strong>$10,400</strong><p>of annual expenses</p></div>
            <div className={styles.metricCard}><div className={styles.metricIcon + " " + styles.coral}><ClockIcon size={21} /></div><div className={styles.ring + " " + styles.ringCoral} style={{ "--ring": "50%" } as React.CSSProperties}><span>50%</span></div><h2>In review</h2><strong>{money(pending)}</strong><p>with manager or finance</p></div>
            <div className={styles.savingsCard}><h2>Budget remaining</h2><strong>$8,320</strong><div className={styles.budgetBars}>{[48, 77, 57, 88, 65, 73, 56].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div><p>Across your active categories</p></div>
            <div className={styles.quickActions} id="reports"><div className={styles.quickHead}><h2>Quick actions</h2><a href="#expenses">View all</a></div><div className={styles.quickButtons}><button onClick={() => setModal(true)}><span className={styles.quickOrange}><PlusIcon size={20} /></span>New expense</button><button onClick={() => setModal(true)}><span className={styles.quickBlue}><CameraIcon size={20} /></span>Scan receipt</button><a href="#expenses"><span className={styles.quickYellow}><FileTextIcon size={20} /></span>Report</a><a href="#reimbursements"><span className={styles.quickPurple}><WalletIcon size={20} /></span>Claims</a></div><div className={styles.quickBottom}><span><span className={styles.flag}>$</span> {money(pending)} pending</span><ArrowUpRightIcon size={15} /></div></div>
          </section>

          <section className={styles.bottomGrid}>
            <div className={styles.expensesPanel} id="expenses"><div className={styles.panelHeading}><div><h2>Recent expenses</h2><p>Track each claim from draft to payment</p></div><div className={styles.tableActions}><button onClick={() => setFilter(filter === "All" ? "Needs action" : filter === "Needs action" ? "In review" : filter === "In review" ? "Paid" : "All")} aria-label={`Filter: ${filter}`} title={`Filter: ${filter}`}><FunnelIcon size={18} /></button><span>{filter}</span></div></div>
              <div className={styles.tableScroll}><table><thead><tr><th>Name</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>{visible.length ? visible.map((item) => <tr key={item.id}><td><span className={styles.expenseNameIcon}><ReceiptIcon size={16} /></span><span><strong>{item.name}</strong><small>{item.category}{item.receipt ? " · Receipt attached" : " · Receipt needed"}</small></span></td><td>{money(item.amount)}</td><td>{item.date}</td><td><span className={`${styles.status} ${item.status === "Paid" || item.status === "Approved" ? styles.paid : item.status === "Draft" ? styles.draft : styles.review}`}>{item.status}</span></td></tr>) : <tr><td colSpan={4} className={styles.emptyState}>No expenses match. Try another search or filter.</td></tr>}</tbody></table></div>
            </div>
            <div className={styles.categoryPanel} id="reimbursements"><div className={styles.cardHeader}><div><h2>Category spend</h2><span className={styles.premium}>This month</span></div><ChartBarIcon size={18} /></div><div className={styles.categoryBars}>{[{ n: "Travel", h: 83, v: "$420" }, { n: "Meals", h: 51, v: "$240" }, { n: "Lodging", h: 69, v: "$335" }, { n: "Supplies", h: 33, v: "$84" }, { n: "Other", h: 58, v: "$190" }].map((item) => <div key={item.n}><span title={`${item.n}: ${item.v}`} style={{ height: `${item.h}%` }} /><small>{item.n}</small></div>)}</div><div className={styles.claimSummary}><strong>{money(pending)} awaiting approval</strong><span>Next update after finance review</span></div><div className={styles.reimbursementNote}><CheckIcon size={14} /><span>Last reimbursement paid 02 Oct</span></div></div>
          </section>
        </main>
      </div>
    </div>

    {modal && <div className={styles.modalBackdrop} onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(false); }}><div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="expense-title"><div className={styles.modalHead}><div><span>EMPLOYEE EXPENSE</span><h2 id="expense-title">New expense</h2></div><button aria-label="Close" onClick={() => setModal(false)}><XIcon size={19} /></button></div><label>Merchant<input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Where did you spend?" /></label><div className={styles.formPair}><label>Amount (USD)<input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></label><label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></div><label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option>Travel</option><option>Meals</option><option>Lodging</option><option>Supplies</option><option>Other</option></select></label><label className={styles.receiptField}>Receipt<input type="file" accept="image/*,.pdf" onChange={(e) => setReceipt(e.target.files?.[0]?.name || "")} /><span>{receipt || "Attach an image or PDF"}</span></label>{mealWarning && <div className={styles.policyWarning}><strong>Meal limit exceeded</strong><p>This expense is {money(Number(amount) - 75)} above the $75 daily meal limit. Add a note for your manager.</p><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" /></div>}{error && <p className={styles.formError} role="alert">{error}</p>}<div className={styles.modalActions}><button onClick={() => setModal(false)}>Cancel</button><button onClick={saveExpense}>Save draft</button></div></div></div>}
  </div>;
}
