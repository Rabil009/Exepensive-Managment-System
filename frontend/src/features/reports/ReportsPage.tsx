import { AuraShell } from "../../shared/layout/AuraShell";
import { Toast } from "../../shared/components/Toast";
import { useReports } from "./hooks/useReports";
import { ReportHeader } from "./components/ReportHeader";
import { ReportSummary } from "./components/ReportSummary";
import { ApprovalWorkflow } from "./components/ApprovalWorkflow";
import { SpendDistribution } from "./components/SpendDistribution";
import { ReportTransactions } from "./components/ReportTransactions";
import "./styles/reports.css";
export default function ReportsPage() {
  const model = useReports();
  return (
    <AuraShell active="Reports" onSearch={model.setQuery}>
      <div className="aura-reports flex flex-col w-full gap-space-xl">
        <ReportHeader model={model} />
        <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
          <ReportSummary model={model} />
          <ApprovalWorkflow model={model} />
          <SpendDistribution model={model} />
        </section>
        <ReportTransactions model={model} />
      </div>
      <Toast
        message={model.notice}
        onDismiss={() => model.setNotice("")}
        dismissLabel="Dismiss report notice"
      />
    </AuraShell>
  );
}
