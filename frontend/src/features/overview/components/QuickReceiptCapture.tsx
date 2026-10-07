"use client";

import React from "react";
import { ScanLine, Upload } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

type Props = { onUpload: () => void };

export function QuickReceiptCapture({ onUpload }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`rounded-xl px-5 py-4 border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDark
          ? "bg-[#111113] border-white/[0.07]"
          : "bg-white border-zinc-200/80 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${
            isDark
              ? "bg-[#18181D] border-white/[0.08] text-zinc-200"
              : "bg-zinc-100 border-zinc-200/80 text-zinc-700"
          }`}
        >
          <ScanLine className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Add an Expense Receipt
            </h2>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                isDark
                  ? "bg-white/[0.06] border-white/[0.08] text-zinc-400"
                  : "bg-zinc-100 border-zinc-200 text-zinc-600"
              }`}
            >
              Receipt Upload
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Upload a receipt, then review and enter your expense details.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <label
          className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
            isDark
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-black text-white hover:bg-zinc-800"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload File</span>
          <input
            accept=".pdf,image/*"
            aria-label="Quick receipt upload"
            className="hidden"
            type="file"
            onChange={(event) => {
              if (event.target.files?.[0]) {
                onUpload();
                event.target.value = "";
              }
            }}
          />
        </label>
      </div>
    </section>
  );
}
export default QuickReceiptCapture;
