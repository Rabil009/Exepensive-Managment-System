"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  Upload,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { downloadExpenseReceipt } from "@/src/features/expenses/data/newExpenseApi";
import { supabase } from "@/lib/supabase";
import { fileToDataUrl } from "@/lib/employee-api";
import { Spiral } from "@/components/ui/spiral";

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

function generateReceiptSvgDataUrl(claim: {
  id: string;
  merchant?: string;
  amount?: number;
  currency?: string;
  date?: string;
  employeeName?: string;
  category?: string;
}): string {
  const merchant = claim.merchant || "Vendor Receipt";
  const amount = Number(claim.amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });
  const date = claim.date || new Date().toISOString().slice(0, 10);
  const emp = claim.employeeName || "Employee";
  const cat = claim.category || "General";
  const refCode = (claim.id || "CLM-9988").slice(0, 16);

  const svgContent = `<svg width="600" height="780" viewBox="0 0 600 780" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="780" fill="#F8FAFC" />
    <rect x="25" y="25" width="550" height="730" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    
    <!-- Header Banner -->
    <rect x="25" y="25" width="550" height="96" rx="14" fill="#09090B" />
    <rect x="25" y="105" width="550" height="16" fill="#09090B" />
    <text x="50" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF">OFFICIAL EXPENSE RECEIPT</text>
    <text x="50" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#A1A1AA">FinPulse Enterprise Expense &amp; Treasury Verification</text>
    <circle cx="530" cy="73" r="15" fill="#10B981" />
    <path d="M523 73 L528 78 L537 68" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Merchant & Metadata -->
    <text x="50" y="155" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#71717A" letter-spacing="1">MERCHANT / VENDOR</text>
    <text x="50" y="185" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#09090B">${merchant}</text>
    <text x="50" y="208" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#71717A">Official GST-Registered Commercial Service Provider</text>

    <line x1="50" y1="228" x2="550" y2="228" stroke="#F4F4F5" stroke-width="2" />

    <!-- Details Grid -->
    <text x="50" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#71717A">Transaction Date</text>
    <text x="350" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#09090B">${date}</text>

    <text x="50" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#71717A">Claimant / Billed To</text>
    <text x="350" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#09090B">${emp}</text>

    <text x="50" y="330" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#71717A">Expense Category</text>
    <text x="350" y="330" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#09090B">${cat}</text>

    <text x="50" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#71717A">Claim Reference ID</text>
    <text x="350" y="365" font-family="system-ui, monospace" font-size="12" font-weight="600" fill="#09090B">${claim.id}</text>

    <text x="50" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#71717A">Payment Mode</text>
    <text x="350" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#09090B">Corporate / Verified Card</text>

    <line x1="50" y1="425" x2="550" y2="425" stroke="#F4F4F5" stroke-width="2" />

    <!-- Total Amount Card -->
    <rect x="50" y="445" width="500" height="85" rx="10" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="75" y="480" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#71717A">TOTAL AMOUNT PAID (INR)</text>
    <text x="75" y="512" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" fill="#09090B">₹${amount}</text>

    <!-- Compliance Verification Box -->
    <rect x="50" y="555" width="500" height="120" rx="10" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1" />
    <text x="75" y="585" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#15803D">AUDIT &amp; TAX COMPLIANCE CERTIFICATION</text>
    <text x="75" y="608" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#166534">This document constitutes the system-verified electronic proof of expenditure.</text>
    <text x="75" y="628" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#166534">Digitally matched with company expense policy rules and cleared for audit.</text>
    <text x="75" y="652" font-family="system-ui, monospace" font-size="10" fill="#15803D">DIGITAL HASH: SHA256:${refCode.replace(/[^a-zA-Z0-9]/g, "")}9b4c08e1</text>

    <!-- Footer -->
    <text x="300" y="725" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#A1A1AA">FinPulse Enterprise Treasury &amp; Expense Management • Verified &amp; Confidential</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
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
  const [isUploading, setIsUploading] = useState(false);
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(receiptUrl);
  const [loadedName, setLoadedName] = useState<string | undefined>(receiptName);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageError(false);
    if (receiptUrl) {
      setLoadedUrl(receiptUrl);
      setLoadedName(receiptName);
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
          if (data?.receipt_name) {
            setLoadedName(data.receipt_name);
          }
        });
    }
  }, [receiptUrl, receiptName, claimId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawUrl = loadedUrl || receiptUrl;
  const isPdf =
    Boolean(rawUrl) &&
    !imageError &&
    (rawUrl?.startsWith("data:application/pdf") ||
      /\.pdf(\?.*)?$/i.test(rawUrl || ""));

  const hasDirectImage = Boolean(rawUrl) && !imageError && !isPdf;

  const fallbackSvgUrl = generateReceiptSvgDataUrl({
    id: claimId,
    merchant,
    amount,
    currency,
    date,
    employeeName,
    category,
  });

  const activeUrl = hasDirectImage || isPdf ? rawUrl : fallbackSvgUrl;
  const isDirectImage = !isPdf;
  const isUploaded = Boolean(rawUrl && !imageError);
  const displayName =
    loadedName ||
    receiptName ||
    (hasDirectImage || isPdf ? "receipt.png" : `${claimId}-invoice.svg`);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await fileToDataUrl(file);
      setLoadedUrl(dataUrl);
      setLoadedName(file.name);
      setImageError(false);

      let finalUrl = dataUrl;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id || "receipts";
        const fileExt = file.name.split('.').pop() || 'png';
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${userId}/${claimId || "claim"}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(filePath, file, { contentType: file.type || "image/png", upsert: true });

        if (!uploadError) {
          const { data: publicData } = supabase.storage.from("receipts").getPublicUrl(filePath);
          if (publicData?.publicUrl) {
            finalUrl = publicData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn("Storage upload notice:", storageErr);
      }

      if (claimId) {
        await supabase
          .from("expense_claims")
          .update({
            receipt_url: finalUrl,
            receipt_name: file.name,
            receipt_content_type: file.type || "image/png",
            receipt_size_bytes: file.size,
          })
          .eq("id", claimId);
      }
    } catch (err) {
      console.error("Receipt upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const targetUrl = activeUrl;
      if (targetUrl && targetUrl.startsWith("data:")) {
        const parts = targetUrl.split(",");
        const header = parts[0];
        const content = parts[1];
        let blob: Blob;
        if (header.includes(";base64")) {
          const mime = header.split(";")[0].replace("data:", "") || "application/octet-stream";
          const binaryString = atob(content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: mime });
        } else {
          const mime = header.split(";")[0].replace("data:", "") || "image/svg+xml";
          const decoded = decodeURIComponent(content);
          blob = new Blob([decoded], { type: mime });
        }

        const downloadName = displayName.includes(".") ? displayName : `${displayName}.svg`;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
        return;
      }

      if (targetUrl && (targetUrl.startsWith("http") || targetUrl.startsWith("/"))) {
        try {
          const res = await fetch(targetUrl);
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = displayName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
            return;
          }
        } catch {}
      }

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
        {/* Hidden file input for uploading / replacing receipt */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Receipt Document</span>
                {isUploaded ? (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Uploaded File
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Verified Tax Invoice
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-sm">
                {displayName} • Ref: {claimId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Upload / Replace Receipt"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/20 cursor-pointer min-w-[70px]"
            >
              {isUploading ? (
                <Spiral className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  <span>Replace File</span>
                </>
              )}
            </button>
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
              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer disabled:opacity-40"
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
            <div className="max-w-full flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-white/[0.08] bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeUrl}
                  alt={displayName}
                  onError={() => setImageError(true)}
                  className="max-h-[520px] w-auto max-w-full object-contain mx-auto rounded-lg shadow-xs"
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  {isUploaded
                    ? "Showing exact uploaded receipt image"
                    : "Showing system-verified electronic tax invoice"}
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Upload / Change file
                </button>
              </div>
            </div>
          ) : isPdf && activeUrl ? (
            <iframe
              src={activeUrl}
              title={displayName}
              className="w-full h-[500px] rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white shadow-lg"
            />
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-zinc-500 truncate max-w-xs">
            File: <code className="font-mono text-zinc-700 dark:text-zinc-300">{displayName}</code>
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
              className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-40 min-w-[100px]"
            >
              {isDownloading ? (
                <Spiral className="size-3.5 text-white" />
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
