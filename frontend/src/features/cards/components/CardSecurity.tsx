"use client";

import React from "react";
import {
  Smartphone,
  Globe,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";
const controls = [
  { name: "Mobile Wallet", enabled: "Wallet enabled", disabled: "Wallet disabled" },
  { name: "Travel Location Limits", enabled: "Travel restrictions on", disabled: "Travel restrictions off" },
  { name: "Online Payment Verification", enabled: "Verification on", disabled: "Verification off" },
  { name: "ATM Withdrawal Lock", enabled: "Cash lock active", disabled: "Cash lock off" },
];

type Props = { model: Pick<CardControlsModel, "state" | "update" | "card"> };

function getControlIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wallet")) return Smartphone;
  if (n.includes("travel")) return Globe;
  if (n.includes("online") || n.includes("verification")) return ShieldCheck;
  return Banknote;
}

export function CardSecurity({ model }: Props) {
  const { state, update, card } = model;
  const activeCount = state.controls.filter(Boolean).length;

  return (
    <section className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200/60 dark:border-white/[0.06] gap-2 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Card Security &amp; Controls
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time authorization rules and spending channel permissions.
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 text-xs font-medium border border-zinc-200/80 dark:border-white/[0.08] tabular-nums">
          {activeCount} of 4 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {controls.map((item, index) => {
          const Icon = getControlIcon(item.name);
          const isEnabled = state.controls[index];

          return (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 p-3 bg-zinc-50/70 dark:bg-[#161619] rounded-lg border border-zinc-200/70 dark:border-white/[0.06]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-md bg-white dark:bg-[#111113] border border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <strong className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.name}
                  </strong>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {isEnabled ? item.enabled : item.disabled}
                  </span>
                </div>
              </div>

              {/* iOS / Linear style Toggle Switch */}
              <button
                type="button"
                disabled={!card}
                role="switch"
                aria-label={item.name}
                aria-checked={isEnabled}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center ${
                  isEnabled
                    ? "bg-[#3B9B78] justify-end"
                    : "bg-zinc-300 dark:bg-zinc-700 justify-start"
                }`}
                onClick={() =>
                  void update({
                    ...state,
                    controls: state.controls.map((value, position) =>
                      position === index ? !value : value,
                    ),
                  })
                }
              >
                <span className={`w-4 h-4 rounded-full shadow-xs pointer-events-none ${
                  isEnabled ? "bg-white" : "bg-white dark:bg-[#111113]"
                }`} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default CardSecurity;
