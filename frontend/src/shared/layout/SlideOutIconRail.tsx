import { SidebarToggle } from "./SidebarToggle";
import { Search, PlusCircle } from "lucide-react";
import { useTheme } from "../theme/theme-store";
import type { NavigationItem, SidebarUser } from "./navigation.types";

interface SlideOutIconRailProps {
  activeView: string;
  onNavigate: (label: string) => void;
  navItems: NavigationItem[];
  user: SidebarUser;
  quickCreateLabel?: string;
  onQuickCreate: () => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

export function SlideOutIconRail({
  activeView,
  onNavigate,
  navItems,
  user,
  quickCreateLabel = "New Expense",
  onQuickCreate,
  onOpenSearch,
  onToggleSidebar,
}: SlideOutIconRailProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const buttonClass = (active = false) =>
    `relative h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${
      active
        ? isDark
          ? "bg-white/10 text-white"
          : "bg-zinc-200 text-zinc-950"
        : isDark
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
    }`;

  return (
    <aside
      aria-label="Collapsed navigation"
      className={`w-12 shrink-0 h-dvh flex flex-col items-center justify-between border-r py-3 overflow-y-auto ${isDark ? "bg-[var(--surface-navigation)] border-white/[0.08]" : "bg-[var(--surface-navigation)] border-zinc-200/80"}`}
    >
      <nav className="flex flex-col items-center gap-1">
        <SidebarToggle expanded={false} onToggle={onToggleSidebar} />
        <button
          type="button"
          aria-label="Search"
          title="Search"
          onClick={onOpenSearch}
          className={buttonClass()}
        >
          <Search className="h-5 w-5 stroke-[1.85]" />
        </button>
        <button
          type="button"
          aria-label={quickCreateLabel}
          title={quickCreateLabel}
          aria-current={activeView === quickCreateLabel ? "page" : undefined}
          onClick={onQuickCreate}
          className={buttonClass(activeView === quickCreateLabel)}
        >
          <PlusCircle className="h-5 w-5 stroke-[1.85]" />
        </button>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            title={item.label}
            aria-current={activeView === item.label ? "page" : undefined}
            onClick={() => onNavigate(item.label)}
            className={buttonClass(activeView === item.label)}
          >
            <item.icon className="h-5 w-5 stroke-[1.85]" />
            {item.badge != null && (
              <span className="absolute bottom-0 right-0 rounded-full bg-sky-700 text-white text-[10px] px-1.5 leading-4">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <span
        title={user.name}
        aria-label={user.name}
        className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-semibold ${isDark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900"}`}
      >
        {user.initials}
      </span>
    </aside>
  );
}
