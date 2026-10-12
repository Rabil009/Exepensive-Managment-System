"use client";

import { AppShell } from "../../shared/layout/AppShell";
import { Toast } from "../../shared/components/Toast";
import { useOverview } from "./hooks/useOverview";
import { OverviewSummary } from "./components/OverviewSummary";
import { QuickReceiptCapture } from "./components/QuickReceiptCapture";
import { OverviewExpenseTable } from "./components/OverviewExpenseTable";
import { ComplianceBanner } from "./components/ComplianceBanner";
import { Spiral } from "@/components/ui/spiral";

export default function OverviewPage() {
  const model = useOverview();
  return (
    <AppShell active="Overview">
      {model.loading && !model.summary ? (
        <div className="w-full min-h-[60vh] flex items-center justify-center py-16">
          <Spiral className="size-9 text-blue-500" />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 w-full">
          <OverviewSummary summary={model.summary} />
          {model.error && <p role="alert" className="text-sm text-rose-500">{model.error}</p>}
          <QuickReceiptCapture />
          <OverviewExpenseTable model={model} />
          <ComplianceBanner />
        </div>
      )}
      <Toast message={model.notice} onDismiss={() => model.setNotice("")} />
    </AppShell>
  );
}
