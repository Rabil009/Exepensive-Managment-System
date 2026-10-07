import { money } from "../../../shared/utils/format";
export function AnalyticsInsights() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-3.5 transition-all hover:shadow-md">
        <div className="w-9 h-9 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">
            trending_up
          </span>
        </div>
        <div>
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Highest-Spend Category
          </span>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
            Travel &amp; Lodging
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-3.5 transition-all hover:shadow-md">
        <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">
            flight_takeoff
          </span>
        </div>
        <div>
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Largest Single Expense
          </span>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
            {money(1120.0)}
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-3.5 transition-all hover:shadow-md">
        <div className="w-9 h-9 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[20px]">
            verified
          </span>
        </div>
        <div>
          <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
            Missing Receipts
          </span>
          <div className="font-headline-sm text-headline-sm text-tertiary font-semibold mt-1">
            0 Missing
          </div>
        </div>
      </div>
    </section>
  );
}
