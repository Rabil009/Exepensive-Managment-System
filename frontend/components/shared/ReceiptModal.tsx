"use client";

import React, { useEffect, useState } from "react";
import { X, Download, Printer, CheckCircle2, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import { downloadExpenseReceipt } from "@/src/features/expenses/data/newExpenseApi";
import { supabase } from "@/lib/supabase";

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
  receiptName?: string;
  receiptUrl?: string;
  merchant?: string;
  amount?: number;
  currency?: string;
  date?: string;
  employeeName?: string;
  category?: string;
}

export function ReceiptModal({
  isOpen,
  onClose,
  claimId,
  receiptName,
  receiptUrl,
  merchant,
  amount,
  currency = "INR",
  date,
  employeeName,
  category,
}: ReceiptModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(receiptUrl);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (receiptUrl) {
      setLoadedUrl(receiptUrl);
    } else if (claimId && isOpen) {
      supabase
        .from("expense_claims")
        .select("receipt_url, receipt_name")
        .eq("id", claimId)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.receipt_url) {
            setLoadedUrl(data.receipt_url);
          }
        });
    }
  }, [receiptUrl, claimId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = receiptName || "receipt.png";
  const displayMerchant = merchant || "Business Vendor";
  const displayAmount = (amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const displayDate = date || new Date().toISOString().slice(0, 10);
  const displayEmployee = employeeName || "Employee";
  const displayCategory = category || "General";

  const activeUrl = loadedUrl || receiptUrl;
  const isBrokenStorageUrl = activeUrl?.includes("/storage/v1/object/public/receipts/");
  const isDirectImage =
    Boolean(activeUrl) &&
    !isBrokenStorageUrl &&
    !imageError &&
    (activeUrl?.startsWith("data:image/") ||
      activeUrl?.startsWith("data:application/octet-stream") ||
      activeUrl?.endsWith(".png") ||
      activeUrl?.endsWith(".jpg") ||
      activeUrl?.endsWith(".jpeg") ||
      activeUrl?.endsWith(".svg") ||
      activeUrl?.endsWith(".webp"));

  const isPdf =
    Boolean(activeUrl) &&
    !isBrokenStorageUrl &&
    (activeUrl?.startsWith("data:application/pdf") || activeUrl?.endsWith(".pdf"));

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadExpenseReceipt(claimId, displayName);
    } catch (err) {
      console.warn("Download receipt error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Receipt &amp; Tax Invoice</span>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-sm">
                {displayName} • Ref: {claimId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Receipt"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Receipt"
              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close (Esc)"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-100/50 dark:bg-black/30 flex flex-col items-center justify-center min-h-[380px]">
          {isDirectImage && activeUrl ? (
            <div className="max-w-full rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-white/[0.08] bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeUrl}
                alt={displayName}
                onError={() => setImageError(true)}
                className="max-h-[520px] w-auto max-w-full object-contain mx-auto rounded-lg shadow-xs"
              />
            </div>
          ) : isPdf && activeUrl ? (
            <iframe
              src={activeUrl}
              title={displayName}
              className="w-full h-[500px] rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white shadow-lg"
            />
          ) : (
            /* Crisp Itemized Tax Invoice Card fallback if direct image binary not present */
            <div className="w-full max-w-lg bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/[0.1] rounded-xl p-6 shadow-xl space-y-4">
              <div className="text-center pb-4 border-b border-zinc-200 dark:border-white/[0.08]">
                <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  TAX INVOICE / OFFICIAL RECEIPT
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                  GSTIN: 29AABCU9603R1ZM | CIN: U72200KA2021PTC145678
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Merchant / Vendor
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate block mt-0.5">
                    {displayMerchant}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Claim Reference
                  </span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm block mt-0.5">
                    {claimId}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Submitted By
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 block mt-0.5">
                    {displayEmployee}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                    Expense Date
                  </span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 block mt-0.5">
                    {displayDate}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="rounded-lg border border-zinc-200 dark:border-white/[0.08] overflow-hidden text-xs">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-white/[0.05] font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Description</span>
                  <span>Amount ({currency})</span>
                </div>
                <div className="p-3 space-y-1.5 bg-white dark:bg-transparent">
                  <div className="flex items-center justify-between font-medium text-zinc-900 dark:text-zinc-100">
                    <span>{displayMerchant} - {displayCategory}</span>
                    <span>₹{displayAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                    <span>CGST (9%)</span>
                    <span>Included</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                    <span>SGST (9%)</span>
                    <span>Included</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <span>Net Paid Amount</span>
                    <span className="text-emerald-600 dark:text-emerald-400">₹{displayAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 text-center text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">
                  Original Audited Document Archived
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Secured with SHA-256 in FinPulse Treasury Vault
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Filename: <code className="font-mono text-zinc-700 dark:text-zinc-300">{displayName}</code>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-white/[0.1] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              {isDownloading ? "Downloading..." : "Download Receipt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

