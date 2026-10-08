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
          className="h-8 px-3 rounded-lg border text-xs font-medium dark:border-white/[0.08] inline-flex items-center gap-1.5">
          <Power className="h-3.5 w-3.5" />{state.active ? "Deactivate" : "Activate"}
        </button>
      </div>
      {cards.slice(1).map((other) => <div key={other.id} className="rounded-xl p-3 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] flex items-center gap-2 text-xs"><CreditCard className="h-4 w-4" />{other.display_name} · ••{other.last4 || "••••"}</div>)}
    </> : <div className="rounded-xl p-6 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07] text-sm text-zinc-500">No corporate card is assigned yet. You can request a virtual card.</div>}
    {requests.length > 0 && <section className="rounded-xl p-4 border bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.07]"><h2 className="text-sm font-semibold mb-2">Card Requests</h2>{requests.map((request) => <p key={request.id} className="text-xs text-zinc-500 py-1">{request.request_type === "VIRTUAL_CARD" ? `Virtual card: ${request.card_name}` : "Limit increase"} · ₹{Number(request.requested_limit).toLocaleString("en-IN")} · {request.status}</p>)}</section>}
  </div>;
}

export default CardPreview;
