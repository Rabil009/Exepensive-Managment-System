"use client";

import React from "react";
import { UploadCloud, FileCheck, FileText, Sparkles } from "lucide-react";
import { Spiral } from "@/components/ui/spiral";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";

type Props = {
  model: Pick<
    ExpenseFormModel,
    | "draft"
    | "preview"
    | "dragging"
    | "setDragging"
    | "attach"
    | "inputRef"
    | "scanning"
    | "scanNotice"
  >;
};

export function ReceiptCapture({ model }: Props) {
  const {
    draft,
    preview,
    dragging,
    setDragging,
    attach,
    inputRef,
    scanning,
    scanNotice,
  } = model;

  const hasReceipt = Boolean(draft.receipt);

  return (
    <div className="rounded-xl p-5 border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#111113] shadow-xs flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Receipt Attachment
          </h2>
        </div>
        {scanning ? (
          <span className="px-2.5 py-0.5 rounded-md border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 flex items-center justify-center">
            <Spiral className="size-3 text-blue-600 dark:text-blue-400" />
          </span>
        ) : hasReceipt ? (
          <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Attached &amp; Scanned</span>
          </span>
        ) : (
          <span className="text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#18181D] text-zinc-500">
            Optional
          </span>
        )}
      </div>

      {/* Modernized Clean Dropzone */}
      <div
        className={`relative rounded-lg p-6 sm:p-7 border-2 border-dashed transition-all group flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
          dragging
            ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20"
            : "border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#141418] hover:border-zinc-400 dark:hover:border-zinc-600"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files?.[0]) {
            attach(event.dataTransfer.files[0]);
          }
        }}
      >
        {preview ? (
          <div className="relative my-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`max-h-[170px] max-w-full rounded-lg border border-zinc-200 dark:border-white/[0.08] shadow-xs object-contain transition-opacity ${
                scanning ? "opacity-40" : "opacity-100"
              }`}
              src={preview}
              alt="Receipt preview"
            />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg backdrop-blur-2xs">
                <Spiral className="size-6 text-emerald-400" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-zinc-200/70 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-2 shadow-2xs">
            {scanning ? (
              <Spiral className="size-5 text-blue-500" />
            ) : hasReceipt ? (
              <FileCheck className="h-5 w-5 text-emerald-600" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>
        )}

        <div className="flex flex-col gap-0.5 max-w-xs">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[260px]">
            {draft.receipt || "Drag and drop your receipt"}
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {scanning
              ? "Scanning document & auto-filling form..."
              : hasReceipt
              ? "Click to change or replace file"
              : "Drop receipt (PDF, PNG, JPG) to auto-fill details"}
          </p>
        </div>

        <div className="mt-3">
          <button
            type="button"
            className="h-7 px-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <UploadCloud className="h-3 w-3" />
            <span>{hasReceipt ? "Change File" : "Browse Files"}</span>
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          aria-label="Upload receipt"
          accept=".pdf,.png,.jpg,.jpeg,.heic"
          hidden
          onChange={(event) => {
            if (event.target.files?.[0]) {
              attach(event.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}

export default ReceiptCapture;
