export function SummaryMetrics() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Total Spend
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[18px]">
              receipt_long
            </span>
          </div>
        </div>
        <div>
          <div className="font-financial-display text-financial-display text-on-surface tracking-tight font-bold">
            $38,420.00
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Pending Approval
          </span>
          <div className="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">
              schedule
            </span>
          </div>
        </div>
        <div>
          <div className="font-financial-display text-financial-display text-secondary tracking-tight font-bold">
            $2,840.50
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Reimbursed
          </span>
          <div className="w-8 h-8 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[18px]">
              account_balance
            </span>
          </div>
        </div>
        <div>
          <div className="font-financial-display text-financial-display text-tertiary tracking-tight font-bold">
            $35,100.00
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Corporate Card Spend
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">
              credit_card
            </span>
          </div>
        </div>
        <div>
          <div className="font-financial-display text-financial-display text-primary tracking-tight font-bold">
            $3,320.50
          </div>
        </div>
      </div>
    </section>
  );
}
