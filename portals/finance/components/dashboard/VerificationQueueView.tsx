"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency } from "@/lib";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ExpenseClaim } from "@/types/finance";

export function VerificationQueueView() {
  const {
    claims,
    approveClaim,
    rejectClaim,
    sendBackClaim,
    placeHold,
    releaseHold,
  } = useFinanceStore();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [actionModal, setActionModal] = useState<{
    type: "REJECT" | "SEND_BACK" | "HOLD";
    claim: ExpenseClaim;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");

  const pendingClaims = claims.filter(
    (c) =>
      c.status === "MANAGER_APPROVED" ||
      c.status === "SUBMITTED" ||
      c.isHold
  );

  const filtered = pendingClaims.filter(
    (c) =>
      c.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.merchant && c.merchant.toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirmAction = () => {
    if (!actionModal || !actionReason.trim()) return;
    if (actionModal.type === "REJECT") {
      rejectClaim(actionModal.claim.id, actionReason.trim());
    } else if (actionModal.type === "SEND_BACK") {
      sendBackClaim(actionModal.claim.id, actionReason.trim());
    } else if (actionModal.type === "HOLD") {
      placeHold(actionModal.claim.id, actionReason.trim());
    }
    setActionModal(null);
    setActionReason("");
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Filter */}
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
              Finance Verification Queue
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              {filtered.length} pending
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Verify submitted expense evidence, policy limits, and duplicate indicators
          </p>
        </div>

        <div className="relative w-64">
          <Search
            className={`absolute left-2.5 top-2.5 h-3.5 w-3.5 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, ID, merchant..."
            className={`w-full h-8 pl-8 pr-3 rounded-lg text-xs transition-colors border outline-none ${
              isDark
                ? "bg-[#18181D] border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:border-white/20"
                : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
            }`}
          />
        </div>
      </div>

      {/* Claims Table */}
      <div
        className={`rounded-xl overflow-hidden border transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.07]"
            : "bg-white border-zinc-200/80 shadow-xs"
        }`}
      >
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
                <th className="py-2.5 px-4 font-medium">Expense Title</th>
                <th className="py-2.5 px-4 font-medium">Payment Type</th>
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium">Audit Flags</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`py-8 text-center text-xs ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    No claims awaiting verification.
                  </td>
                </tr>
              ) : (
                filtered.map((claim) => (
                  <tr
                    key={claim.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50/80"
                    }`}
                  >
                    <td className={`py-3 px-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {claim.id}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className={`font-medium block ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                          {claim.employeeName}
                        </span>
                        <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          {claim.employeeDepartment}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className={`font-medium block truncate ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                        {claim.title}
                      </span>
                      <span className={`text-[11px] block truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        {claim.merchant || claim.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {claim.paymentMethod === "CORPORATE_CARD"
                          ? "Corporate Card"
                          : "Personal Payout"}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                      {formatCurrency(claim.amount, claim.currency)}
                    </td>
                    <td className="py-3 px-4">
                      {claim.isHold ? (
                        <StatusBadge tone="warning">On hold</StatusBadge>
                      ) : claim.policyViolation ? (
                        <StatusBadge tone="danger">Cap exceeded</StatusBadge>
                      ) : claim.isDuplicateWarning ? (
                        <StatusBadge tone="warning">Duplicate</StatusBadge>
                      ) : (
                        <StatusBadge tone="success">Compliant</StatusBadge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {claim.isHold ? (
                          <button
                            type="button"
                            onClick={() => releaseHold(claim.id)}
                            className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                              isDark
                                ? "bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border-white/[0.08]"
                                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                            }`}
                          >
                            Release Hold
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => approveClaim(claim.id)}
                              className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                                isDark
                                  ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
                                  : "bg-zinc-900 text-white hover:bg-black border-transparent"
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({ type: "HOLD", claim })
                              }
                              className={`h-7 px-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                isDark
                                  ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                              }`}
                            >
                              Hold
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({ type: "SEND_BACK", claim })
                              }
                              className={`h-7 px-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                isDark
                                  ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                              }`}
                            >
                              Return
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionModal({ type: "REJECT", claim })
                              }
                              className={`h-7 px-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                isDark
                                  ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                  : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              }`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Reason Action Modal */}
      {actionModal && (
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
              {actionModal.type === "REJECT"
                ? "Reject Expense Claim"
                : actionModal.type === "SEND_BACK"
                ? "Send Back for Employee Correction"
                : "Place Claim on Audit Hold"}
            </h3>
            <p className={`text-xs mb-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Claim ID: {actionModal.claim.id} • {actionModal.claim.employeeName}
            </p>

            <div className="space-y-3">
              <div>
                <label className={`block text-xs mb-1 font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Reason / Clarification Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Explain why this decision is being made..."
                  className={`w-full p-2.5 rounded-lg text-xs outline-none border transition-colors ${
                    isDark
                      ? "bg-[#18181D] border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:border-white/20"
                      : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
                  }`}
                />
              </div>

              <div
                className={`flex items-center justify-end gap-2 pt-3 border-t ${
                  isDark ? "border-white/[0.08]" : "border-zinc-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActionModal(null);
                    setActionReason("");
                  }}
                  className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!actionReason.trim()}
                  onClick={handleConfirmAction}
                  className={`h-8 px-4 rounded-lg font-medium text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-black"
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
