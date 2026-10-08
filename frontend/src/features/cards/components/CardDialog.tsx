"use client";

import React from "react";
import { X } from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";

type Props = {
  model: Pick<
    CardControlsModel,
    | "dialogRef"
    | "dialogType"
    | "setDialogType"
    | "saveDialog"
    | "virtualName"
    | "setVirtualName"
    | "requestedAmount"
    | "setRequestedAmount"
    | "dialogError"
  >;
};

export function CardDialog({ model }: Props) {
  const {
    dialogRef,
    dialogType,
    setDialogType,
    saveDialog,
    virtualName,
    setVirtualName,
    requestedAmount,
    setRequestedAmount,
    dialogError,
  } = model;

  if (!dialogType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] shadow-2xl p-6">
        <form onSubmit={saveDialog} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {dialogType === "limit"
                ? "Request Limit Increase"
                : "Create Virtual Card"}
            </h3>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setDialogType(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Submit a request for your corporate Visa card account. Changes will update your active controls immediately.
          </p>

          {dialogType === "virtual" && (
            <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Card Purpose / Name
              <input
                autoFocus
                value={virtualName}
                onChange={(event) => setVirtualName(event.target.value)}
                placeholder="e.g. AWS Cloud Services"
                required
                className="h-9 px-3 rounded-lg border text-xs bg-zinc-50 dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {dialogType === "limit"
              ? "Requested Monthly Limit (INR)"
              : "Spending Limit (INR)"}
            <input
              type="number"
              min={dialogType === "limit" ? "7500.01" : "0.01"}
              step="0.01"
              value={requestedAmount}
              onChange={(event) => setRequestedAmount(event.target.value)}
              required
              className="h-9 px-3 rounded-lg border text-xs bg-zinc-50 dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 transition-all"
            />
          </label>

          {dialogError && (
            <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {dialogError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200/60 dark:border-white/[0.06]">
            <button
              type="button"
              className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              onClick={() => setDialogType(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Save {dialogType === "limit" ? "Request" : "Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CardDialog;
