"use client";

import React from "react";
import { Eye, EyeOff, KeyRound, Wallet, ShieldCheck, CreditCard } from "lucide-react";
import { CardStack } from "./CardStack";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<
    CardControlsModel,
    "state" | "revealed" | "setRevealed" | "setMessage"
  >;
};

export function CardPreview({ model }: Props) {
  const { state, revealed, setRevealed, setMessage } = model;

  return (
    <div className="min-w-0 flex flex-col gap-3">
      {/* 3D / Stacked Card Preview */}
      <CardStack>
        <div
          className={`aura-physical-card ${
            state.frozen ? "frozen opacity-60 grayscale" : ""
          }`}
        >
          {/* Card Top: Chip + Contactless + Brand */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="aura-card-chip">
                <i />
                <i />
                <i />
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8.5 16.5a5 5 0 0 1 0-7M12 18.5a8 8 0 0 0 0-11M15.5 20.5a11 11 0 0 0 0-15" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 font-bold tracking-widest text-xs text-white">
              <span>PAYOUT</span>
              <span className="text-[10px] font-mono text-zinc-400">CORP</span>
            </div>
          </div>

          {/* Card Middle: PAN */}
          <div className="relative z-10 my-auto py-2">
            <span className="font-mono text-lg sm:text-xl font-medium tracking-widest text-white tabular-nums drop-shadow-sm">
              {revealed ? "4921  8400  1294  3820" : "4921  8400  12••  ••••"}
            </span>
          </div>

          {/* Card Bottom: Holder + Expiry + Visa */}
          <div className="relative z-10 flex items-end justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                Cardholder
              </span>
              <strong className="text-xs sm:text-sm font-semibold tracking-wider text-white uppercase">
                RABIL KHAN
              </strong>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                  Expires
                </span>
                <span className="text-xs font-semibold text-white tabular-nums">
                  09/28
                </span>
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white">
                VISA
              </span>
            </div>
          </div>
        </div>
      </CardStack>

      {/* Card Controls Action Bar */}
      <div className="rounded-xl p-4 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Show/Hide Details */}
          <button
            type="button"
            aria-pressed={revealed}
            onClick={() => setRevealed((value) => !value)}
            className="h-8 px-2.5 rounded-lg border text-xs font-medium bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {revealed ? (
              <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span className="truncate">{revealed ? "Hide Details" : "Show Details"}</span>
          </button>

          {/* Reset PIN */}
          <button
            type="button"
            onClick={() =>
              setMessage("PIN reset is unavailable for sample corporate cards.")
            }
            className="h-8 px-2.5 rounded-lg border text-xs font-medium bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
            <span className="truncate">Reset PIN</span>
          </button>

          {/* Apple Wallet */}
          <button
            type="button"
            onClick={() =>
              setMessage("Adding to digital wallet is managed via organization admin.")
            }
            className="h-8 px-2.5 rounded-lg border text-xs font-medium bg-white dark:bg-[#18181D] border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Wallet className="h-3.5 w-3.5 text-zinc-400" />
            <span className="truncate">Apple Wallet</span>
          </button>
        </div>

        {/* Card Status & Protection Footer */}
        <div className="pt-2.5 border-t border-zinc-200/60 dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                state.frozen ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
            <span className="text-zinc-500 dark:text-zinc-400">
              Card Status:{" "}
              <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">
                {state.frozen
                  ? "Frozen · Temporarily Paused"
                  : "Active · Physical Card"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Protected</span>
          </div>
        </div>
      </div>

      {/* Virtual Cards List */}
      {state.virtualCards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl p-3.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <strong className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {card.name}
              </strong>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Virtual Card · ••{card.last4}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {money(card.limit)} limit
          </span>
        </div>
      ))}
    </div>
  );
}
export default CardPreview;
