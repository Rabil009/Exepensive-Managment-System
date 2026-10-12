"use client";

import React from "react";
import { AppShell } from "../../shared/layout/AppShell";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { SummaryMetrics } from "./components/SummaryMetrics";
import { SpendingOverview } from "./components/SpendingOverview";
import { CardAndChecklist } from "./components/CardAndChecklist";
import { FundingSplit } from "./components/FundingSplit";
import { AnalyticsInsights } from "./components/AnalyticsInsights";
import { useEmployeeAnalytics } from "./data/useEmployeeAnalytics";
import { Spiral } from "@/components/ui/spiral";

export default function AnalyticsPage() {
  const model = useEmployeeAnalytics();
  return (
    <AppShell active="Analytics">
      {model.loading && !model.data ? (
        <div className="w-full h-full min-h-[calc(100vh-160px)] flex items-center justify-center">
          <Spiral className="size-10 text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-6 pb-12">
          <AnalyticsHeader model={model} />
          {model.error && (
            <div role="alert" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
              <span>{model.error}</span>
              <button onClick={model.refresh} className="underline font-semibold ml-2 hover:opacity-80">Retry</button>
            </div>
          )}
          <SummaryMetrics data={model.data} />
          <SpendingOverview data={model.data} />
          <CardAndChecklist data={model.data} />
          <FundingSplit data={model.data} />
          <AnalyticsInsights data={model.data} />
        </div>
      )}
    </AppShell>
  );
}
