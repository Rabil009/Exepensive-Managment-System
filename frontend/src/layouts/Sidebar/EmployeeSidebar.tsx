import { Link, useLocation, useNavigate } from "react-router";
import {
  Bell,
  CircleDollarSign,
  CirclePlus,
  EllipsisVertical,
  LayoutDashboard,
  ReceiptText,
  Search,
  Settings,
  Wallet,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@ui/components/navigation/Sidebar/sidebar";
import { Button } from "@ui/components/actions/Button/button";
import { Avatar, AvatarFallback } from "@ui/components/data-display/Avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/navigation/Dropdown/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/components/overlays/Tooltip/tooltip";

const mainLinks = [
  { to: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employee/expenses", label: "My Expenses", icon: ReceiptText },
  { to: "/employee/reimbursements", label: "Reimbursements", icon: Wallet },
];
const reportLinks = [
  { to: "/employee/reports", label: "Reports", icon: ChartNoAxesCombined },
];

export function EmployeeSidebar() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const isActive = (to: string) =>
    to === "/employee/expenses"
      ? pathname === to ||
        (pathname.startsWith("/employee/expenses/") &&
          !pathname.endsWith("/new"))
      : pathname === to;

  const renderLink = ({ to, label, icon: Icon }: (typeof mainLinks)[number]) => (
    <SidebarMenuItem key={to}>
      <SidebarMenuButton asChild isActive={isActive(to)} className="sidebar-link">
        <Link to={to}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="expense-sidebar sticky top-0 h-screen">
      <SidebarHeader className="sidebar-top">
        <Link to="/employee/dashboard" className="sidebar-brand" aria-label="ExpenseFlow dashboard">
          <span className="sidebar-brand-mark"><CircleDollarSign aria-hidden="true" /></span>
          <span>ExpenseFlow</span>
        </Link>
        <div className="sidebar-action-row">
          <Button asChild className="sidebar-create">
            <Link to="/employee/expenses/new"><CirclePlus aria-hidden="true" />Add Expense</Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="sidebar-alert"
                aria-label="Reimbursement updates"
                onClick={() => navigate("/employee/reimbursements")}
              >
                <Bell aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reimbursement updates</TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>

      <SidebarContent className="sidebar-scroll">
        <SidebarGroup className="sidebar-group">
          <SidebarMenu className="sidebar-menu">{mainLinks.map(renderLink)}</SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="sidebar-group sidebar-report-group">
          <SidebarGroupLabel className="sidebar-section-label">Insights</SidebarGroupLabel>
          <SidebarMenu className="sidebar-menu">{reportLinks.map(renderLink)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="sidebar-footer">
        <SidebarMenu className="sidebar-menu">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/employee/settings"} className="sidebar-link">
              <Link to="/employee/settings"><Settings aria-hidden="true" /><span>Settings</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="sidebar-link">
              <Link to="/employee/expenses"><Search aria-hidden="true" /><span>Search</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="sidebar-account w-full text-left">
            <Avatar className="sidebar-account-avatar"><AvatarFallback className="employee-avatar">AK</AvatarFallback></Avatar>
            <span className="sidebar-account-copy"><strong>Aarav Kumar</strong><small>aarav.kumar@company.com</small></span>
            <EllipsisVertical aria-hidden="true" className="sidebar-account-more" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            <DropdownMenuItem asChild><Link to="/employee/settings">Profile settings</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
