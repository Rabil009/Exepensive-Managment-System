import {
  Search,
  PlusCircle,
  Settings,
  HelpCircle,
  ChevronsUpDown,
} from "lucide-react";
import { SidebarToggle } from "./SidebarToggle";
import { useTheme } from "../theme/theme-store";
import type { NavigationItem, SidebarUser } from "./navigation.types";

interface SidebarProps {
  activeView: string;
  onNavigate: (label: string) => void;
  navItems: NavigationItem[];
  user: SidebarUser;
  isCollapsed?: boolean;
  quickCreateLabel?: string;
  onQuickCreate?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenSearch?: () => void;
  onToggleSidebar: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  navItems,
  user,
  isCollapsed = false,
  quickCreateLabel = "New Expense",
  onQuickCreate,
  onOpenSettings,
  onOpenHelp,
  onOpenSearch,
  onToggleSidebar,
}: SidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const rowClass = (active = false) =>
    `group w-full flex items-center h-10 px-1.5 rounded-xl cursor-pointer text-left ${
      active
        ? isDark
          ? "bg-white text-black shadow-sm"
          : "bg-black text-white shadow-sm"
        : isDark
          ? "text-zinc-300 hover:bg-white hover:text-black"
          : "text-zinc-900 hover:bg-black hover:text-white"
    }`;
  const items = [
    ...(onQuickCreate
      ? [{ label: quickCreateLabel, icon: PlusCircle, action: onQuickCreate }]
      : []),
    ...navItems.map((item) => ({
      ...item,
      action: () => onNavigate(item.label),
    })),
  ];
  return (
    <aside
      aria-label={isCollapsed ? "Collapsed navigation" : "Main navigation"}
      className={`shrink-0 h-dvh border-r flex flex-col justify-between overflow-hidden select-none font-sans px-2.5 py-3 bg-[var(--surface-navigation)] ${isCollapsed ? "w-[64px]" : "w-[240px]"} ${isDark ? "border-white/[0.08] text-[#F4F4F5]" : "border-zinc-200/80 text-zinc-900"}`}
    >
      <div className="flex flex-col w-full min-h-0">
        <div
          className={`flex items-center h-9 shrink-0 px-1 mb-3 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-5 rounded-full border-[1.8px] border-current flex items-center justify-center shrink-0">
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
                Payout
              </span>
            </div>
          )}
          <SidebarToggle expanded={!isCollapsed} onToggle={onToggleSidebar} />
        </div>
        <nav
          className="space-y-1 w-full overflow-y-auto"
          aria-label="Employee pages"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              aria-label={item.label}
              aria-current={activeView === item.label ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
              className={rowClass(activeView === item.label)}
            >
              <span className="h-7 w-7 shrink-0 flex items-center justify-center">
                <item.icon className="h-4 w-4 stroke-[1.85]" />
              </span>
              {!isCollapsed && (
                <span className="ml-2.5 whitespace-nowrap text-[13.5px] font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="w-full space-y-1 shrink-0">
        {[
          { label: "Settings", icon: Settings, action: onOpenSettings },
          { label: "Get Help", icon: HelpCircle, action: onOpenHelp },
          { label: "Search", icon: Search, action: onOpenSearch },
        ]
          .filter((item) => item.action)
          .map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              aria-label={item.label}
              title={isCollapsed ? item.label : undefined}
              className={rowClass()}
            >
              <span className="h-7 w-7 shrink-0 flex items-center justify-center">
                <item.icon className="h-4 w-4 stroke-[1.85]" />
              </span>
              {!isCollapsed && (
                <span className="ml-2.5 whitespace-nowrap text-[13.5px] font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        <div
          className={`pt-2 mt-2 border-t ${isDark ? "border-white/[0.08]" : "border-zinc-200/80"}`}
        >
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={user.name}
            title={isCollapsed ? user.name : undefined}
            className={`w-full flex items-center h-11 px-1 rounded-xl text-left group ${isDark ? "hover:bg-white hover:text-black text-white" : "hover:bg-zinc-100 text-zinc-900"}`}
          >
            <span
              className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ring-1 text-xs font-semibold ${isDark ? "bg-zinc-800 ring-white/20" : "bg-zinc-100 ring-zinc-300"}`}
            >
              {user.initials}
            </span>
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0 ml-2.5 gap-1">
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] truncate leading-tight mt-0.5 text-zinc-500 dark:text-zinc-400">
                    {user.subtitle}
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" />
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
