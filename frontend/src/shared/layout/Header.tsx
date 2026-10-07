import { Link } from "react-router";
import { AuraIcon } from "../components/AuraIcon";
type Props = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  onSearch?: (value: string) => void;
  onNotifications: () => void;
};
export function Header({
  sidebarOpen,
  toggleSidebar,
  onSearch,
  onNotifications,
}: Props) {
  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 z-40 flex items-center justify-between px-space-xl">
      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          aria-label="Toggle sidebar"
          aria-controls="aura-sidebar"
          aria-expanded={sidebarOpen}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center border border-outline-variant/30"
          onClick={toggleSidebar}
        >
          <AuraIcon className="text-xl">
            {sidebarOpen ? "left_panel_close" : "left_panel_open"}
          </AuraIcon>
        </button>
        <div className="flex items-center w-96">
          <form
            className="flex items-center w-full bg-surface-container-low px-space-md py-1.5 rounded-lg border border-outline-variant/30"
            action="/employee/reports"
            onSubmit={onSearch ? (event) => event.preventDefault() : undefined}
          >
            <input
              name="search"
              className="bg-transparent border-none outline-none text-body-md w-full"
              aria-label="Search transactions"
              placeholder="Search transactions, tags, reports..."
              onChange={(event) => onSearch?.(event.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant/30 px-space-md py-1 rounded-lg">
          <AuraIcon className="text-base">payments</AuraIcon>
          <span className="text-label-md">USD ($)</span>
          <AuraIcon className="text-sm">expand_more</AuraIcon>
        </div>
        <button
          className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
        >
          <AuraIcon className="text-xl">notifications</AuraIcon>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-container" />
        </button>
        <Link
          to="/employee/expenses/new"
          className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary-container hover:bg-primary px-space-lg py-1.5 rounded-lg font-headline-sm text-headline-sm shadow-sm"
        >
          <AuraIcon className="text-base">add</AuraIcon>
          <span>New Expense</span>
        </Link>
      </div>
    </header>
  );
}
