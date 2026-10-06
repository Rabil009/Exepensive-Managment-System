import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Bell, BriefcaseBusiness, Check, CheckCircle2,
  ChevronsUpDown, CircleHelp, CirclePlus, Clock3, Ellipsis, EllipsisVertical,
  FileText, House, Landmark, Laptop, Plane, ReceiptText, RefreshCw, Search,
  Settings, TrendingUp, Utensils, Wallet, ChartNoAxesColumn, PanelLeft, Columns, Plus, ChevronDown
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@ui/components/data-display/Card/card";
import { Button } from "@ui/components/actions/Button/button";
import { Checkbox } from "@ui/components/forms/Checkbox/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/components/data-display/Table/table";
import { MerchantLogos } from "./MerchantLogos";
import "./dashboard.css";

const navigation = [
  { label: "Dashboard", href: "/employee/dashboard", icon: House },
  { label: "My Expenses", href: "/employee/expenses", icon: FileText },
  { label: "Add Expense", href: "/employee/expenses/new", icon: CirclePlus },
  { label: "Reimbursements", href: "/employee/reimbursements", icon: RefreshCw },
  { label: "Reports", href: "/employee/reports", icon: ChartNoAxesColumn },
  { label: "Settings", href: "/employee/settings", icon: Settings },
];
const stats = [
  { label: "Total Expenses", value: "₹ 48,320.00", note: "Higher than last month", change: "+12.5%", tone: "blue", icon: Wallet },
  { label: "Pending", value: "₹ 12,450.00", note: "Awaiting approval", change: "+20%", tone: "yellow", icon: Clock3 },
  { label: "Approved", value: "₹ 22,870.00", note: "Approved this month", change: "+8.3%", tone: "green", icon: CheckCircle2 },
  { label: "Reimbursed", value: "₹ 13,000.00", note: "Credited to your account", change: "+16.2%", tone: "cyan", icon: Landmark },
];
const trend = [
  { day: "Jun 1", expense: 3500 }, { day: "Jun 4", expense: 5600 },
  { day: "Jun 7", expense: 7400 }, { day: "Jun 10", expense: 10500 },
  { day: "Jun 13", expense: 11200 }, { day: "Jun 16", expense: 16300 },
  { day: "Jun 19", expense: 12100 }, { day: "Jun 22", expense: 9100 },
  { day: "Jun 25", expense: 7200 }, { day: "Jun 28", expense: 10800 },
  { day: "Jun 30", expense: 15400 },
];
const threeMonthTrend = trend.slice(0, 12).map((point, index) => ({
  ...point,
  day: ["Apr 1", "Apr 8", "Apr 15", "Apr 22", "May 1", "May 8", "May 15", "May 22", "Jun 1", "Jun 8", "Jun 15", "Jun 22"][index],
}));
const categories = [
  { label: "Travel", percent: 32, amount: "₹ 15,620.00", icon: Plane, tone: "blue" },
  { label: "Meals & Entertainment", percent: 24, amount: "₹ 11,580.00", icon: Utensils, tone: "purple" },
  { label: "Office Supplies", percent: 18, amount: "₹ 8,690.00", icon: BriefcaseBusiness, tone: "royal" },
  { label: "Software & Tools", percent: 15, amount: "₹ 7,250.00", icon: Laptop, tone: "cyan" },
  { label: "Other", percent: 11, amount: "₹ 5,180.00", icon: Ellipsis, tone: "gray" },
];
type Status = "Approved" | "Pending" | "Reimbursed";
const expenses: { id: string; date: string; merchant: string; mark: string; markTone: string; category: string; categoryTone: string; amount: string; status: Status }[] = [
  { id: "1", date: "Jun 28, 2024", merchant: "Amazon", mark: "a", markTone: "amazon", category: "Office Supplies", categoryTone: "royal", amount: "₹ 2,499.00", status: "Approved" },
  { id: "2", date: "Jun 26, 2024", merchant: "Swiggy", mark: "◆", markTone: "swiggy", category: "Meals & Entertainment", categoryTone: "purple", amount: "₹ 1,320.00", status: "Pending" },
  { id: "3", date: "Jun 24, 2024", merchant: "Swiggy", mark: "◆", markTone: "swiggy", category: "Meals & Entertainment", categoryTone: "purple", amount: "₹ 860.00", status: "Reimbursed" },
  { id: "4", date: "Jun 21, 2024", merchant: "Ola Cabs", mark: "◎", markTone: "ola", category: "Travel", categoryTone: "blue", amount: "₹ 4,989.00", status: "Approved" },
  { id: "5", date: "Jun 19, 2024", merchant: "Adobe", mark: "A", markTone: "adobe", category: "Software & Tools", categoryTone: "cyan", amount: "₹ 4,989.00", status: "Approved" },
  { id: "6", date: "Jun 17, 2024", merchant: "Cafe Coffee Day", mark: "☕", markTone: "coffee", category: "Meals & Entertainment", categoryTone: "purple", amount: "₹ 470.00", status: "Reimbursed" },
];
const statusIcons = { Approved: Check, Pending: Clock3, Reimbursed: Landmark };
const categoryIcons = { "Office Supplies": BriefcaseBusiness, "Meals & Entertainment": Utensils, Travel: Plane, "Software & Tools": Laptop };
const periods = ["7 Days", "30 Days", "3 Months"] as const;
const filters = ["All", "Pending", "Approved", "Reimbursed"] as const;

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 Days");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const visible = useMemo(() => expenses.filter((expense) =>
    (filter === "All" || expense.status === filter) &&
    `${expense.merchant} ${expense.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [filter, query]);

  return <div className="paytrack-dashboard">
    <aside className={`paytrack-sidebar ${!isSidebarOpen ? "collapsed" : ""}`} aria-label="Main navigation">
      <Link to="/employee/dashboard" className="paytrack-brand"><span className="paytrack-logo" aria-hidden="true"><span /></span><span className="brand-text">PayTrack</span></Link>
      <nav className="paytrack-nav">{navigation.map(({ label, href, icon: Icon }) =>
        <Link key={label} to={href} className={`paytrack-nav-link ${label === "Dashboard" ? "active" : ""}`} aria-current={label === "Dashboard" ? "page" : undefined}>
          <Icon size={25} strokeWidth={1.8} /><span>{label}</span>
        </Link>)}</nav>
      <div className="paytrack-sidebar-bottom">
        <a href="mailto:support@paytrack.com" className="paytrack-nav-link paytrack-help"><CircleHelp size={25} strokeWidth={1.8}/><span>Help &amp; Support</span></a>
        <button className="paytrack-sidebar-profile" type="button" aria-label="Aarav Sharma profile"><span className="paytrack-avatar">AS</span><span className="paytrack-person"><strong>Aarav Sharma</strong><small>Employee</small></span><EllipsisVertical size={18}/></button>
      </div>
    </aside>
    <div className="paytrack-main">
      <header className="paytrack-topbar">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <PanelLeft size={16} className="text-muted-foreground" style={{ cursor: 'pointer', color: isSidebarOpen ? '#a1a1aa' : '#ffffff', transition: 'color 0.2s' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <span className="header-divider" style={{ width: '1px', height: '20px', background: '#2a2a2f' }} />
          <span className="header-title" style={{ fontSize: '13px', fontWeight: 600 }}>Dashboard</span>
        </div>
        <div className="paytrack-top-actions">
        <label className="paytrack-search"><Search size={20} strokeWidth={1.7} aria-hidden="true"/><input aria-label="Search expenses, merchants, or categories" placeholder="Search expenses, merchants, or categories" value={query} onChange={(event) => setQuery(event.target.value)}/></label>
        <button className="paytrack-notification" type="button" aria-label="Notifications"><Bell size={24} strokeWidth={1.7}/><span/></button>
      </div></header>
      <main className="paytrack-content">
        <section className="paytrack-stats" aria-label="Expense summary">{stats.map(({ label, value, note, change, tone, icon: Icon }) =>
          <Card className="paytrack-card paytrack-stat" key={label}><span className={`paytrack-stat-icon tone-${tone}`}><Icon size={29} strokeWidth={1.9}/></span><div className="paytrack-stat-body"><div className="paytrack-stat-heading"><span>{label}</span><span className={`paytrack-change tone-${tone}`}><TrendingUp size={14}/>{change}</span></div><strong>{value}</strong><span className="paytrack-stat-detail">{note}</span></div></Card>)}</section>
        <section className="paytrack-charts" aria-label="Expense charts">
          <Card className="paytrack-card paytrack-trend"><div className="paytrack-panel-heading"><div><h2>Expense Overview</h2></div><div className="paytrack-periods" role="group" aria-label="Chart period">{periods.map((item) => <Button key={item} type="button" className={period === item ? "selected" : ""} aria-pressed={period === item} onClick={() => setPeriod(item)}>{item}</Button>)}</div></div>
            <div className="paytrack-chart-canvas"><ResponsiveContainer width="100%" height="100%"><AreaChart data={period === "7 Days" ? trend.slice(-7) : period === "3 Months" ? threeMonthTrend : trend} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs><linearGradient id="paytrackGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3baf62" stopOpacity={0.12}/><stop offset="55%" stopColor="#2d9651" stopOpacity={0.23}/><stop offset="100%" stopColor="#247c43" stopOpacity={0.42}/></linearGradient></defs>
              <CartesianGrid stroke="#3b4840" strokeOpacity={0.16}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#c4d1e4", fontSize: 11 }} dy={12} interval="preserveStartEnd" minTickGap={8}/><YAxis domain={[0, 20000]} ticks={[0, 5000, 10000, 15000, 20000]} axisLine={false} tickLine={false} tick={{ fill: "#c4d1e4", fontSize: 11 }} tickFormatter={(value: number) => value === 0 ? "₹ 0" : `₹ ${value / 1000}K`} width={54}/>
              <Tooltip contentStyle={{ background: "#14201a", border: "1px solid #31533a", borderRadius: 8, color: "#fff" }} formatter={(value) => `₹ ${Number(value).toLocaleString("en-IN")}`}/><Area type="monotone" dataKey="expense" stroke="#67d783" strokeWidth={2.5} fill="url(#paytrackGreen)" dot={false} isAnimationActive={false}/>
            </AreaChart></ResponsiveContainer></div></Card>
          <Card className="paytrack-card paytrack-categories"><div className="paytrack-panel-heading"><div><h2>Expense by Category</h2></div></div><div className="paytrack-category-list">{categories.map(({ label, percent, amount, icon: Icon, tone }) => <div className="paytrack-category" key={label}><span className={`paytrack-category-icon tone-${tone}`}><Icon size={21} strokeWidth={2.1}/></span><span className="paytrack-category-label">{label}</span><span className="paytrack-bar"><span className={`tone-${tone}`} style={{ width: `${percent * 1.65}%` }}/></span><span className="paytrack-percent">{percent}%</span><strong>{amount}</strong></div>)}</div></Card>
        </section>
        <Card className="paytrack-card paytrack-recent" aria-label="Expenses">
          <div className="paytrack-recent-head">
            <div className="paytrack-recent-actions" role="group" aria-label="Filter expenses">
              {filters.map((item) => {
                const count = item === "All" ? 0 : expenses.filter(e => e.status === item).length;
                return (
                  <Button key={item} type="button" className={filter === item ? "selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>
                    {item} {item !== "All" && <span className="paytrack-filter-count">{count}</span>}
                  </Button>
                );
              })}
            </div>
            <div className="paytrack-table-tools">
              <button className="paytrack-tool-button"><Columns size={15} /> Customize Columns <ChevronDown size={15} /></button>
              <button className="paytrack-tool-button"><Plus size={15} /> Add Section</button>
            </div>
          </div>
          <Table className="paytrack-table"><TableHeader><TableRow><TableHead><Checkbox aria-label="Select all visible expenses" checked={visible.length > 0 && visible.every((expense) => selected.includes(expense.id))} onCheckedChange={(checked) => setSelected(checked ? visible.map((expense) => expense.id) : [])}/></TableHead><TableHead>Date <ChevronsUpDown size={13}/></TableHead><TableHead>Merchant</TableHead><TableHead>Category</TableHead><TableHead>Amount <ChevronsUpDown size={13}/></TableHead><TableHead>Status</TableHead><TableHead>Receipt</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>
            {visible.map((expense) => { const StatusIcon = statusIcons[expense.status]; const CategoryIcon = categoryIcons[expense.category as keyof typeof categoryIcons]; return <TableRow key={expense.id}><TableCell><Checkbox aria-label={`Select ${expense.merchant} expense`} checked={selected.includes(expense.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, expense.id] : current.filter((id) => id !== expense.id))}/></TableCell><TableCell>{expense.date}</TableCell><TableCell><div className="paytrack-merchant"><span className={`paytrack-merchant-mark mark-${expense.markTone}`}>{MerchantLogos[expense.markTone] ? React.createElement(MerchantLogos[expense.markTone]) : expense.mark}</span><span>{expense.merchant}</span></div></TableCell><TableCell><span className={`paytrack-category-badge tone-${expense.categoryTone}`}>{CategoryIcon && <CategoryIcon size={17}/>} {expense.category}</span></TableCell><TableCell className="paytrack-amount">{expense.amount}</TableCell><TableCell><span className={`paytrack-status status-${expense.status.toLowerCase()}`}><StatusIcon size={16}/>{expense.status}</span></TableCell><TableCell><button className="paytrack-icon-button" type="button" aria-label={`View ${expense.merchant} receipt`}><ReceiptText size={22}/></button></TableCell><TableCell><button className="paytrack-icon-button" type="button" aria-label={`More actions for ${expense.merchant}`}><EllipsisVertical size={20}/></button></TableCell></TableRow>; })}
            {visible.length === 0 && <TableRow><TableCell colSpan={8} className="paytrack-empty">No expenses match your search.</TableCell></TableRow>}
          </TableBody></Table>
        </Card>
      </main>
    </div>
  </div>;
}
