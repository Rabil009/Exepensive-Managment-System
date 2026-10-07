export function CardAndApproval() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              credit_card
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Card Limit Usage
            </h2>
          </div>
          <span className="font-label-caps text-label-caps uppercase px-2 py-0.5 rounded bg-surface-container-low text-outline font-semibold">
            ••4921 Visa
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 my-4 py-2.5 px-3.5 rounded-xl bg-surface-container-low/60">
          <div className="min-w-0">
            <div className="font-label-caps text-label-caps uppercase text-outline truncate font-semibold">
              Total Spent
            </div>
            <div className="font-financial-display text-[22px] text-primary font-bold mt-0.5 whitespace-nowrap">
              $3,320.50
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-label-caps text-label-caps uppercase text-outline truncate font-semibold">
              Available Credit
            </div>
            <div className="font-financial-display text-[22px] text-tertiary font-bold mt-0.5 whitespace-nowrap">
              $4,179.50
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-label-caps text-label-caps uppercase text-outline truncate font-semibold">
              Monthly Limit
            </div>
            <div className="font-financial-display text-[22px] text-on-surface font-bold mt-0.5 whitespace-nowrap">
              $7,500.00
            </div>
          </div>
        </div>
        <div className="relative w-full h-36 my-2 flex flex-col justify-end">
          <div className="absolute top-1 left-0 right-0 flex items-center justify-between text-outline border-b border-dashed border-outline-variant/40 pb-1">
            <span className="font-label-caps text-label-caps text-outline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              Weekly Pacing Benchmark
            </span>
            <span className="font-financial-tabular text-body-sm font-semibold text-outline">
              $1,875 / wk limit
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 h-24 items-end pt-4">
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="font-financial-tabular text-body-sm font-semibold text-on-surface-variant">
                $640
              </span>
              <div
                className="w-full max-w-[48px] bg-primary-fixed/40 hover:bg-primary-container transition-colors rounded-t-md"
                style={{ height: "38%" }}
              ></div>
              <span className="font-label-caps text-label-caps text-outline font-medium">
                Week 1
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="font-financial-tabular text-body-sm font-semibold text-on-surface-variant">
                $890
              </span>
              <div
                className="w-full max-w-[48px] bg-primary-fixed/40 hover:bg-primary-container transition-colors rounded-t-md"
                style={{ height: "52%" }}
              ></div>
              <span className="font-label-caps text-label-caps text-outline font-medium">
                Week 2
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="font-financial-tabular text-body-sm font-semibold text-on-surface-variant">
                $670
              </span>
              <div
                className="w-full max-w-[48px] bg-primary-fixed/40 hover:bg-primary-container transition-colors rounded-t-md"
                style={{ height: "40%" }}
              ></div>
              <span className="font-label-caps text-label-caps text-outline font-medium">
                Week 3
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="font-financial-tabular text-body-sm font-semibold text-primary">
                $1,120
              </span>
              <div
                className="w-full max-w-[48px] bg-primary-container shadow-sm rounded-t-md"
                style={{ height: "68%" }}
              ></div>
              <span className="font-label-caps text-label-caps text-primary font-semibold">
                Week 4
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <div className="flex items-center gap-3">
              <span className="text-primary font-semibold">
                Utilization: 44.3%
              </span>
              <div className="flex items-center gap-1.5 text-tertiary font-label-caps text-label-caps font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Pacing: On Track
              </div>
            </div>
            <span className="text-outline font-label-caps text-label-caps">
              Resets Nov 1, 2025
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-surface-container-low overflow-hidden flex">
            <div
              className="h-full rounded-full bg-primary-container transition-all duration-500"
              style={{ width: "44.3%" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Approval Status
          </h2>
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            By Workflow
          </span>
        </div>
        <div className="flex flex-col gap-3 my-4">
          <div className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-surface-container-low/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-tertiary"></div>
              <div className="font-body-md text-body-md font-semibold text-on-surface">
                Reimbursed
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-financial-tabular text-headline-sm font-bold text-tertiary">
                $35,100.00
              </div>
              <span className="font-label-caps text-label-caps text-outline w-12 text-right font-medium">
                91.4%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-surface-container-low/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <div className="font-body-md text-body-md font-semibold text-on-surface">
                Pending Review
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-financial-tabular text-headline-sm font-bold text-secondary">
                $2,840.50
              </div>
              <span className="font-label-caps text-label-caps text-outline w-12 text-right font-medium">
                7.4%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-surface-container-low/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary-container"></div>
              <div className="font-body-md text-body-md font-semibold text-on-surface">
                Approved (Queued)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-financial-tabular text-headline-sm font-bold text-primary-container">
                $447.80
              </div>
              <span className="font-label-caps text-label-caps text-outline w-12 text-right font-medium">
                1.2%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-surface-container-low/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
              <div className="font-body-md text-body-md font-semibold text-outline">
                Rejected / Returned
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-financial-tabular text-headline-sm font-bold text-outline">
                $0.00
              </div>
              <span className="font-label-caps text-label-caps uppercase text-outline w-12 text-right font-medium">
                0.0%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary font-label-caps text-label-caps font-semibold">
            11 Settled
          </span>
          <span className="px-2 py-1 rounded bg-secondary-container/40 text-secondary font-label-caps text-label-caps font-semibold">
            2 Awaiting Review
          </span>
          <span className="px-2 py-1 rounded bg-primary-fixed/40 text-primary font-label-caps text-label-caps font-semibold">
            1 Queued
          </span>
        </div>
      </div>
    </div>
  );
}
