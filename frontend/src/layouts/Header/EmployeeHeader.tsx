import { useLocation, useNavigate } from "react-router";
import { Bell, Search, PanelLeft } from "lucide-react";
import { useSidebar } from "@ui/components/navigation/Sidebar/sidebar";
import "../../pages/Dashboard/dashboard.css";

export function EmployeeHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  
  const title = location.pathname.includes("/new")
    ? "Add Expense"
    : location.pathname.match(/expenses\/[^/]+$/)
      ? "Expense Details"
      : ((
          {
            dashboard: "Dashboard",
            expenses: "My Expenses",
            reimbursements: "Reimbursements",
            reports: "Reports",
            settings: "Settings",
          } as Record<string, string>
        )[location.pathname.split("/")[2]] ?? "Dashboard");

  return (
    <header className="paytrack-topbar">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <PanelLeft size={16} className="text-muted-foreground" style={{ cursor: 'pointer', color: '#a1a1aa' }} onClick={toggleSidebar} />
        <span className="header-divider" style={{ width: '1px', height: '20px', background: '#2a2a2f' }} />
        <span className="header-title" style={{ fontSize: '13px', fontWeight: 600 }}>{title}</span>
      </div>
      <div className="paytrack-top-actions">
        <label className="paytrack-search">
          <Search size={20} strokeWidth={1.7}/>
          <input aria-label="Search" placeholder="Search..." />
          <span className="paytrack-shortcut">⌘ K</span>
        </label>
        <button className="paytrack-notification" type="button" aria-label="Notifications" onClick={() => navigate("/employee/reimbursements")}>
          <Bell size={24} strokeWidth={1.7}/>
          <span/>
        </button>
      </div>
    </header>
  );
}
