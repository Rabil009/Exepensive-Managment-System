import { useEffect, useRef } from "react";
import { X, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/theme-store";

export function SidebarUtilityDialog({
  panel,
  onClose,
}: {
  panel: "settings" | "help" | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    const dialog = ref.current;
    if (panel) dialog?.showModal();
    else dialog?.close();
  }, [panel]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="sidebar-utility-title"
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-6 text-[var(--text-primary)] shadow-xl backdrop:bg-black/30"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 id="sidebar-utility-title" className="text-base font-semibold">
          {panel === "settings" ? "Settings" : "Get Help"}
        </h2>
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface-elevated)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {panel === "settings" ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-medium">Appearance</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Choose your Employee portal theme.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] px-3 py-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Use light mode" : "Use dark mode"}
          </button>
        </div>
      ) : (
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium">Create an expense</dt>
            <dd className="mt-1 text-[var(--text-secondary)]">
              Open New Expense, attach a receipt, fill in the details, then save
              a draft or submit.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Review your reports</dt>
            <dd className="mt-1 text-[var(--text-secondary)]">
              Use Reports to check payment breakdowns, receipts, and approval
              status.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Find a transaction</dt>
            <dd className="mt-1 text-[var(--text-secondary)]">
              Select Search above your profile to focus the search field at the
              top of the page.
            </dd>
          </div>
        </dl>
      )}
    </dialog>
  );
}
