"use client";

import React from "react";
import { useFinanceStore } from "@/lib/finance-store";
import { useTheme } from "@/lib/theme-store";
import { formatCurrency } from "@/lib";
import { StatusBadge, PriorityBadge } from "@/components/shared/StatusBadge";

export function ExceptionsView() {
  const { claims, exceptions, releaseHold, approveClaim } = useFinanceStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const flaggedClaims = claims.filter(
    (c) => c.policyViolation || c.isDuplicateWarning || c.isHold
  );

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
              Exceptions & Policy Violation Center
            </h2>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                isDark
                  ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
              }`}
            >
              {flaggedClaims.length} active violations
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Track policy breaches, duplicate expenses, missing receipts, and audit holds
          </p>
        </div>
      </div>

      {/* Exception Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exceptions.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`rounded-xl p-4 flex flex-col justify-between border transition-colors ${
              isDark
                ? "bg-[#111113] border-white/[0.07]"
                : "bg-white border-zinc-200/80 shadow-xs"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                  {item.type}
                </span>
                <PriorityBadge level={item.priority.toLowerCase() as "high" | "medium" | "low"} />
              </div>
              <p className={`text-xs line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                {item.description}
              </p>
            </div>
            <div
              className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
                isDark ? "border-white/[0.06]" : "border-zinc-200/60"
              }`}
            >
              <span className={`text-lg font-semibold tabular-nums ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                {item.count} items
              </span>
              <span className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Requires audit</span>
            </div>
          </div>
        ))}
      </div>

      {/* Flagged Claims Table */}
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
            Active Claims Requiring Exception Resolution
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
                <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                <th className="py-2.5 px-4 font-medium">Violation / Exception Detail</th>
                <th className="py-2.5 px-4 font-medium">Current State</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs ${
                isDark ? "divide-white/[0.04]" : "divide-zinc-200/50"
              }`}
            >
              {flaggedClaims.map((claim) => (
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
                    <span className={`font-medium block ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                      {claim.employeeName}
                    </span>
                    <span className={`text-[11px] block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {claim.employeeDepartment}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold tabular-nums text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                    {formatCurrency(claim.amount, claim.currency)}
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    {claim.policyViolation && (
                      <span className="text-xs text-rose-500 font-medium block">
                        • {claim.policyViolation}
                      </span>
                    )}
                    {claim.isDuplicateWarning && (
                      <span className="text-xs text-amber-500 font-medium block">
                        • Potential duplicate expense pattern detected
                      </span>
                    )}
                    {claim.isHold && (
                      <span className="text-xs text-amber-500 font-medium block">
                        • Hold Note: {claim.holdReason || "Under review"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {claim.isHold ? (
                      <StatusBadge tone="warning">On hold</StatusBadge>
                    ) : (
                      <StatusBadge tone="danger">Review needed</StatusBadge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {claim.isHold ? (
                      <button
                        type="button"
                        onClick={() => releaseHold(claim.id)}
                        className={`h-7 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                          isDark
                            ? "bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border-white/[0.08]"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                        }`}
                      >
                        Release Hold
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          approveClaim(
                            claim.id,
                            "Exception reviewed and granted exception waiver by Finance."
                          )
                        }
                        className={`h-7 px-3 rounded-md font-medium text-xs transition-colors cursor-pointer border ${
                          isDark
                            ? "bg-white text-zinc-950 hover:bg-zinc-200 border-transparent"
                            : "bg-zinc-900 text-white hover:bg-black border-transparent"
                        }`}
                      >
                        Grant Waiver & Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
