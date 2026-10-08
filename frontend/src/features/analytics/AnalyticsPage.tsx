"use client";

import React from "react";
import { AppShell } from "../../shared/layout/AppShell";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { SummaryMetrics } from "./components/SummaryMetrics";
import { SpendingOverview } from "./components/SpendingOverview";
import { CardAndChecklist } from "./components/CardAndChecklist";
import { FundingSplit } from "./components/FundingSplit";
import { AnalyticsInsights } from "./components/AnalyticsInsights";
import "./styles/analytics.css";
import { useEmployeeAnalytics } from "./data/useEmployeeAnalytics";

export default function AnalyticsPage() {
  const model = useEmployeeAnalytics();
  return (
    <AppShell active="Analytics">
      <div className="flex flex-col w-full gap-6 pb-12">
        <AnalyticsHeader model={model} />
        {model.error && <p role="alert" className="text-sm text-rose-500">{model.error}</p>}
        <SummaryMetrics data={model.data} />
        <SpendingOverview data={model.data} />
        <CardAndChecklist data={model.data} />
        <FundingSplit data={model.data} />
        <AnalyticsInsights data={model.data} />
      </div>
    </AppShell>
  );
}
