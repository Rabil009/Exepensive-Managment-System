"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { EmployeeAccount } from "./employee-auth";

const EmployeeSession = createContext<EmployeeAccount | null>(null);

export function EmployeeSessionProvider({ account, children }: { account: EmployeeAccount; children: ReactNode }) {
  return <EmployeeSession.Provider value={account}>{children}</EmployeeSession.Provider>;
}

export function useEmployeeSession() {
  const account = useContext(EmployeeSession);
  if (!account) throw new Error("EmployeeSessionProvider missing");
  return account;
}
