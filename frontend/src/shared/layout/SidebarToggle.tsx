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
      className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.08] hover:text-zinc-950 dark:hover:text-white"
    >
      <PanelLeft className="h-4 w-4 stroke-[1.85]" />
    </button>
  );
}
