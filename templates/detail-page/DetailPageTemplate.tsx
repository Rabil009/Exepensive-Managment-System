import type { ReactNode } from "react";
export function DetailPageTemplate({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {header}
      <div className="detail-grid">{children}</div>
    </>
  );
}
