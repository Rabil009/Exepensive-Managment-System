"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Upload,
  FileText,
  AlertTriangle,
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
          } else {
            setLoadedUrl(undefined);
          }
          if (data?.receipt_name) {
            setLoadedName(data.receipt_name);
          }
        });
    } else {
      setLoadedUrl(undefined);
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
  const hasReceipt = Boolean(rawUrl && !imageError);

  const isPdf =
    hasReceipt &&
    (rawUrl?.startsWith("data:application/pdf") ||
      /\.pdf(\?.*)?$/i.test(rawUrl || ""));

  const isDirectImage = hasReceipt && !isPdf;

  const displayName =
    loadedName ||
    receiptName ||
    (isPdf ? "receipt.pdf" : isDirectImage ? "receipt.png" : "No receipt attached");

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
    if (!hasReceipt || !rawUrl) return;

    try {
      setIsDownloading(true);
      if (rawUrl.startsWith("data:")) {
        const parts = rawUrl.split(",");
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

        const downloadName = displayName.includes(".") ? displayName : `${displayName}.png`;
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

      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        try {
          const resp = await fetch(rawUrl);
          if (resp.ok) {
            const blob = await resp.blob();
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
    if (hasReceipt) {
      window.print();
    }
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
            <div
              className={`p-2 rounded-lg ${
                hasReceipt
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {hasReceipt ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Receipt Document</span>
                {hasReceipt ? (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Receipt Attached
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Missing Receipt
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
              title={hasReceipt ? "Replace Receipt File" : "Upload Receipt Document"}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/20 cursor-pointer min-w-[70px]"
            >
              {isUploading ? (
                <Spiral className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  <span>{hasReceipt ? "Replace File" : "Upload File"}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              disabled={!hasReceipt}
              title={hasReceipt ? "Print Receipt" : "No receipt to print"}
              className={`p-2 rounded-lg transition-colors ${
                hasReceipt
                  ? "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] cursor-pointer"
                  : "text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-40"
              }`}
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasReceipt || isDownloading}
              title={hasReceipt ? "Download Receipt" : "No receipt to download"}
              className={`p-2 rounded-lg transition-colors ${
                hasReceipt
                  ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                  : "text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-40"
              }`}
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
          {isDirectImage && rawUrl ? (
            <div className="max-w-full flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-white/[0.08] bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rawUrl}
                  alt={displayName}
                  onError={() => setImageError(true)}
                  className="max-h-[520px] w-auto max-w-full object-contain mx-auto rounded-lg shadow-xs"
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>Original uploaded receipt file</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Upload / Replace file
                </button>
              </div>
            </div>
          ) : isPdf && rawUrl ? (
            <iframe
              src={rawUrl}
              title={displayName}
              className="w-full h-[500px] rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white shadow-lg"
            />
          ) : (
            /* Honest, professional Missing Receipt state */
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 ring-1 ring-amber-500/20">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                No receipt file uploaded yet
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
                This expense was claimed without compliant tax invoice or receipt proof.
              </p>
              {receiptName && (
                <div className="mb-4 px-2.5 py-1 rounded-md bg-zinc-200/60 dark:bg-white/[0.06] text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                  Referenced filename: <span className="text-zinc-900 dark:text-zinc-200 font-medium">{receiptName}</span> (File not stored)
                </div>
              )}
              <div className="w-full p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-white/[0.12] bg-white/50 dark:bg-white/[0.02] flex flex-col items-center gap-2 mt-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Upload compliant receipt to satisfy audit policy
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <Spiral className="size-4 text-white" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Receipt Proof</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-zinc-400">PNG, JPG, WebP or PDF (up to 10MB)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-zinc-500 truncate max-w-xs">
            {hasReceipt ? (
              <>File: <code className="font-mono text-zinc-700 dark:text-zinc-300">{displayName}</code></>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">Status: No receipt proof attached</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-300 dark:border-white/[0.1] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Close
            </button>
            {hasReceipt ? (
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
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs min-w-[100px]"
              >
                {isUploading ? (
                  <Spiral className="size-3.5 text-white" />
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Receipt</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
