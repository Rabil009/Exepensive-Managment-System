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

export default function AnalyticsPage() {
  const model = useEmployeeAnalytics();
  return (
    <AppShell active="Analytics">
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
    </AppShell>
  );
}
