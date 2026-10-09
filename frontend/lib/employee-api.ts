import { supabase } from "./supabase";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK_EXPENSES = [
  {
    id: "exp-1",
    date: "2026-10-06",
    merchant: "Delta Airlines",
    category: "Travel",
    amount: 14500,
    status: "Approved",
    raw_status: "MANAGER_APPROVED",
    source: "claim",
    description: "Architectural sync Bangalore flight",
    receipt: "e-ticket-delta.pdf",
    currency: "INR",
    report: "Q4 Bangalore Sync",
    paymentMethod: "Corporate Card",
    attendees: [],
  },
  {
    id: "exp-2",
    date: "2026-10-05",
    merchant: "Grand Hyatt",
    category: "Accommodation",
    amount: 8200,
    status: "Pending",
    raw_status: "SUBMITTED",
    source: "claim",
    description: "Design sprint conference stay",
    receipt: "invoice-hyatt.pdf",
    currency: "INR",
    report: "Q4 Bangalore Sync",
    paymentMethod: "Corporate Card",
    attendees: [],
  },
  {
    id: "exp-3",
    date: "2026-10-04",
    merchant: "Taj Lands End",
    category: "Food",
    amount: 6800,
    status: "Pending",
    raw_status: "SUBMITTED",
    source: "claim",
    description: "Enterprise Q4 dinner with client CFO",
    receipt: "dinner-receipt.jpg",
    currency: "INR",
    report: "Client Visit Mumbai",
    paymentMethod: "Personal (Out-of-Pocket)",
    attendees: ["Rahul", "Priya"],
  },
  {
    id: "exp-4",
    date: "2026-10-02",
    merchant: "Uber for Business",
    category: "Travel",
    amount: 2300,
    status: "Reimbursed",
    raw_status: "DISBURSED",
    source: "claim",
    description: "Product shoot logistics transfers",
    receipt: "uber-invoice.pdf",
    currency: "INR",
    report: "General Transfers",
    paymentMethod: "Personal (Out-of-Pocket)",
    attendees: [],
  },
];

const FALLBACK_OVERVIEW = {
  expenses: FALLBACK_EXPENSES,
  summary: {
    ready_for_reimbursement: "2300",
    pending_approval: "15000",
    card_spending_mtd: "22700",
    card_limit: "100000",
    card_limit_remaining: "77300",
    approved_count: 1,
    pending_count: 2,
  },
};

const FALLBACK_CARDS = {
  cards: [
    {
      id: "crd-001",
      display_name: "Corporate Platinum Visa",
      kind: "PHYSICAL",
      network: "Visa",
      last4: "4242",
      monthly_limit: "100000",
      active: true,
      frozen: false,
      wallet_enabled: true,
      travel_limits_enabled: true,
      online_verification_enabled: true,
      atm_lock_enabled: false,
    },
  ],
  transactions: [
    {
      id: "tx-1",
      card_id: "crd-001",
      transaction_date: "2026-10-06",
      merchant: "Delta Airlines",
      purpose: "Client flights",
      amount: "14500",
      currency: "INR",
      status: "SETTLED",
    },
    {
      id: "tx-2",
      card_id: "crd-001",
      transaction_date: "2026-10-05",
      merchant: "Grand Hyatt",
      purpose: "Conference stay",
      amount: "8200",
      currency: "INR",
      status: "SETTLED",
    },
  ],
  requests: [],
  usage: {
    month: "2026-10",
    cards: [{ id: "crd-001", spent: "22700", limit: "100000", remaining: "77300" }],
    categories: [
      { category: "TRAVEL", name: "Travel & Flights", spent: "14500", limit: "50000", remaining: "35500" },
      { category: "ACCOMMODATION", name: "Hotels & Stays", spent: "8200", limit: "30000", remaining: "21800" },
    ],
  },
};

const FALLBACK_ANALYTICS = {
  month: "2026-10",
  currency: "INR",
  totals: {
    total_spend: "31800",
    pending_approval: "15000",
    reimbursed: "2300",
    corporate_card_spend: "22700",
  },
  categories: [
    { name: "Travel", amount: "16800" },
    { name: "Accommodation", amount: "8200" },
    { name: "Food", amount: "6800" },
  ],
  daily_spend: [
    { date: "2026-10-02", amount: "2300" },
    { date: "2026-10-04", amount: "6800" },
    { date: "2026-10-05", amount: "8200" },
    { date: "2026-10-06", amount: "14500" },
  ],
  weekly_spend: [{ week: "Week 1", amount: "31800" }],
  funding: { corporate: "22700", personal: "9100" },
  receipt_compliance: { attached: 4, total: 4 },
  largest_expense: {
    merchant: "Delta Airlines",
    date: "2026-10-06",
    amount: 14500,
    currency: "INR",
  },
  cards: [{ id: "crd-001", name: "Corporate Platinum Visa", last4: "4242", limit: "100000" }],
};

const FALLBACK_REPORTS = {
  reports: [
    {
      name: "Q4 Bangalore Sync",
      items: [FALLBACK_EXPENSES[0], FALLBACK_EXPENSES[1]],
      workflow_stage: "MANAGER_REVIEW",
      can_withdraw: true,
      can_submit: false,
    },
    {
      name: "Client Visit Mumbai",
      items: [FALLBACK_EXPENSES[2]],
      workflow_stage: "MANAGER_REVIEW",
      can_withdraw: true,
      can_submit: false,
    },
  ],
};

const FALLBACK_OPTIONS = {
  categories: ["Travel", "Food", "Accommodation", "Office", "Software", "Other"],
  reports: ["Q4 Bangalore Sync", "Client Visit Mumbai", "Tech Conference 2026"],
  unlinked_transactions: [],
};

export async function employeeRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token || "demo-token";

  // 1. Try FastAPI backend first
  try {
    const response = await fetch(`${apiUrl}/api/employee${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.ok) return response;
  } catch {
    // Backend offline, fallback gracefully below
  }

  // 2. Direct Supabase Query / Safe Fallback Response
  let fallbackData: any = null;

  if (path.startsWith("/overview")) {
    try {
      const { data: claims } = await supabase
        .from("expense_claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (claims && claims.length > 0) {
        fallbackData = {
          expenses: claims.map((c: any) => ({
            id: c.id,
            date: c.expense_date || (c.created_at || "").slice(0, 10),
            merchant: c.merchant || c.title || "Expense",
            category: c.category || "Other",
            amount: Number(c.amount) || 0,
            status: c.status?.includes("APPROV") ? "Approved" : c.status?.includes("REJECT") ? "Rejected" : "Pending",
            raw_status: c.status || "SUBMITTED",
            source: "claim",
            description: c.description || "",
            receipt: c.receipt_name || null,
            currency: c.currency || "INR",
            report: c.report_name || "General",
            paymentMethod: c.payment_method === "CORPORATE_CARD" ? "Corporate Card" : "Personal (Out-of-Pocket)",
            attendees: c.attendees || [],
          })),
          summary: FALLBACK_OVERVIEW.summary,
        };
      } else {
        fallbackData = FALLBACK_OVERVIEW;
      }
    } catch {
      fallbackData = FALLBACK_OVERVIEW;
    }
  } else if (path.startsWith("/cards")) {
    fallbackData = FALLBACK_CARDS;
  } else if (path.startsWith("/analytics")) {
    fallbackData = FALLBACK_ANALYTICS;
  } else if (path.startsWith("/reports")) {
    fallbackData = FALLBACK_REPORTS;
  } else if (path.startsWith("/new-expense/options")) {
    fallbackData = FALLBACK_OPTIONS;
  } else if (path.startsWith("/new-expense") && init.method === "POST") {
    try {
      if (init.body instanceof FormData) {
        const rawData = init.body.get("data");
        if (typeof rawData === "string") {
          const parsed = JSON.parse(rawData);
          await supabase.from("expense_claims").insert({
            id: parsed.id,
            employee_name: "Rabil Khan",
            employee_department: "Engineering",
            title: parsed.merchant,
            merchant: parsed.merchant,
            description: parsed.purpose || "",
            amount: Number(parsed.amount) || 0,
            category: parsed.category || "TRAVEL",
            status: "SUBMITTED",
            report_name: parsed.report || "General",
            expense_date: parsed.date || new Date().toISOString().slice(0, 10),
          });
        }
      }
    } catch (dbErr) {
      console.warn("Direct Supabase claim insertion notice:", dbErr);
    }
    fallbackData = { id: "new-exp", status: "Pending" };
  } else {
    fallbackData = {};
  }

  return new Response(JSON.stringify(fallbackData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function employeeJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  return (await employeeRequest(path, init)).json() as Promise<T>;
}
