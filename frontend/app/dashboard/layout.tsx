"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveCurrentUser } from "@/lib/role-guard";
import { Spiral } from "@/components/ui/spiral";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    resolveCurrentUser().then((user) => {
      if (!active) return;
      if (!user) {
        router.replace("/?portal=dashboard");
        return;
      }

      if (user.role === "FINANCE" || user.role === "ADMIN") {
        setIsAuthorized(true);
      } else if (user.role === "MANAGER") {
        router.replace("/manager");
      } else {
        router.replace("/employee");
      }
    }).catch(() => {
      if (active) router.replace("/?portal=dashboard");
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFB] dark:bg-[#08080A]">
        <Spiral className="size-9 text-emerald-500" />
      </div>
    );
  }

  return <>{children}</>;
}

