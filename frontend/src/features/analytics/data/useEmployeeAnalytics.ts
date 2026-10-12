import { useEffect, useState } from "react";
import { employeeJson } from "@/lib/employee-api";

export type AnalyticsData = {
  month: string;
  currency: string;
  totals: { total_spend: string; pending_approval: string; reimbursed: string; corporate_card_spend: string };
  categories: { name: string; amount: string }[];
  daily_spend: { date: string; amount: string }[];
  weekly_spend: { week: string; amount: string }[];
  funding: { corporate: string; personal: string };
  receipt_compliance: { attached: number; total: number };
  largest_expense: { merchant: string; date: string; amount: number; currency: string } | null;
  cards: { id: string; name: string; last4: string | null; limit: string }[];
};

export function useEmployeeAnalytics() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const result = await employeeJson<AnalyticsData>(`/analytics?month=${encodeURIComponent(month)}`);
      setData(result);
      setError("");
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    employeeJson<AnalyticsData>(`/analytics?month=${encodeURIComponent(month)}`).then((result) => {
      if (active) { setData(result); setError(""); setLoading(false); }
    }).catch((cause: unknown) => {
      if (active) {
        setError(cause instanceof Error ? cause.message : "Could not load analytics.");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [month]);

  return { data, month, setMonth, loading, error, refresh };
}
