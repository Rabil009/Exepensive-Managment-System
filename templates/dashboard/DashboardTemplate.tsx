import type { ReactNode } from "react";
export function DashboardTemplate({
  header,
  stats,
  charts,
  table,
}: {
  header: ReactNode;
  stats: ReactNode;
  charts: ReactNode;
  table: ReactNode;
}) {
  return (
    <>
      {header}
      {stats}
      <div className="dashboard-grid">{charts}</div>
      {table}
    </>
  );
}
