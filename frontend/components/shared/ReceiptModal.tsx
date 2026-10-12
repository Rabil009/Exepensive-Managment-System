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

  const displayName = loadedName || receiptName || "receipt.png";
  const activeUrl = loadedUrl || receiptUrl;

  const isBrokenStorageUrl = Boolean(
    activeUrl?.includes("/storage/v1/object/public/receipts/") &&
      !activeUrl?.startsWith("data:")
  );

  const isPdf =
    Boolean(activeUrl) &&
    !isBrokenStorageUrl &&
    (activeUrl?.startsWith("data:application/pdf") ||
      /\.pdf(\?.*)?$/i.test(activeUrl || ""));

  const isDirectImage =
    Boolean(activeUrl) &&
    !isBrokenStorageUrl &&
    !isPdf &&
    !imageError &&
    (activeUrl?.startsWith("data:") ||
      activeUrl?.startsWith("blob:") ||
      /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(activeUrl || "") ||
      activeUrl?.startsWith("http"));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await fileToDataUrl(file);
      setLoadedUrl(dataUrl);
      setLoadedName(file.name);
      setImageError(false);

      if (claimId) {
        await supabase
          .from("expense_claims")
          .update({
            receipt_url: dataUrl,
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
      if (activeUrl && activeUrl.startsWith("data:")) {
        const parts = activeUrl.split(",");
        const header = parts[0];
        const base64 = parts[1];
        const mime =
          header.split(";")[0].replace("data:", "") || "application/octet-stream";
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mime });
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
                {isDirectImage || isPdf ? (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Uploaded File
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Action Required
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 border border-emerald-500/20 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{isUploading ? "Uploading..." : "Replace File"}</span>
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
              disabled={isDownloading || (!isDirectImage && !isPdf)}
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
                <span>Showing exact uploaded receipt image</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                >
                  Change image
                </button>
              </div>
            </div>
          ) : isPdf && activeUrl ? (
            <iframe
              src={activeUrl}
              title={displayName}
              className="w-full h-[500px] rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white shadow-lg"
            />
          ) : (
            /* Clean Upload Box when no authentic image is attached */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md p-8 border-2 border-dashed border-zinc-300 dark:border-white/[0.15] hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/70 dark:bg-[#18181b]/70 shadow-sm"
            >
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
                <Upload className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {imageError
                  ? "Receipt image failed to render"
                  : "No receipt file uploaded yet"}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
                Click here to browse and upload the authentic receipt image or PDF
                for claim <code className="font-mono text-zinc-700 dark:text-zinc-300">{claimId}</code>.
              </p>
              <button
                type="button"
                disabled={isUploading}
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{isUploading ? "Uploading..." : "Browse Receipt File"}</span>
              </button>
            </div>
          )}
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
              disabled={isDownloading || (!isDirectImage && !isPdf)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              {isDownloading ? "Downloading..." : "Download File"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
