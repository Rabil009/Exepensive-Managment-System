import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { SidebarUtilityDialog } from "./SidebarUtilityDialog";
import { Header } from "./Header";
import { navigation } from "./navigation";
import { Toast } from "../components/Toast";
import "../styles/shell.css";

const user = {
  name: "Rabil Khan",
  initials: "RK",
  subtitle: "Employee",
};
const sidebarNav = navigation.filter((item) => item.label !== "New Expense");

export function AppShell({
  children,
  active,
  onSearch,
}: {
  children: ReactNode;
  active: string;
  onSearch?: (value: string) => void;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.matchMedia("(max-width: 767px)").matches) return false;
    return localStorage.getItem("aura-sidebar-expanded") !== "false";
  });
  const [notice, setNotice] = useState("");
  const [utilityPanel, setUtilityPanel] = useState<"settings" | "help" | null>(
    null,
  );
  const searchRef = useRef<HTMLInputElement>(null);
  function toggleSidebar() {
    setSidebarOpen((open) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("aura-sidebar-expanded", String(!open));
      }
      return !open;
    });
  }
  function onNavigate(label: string) {
    const item = navigation.find((item) => item.label === label);
    if (item) router.push(item.path);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) setSidebarOpen(false);
  }
  const createExpense = () => onNavigate("New Expense");
  const openSearch = () => searchRef.current?.focus();
  return (
    <div className="aura-app finance-shell flex h-dvh w-full overflow-hidden font-sans antialiased transition-colors bg-[var(--canvas-bg)] text-[var(--text-primary)]">
      {sidebarOpen && (
        <button
          className="finance-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={toggleSidebar}
        />
      )}
      <div className={sidebarOpen ? "finance-sidebar-wrap" : undefined}>
        <Sidebar
          isCollapsed={!sidebarOpen}
          activeView={active}
          onNavigate={onNavigate}
          navItems={sidebarNav}
          user={user}
          quickCreateLabel="New Expense"
          onQuickCreate={createExpense}
          onOpenSearch={openSearch}
          onOpenSettings={() => setUtilityPanel("settings")}
          onOpenHelp={() => setUtilityPanel("help")}
          onToggleSidebar={toggleSidebar}
        />
      </div>
      <div className="flex-1 flex flex-col h-dvh overflow-hidden min-w-0">
        <Header
          searchRef={searchRef}
          onSearch={onSearch}
          onNotifications={() => setNotice("No new notifications.")}
        />
        <main className="employee-content flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>
      <Toast message={notice} onDismiss={() => setNotice("")} />
      <SidebarUtilityDialog
        panel={utilityPanel}
        onClose={() => setUtilityPanel(null)}
      />
    </div>
  );
}
