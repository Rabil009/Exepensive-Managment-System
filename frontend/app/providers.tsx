"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ExpensesProvider } from "@/features/expenses/data/ExpensesContext";
import { ThemeProvider } from "@/shared/theme/theme-store";

const subscribe = () => () => undefined;
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function Providers({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  if (!ready)
    return (
      <div className="aura-loading" role="status">
        Loading...
      </div>
    );

  // Restore existing browser data before rendering components that consume it.
  return (
    <ThemeProvider>
      <ExpensesProvider>{children}</ExpensesProvider>
    </ThemeProvider>
  );
}
