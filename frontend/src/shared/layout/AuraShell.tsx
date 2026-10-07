import { useState, type ReactNode } from "react";
import { Toast } from "../components/Toast";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import "../styles/shell.css";
type Props = {
  children: ReactNode;
  active: string;
  onSearch?: (value: string) => void;
};
export function AuraShell({ children, active, onSearch }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      return localStorage.getItem("aura-sidebar-expanded") !== "false";
    } catch {
      return true;
    }
  });
  const [notice, setNotice] = useState("");
  function toggleSidebar() {
    const expanded = !sidebarOpen;
    setSidebarOpen(expanded);
    try {
      localStorage.setItem("aura-sidebar-expanded", String(expanded));
    } catch {
      /* Keep the toggle working when storage is unavailable. */
    }
  }
  return (
    <div className={`aura-app ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <div>
        <Sidebar active={active} />
        <div className="pl-[260px]">
          <Header
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            onSearch={onSearch}
            onNotifications={() => setNotice("No new notifications.")}
          />
          <main className="relative pt-16 bg-surface min-h-screen w-full px-space-xl py-space-xl max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
      <Toast message={notice} onDismiss={() => setNotice("")} />
    </div>
  );
}
