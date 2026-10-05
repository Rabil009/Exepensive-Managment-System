"use client";

import { useState } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_USERS, MOCK_CLAIMS, MOCK_BUDGETS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib";
import { toast } from "sonner";
import {
  Check,
  X,
  AlertTriangle,
  FileText,
  Copy,
  Receipt,
  Eye,
  CreditCard,
  Building,
} from "lucide-react";
import type { ExpenseClaim } from "@/types/finance";

export default function ManagementPage() {
  const currentUser = MOCK_USERS.find((u) => u.role === "MANAGER") || MOCK_USERS[2];
  
  // Interactive state
  const [claims, setClaims] = useState<ExpenseClaim[]>(MOCK_CLAIMS);
  const [inspectClaim, setInspectClaim] = useState<ExpenseClaim | null>(null);
  const [actionClaim, setActionClaim] = useState<ExpenseClaim | null>(null);
  const [actionType, setActionType] = useState<"REJECT" | "SEND_BACK">("SEND_BACK");
  const [adjudicationReason, setAdjudicationReason] = useState("");

  const pendingApprovals = claims.filter((c) => c.status === "SUBMITTED");
  const deptBudget = MOCK_BUDGETS.find((b) => b.name === currentUser.department) || MOCK_BUDGETS[0];
  const budgetUsagePercent = Math.round((deptBudget.spentAmount / deptBudget.allocatedAmount) * 100);

  // Manager Actions
  const handleApprove = (claim: ExpenseClaim) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claim.id
          ? {
              ...c,
              status: "MANAGER_APPROVED",
              managerRemark: "Endorsed by Manager. Dispatched to Treasury.",
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    toast.success(`Claim ${claim.id} Approved`, {
      description: `Report endorsed and routed to Finance Verification Queue (FastAPI: POST /api/v1/approvals/${claim.id}/decision).`,
    });
    if (inspectClaim?.id === claim.id) setInspectClaim(null);
  };

  const submitAdjudication = () => {
    if (!actionClaim) return;
    if (!adjudicationReason.trim()) {
      toast.error("Reason Required", {
        description: "PRD FR-09 requires a documented reason for rejections and returns.",
      });
      return;
    }

    const newStatus = actionType === "REJECT" ? "MANAGER_REJECTED" : "DRAFT";
    setClaims((prev) =>
      prev.map((c) =>
        c.id === actionClaim.id
          ? {
              ...c,
              status: newStatus,
              managerRemark: adjudicationReason,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    toast.info(`Claim ${actionClaim.id} ${actionType === "REJECT" ? "Rejected" : "Returned"}`, {
      description: `Reason recorded: "${adjudicationReason}". Claimant notified.`,
    });

    setActionClaim(null);
    setAdjudicationReason("");
    if (inspectClaim?.id === actionClaim.id) setInspectClaim(null);
  };

  return (
    <AppShell currentUser={currentUser} pageTitle="Management Chamber">
      <div className="space-y-10">
        <PageHeader
          sectionCode="REVIEW REF // MGR-GOV-02"
          title="Managerial Review Chamber & Budget Allocations"
          subtitle="Audit team submissions, adjudicate policy warnings, and regulate department capital drawdown limits."
        />

        {/* Metric Modules */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            serialNumber="POS // 01 — QUEUE"
            title="Pending Verification Queue"
            value={pendingApprovals.length.toString()}
            trend={pendingApprovals.length > 0 ? "up" : "neutral"}
            trendValue="Sign-off Required"
            subtitle="Reports requiring managerial audit decision"
          />
          <MetricCard
            serialNumber="POS // 02 — DRAWDOWN"
            title="Department Budget Allocated"
            value={formatCurrency(deptBudget.allocatedAmount, deptBudget.currency)}
            subtitle={`${formatCurrency(deptBudget.spentAmount, deptBudget.currency)} drawn (${budgetUsagePercent}%)`}
          />
          <MetricCard
            serialNumber="POS // 03 — SPONSORS"
            title="Active Team Contributors"
            value="05 Officers"
            subtitle="Engineering Department Authorized Personnel"
          />
        </div>

        {/* Budget Allocation Progress Console */}
        <div className="luxury-card rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-hairline)] gap-2">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-gold)] uppercase">
                CAPITAL ALLOCATION RESERVE (PRD FR-14)
              </span>
              <h3 className="font-forum text-xl text-[var(--text-display)] mt-0.5">
                {deptBudget.name} Fiscal Protocol ({deptBudget.fiscalPeriod})
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {budgetUsagePercent > deptBudget.thresholdPercent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-500 uppercase tracking-widest">
                  <AlertTriangle className="h-3 w-3" />
                  Threshold Alert ({deptBudget.thresholdPercent}%)
                </span>
              )}
              <span className="font-mono text-[11px] font-medium tracking-wider text-[var(--accent-gold)] uppercase">
                {budgetUsagePercent}% Capital Consumed
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 w-full rounded-full bg-[var(--bg-surface-elevated)] overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-gold)] to-amber-300 transition-all duration-700"
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              <span>Committed: {formatCurrency(deptBudget.spentAmount, deptBudget.currency)}</span>
              <span>Available Reserve: {formatCurrency(deptBudget.allocatedAmount - deptBudget.spentAmount, deptBudget.currency)}</span>
            </div>
          </div>
        </div>

        {/* Review Queue Chamber Table */}
        <div className="luxury-card rounded-2xl p-8 backdrop-blur-md">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-hairline)]">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-gold)] uppercase">
                PENDING SCRUTINY DOCKET (PRD FR-09)
              </span>
              <h2 className="font-forum text-2xl text-[var(--text-display)] mt-0.5">
                Expense Approval Queue
              </h2>
            </div>
            <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--accent-gold)]">
              {pendingApprovals.length} Reports In Docket
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-12 text-center font-light">
              No expense reports currently require managerial scrutiny.
            </p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <tr>
                    <th className="py-4 pl-1 font-medium">Claimant Officer</th>
                    <th className="py-4 font-medium">Report Subject & Merchant</th>
                    <th className="py-4 font-medium">Audit Checks</th>
                    <th className="py-4 font-medium">Payment Mode</th>
                    <th className="py-4 font-medium">Claim Amount</th>
                    <th className="py-4 pr-1 text-right font-medium">Manager Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)]">
                  {pendingApprovals.map((claim) => (
                    <tr key={claim.id} className="group transition-colors hover:bg-[var(--accent-gold-light)]/20">
                      <td className="py-4 pl-1">
                        <p className="font-medium text-[var(--text-display)]">{claim.employeeName}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase">{claim.employeeDepartment}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[var(--text-display)] font-medium">{claim.title}</p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{claim.merchant || "Standard Vendor"}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          {claim.policyViolation ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-mono text-amber-500 uppercase">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Policy Exception (+{formatCurrency(claim.policyExceededAmount || 0, claim.currency)})
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-500 font-mono">✓ Policy Compliant</span>
                          )}

                          {claim.isDuplicateWarning && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[9px] font-mono text-rose-400 uppercase">
                              <Copy className="h-2.5 w-2.5" />
                              Duplicate Suspected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent-gold)]">
                          {claim.paymentMethod.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 font-mono-nums text-sm font-medium text-[var(--text-display)]">
                        {formatCurrency(claim.amount, claim.currency)}
                      </td>
                      <td className="py-4 pr-1 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setInspectClaim(claim)}
                            className="luxury-btn-secondary inline-flex items-center gap-1 py-1 px-2.5 text-[10px]"
                            title="Inspect full digital receipt & explanation"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Audit</span>
                          </button>
                          <button
                            onClick={() => handleApprove(claim)}
                            className="luxury-btn-primary inline-flex items-center gap-1 py-1 px-3 text-[10px]"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              setActionClaim(claim);
                              setActionType("SEND_BACK");
                            }}
                            className="luxury-btn-secondary inline-flex items-center gap-1 py-1 px-2.5 text-[10px] text-rose-400 border-rose-500/30 hover:border-rose-500"
                          >
                            <X className="h-3 w-3" />
                            <span>Return</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Inspection Modal (PRD Complete Audit View) ── */}
        {inspectClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div className="luxury-card w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-[var(--accent-gold)] uppercase">
                    AUDIT SCRUTINY FILE // {inspectClaim.id}
                  </span>
                  <h3 className="font-forum text-2xl text-[var(--text-display)] mt-1">
                    {inspectClaim.title}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectClaim(null)}
                  className="rounded-full p-1 text-[var(--text-muted)] hover:text-[var(--text-display)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 mt-6 text-xs text-[var(--text-body)]">
                <div className="grid grid-cols-2 gap-4 border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-surface-elevated)]">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Claimant</span>
                    <p className="font-medium text-[var(--text-display)] text-sm">{inspectClaim.employeeName}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{inspectClaim.employeeDepartment}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Amount & Method</span>
                    <p className="font-mono-nums text-sm font-semibold text-[var(--text-display)]">
                      {formatCurrency(inspectClaim.amount, inspectClaim.currency)}
                    </p>
                    <p className="text-[11px] text-[var(--accent-gold)] uppercase font-mono">
                      {inspectClaim.paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {inspectClaim.policyViolation && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 text-amber-500 font-mono text-[11px] uppercase tracking-wider font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Policy Limit Violation Detected
                    </div>
                    <p className="text-xs text-[var(--text-display)] mt-2 font-medium">
                      {inspectClaim.policyViolation}
                    </p>
                    {inspectClaim.employeeExceptionReason && (
                      <div className="mt-3 border-t border-amber-500/20 pt-2 text-[11px] text-[var(--text-muted)]">
                        <span className="font-mono text-[10px] text-amber-500/80 uppercase block">Claimant Justification:</span>
                        "{inspectClaim.employeeExceptionReason}"
                      </div>
                    )}
                  </div>
                )}

                {/* Receipt Evidence Preview */}
                <div className="border border-[var(--border-hairline)] rounded-xl p-4 bg-[var(--bg-surface)]">
                  <span className="font-mono text-[10px] text-[var(--accent-gold)] uppercase tracking-wider block mb-2">
                    Digital Evidence Attached (PRD FR-03)
                  </span>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[var(--accent-gold)]" />
                      <div>
                        <p className="font-medium text-[var(--text-display)]">{inspectClaim.receiptName || "receipt_evidence.pdf"}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">SHA-256 Verified · Private Storage Object</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-500 uppercase">Secure Link Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-[var(--border-hairline)] pt-4">
                <button
                  onClick={() => {
                    setActionClaim(inspectClaim);
                    setActionType("SEND_BACK");
                  }}
                  className="luxury-btn-secondary text-rose-400 border-rose-500/30"
                >
                  Return for Clarification
                </button>
                <button
                  onClick={() => handleApprove(inspectClaim)}
                  className="luxury-btn-primary"
                >
                  Endorse & Pass to Treasury
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Return / Reject Modal with MANDATORY Reason (PRD FR-09) ── */}
        {actionClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div className="luxury-card w-full max-w-lg rounded-2xl p-7">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <h3 className="font-forum text-xl text-[var(--text-display)]">
                  {actionType === "REJECT" ? "Formal Claim Rejection" : "Return Claim for Corrections"}
                </h3>
                <button onClick={() => setActionClaim(null)} className="text-[var(--text-muted)] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-4">
                PRD Rule FR-09: Rejection or Return mandates an auditable statement of reason before the action is executed.
              </p>

              <div className="mt-4">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                  Documented Adjudication Reason *
                </label>
                <textarea
                  rows={4}
                  value={adjudicationReason}
                  onChange={(e) => setAdjudicationReason(e.target.value)}
                  placeholder="e.g. Please provide itemized hotel folio breakdown rather than summary charge slip..."
                  className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-3 text-xs text-[var(--text-display)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => setActionClaim(null)} className="luxury-btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={submitAdjudication}
                  className="luxury-btn-primary bg-rose-600 text-white hover:bg-rose-500"
                >
                  Confirm & Dispatch to Claimant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
