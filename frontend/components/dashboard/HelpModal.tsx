"use client";

import React from "react";
import { X, HelpCircle, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative select-none max-h-[85vh] overflow-y-auto transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.08] text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-white border-zinc-200/90 text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between border-b pb-3.5 mb-4 ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? "bg-white/[0.06] text-zinc-300" : "bg-zinc-100 text-zinc-700"
              }`}
            >
              <HelpCircle className="h-4 w-4 stroke-[1.85]" />
            </div>
            <div>
              <h3
                className={`text-[15px] font-semibold tracking-tight ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                Workflow & Compliance Guide
              </h3>
              <p
                className={`text-[11px] ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Standard expense approval rules and policy thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-[12px] leading-relaxed">
          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? "bg-[#18181D] border-white/[0.06] text-zinc-300" : "bg-zinc-50 border-zinc-200/80 text-zinc-600"
            }`}
          >
            <span
              className={`text-[13px] font-semibold block ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              1. Four MVP Roles & Workflow Transitions
            </span>
            <p>
              <code>Employee</code> logs draft & submits → <code>Manager</code> reviews and approves → <code>Finance</code> verifies evidence/caps & grants final approval → <code>Payment Settlement</code> records bank UTR.
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? "bg-[#18181D] border-white/[0.06] text-zinc-300" : "bg-zinc-50 border-zinc-200/80 text-zinc-600"
            }`}
          >
            <span
              className={`text-[13px] font-semibold block ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              2. Personal Reimbursement vs Corporate Card (FR-11)
            </span>
            <p>
              • <strong>Personal Card / UPI:</strong> Creates payable reimbursement record for employee.
              <br />
              • <strong>Corporate Card:</strong> Creates no employee payment liability (handled externally via corporate bank card feed).
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? "bg-[#18181D] border-white/[0.06] text-zinc-300" : "bg-zinc-50 border-zinc-200/80 text-zinc-600"
            }`}
          >
            <span
              className={`text-[13px] font-semibold block ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              3. Finance Hold Engine (FR-10)
            </span>
            <p>
              Finance holds can be placed with justification note (e.g. awaiting physical GST tax receipt). Holding suspends payment disbursement until explicitly released.
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? "bg-[#18181D] border-white/[0.06] text-zinc-300" : "bg-zinc-50 border-zinc-200/80 text-zinc-600"
            }`}
          >
            <span
              className={`text-[13px] font-semibold block ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              4. Budget Visibility & Deduplication (FR-14)
            </span>
            <p>
              Each approved expense posts exactly once to its Department, Project, and Cost Center. Threshold indicators highlight Healthy (&lt;75%), Near Limit (75-90%), and Critical (&gt;90%).
            </p>
          </div>
        </div>

        <div
          className={`pt-3.5 mt-4 border-t flex justify-end ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`h-8 px-4 rounded-lg font-semibold text-[12px] transition-colors cursor-pointer shadow-xs ${
              isDark
                ? "bg-white hover:bg-zinc-100 text-black"
                : "bg-zinc-900 hover:bg-black text-white"
            }`}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
