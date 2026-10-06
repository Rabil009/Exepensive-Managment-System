import type { ReactNode } from "react";
export function FormPageTemplate({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {header}
      <div className="form-card">{children}</div>
    </>
  );
}
