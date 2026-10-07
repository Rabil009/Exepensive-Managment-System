import type { RefObject } from "react";
import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { AuraIcon } from "../components/AuraIcon";
import { useTheme } from "../theme/theme-store";

interface HeaderProps {
  searchRef: RefObject<HTMLInputElement | null>;
  onSearch?: (value: string) => void;
  onNotifications: () => void;
}

export function Header({ searchRef, onSearch, onNotifications }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="h-16 w-full shrink-0 flex items-center justify-between gap-3 px-3 sm:px-6 bg-[var(--surface-navigation)] border-b border-zinc-200 dark:border-white/[0.08]">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <form
          action="/employee/reports"
          onSubmit={onSearch ? (event) => event.preventDefault() : undefined}
          className="flex items-center w-full max-w-96 min-w-0 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30"
        >
          <input
            ref={searchRef}
            name="search"
            aria-label="Search transactions"
            placeholder="Search transactions, tags, reports..."
            onChange={(event) => onSearch?.(event.target.value)}
            className="bg-transparent border-none outline-none text-body-md w-full min-w-0"
          />
        </form>
      </div>
      <div className="flex items-center gap-2 sm:gap-5 shrink-0">
        <div className="hidden md:flex items-center gap-1 bg-surface-container-low border border-outline-variant/30 px-3 py-1 rounded-lg">
          <AuraIcon className="text-base">payments</AuraIcon>
          <span className="text-label-md">INR (₹)</span>
          <AuraIcon className="text-sm">expand_more</AuraIcon>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={onNotifications}
          className="relative p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
        >
          <AuraIcon className="text-xl">notifications</AuraIcon>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-container" />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <Link
          to="/employee/expenses/new"
          className="finance-primary-button inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm"
          aria-label="New Expense"
        >
          <AuraIcon className="text-base">add</AuraIcon>
          <span className="hidden sm:inline">New Expense</span>
        </Link>
      </div>
    </header>
  );
}
