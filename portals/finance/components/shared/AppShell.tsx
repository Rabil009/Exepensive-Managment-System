import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import type { User } from "@/types/finance";

interface AppShellProps {
  currentUser: User;
  children: React.ReactNode;
  pageTitle?: string;
}

export function AppShell({ currentUser, children, pageTitle }: AppShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-display)] antialiased">
      {/* Subtle Luxury Watermark / Ambient Horizon */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(197,168,128,0.06),transparent)]" />

      {/* Main Boutique Rail */}
      <AppSidebar role={currentUser.role} />

      {/* Primary Workspace Stage */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <AppHeader currentUser={currentUser} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="mx-auto max-w-6xl space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
