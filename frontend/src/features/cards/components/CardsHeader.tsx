"use client";

import React from "react";
import { Lock, Unlock, ArrowUpRight, Plus } from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";

type Props = {
  model: Pick<
    CardControlsModel,
    "state" | "update" | "setRevealed" | "openDialog"
  >;
};

export function CardsHeader({ model }: Props) {
  const { state, update, setRevealed, openDialog } = model;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Cards &amp; Spending Limits
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage your corporate cards, adjust monthly limits, and configure card security controls.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Freeze/Unfreeze Button */}
        <button
          type="button"
          aria-pressed={state.frozen}
          onClick={() => {
            update({ ...state, frozen: !state.frozen });
            setRevealed(false);
          }}
          className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
            state.frozen
              ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300"
              : "bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D]"
          }`}
        >
          {state.frozen ? (
            <Unlock className="h-3.5 w-3.5" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-zinc-400" />
          )}
          <span>{state.frozen ? "Unfreeze Card" : "Freeze Card"}</span>
        </button>

        {/* Request Limit Increase */}
        <button
          type="button"
          onClick={() => openDialog("limit")}
          className="h-8 px-3 rounded-lg border text-xs font-medium bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          <span>Request Limit Increase</span>
        </button>

        {/* Create Virtual Card */}
        <button
          type="button"
          onClick={() => openDialog("virtual")}
          className="h-8 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Virtual Card</span>
        </button>
      </div>
    </div>
  );
}
export default CardsHeader;
