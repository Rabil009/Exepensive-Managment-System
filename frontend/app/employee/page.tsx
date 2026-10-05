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
  Plus,
  ArrowUpRight,
  UploadCloud,
  FileCheck2,
  X,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import type { ExpenseClaim, ExpenseCategory, PaymentMethod } from "@/types/finance";

export default function EmployeePage() {
  const currentUser = MOCK_USERS.find((u) => u.role === "EMPLOYEE") || MOCK_USERS[0];
  const [claims, setClaims] = useState<ExpenseClaim[]>(MOCK_CLAIMS);

  // New Claim Modal State
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("TRAVEL");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PERSONAL_CARD");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [exceptionReason, setExceptionReason] = useState("");

  const userClaims = claims.filter((c) => c.employeeId === currentUser.id);
  const totalSubmitted = userClaims.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = userClaims
    .filter((c) => c.status === "SUBMITTED")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const reimbursedAmount = userClaims
    .filter((c) => c.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Policy calculation rule simulation (PRD FR-05)
  const numericAmount = parseFloat(amount) || 0;
  const isHotelPolicyViolated = category === "HOTEL" && numericAmount > 5000;
  const isMealsPolicyViolated = category === "MEALS" && numericAmount > 1500;
  const hasPolicyViolation = isHotelPolicyViolated || isMealsPolicyViolated;

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numericAmount <= 0) {
      toast.error("Invalid Claim", { description: "Please enter a valid title and positive amount." });
      return;
    }

    if (hasPolicyViolation && !exceptionReason.trim()) {
      toast.error("Policy Exception Justification Required", {
        description: "PRD FR-05: When policy limits are exceeded, an employee justification is mandatory.",
      });
      return;
    }

    const newClaim: ExpenseClaim = {
      id: "CLM-" + Math.floor(100 + Math.random() * 900),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeDepartment: currentUser.department,
      title: title.trim(),
      description: description.trim(),
      amount: numericAmount,
      currency: "INR",
      category,
      paymentMethod,
      merchant: merchant.trim() || "Unspecified Vendor",
      receiptName: receiptFileName || "receipt_evidence_scan.pdf",
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      policyViolation: isHotelPolicyViolated
        ? "Nightly accommodation cap exceeded (Standard threshold ₹5,000)."
        : isMealsPolicyViolated
        ? "Daily meal allowance exceeded (Standard threshold ₹1,500)."
        : undefined,
      policyExceededAmount: isHotelPolicyViolated
        ? numericAmount - 5000
        : isMealsPolicyViolated
        ? numericAmount - 1500
        : undefined,
      employeeExceptionReason: hasPolicyViolation ? exceptionReason : undefined,
    };

    setClaims([newClaim, ...claims]);
    setIsNewClaimOpen(false);

    // Reset Form
    setTitle("");
    setAmount("");
    setDescription("");
    setMerchant("");
    setReceiptFileName(null);
    setExceptionReason("");

    toast.success("Expense Claim Lodged (PRD FR-02 & FR-08)", {
      description: `Report snapshot created atomically and routed to Manager queue.`,
    });
  };

  return (
    <AppShell currentUser={currentUser} pageTitle="Employee Chamber">
      <div className="space-y-10">
        <PageHeader
          sectionCode="LEDGER REF // EXP-EMP-01"
          title="Expense Ledger & Reimbursement Register"
          subtitle="Record corporate disbursements, submit verified receipts, and monitor multi-stage treasury clearance."
          action={
            <button
              onClick={() => setIsNewClaimOpen(true)}
              className="luxury-btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record New Claim</span>
            </button>
          }
        />

        {/* Metric Modules */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MetricCard
            serialNumber="POS // 01 — CUMULATIVE"
            title="Total Submitted Capital"
            value={formatCurrency(totalSubmitted, "INR")}
            subtitle="All-time personal business expense entries"
          />
          <MetricCard
            serialNumber="POS // 02 — IN AUDIT"
            title="Under Review & Verification"
            value={formatCurrency(pendingAmount, "INR")}
            trend={pendingAmount > 0 ? "up" : "neutral"}
            trendValue={`${userClaims.filter((c) => c.status === "SUBMITTED").length} Active`}
            subtitle="Awaiting managerial sign-off"
          />
          <MetricCard
            serialNumber="POS // 03 — SETTLED"
            title="Total Settled & Reimbursed"
            value={formatCurrency(reimbursedAmount, "INR")}
            trend="up"
            trendValue="Cleared"
            subtitle="Confirmed electronic bank settlement"
          />
        </div>

        {/* Private Bank Statement Ledger View */}
        <div className="luxury-card rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border-hairline)] gap-4">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-gold)] uppercase">
                PORTFOLIO STATEMENT (PRD FR-04 & FR-13)
              </span>
              <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[var(--text-display)] mt-0.5">
                Itemized Expense Register
              </h2>
            </div>
            <span className="font-mono text-[11px] tracking-wider uppercase text-[var(--text-muted)] self-start sm:self-auto">
              Showing {userClaims.length} Certified Entries
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 pl-1 font-medium">Claim Particulars</th>
                  <th className="py-4 font-medium">Category</th>
                  <th className="py-4 font-medium">Payment Mode</th>
                  <th className="py-4 font-medium">Amount Claimed</th>
                  <th className="py-4 font-medium">Recorded Date</th>
                  <th className="py-4 font-medium">Claim Status</th>
                  <th className="py-4 pr-1 text-right font-medium">Payment Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)]">
                {userClaims.map((claim) => (
                  <tr key={claim.id} className="group transition-colors hover:bg-[var(--accent-gold-light)]/20">
                    <td className="py-4 pl-1">
                      <p className="font-sans text-[13px] font-medium text-[var(--text-display)]">
                        {claim.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {claim.merchant || "Standard Merchant"}
                      </p>
                      {claim.policyViolation && (
                        <span className="inline-block text-[10px] font-mono text-amber-500 mt-1">
                          ⚠ {claim.policyViolation}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent-gold)]">
                        {claim.category}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-[10px] uppercase text-[var(--text-muted)]">
                      {claim.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="py-4 font-mono-nums text-sm font-medium text-[var(--text-display)]">
                      {formatCurrency(claim.amount, claim.currency)}
                    </td>
                    <td className="py-4 font-mono text-[11px] text-[var(--text-muted)]">
                      {formatDate(claim.createdAt)}
                    </td>
                    <td className="py-4">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-4 pr-1 text-right font-mono text-[11px] text-[var(--text-muted)]">
                      {claim.paymentReference ? (
                        <span className="text-emerald-500 font-semibold">{claim.paymentReference}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Record New Claim Modal (PRD Complete Capture Engine) ── */}
        {isNewClaimOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
            <div className="luxury-card w-full max-w-xl rounded-2xl p-7 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-[var(--accent-gold)] uppercase">
                    NEW EXPENSE LODGEMENT (PRD FR-02)
                  </span>
                  <h3 className="font-outfit text-2xl font-semibold tracking-tight text-[var(--text-display)] mt-0.5">
                    Record Business Expense
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewClaimOpen(false)}
                  className="rounded-full p-1 text-[var(--text-muted)] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClaim} className="space-y-4 mt-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Client Architecture Dinner - Q4"
                    className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Expense Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    >
                      <option value="TRAVEL">Travel & Transit</option>
                      <option value="HOTEL">Hotel & Accommodation</option>
                      <option value="MEALS">Meals & Hospitality</option>
                      <option value="SOFTWARE">Software & Cloud Subscriptions</option>
                      <option value="HARDWARE">Hardware & Equipment</option>
                      <option value="TRAINING">Conferences & Training</option>
                      <option value="OFFICE">Office Supplies</option>
                      <option value="OTHER">Other Discretionary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Claim Amount (INR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="6000.00"
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 font-mono-nums text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    >
                      <option value="PERSONAL_CARD">Personal Credit / Debit Card</option>
                      <option value="PERSONAL_UPI">Personal UPI / Net Banking</option>
                      <option value="PERSONAL_CASH">Personal Cash</option>
                      <option value="CORPORATE_CARD">Corporate Company Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                      Merchant / Vendor
                    </label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      placeholder="e.g. The Oberoi Grand"
                      className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-2.5 text-xs text-[var(--text-display)] focus:border-[var(--accent-gold)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Real-time Policy Violation Indicator */}
                {hasPolicyViolation && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-amber-500 uppercase font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Policy Warning: Cap Exceeded
                    </div>
                    <p className="text-[11px] text-[var(--text-display)]">
                      {isHotelPolicyViolated
                        ? "Hotel stay cap is ₹5,000. Your amount of ₹" + numericAmount + " exceeds by ₹" + (numericAmount - 5000) + "."
                        : "Meal allowance cap is ₹1,500. Your amount exceeds threshold."}
                    </p>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-amber-500/90 mb-1">
                        Mandatory Exception Justification *
                      </label>
                      <input
                        type="text"
                        required
                        value={exceptionReason}
                        onChange={(e) => setExceptionReason(e.target.value)}
                        placeholder="State reason for policy exception..."
                        className="w-full rounded-lg border border-amber-500/40 bg-[var(--bg-surface)] p-2 text-xs text-[var(--text-display)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Digital Receipt Upload Dropzone */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                    Receipt Attachment (PDF / PNG / JPG)
                  </label>
                  <div
                    onClick={() => setReceiptFileName("receipt_invoice_scan_" + Math.floor(100 + Math.random() * 900) + ".pdf")}
                    className="cursor-pointer flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-hairline)] bg-[var(--bg-surface-elevated)] p-5 hover:bg-[var(--accent-gold-light)]/20 transition-colors"
                  >
                    <UploadCloud className="h-6 w-6 text-[var(--accent-gold)] mb-1.5" />
                    {receiptFileName ? (
                      <span className="font-mono text-xs text-emerald-500 font-medium">✓ Attached: {receiptFileName}</span>
                    ) : (
                      <>
                        <span className="font-mono text-[11px] text-[var(--text-display)]">Click to attach file or drop receipt here</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-mono mt-0.5">SHA-256 fingerprint verified upon upload</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-hairline)]">
                  <button type="button" onClick={() => setIsNewClaimOpen(false)} className="luxury-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="luxury-btn-primary">
                    Submit to Manager
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
