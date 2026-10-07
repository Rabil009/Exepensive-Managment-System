import { AuraShell } from "../../shared/layout/AuraShell";
import { Toast } from "../../shared/components/Toast";
import { useOverview } from "./hooks/useOverview";
import { OverviewHeader } from "./components/OverviewHeader";
import { OverviewSummary } from "./components/OverviewSummary";
import { QuickReceiptCapture } from "./components/QuickReceiptCapture";
import { OverviewExpenseTable } from "./components/OverviewExpenseTable";
import { ComplianceBanner } from "./components/ComplianceBanner";
export default function OverviewPage() {
  const model = useOverview();
  return (
    <AuraShell active="Overview" onSearch={model.setQuery}>
      <div className="flex flex-col w-full gap-space-xl">
        <OverviewHeader
          cycleFilter={model.cycleFilter}
          exportExpenses={model.exportExpenses}
        />
        <OverviewSummary />
        <QuickReceiptCapture
          onScan={() => model.setNotice("Use New Expense to attach a receipt.")}
          onUpload={() =>
            model.setNotice(
              "Open New Expense to attach this receipt and enter its details.",
            )
          }
        />
        <OverviewExpenseTable model={model} />
        <ComplianceBanner />
      </div>
      <Toast message={model.notice} onDismiss={() => model.setNotice("")} />
    </AuraShell>
  );
}
