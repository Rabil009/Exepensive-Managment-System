type Props = { cycleFilter: () => void; exportExpenses: () => void };
export function OverviewHeader({ cycleFilter, exportExpenses }: Props) {
  return (
    <section className="employee-page-header flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
          <span className="">My Expenses</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Welcome, Rabil
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-space-sm">
        <button
          type="button"
          className="inline-flex items-center gap-space-sm bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm hover:bg-surface-container-low transition-colors text-on-surface font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            calendar_today
          </span>
          <span className="">Oct 1 - 31, 2025</span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant">
            keyboard_arrow_down
          </span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm hover:bg-surface-container-low transition-colors text-on-surface font-label-md text-label-md"
          onClick={cycleFilter}
        >
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            tune
          </span>
          <span className="">Filters</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5"></span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm hover:bg-surface-container-low transition-colors text-on-surface font-label-md text-label-md"
          onClick={exportExpenses}
        >
          <span className="material-symbols-outlined text-base text-on-surface-variant">
            ios_share
          </span>
          <span className="">Export</span>
        </button>
      </div>
    </section>
  );
}
