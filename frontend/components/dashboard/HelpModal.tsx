"use client";

import React from "react";
import { X, HelpCircle, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-lg bg-[#0E0E11] border border-white/[0.08] shadow-2xl p-6 text-[#F4F4F5] relative select-none max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="h-4 w-4 text-[#A1A1AA]" />
            <h3 className="text-[15px] font-semibold text-[#F4F4F5]">
              Finance Workflow Guide (PRD Rules)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#F4F4F5] p-1 rounded hover:bg-white/[0.04]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-[12px] text-[#A1A1AA] leading-relaxed">
          <div className="p-3 rounded bg-[#141417] border border-white/[0.04] space-y-1">
            <span className="text-[13px] font-medium text-[#F4F4F5] block">
              1. Four MVP Roles & Workflow Transitions
            </span>
            <p>
              `Employee` logs draft & submits → `Manager` reviews and approves → `Finance` verifies evidence/caps & grants final approval → `Payment Settlement` records bank UTR.
            </p>
          </div>

          <div className="p-3 rounded bg-[#141417] border border-white/[0.04] space-y-1">
            <span className="text-[13px] font-medium text-[#F4F4F5] block">
              2. Personal Reimbursement vs Corporate Card (FR-11)
            </span>
            <p>
              • <strong>Personal Card / UPI:</strong> Creates payable reimbursement record for employee.
              <br />
              • <strong>Corporate Card:</strong> Creates no employee payment liability (handled externally via corporate bank card feed).
            </p>
          </div>

          <div className="p-3 rounded bg-[#141417] border border-white/[0.04] space-y-1">
            <span className="text-[13px] font-medium text-[#F4F4F5] block">
              3. Finance Hold Engine (FR-10)
            </span>
            <p>
              Finance holds can be placed with justification note (e.g. awaiting physical GST tax receipt). Holding suspends payment disbursement until explicitly released.
            </p>
          </div>

          <div className="p-3 rounded bg-[#141417] border border-white/[0.04] space-y-1">
            <span className="text-[13px] font-medium text-[#F4F4F5] block">
              4. Budget Visibility & Deduplication (FR-14)
            </span>
            <p>
              Each approved expense posts exactly once to its Department, Project, and Cost Center. Threshold indicators highlight Healthy (&lt;75%), Near Limit (75-90%), and Critical (&gt;90%).
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded bg-white hover:bg-[#ECECED] text-black font-medium text-[12px]"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

