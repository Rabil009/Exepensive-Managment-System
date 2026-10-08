"use client";

import React from "react";
import { AppShell } from "../../shared/layout/AppShell";
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
    <AppShell active="Reports" onSearch={model.setQuery}>
      <div className="flex flex-col w-full gap-5 pb-12">
        {!model.groups.length && <p className="text-sm text-zinc-500">No expense reports yet. Add an expense to create one.</p>}
        <ReportHeader model={model} />
        <ReportSummary model={model} />
        <ApprovalWorkflow model={model} />
        <SpendDistribution model={model} />
        <ReportTransactions model={model} />
      </div>

      <Toast
        message={model.notice}
        onDismiss={() => model.setNotice("")}
        dismissLabel="Dismiss report notice"
      />
    </AppShell>
  );
}
