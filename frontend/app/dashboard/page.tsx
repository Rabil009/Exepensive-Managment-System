import Link from "next/link";
import { ArrowLeft, Receipt, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 sm:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">FinPulse Dashboard</h1>
              <p className="text-xs text-neutral-400">Expense overview & approvals</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Total Expenses</span>
              <Receipt className="h-4 w-4 text-[#3B6CF6]" />
            </div>
            <p className="text-2xl font-bold font-mono">₹42,850</p>
            <p className="text-[11px] text-neutral-500 mt-1">18 claims logged this month</p>
          </div>

          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Approved & Cleared</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">₹31,400</p>
            <p className="text-[11px] text-neutral-500 mt-1">Direct UTR bank settled</p>
          </div>

          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>In Audit Review</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-400">₹11,450</p>
            <p className="text-[11px] text-neutral-500 mt-1">3 pending manager sign-offs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
