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

export default function AnalyticsPage() {
  return (
    <AppShell active="Analytics">
      <div className="flex flex-col w-full gap-6 pb-12">
        <AnalyticsHeader />
        <SummaryMetrics />
        <SpendingOverview />
        <CardAndChecklist />
        <FundingSplit />
        <AnalyticsInsights />
      </div>
    </AppShell>
  );
}
