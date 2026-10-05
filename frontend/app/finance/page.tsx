"use client";

import { useState } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MOCK_USERS, MOCK_CLAIMS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib";
import { toast } from "sonner";
import {
  DollarSign,
  Download,
  PauseCircle,
  PlayCircle,
  CreditCard,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Building2,
} from "lucide-react";
import type { ExpenseClaim } from "@/types/finance";

export default function FinancePage() {
  const currentUser = MOCK_USERS.find((u) => u.role === "FINANCE") || MOCK_USERS[1];

  const [claims, setClaims] = useState<ExpenseClaim[]>(MOCK_CLAIMS);
  const [filterMode, setFilterMode] = useState<"ALL" | "PERSONAL" | "CORPORATE">("ALL");
  const [payoutClaim, setPayoutClaim] = useState<ExpenseClaim | null>(null);
  const [holdClaim, setHoldClaim] = useState<ExpenseClaim | null>(null);

  // Form states for Payout Modal (FastAPI POST /api/v1/payments payload)
  const [paymentRef, setPaymentRef] = useState("UTR-HDFC-2026-" + Math.floor(1000 + Math.random() * 9000));
  const [paymentMethod, setPaymentMethod] = useState("Corporate NEFT");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

  // Form states for Hold Modal
  const [holdReasonInput, setHoldReasonInput] = useState("");

  const authorizedClaims = claims.filter(
    (c) => c.status === "MANAGER_APPROVED" || c.status === "FINANCE_APPROVED"
  );

  const displayedClaims = authorizedClaims.filter((c) => {
    if (filterMode === "PERSONAL") return c.paymentMethod !== "CORPORATE_CARD";
    if (filterMode === "CORPORATE") return c.paymentMethod === "CORPORATE_CARD";
    return true;
  });

  const totalPayablePersonal = authorizedClaims
    .filter((c) => c.paymentMethod !== "CORPORATE_CARD" && !c.isHold)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const corporateCardSpend = authorizedClaims
    .filter((c) => c.paymentMethod === "CORPORATE_CARD")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Execute Settlement
  const handleExecutePayout = () => {
    if (!payoutClaim) return;
    if (!paymentRef.trim()) {
      toast.error("Reference ID Required", { description: "Enter banking transaction UTR / Reference." });
      return;
    }

    setClaims((prev) =>
      prev.map((c) =>
        c.id === payoutClaim.id
          ? {
              ...c,
              status: "PAID",
              paymentReference: paymentRef,
              paymentChannel: paymentMethod,
              disbursedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    toast.success(`Disbursement Sealed: ${payoutClaim.id}`, {
      description: `Payment ${formatCurrency(payoutClaim.amount, payoutClaim.currency)} confirmed via ${paymentMethod} (Ref: ${paymentRef}).`,
    });

    setPayoutClaim(null);
  };

  // Hold Toggle Action
  const toggleHold = () => {
    if (!holdClaim) return;

    if (!holdClaim.isHold && !holdReasonInput.trim()) {
      toast.error("Hold Reason Required", { description: "PRD FR-10 mandates documented reason for audit logs." });
      return;
    }

    setClaims((prev) =>
      prev.map((c) =>
        c.id === holdClaim.id
          ? {
              ...c,
              isHold: !c.isHold,
              holdReason: !c.isHold ? holdReasonInput : undefined,
              heldAt: !c.isHold ? new Date().toISOString() : undefined,
            }
          : c
      )
    );

    toast.info(`Claim ${holdClaim.id} ${!holdClaim.isHold ? "Placed on Audit Hold" : "Hold Released"}`, {
      description: !holdClaim.isHold
        ? `Payout blocked until released: "${holdReasonInput}"`
        : "Claim eligible for treasury release.",
    });

    setHoldClaim(null);
    setHoldReasonInput("");
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = "Expense_ID,Claimant,Department,Category,Amount,Currency,Payment_Method,Status,Payment_Ref\n";
    const rows = claims
      .map(
        (c) =>
          `"${c.id}","${c.employeeName}","${c.employeeDepartment}","${c.category}",${c.amount},"${c.currency}","${c.paymentMethod}","${c.status}","${c.paymentReference || "N/A"}"`
      )
      .join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FinPulse_Accounting_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Accounting Export Generated (PRD FR-18)", {
      description: "Reconciled CSV archive generated and dispatched from local ledger.",
    });
  };

  return (
    <AppShell currentUser={currentUser} pageTitle="Treasury Vault">
      <div className="space-y-10">
        <PageHeader
          sectionCode="SETTLEMENT REF // FIN-TR-03"
          title="Corporate Treasury & Settlement Clearinghouse"
          subtitle="Execute verified employee reimbursements, seal immutable ledger entries, and generate audit-grade reconciliation archives."
          action={
            <button onClick={handleExportCSV} className="luxury-btn-secondary inline-flex items-center gap-2">
              <Download className="h-3.5 w-3.5 text-[var(--accent-gold)]" />
              <span>Export Accounting Ledger</span>
            </button>
          }
        />

        {/* Metric Modules */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            serialNumber="POS // 01 — PAYABLE"
            title="Authorized Personal Payouts"
            value={formatCurrency(totalPayablePersonal, "INR")}
            trend={totalPayablePersonal > 0 ? "up" : "neutral"}
            trendValue={`${authorizedClaims.filter((c) => c.paymentMethod !== "CORPORATE_CARD" && !c.isHold).length} Payable`}
            subtitle="Verified personal reimbursement claims eligible for execution"
          />
          <MetricCard
            serialNumber="POS // 02 — CORPORATE CARD"
            title="Corporate Card Spend (₹0 Payout)"
            value={formatCurrency(corporateCardSpend, "INR")}
            subtitle="Company card liability handled directly outside payroll"
          />
          <MetricCard
            serialNumber="POS // 03 — RESERVES"
            title="Corporate Liquidity Pool"
            value={formatCurrency(485000, "INR")}
            subtitle="Current available balance in primary operating clearinghouse"
          />
        </div>

        {/* Settlement Filter Tabs */}
        <div className="flex items-center gap-3 border-b border-[var(--border-hairline)] pb-4">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mr-2">
            Ledger View:
          </span>
          <button
            onClick={() => setFilterMode("ALL")}
            className={`font-mono text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider transition-all ${
              filterMode === "ALL"
                ? "bg-[var(--accent-gold)] text-black font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-display)] border border-[var(--border-subtle)]"
            }`}
          >
            All Verified ({authorizedClaims.length})
          </button>
          <button
            onClick={() => setFilterMode("PERSONAL")}
            className={`font-mono text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider transition-all ${
              filterMode === "PERSONAL"
                ? "bg-[var(--accent-gold)] text-black font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-display)] border border-[var(--border-subtle)]"
            }`}
          >
            Personal Reimbursements Only (PRD FR-11)
          </button>
          <button
            onClick={() => setFilterMode("CORPORATE")}
            className={`font-mono text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider transition-all ${
              filterMode === "CORPORATE"
                ? "bg-[var(--accent-gold)] text-black font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-display)] border border-[var(--border-subtle)]"
            }`}
          >
            Corporate Card Liabilities
          </button>
        </div>

        {/* Payout Register Chamber */}
        <div className="luxury-card rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-2">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-gold)] uppercase">
                SETTLEMENT MANIFEST (PRD FR-10 & FR-12)
              </span>
              <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[var(--text-display)] mt-0.5">
                Authorized Disbursement Register
              </h2>
            </div>
            <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--accent-gold)]">
              {displayedClaims.length} Active Records
            </span>
          </div>

          {displayedClaims.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-12 text-center font-light">
              No claims currently match this settlement criteria.
            </p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <tr>
                    <th className="py-4 pl-1 font-medium">Beneficiary Officer</th>
                    <th className="py-4 font-medium">Department</th>
                    <th className="py-4 font-medium">Claim Title</th>
                    <th className="py-4 font-medium">Payment Channel</th>
                    <th className="py-4 font-medium">Settlement Amount</th>
                    <th className="py-4 font-medium">Audit Hold Flag</th>
                    <th className="py-4 pr-1 text-right font-medium">Execution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)]">
                  {displayedClaims.map((claim) => {
                    const isCorporate = claim.paymentMethod === "CORPORATE_CARD";
                    return (
                      <tr key={claim.id} className="group transition-colors hover:bg-[var(--accent-gold-light)]/20">
                        <td className="py-4 pl-1 font-medium text-[var(--text-display)]">
                          {claim.employeeName}
                        </td>
                        <td className="py-4 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                          {claim.employeeDepartment}
                        </td>
                        <td className="py-4 text-[var(--text-display)] font-light">
                          {claim.title}
                        </td>
                        <td className="py-4 font-mono text-[10px] uppercase text-[var(--accent-gold)]">
                          {claim.paymentMethod.replace("_", " ")}
                        </td>
                        <td className="py-4 font-mono-nums text-sm font-medium text-[var(--text-display)]">
                          {formatCurrency(claim.amount, claim.currency)}
                          {isCorporate && (
                            <span className="block text-[9px] font-mono text-[var(--text-muted)] font-normal">
                              (₹0.00 employee payable)
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          {claim.isHold ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[9px] text-amber-500 uppercase font-semibold">
                              <PauseCircle className="h-3 w-3" />
                              Held ({claim.holdReason})
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-emerald-500">
                              ✓ Cleared
                            </span>
                          )}
                        </td>
                        <td className="py-4 pr-1 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Hold / Release Button */}
                            <button
                              onClick={() => {
                                setHoldClaim(claim);
                                setHoldReasonInput(claim.holdReason || "");
                              }}
                              className="luxury-btn-secondary py-1 px-2.5 text-[10px]"
                              title={claim.isHold ? "Release Hold" : "Place on Hold"}
                            >
                              {claim.isHold ? "Release Hold" : "Hold"}
                            </button>

                            {/* Release Payout Button */}
                            {isCorporate ? (
                              <button
                                onClick={() => {
                                  toast.info(`Corporate Reconciliation Completed`, {
                                    description: `Direct card transaction ${claim.id} sealed to general ledger. No employee payment generated.`,
                                  });
                                }}
                                className="luxury-btn-secondary py-1 px-3 text-[10px] text-[var(--accent-gold)]"
                              >
                                Reconcile Card
                              </button>
                            ) : (
                              <button
                                disabled={claim.isHold}
                                onClick={() => setPayoutClaim(claim)}
                                className={`luxury-btn-primary inline-flex items-center gap-1.5 py-1 px-3 text-[10px] ${
                                  claim.isHold ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                              >
                                <DollarSign className="h-3 w-3" />
                                <span>Disburse</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Disbursement Modal (FastAPI POST /api/v1/payments payload) ── */}
        {payoutClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div className="luxury-card w-full max-w-lg rounded-2xl p-7">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <h3 className="font-outfit text-xl font-semibold tracking-tight text-[var(--text-display)]">
                  Record Manual Payment Settlement
                </h3>
                <button onClick={() => setPayoutClaim(null)} className="text-[var(--text-muted)] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-4">
                PRD FR-12: Record confirmed electronic banking disbursement reference for claimant{" "}
                <span className="font-medium text-[var(--text-display)]">{payoutClaim.employeeName}</span>.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                    Amount to Disburse
                  </label>
                  <p className="font-mono-nums text-2xl font-light text-[var(--text-display)]">
                    {formatCurrency(payoutClaim.amount, payoutClaim.currency)}
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                    Banking UTR / Payment Reference Number *
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. UTR-HDFC-2026-9921"
                    className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 font-mono text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 font-sans text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    >
                      <option value="Corporate NEFT">Corporate NEFT</option>
                      <option value="Corporate RTGS">Corporate RTGS</option>
                      <option value="Corporate IMPS / UPI">Corporate IMPS / UPI</option>
                      <option value="Direct ACH Transfer">Direct ACH Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Disbursement Date
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2 font-mono text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    >
                    </input>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-[var(--border-hairline)] pt-4">
                <button onClick={() => setPayoutClaim(null)} className="luxury-btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleExecutePayout}
                  className="luxury-btn-primary"
                >
                  Confirm & Seal Ledger Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Hold Modal (PRD FR-10 Hold Engine) ── */}
        {holdClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div className="luxury-card w-full max-w-md rounded-2xl p-7">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <h3 className="font-outfit text-xl font-semibold tracking-tight text-[var(--text-display)]">
                  {holdClaim.isHold ? "Release Audit Hold" : "Place Claim on Hold"}
                </h3>
                <button onClick={() => setHoldClaim(null)} className="text-[var(--text-muted)] hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-4">
                {holdClaim.isHold
                  ? `Claim is currently held with note: "${holdClaim.holdReason}". Releasing will make it eligible for immediate payment disbursement.`
                  : "PRD FR-10: Placing a hold blocks payment disbursement until explicitly released by Finance."}
              </p>

              {!holdClaim.isHold && (
                <div className="mt-4">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                    Hold Justification *
                  </label>
                  <textarea
                    rows={3}
                    value={holdReasonInput}
                    onChange={(e) => setHoldReasonInput(e.target.value)}
                    placeholder="e.g. Awaiting original physical invoice verification with corporate accounting..."
                    className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-3 text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => setHoldClaim(null)} className="luxury-btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={toggleHold}
                  className={`luxury-btn-primary ${
                    holdClaim.isHold ? "bg-emerald-600 hover:bg-emerald-500" : "bg-amber-600 hover:bg-amber-500"
                  }`}
                >
                  {holdClaim.isHold ? "Release Hold" : "Confirm Audit Hold"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
