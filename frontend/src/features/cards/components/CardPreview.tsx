"use client";

import { Power, CreditCard } from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";

export function CardPreview({ model }: { model: Pick<CardControlsModel, "card" | "cards" | "requests" | "state" | "update"> }) {
  const { card, cards, requests, state, update } = model;
  return <div className="min-w-0 flex flex-col gap-3">
    {card ? <>
      <div className={`aura-physical-card flex flex-col justify-between ${state.frozen || !state.active ? "opacity-60 grayscale" : ""}`}>
        <div className="flex justify-between text-white text-xs font-semibold tracking-widest"><span>PAYOUT</span><span>{card.kind}</span></div>
        <div className="text-white font-mono text-xl tracking-widest">•••• •••• •••• {card.last4 || "••••"}</div>
        <div className="flex justify-between text-white text-xs"><strong>{card.display_name}</strong><span>{card.network || "Corporate card"}</span></div>
      </div>
      <div className="rounded-xl p-4 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-600 dark:text-zinc-400">Card status: <strong>{!state.active ? "Inactive" : state.frozen ? "Frozen" : "Active"}</strong></span>
        <button type="button" onClick={() => void update({ ...state, active: !state.active, frozen: state.active ? state.frozen : false })}
          className="h-8 px-3 rounded-lg border text-xs font-medium dark:border-white/[0.08] inline-flex items-center gap-1.5 cursor-pointer">
          <Power className="h-3.5 w-3.5" />{state.active ? "Deactivate" : "Activate"}
        </button>
      </div>
      {cards.slice(1).map((other) => <div key={other.id} className="rounded-xl p-3 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] flex items-center gap-2 text-xs"><CreditCard className="h-4 w-4" />{other.display_name} · ••{other.last4 || "••••"}</div>)}
    </> : <div className="rounded-xl p-6 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] text-sm text-zinc-500">No corporate card is assigned yet. You can request a virtual card.</div>}
    {requests.length > 0 && (
      <section className="rounded-xl p-4 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-white/[0.06]">
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Card &amp; Limit Requests
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Reviewed &amp; authorized by Manager and Finance Treasury.
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300">
            {requests.length} {requests.length === 1 ? "request" : "requests"}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-zinc-200/50 dark:divide-white/[0.04]">
          {requests.map((request) => {
            const isApproved = (request.status || "").toUpperCase().includes("APPROV");
            const isRejected = (request.status || "").toUpperCase().includes("REJECT");

            return (
              <div key={request.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {request.request_type === "VIRTUAL_CARD"
                        ? request.card_name || "Virtual Corporate Card"
                        : "Limit Increase Request"}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Requested: ₹{Number(request.requested_limit).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="shrink-0">
                  {isApproved ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300">
                      Approved &amp; Active
                    </span>
                  ) : isRejected ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300 animate-pulse">
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    )}
  </div>;
}

export default CardPreview;
