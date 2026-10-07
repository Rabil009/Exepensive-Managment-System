export function FundingSplit() {
  return (
    <div className="grid grid-cols-1 gap-5 items-stretch">
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              swap_horiz
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Corporate vs Personal Funding Split
            </h2>
          </div>
          <span className="font-label-caps text-label-caps uppercase px-2 py-0.5 rounded bg-surface-container-low text-outline font-semibold">
            Monthly Breakdown
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
          <div className="p-4 rounded-xl bg-primary-fixed/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">
                  Corporate Card
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-primary font-semibold">
                8.6%
              </span>
            </div>
            <div className="mt-3">
              <div className="font-financial-display text-financial-display font-bold text-on-surface">
                $3,320.50
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-tertiary-container/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">
                  Out-of-Pocket
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-tertiary font-semibold">
                91.4%
              </span>
            </div>
            <div className="mt-3">
              <div className="font-financial-display text-financial-display font-bold text-on-surface">
                $35,100.00
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-primary font-semibold">
              8.6% Corporate Card ($3,320.50)
            </span>
            <span className="text-tertiary font-semibold">
              91.4% Personal Reimbursable ($35,100.00)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex gap-0.5">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: "8.6%" }}
            ></div>
            <div
              className="h-full bg-tertiary rounded-r-full transition-all"
              style={{ width: "91.4%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
