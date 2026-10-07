export function AnalyticsHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
          Expense Analytics
        </h1>
      </div>
      <div className="flex items-center flex-wrap gap-2.5">
        <button
          className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-2 font-label-md text-label-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px] text-outline">
            calendar_today
          </span>
          <span className="">Oct 1 – Oct 31, 2025</span>
          <span className="material-symbols-outlined text-[15px] text-outline">
            expand_more
          </span>
        </button>
        <button
          className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-1.5 font-financial-tabular text-financial-tabular"
          type="button"
        >
          <span className="text-outline font-body-sm text-body-sm">
            Currency:
          </span>
          <span className="font-semibold">INR (₹)</span>
          <span className="material-symbols-outlined text-[15px] text-outline">
            expand_more
          </span>
        </button>
        <button
          className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-2 font-label-md text-label-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px] text-outline">
            filter_list
          </span>
          <span className="">All Reports</span>
          <span className="material-symbols-outlined text-[15px] text-outline">
            expand_more
          </span>
        </button>
        <button
          className="h-9 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-1.5 font-label-md text-label-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px] text-outline">
            download
          </span>
          <span className="">Export CSV</span>
        </button>
      </div>
    </header>
  );
}
