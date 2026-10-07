import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardPanelClass as panel } from "../styles/cardClasses";
import { categories } from "../data/demoCards";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<CardControlsModel, "state" | "spent" | "limit" | "percent">;
};
export function SpendingLimits({ model }: Props) {
  const { state, spent, limit, percent } = model;
  return (
    <div className="lg:col-span-7 flex flex-col gap-space-md">
      <section
        className={`${panel} p-space-lg flex flex-col gap-space-lg`}
        aria-label="Monthly spending limits"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-md gap-2 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
              Billing Interval
            </span>
            <strong className="text-headline-lg">Oct 1 – Oct 31, 2025</strong>
          </div>
          <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full text-on-surface-variant text-label-md border border-outline-variant/30">
            <Icon className="text-sm text-primary">autorenew</Icon>Refreshes in
            7 days
          </span>
        </div>
        <div className="aura-card-kpis">
          {[
            {
              name: "Total Spent",
              value: spent,
              note: "44.2% of corporate limit",
              tone: "",
            },
            {
              name: "Available Credit",
              value: limit - spent,
              note: "Auto-cleared capacity",
              tone: "green",
            },
            {
              name: "Hard Cap",
              value: limit,
              note: "Monthly allocation",
              tone: "gray",
            },
          ].map((item) => (
            <div key={item.name}>
              <span className="text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                {item.name}
              </span>
              <strong className={item.tone}>{money(item.value)}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
          <div className="flex justify-between items-center text-label-md gap-2 flex-wrap">
            <strong className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              Monthly Spend Progress
            </strong>
            <span className="font-semibold text-primary">
              {money(spent)}{" "}
              <span className="text-on-surface-variant font-normal">
                / {money(limit)}
              </span>
            </span>
          </div>
          <div
            className="aura-spend-track"
            role="progressbar"
            aria-label="Monthly spend"
            aria-valuenow={spent}
            aria-valuemin={0}
            aria-valuemax={limit}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="flex justify-between gap-2 flex-wrap text-label-caps text-on-surface-variant">
            <span>$0.00</span>
            <strong className="text-primary">
              Current Spend: {money(spent)} (44.2%)
            </strong>
            <span>Monthly Limit: {money(limit)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-label-caps uppercase tracking-wider text-on-surface-variant">
              Merchant Category Velocity Rules
            </h2>
            <span className="text-label-caps text-on-surface-variant whitespace-nowrap">
              4 Policy Sub-caps
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {categories.map((item) => (
              <article
                key={item.label}
                className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs border border-outline-variant/20"
              >
                <div className="flex items-center justify-between gap-2 text-label-md">
                  <strong className="flex items-center gap-2">
                    <span className={`aura-category-icon ${item.color}`}>
                      <Icon className="text-base">{item.icon}</Icon>
                    </span>
                    {item.label}
                  </strong>
                  <span className="font-semibold whitespace-nowrap">
                    {money(item.spent)}{" "}
                    <span className="text-on-surface-variant font-normal text-xs">
                      / {money(item.limit).replace(".00", "")}
                    </span>
                  </span>
                </div>
                <div className={`aura-spend-track small ${item.color}`}>
                  <span
                    style={{ width: `${(item.spent / item.limit) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-label-caps text-on-surface-variant">
                  <span>
                    {Math.round((item.spent / item.limit) * 100)}% utilized
                  </span>
                  <span>{money(item.limit - item.spent)} remaining</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        {state.requestedLimit && (
          <p className="text-body-sm text-primary">
            Demo increase request: {money(state.requestedLimit)} · not sent to
            an issuer
          </p>
        )}
      </section>
    </div>
  );
}
