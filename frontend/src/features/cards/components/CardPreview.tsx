"use client";

import React, { useState } from "react";
import {
  Power,
  Eye,
  KeyRound,
  CreditCard,
  Clock,
  XCircle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import type { CardControlsModel } from "../hooks/useCardControls";

export function CardPreview({
  model,
}: {
  model: Pick<
    CardControlsModel,
    "card" | "requests" | "state" | "update" | "setMessage"
  >;
}) {
  const { card, requests, state, update, setMessage } = model;
  const [showDetails, setShowDetails] = useState(false);

  // Filter approved limit increase / virtual card requests
  const approvedRequests = requests.filter((r) =>
    (r.status || "").toUpperCase().includes("APPROV"),
  );

  // Filter pending or rejected requests
  const pendingRequests = requests.filter(
    (r) => !(r.status || "").toUpperCase().includes("APPROV"),
  );

  return (
    <div className="min-w-0 flex flex-col gap-3">
      {card ? (
        <>
          {/* Corporate card face */}
          <div
            className={`aura-physical-card ${
              state.frozen || !state.active
                ? "aura-physical-card--inactive"
                : ""
            } ${showDetails ? "aura-physical-card--details" : ""}`}
          >
            <div className="aura-card-header">
              <span className="aura-card-chip" aria-hidden="true">
                <span />
              </span>
              <strong
                className="aura-card-network"
                title={card.network || "Corporate card"}
              >
                {card.network?.toUpperCase().includes("VISA")
                  ? "VISA"
                  : card.network || "CARD"}
              </strong>
            </div>
            {showDetails ? (
              <div className="aura-card-revealed-details" aria-live="polite">
                <div>
                  <span>Card number</span>
                  <strong>
                    •••• &nbsp;•••• &nbsp;•••• &nbsp;{card.last4 || "----"}
                  </strong>
                </div>
                <div>
                  <span>Expiry date</span>
                  <strong>Not provided</strong>
                </div>
                <p>Full card number and expiry are not stored for security.</p>
              </div>
            ) : (
              <div className="aura-card-number" aria-label="Card number hidden">
                <span aria-hidden="true">****</span>
                <span aria-hidden="true">****</span>
                <span aria-hidden="true">****</span>
                <span aria-hidden="true">****</span>
              </div>
            )}
            <div className="aura-card-footer">
              <div className="aura-card-holder">
                <span>Card Holder name</span>
                <strong title={card.display_name}>{card.display_name}</strong>
              </div>
              <div className="aura-card-expiry">
                <span>Expiry Date</span>
                <strong>{showDetails ? "Not provided" : "--/--"}</strong>
              </div>
            </div>
          </div>

          {/* Compact Card Status Strip */}
          <div className="rounded-xl px-3.5 py-2.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
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
                  {!state.active
                    ? "Inactive"
                    : state.frozen
                      ? "Frozen"
                      : "Active"}
                </strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={showDetails}
                onClick={() => setShowDetails((current) => !current)}
                className="h-7 px-2.5 rounded-md border border-zinc-200 dark:border-white/[0.08] text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="h-3 w-3" />
                <span>{showDetails ? "Hide details" : "Show details"}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "PIN reset is not available in the app yet. Contact your card administrator to reset it.",
                  )
                }
                className="h-7 px-2.5 rounded-md border border-zinc-200 dark:border-white/[0.08] text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="h-3 w-3" />
                <span>Reset PIN</span>
              </button>
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
          </div>
        </>
      ) : (
        <div className="rounded-xl p-5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] text-xs text-zinc-500">
          No corporate card is assigned yet. You can request a virtual card
          above.
        </div>
      )}

      {/* Approved Limit Increase Section (Fills empty space with valuable limit increase info) */}
      <section className="rounded-xl p-3.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <div>
              <h2 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Approved Limits &amp; Increases
              </h2>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Authorized by Manager &amp; Finance Treasury
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {approvedRequests.length > 0
              ? `${approvedRequests.length} Approved`
              : "Active Limit"}
          </span>
        </div>

        {approvedRequests.length > 0 ? (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-white/[0.04]">
            {approvedRequests.map((req) => (
              <div
                key={req.id}
                className="py-2.5 flex items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-[11.5px]">
                      {req.request_type === "VIRTUAL_CARD"
                        ? req.card_name || "Virtual Card Limit"
                        : "Limit Increase Authorized"}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 pl-5">
                    Approved Limit:{" "}
                    <strong className="text-zinc-800 dark:text-zinc-200 font-semibold tabular-nums">
                      ₹{Number(req.requested_limit).toLocaleString("en-IN")}
                    </strong>
                  </span>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Applied &amp; Active</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Standard Assigned Limit
                </span>
                <p className="text-[10.5px] text-zinc-500">
                  Current: ₹
                  {Number(card?.monthly_limit || 100000).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
        )}
      </section>

      {/* Pending / In-Review Requests (if any) */}
      {pendingRequests.length > 0 && (
        <section className="rounded-xl p-3.5 border bg-white dark:bg-[#111113] border-zinc-200/80 dark:border-white/[0.07] shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-white/[0.06]">
            <div>
              <h2 className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Pending Requests
              </h2>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Awaiting authorization from Manager &amp; Finance
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {pendingRequests.length} pending
            </span>
          </div>

          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-white/[0.04]">
            {pendingRequests.map((request) => {
              const isRejected = (request.status || "")
                .toUpperCase()
                .includes("REJECT");

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
                      Requested: ₹
                      {Number(request.requested_limit).toLocaleString("en-IN")}
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
