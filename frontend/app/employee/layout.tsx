"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExpensesProvider } from "@/features/expenses/data/ExpensesContext";
import { ThemeProvider } from "@/lib/theme-store";
import { supabase } from "@/lib/supabase";
import { assignEmployeeCacheOwner, clearEmployeeCache, getEmployeeAccount } from "@/lib/employee-auth";
import type { EmployeeAccount } from "@/lib/employee-auth";
import { EmployeeSessionProvider } from "@/lib/employee-session";

function EmployeeAccess({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorizedPath, setAuthorizedPath] = useState("");
  const [account, setAccount] = useState<EmployeeAccount | null>(null);
  useEffect(() => {
    let active = true;
    const returnPath = window.location.pathname + window.location.search;
    getEmployeeAccount().then((account) => {
      if (!active) return;
      if (account?.profile?.role === "EMPLOYEE") {
        assignEmployeeCacheOwner(account.user.id);
        setAccount(account);
        setAuthorizedPath(pathname);
      } else {
        setAccount(null);
        setAuthorizedPath("");
        const reason = account ? "&reason=role" : "";
        router.replace(`/?portal=employee&next=${encodeURIComponent(returnPath)}${reason}`);
      }
    }).catch(() => {
      if (active) router.replace(`/?portal=employee&next=${encodeURIComponent(returnPath)}&reason=profile`);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active) {
        clearEmployeeCache();
        setAccount(null);
        setAuthorizedPath("");
        router.replace("/?portal=employee");
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [pathname, router]);

  if (authorizedPath !== pathname || !account) {
    return <div className="min-h-screen bg-[#08080A] text-zinc-400 grid place-items-center text-sm" role="status">Checking Employee access…</div>;
  }
  return <EmployeeSessionProvider account={account}><ExpensesProvider>{children}</ExpensesProvider></EmployeeSessionProvider>;
}

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <EmployeeAccess>{children}</EmployeeAccess>
    </ThemeProvider>
  );
}

