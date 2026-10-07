import { PanelLeft } from "lucide-react";

export function SidebarToggle({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      aria-expanded={expanded}
      title={expanded ? "Collapse sidebar" : "Expand sidebar"}
      onClick={onToggle}
      className={`${expanded ? "h-7 w-7" : "h-9 w-9"} shrink-0 flex items-center justify-center rounded-lg text-zinc-600 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white transition-colors`}
    >
      <PanelLeft
        className={expanded ? "h-4 w-4 stroke-[1.85]" : "h-5 w-5 stroke-[1.85]"}
      />
    </button>
  );
}
