"use client";

import { AppShell } from "../../shared/layout/AppShell";
import { Toast } from "../../shared/components/Toast";
import { useOverview } from "./hooks/useOverview";
import { OverviewSummary } from "./components/OverviewSummary";
import { QuickReceiptCapture } from "./components/QuickReceiptCapture";
import { OverviewExpenseTable } from "./components/OverviewExpenseTable";
import { ComplianceBanner } from "./components/ComplianceBanner";
export default function OverviewPage() {
  const model = useOverview();
  return (
    <AppShell active="Overview">
      <div className="space-y-4 sm:space-y-6 w-full">
        <OverviewSummary summary={model.summary} />
        {model.error && <p role="alert" className="text-sm text-rose-500">{model.error}</p>}
        <QuickReceiptCapture />
        <OverviewExpenseTable model={model} />
        <ComplianceBanner />
      </div>
      <Toast message={model.notice} onDismiss={() => model.setNotice("")} />
    </AppShell>
  );
}
