export function OverviewSummary() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
      <div className="group relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
              Ready for Reimbursement
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-financial-display text-financial-display text-on-surface">
                $2,480.50
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg">
              account_balance
            </span>
          </div>
        </div>
        <div className="mt-space-lg pt-space-sm flex items-center justify-between border-t-0 bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2.5">
          <div className="inline-flex items-center gap-1.5 text-tertiary font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="">Direct Deposit Oct 28</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            2 approved reports
          </span>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
              Pending Approval
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-financial-display text-financial-display text-on-surface">
                $840.00
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-lg">
              hourglass_top
            </span>
          </div>
        </div>
        <div className="mt-space-lg pt-space-sm flex items-center justify-between bg-surface-container-low/50 -mx-space-lg -mb-space-lg px-space-lg py-2.5">
          <div className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="">Under review by Sarah C.</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            1 report
          </span>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
              Monthly Spend Allowance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-financial-display text-financial-display text-on-surface">
                $3,320.50
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                / $7,500.00
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-lg">pie_chart</span>
          </div>
        </div>
        <div className="mt-space-lg space-y-2">
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-500"
              style={{ width: "44.2%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <span className="">44% utilized</span>
            <span className="text-on-surface">$4,179.50 remaining</span>
          </div>
        </div>
      </div>
    </section>
  );
}
