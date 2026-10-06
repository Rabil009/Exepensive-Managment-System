import type { ReactNode } from "react";
export function ListPageTemplate({
  header,
  filters,
  children,
}: {
  header: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {header}
      {filters}
      {children}
    </>
  );
}
