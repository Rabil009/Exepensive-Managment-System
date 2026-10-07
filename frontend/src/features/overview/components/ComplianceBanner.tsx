export function ComplianceBanner() {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm text-on-surface-variant">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-lg">shield</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Compliance Health
          </span>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            100% Policy Compliant · 0 Audit Flags Recorded
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-md mt-space-sm sm:mt-0 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
        <span className="">Auto-Audit Guard v4.2 Active</span>
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
      </div>
    </section>
  );
}
