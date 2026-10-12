"use client";

import React from "react";
import { Power, CreditCard, Clock, XCircle, CheckCircle2 } from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";

export function CardPreview({
  model,
}: {
  model: Pick<CardControlsModel, "card" | "cards" | "requests" | "state" | "update">;
}) {
  const { card, requests, state, update } = model;

  // UX Requirement: Remove approved requests from the requests box so space is managed cleanly
  const activeRequests = requests.filter(
    (r) => !(r.status || "").toUpperCase().includes("APPROV")
  );

  return (
    <div className="min-w-0 flex flex-col gap-3">
      {card ? (
        <>
          {/* Single Compact Active Card */}
          <div
            className={`aura-physical-card flex flex-col justify-between ${
              state.frozen || !state.active ? "opacity-60 grayscale" : ""
            }`}
          >
            <div className="flex justify-between items-center text-white text-[11px] font-semibold tracking-widest">
              <span>PAYOUT</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 uppercase tracking-wider">
                {card.kind}
              </span>
            </div>
            <div className="text-white font-mono text-lg tracking-widest my-2.5">
              •••• •••• •••• {card.last4 || "••••"}
            </div>
            <div className="flex justify-between items-end text-white text-[11px]">
              <div>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Cardholder</p>
                <strong className="font-semibold text-xs">{card.display_name}</strong>
              </div>
              <span className="text-xs text-zinc-300 font-medium">
                {card.network || "Corporate card"}
              </span>
            </div>
          </div>

          {/* Compact Card Status Strip */}
          <div className="rounded-xl px-3.5 py-2.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  !state.active
                    ? "bg-zinc-400"
                    : state.frozen
                    ? "bg-amber-400"
                    : "bg-emerald-500"
                }`}
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                Card Status:{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {!state.active ? "Inactive" : state.frozen ? "Frozen" : "Active"}
                </strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                void update({
                  ...state,
                  active: !state.active,
                  frozen: state.active ? state.frozen : false,
                })
              }
              className={`h-7 px-2.5 rounded-md border text-[11px] font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                state.active
                  ? "border-zinc-200 dark:border-white/[0.08] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-zinc-600 dark:text-zinc-300"
                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
              }`}
            >
              <Power className="h-3 w-3" />
              <span>{state.active ? "Deactivate" : "Activate"}</span>
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] text-xs text-zinc-500">
          No corporate card is assigned yet. You can request a virtual card above.
        </div>
      )}

      {/* Card & Limit Requests (Only Pending / Rejected shown, Approved is removed to save space) */}
      {activeRequests.length > 0 && (
        <section className="rounded-xl p-3.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.06]">
            <div>
              <h2 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Pending Requests
              </h2>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                Awaiting authorization from Manager &amp; Finance
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {activeRequests.length} pending
            </span>
          </div>

          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-white/[0.04]">
            {activeRequests.map((request) => {
              const isRejected = (request.status || "").toUpperCase().includes("REJECT");

              return (
                <div
                  key={request.id}
                  className="py-2 flex items-center justify-between gap-2.5 text-xs"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3 text-zinc-400 shrink-0" />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-[11.5px]">
                        {request.request_type === "VIRTUAL_CARD"
                          ? request.card_name || "Virtual Card"
                          : "Limit Increase"}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Requested: ₹{Number(request.requested_limit).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isRejected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-rose-500/10 text-rose-600 border border-rose-500/25">
                        <XCircle className="h-3 w-3" />
                        <span>Declined</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>In Review</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default CardPreview;
