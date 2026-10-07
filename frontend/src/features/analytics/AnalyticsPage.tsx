import { AuraShell } from "../../shared/layout/AuraShell";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { SummaryMetrics } from "./components/SummaryMetrics";
import { SpendingOverview } from "./components/SpendingOverview";
import { CardAndApproval } from "./components/CardAndApproval";
import { FundingSplit } from "./components/FundingSplit";
import { AnalyticsInsights } from "./components/AnalyticsInsights";
import "./styles/analytics.css";

export default function AnalyticsPage() {
  return (
    <AuraShell active="Analytics">
      <div className="pasted-analytics flex flex-col w-full gap-6 pb-16">
        <AnalyticsHeader />
        <SummaryMetrics />
        <SpendingOverview />
        <CardAndApproval />
        <FundingSplit />
        <AnalyticsInsights />
      </div>
    </AuraShell>
  );
}
