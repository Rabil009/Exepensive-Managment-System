import { money } from "../../../shared/utils/format";

const funding = [
  {
    label: "Corporate Card",
    amount: 3320.5,
    background: "bg-[var(--chart-blue)]/10",
    dot: "bg-[var(--chart-blue)]",
    text: "text-[var(--chart-blue)]",
  },
  {
    label: "Personal Card",
    amount: 2480.5,
    background: "bg-[var(--chart-violet)]/10",
    dot: "bg-[var(--chart-violet)]",
    text: "text-[var(--chart-violet)]",
  },
  {
    label: "Out-of-Pocket",
    amount: 32619.5,
    background: "bg-tertiary-container/10",
    dot: "bg-tertiary",
    text: "text-tertiary",
  },
];
const total = funding.reduce((sum, item) => sum + item.amount, 0);
const percent = (amount: number) => (total ? (amount / total) * 100 : 0);

export function FundingSplit() {
  return (
    <section
      className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between"
      aria-label="Funding split"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">
            swap_horiz
          </span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            How I Paid for Expenses
          </h2>
        </div>
        <span className="font-label-caps text-label-caps uppercase px-2 py-0.5 rounded bg-surface-container-low text-outline font-semibold">
          Monthly Breakdown
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {funding.map((item) => (
          <div
            key={item.label}
            className={`min-w-0 p-4 rounded-xl flex flex-col justify-between ${item.background}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`}
                />
                <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">
                  {item.label}
                </span>
              </div>
              <span
                className={`font-label-caps text-label-caps font-semibold shrink-0 ${item.text}`}
              >
                {percent(item.amount).toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 font-financial-display text-financial-display font-bold text-on-surface">
              {money(item.amount)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-label-md text-label-md">
          {funding.map((item, index) => (
            <span
              key={item.label}
              className={`font-semibold ${item.text} ${index === 1 ? "md:text-center" : index === 2 ? "md:text-right" : ""}`}
            >
              {percent(item.amount).toFixed(1)}% {item.label} (
              {money(item.amount)})
            </span>
          ))}
        </div>
        <div
          className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex"
          role="img"
          aria-label={funding
            .map(
              (item) =>
                `${item.label}: ${percent(item.amount).toFixed(1)} percent`,
            )
            .join(", ")}
        >
          {funding.map((item) => (
            <div
              key={item.label}
              className={`h-full transition-all ${item.dot}`}
              style={{ width: `${percent(item.amount)}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
