"use client";

import React, { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency, getEmployeeAvatar } from "@/lib";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ExpenseClaim } from "@/types/finance";

export function ReimbursementsView() {
  const {
    claims,
    reimbursements,
    recordPayment,
    reimbursementsPendingAmount,
  } = useFinanceStore();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [settleModalClaim, setSettleModalClaim] = useState<ExpenseClaim | null>(null);
  const [utr, setUtr] = useState(`UTR-HDFC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [channel, setChannel] = useState("Corporate NEFT Clearing");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Eligible personal claims waiting for payment
  const pendingReimbursements = claims.filter(
    (c) =>
      c.paymentMethod !== "CORPORATE_CARD" &&
      (c.status === "FINANCE_APPROVED" || c.status === "PAYMENT_PENDING" || c.status === "MANAGER_APPROVED") &&
      !c.isHold
  );

  const handleExecuteSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleModalClaim || !utr.trim()) return;
    recordPayment(settleModalClaim.id, utr.trim(), channel, date);
    setSettleModalClaim(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div
        className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-sm font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Employee Reimbursements Ledger
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              {pendingReimbursements.length} pending payout
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Approved employee out-of-pocket expenses eligible for electronic bank disbursement
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className={`text-[11px] block font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Total Pending Liability
          </span>
          <span className={`text-xl font-semibold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            {formatCurrency(reimbursementsPendingAmount)}
          </span>
        </div>
      </div>

      {/* Pending Payout Queue Table */}
      <div
        className={`rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div
          className={`p-4 pb-3 border-b ${
            isDark ? "border-white/[0.06]" : "border-zinc-200/60"
          }`}
        >
          <h3 className={`text-xs font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            Approved Claims Awaiting Bank Settlement
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`text-xs font-medium border-b ${
                  isDark
                    ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
                    : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Claim ID</th>
                <th className="py-2.5 px-4 font-medium">Employee</th>
                <th className="py-2.5 px-4 font-medium">Department</th>
                <th className="py-2.5 px-4 font-medium">Expense Title</th>
                <th className="py-2.5 px-4 font-medium text-right">Eligible Payout</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {pendingReimbursements.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`py-8 text-center text-xs ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    No personal claims awaiting reimbursement.
                  </td>
                </tr>
              ) : (
                pendingReimbursements.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                    }`}
                  >
                    <td className={`py-3 px-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {c.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                          <img
                            src={getEmployeeAvatar(c.employeeName)}
                            alt={c.employeeName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-medium text-[13px] leading-tight truncate ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                            {c.employeeName}
                          </span>
                          {c.employeeDepartment && (
                            <span className={`text-[11.5px] leading-tight mt-0.5 truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                              {c.employeeDepartment}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 max-w-xs truncate font-medium ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                      {c.title}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                      {formatCurrency(c.amount, c.currency)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSettleModalClaim(c);
                          setUtr(`UTR-HDFC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                        }}
                        className={`h-7 px-3 rounded-lg font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 border ${
                          isDark
                            ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
                            : "bg-zinc-900 text-white hover:bg-black border-transparent"
                        }`}
                      >
                        <Wallet className="h-3 w-3" />
                        Disburse Payout
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Reimbursements History Table */}
      <div
        className={`rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
        <div
          className={`p-4 pb-3 border-b ${
            isDark ? "border-white/[0.06]" : "border-zinc-200/60"
          }`}
        >
          <h3 className={`text-xs font-semibold tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            Recently Settled Reimbursements History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`text-xs font-medium border-b ${
                  isDark
                    ? "border-white/[0.06] text-zinc-400 bg-white/[0.01]"
                    : "border-zinc-200/60 text-zinc-500 bg-zinc-50/50"
                }`}
              >
                <th className="py-2.5 px-4 font-medium">Reimbursement ID</th>
                <th className="py-2.5 px-4 font-medium">Employee</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium">Completed Date</th>
                <th className="py-2.5 px-4 font-medium">Payment Channel</th>
                <th className="py-2.5 px-4 font-medium">Bank Reference</th>
                <th className="py-2.5 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {reimbursements.map((r) => (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                  }`}
                >
                  <td className={`py-3 px-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {r.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <img
                          src={r.avatar || getEmployeeAvatar(r.employee)}
                          alt={r.employee}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-medium text-[13px] leading-tight truncate ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {r.employee}
                        </span>
                        {r.department && (
                          <span className={`text-[11.5px] leading-tight mt-0.5 truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {r.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                    {formatCurrency(r.amount, r.currency)}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {r.completedDate}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {r.paymentMethod}
                  </td>
                  <td className={`py-3 px-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    {r.paymentReference}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex justify-end">
                      <StatusBadge tone="success">{r.status}</StatusBadge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement UTR Modal */}
      {settleModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-xl p-6 relative border shadow-2xl transition-colors ${
              isDark
                ? "bg-[#111113] border-white/[0.08] text-zinc-100"
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-sm font-semibold mb-1 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Record Bank Settlement
            </h3>
            <p className={`text-xs mb-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Enter electronic payment reference for {settleModalClaim.employeeName}
            </p>

            <form onSubmit={handleExecuteSettlement} className="space-y-3.5">
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark
                    ? "bg-[#18181D] border-white/[0.06]"
                    : "bg-zinc-50 border-zinc-200/80"
                }`}
              >
                <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Payable Amount</span>
                <span className={`text-lg font-semibold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {formatCurrency(settleModalClaim.amount, settleModalClaim.currency)}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Bank UTR / Transaction Reference <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUtr(`UTR-HDFC-2026-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className={`text-xs flex items-center gap-1 ${
                      isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className={`w-full h-8 px-3 font-mono rounded-lg text-xs outline-none border transition-colors ${
                    isDark
                      ? "bg-[#18181D] border-white/[0.08] text-zinc-100 focus:border-white/20"
                      : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Payment Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className={`w-full h-8 px-2.5 rounded-lg text-xs outline-none border transition-colors ${
                    isDark
                      ? "bg-[#18181D] border-white/[0.08] text-zinc-100 focus:border-white/20"
                      : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400"
                  }`}
                >
                  <option value="Corporate NEFT Clearing">Corporate NEFT Clearing</option>
                  <option value="Corporate RTGS High-Value">Corporate RTGS High-Value</option>
                  <option value="Instant UPI / IMPS Payout">Instant UPI / IMPS Payout</option>
                  <option value="Automated ACH Wire">Automated ACH Wire</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Settlement Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full h-8 px-3 font-mono rounded-lg text-xs outline-none border transition-colors ${
                    isDark
                      ? "bg-[#18181D] border-white/[0.08] text-zinc-100 focus:border-white/20"
                      : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400"
                  }`}
                />
              </div>

              <div
                className={`pt-3 border-t flex items-center justify-end gap-2 ${
                  isDark ? "border-white/[0.08]" : "border-zinc-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSettleModalClaim(null)}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`h-8 px-4 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-black"
                  }`}
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
