"use client";

import { X } from "lucide-react";
import { AppShell } from "../../shared/layout/AppShell";
import { useCardControls } from "./hooks/useCardControls";
import { CardsHeader } from "./components/CardsHeader";
import { CardPreview } from "./components/CardPreview";
import { SpendingLimits } from "./components/SpendingLimits";
import { CardSecurity } from "./components/CardSecurity";
import { CardTransactions } from "./components/CardTransactions";
import { CardDialog } from "./components/CardDialog";
import "./styles/cards.css";

export default function CardsPage() {
  const model = useCardControls();

  return (
    <AppShell active="Cards & Limits">
      <div className="flex flex-col w-full gap-6">
        <CardsHeader model={model} />

        {model.message && (
          <div
            className="rounded-xl px-4 py-3 border bg-blue-50/70 border-blue-200/80 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-200 text-xs flex items-center justify-between gap-3 animate-in fade-in"
            role="status"
          >
            <span>{model.message}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => model.setMessage("")}
              className="p-1 rounded-md hover:bg-blue-200/50 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-6">
          <div className="lg:col-span-5 min-w-0 flex flex-col gap-6">
            <CardPreview model={model} />
            <CardSecurity model={model} />
          </div>
          <SpendingLimits model={model} />
        </div>

        <CardTransactions model={model} />
        <CardDialog model={model} />
      </div>
    </AppShell>
  );
}
