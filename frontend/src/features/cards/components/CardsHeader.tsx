import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { CardControlsModel } from "../hooks/useCardControls";

type Props = {
  model: Pick<
    CardControlsModel,
    "state" | "update" | "setRevealed" | "openDialog"
  >;
};
export function CardsHeader({ model }: Props) {
  const { state, update, setRevealed, openDialog } = model;
  return (
    <div className="employee-page-header flex flex-col md:flex-row md:items-center justify-between gap-space-lg pb-space-sm border-b border-outline-variant/20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-label-caps uppercase tracking-wider text-primary font-semibold">
            Governance · Fiscal Fleet
          </span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-label-caps font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            Demo Card Controls
          </span>
        </div>
        <h1 className="text-display-lg">Cards &amp; Spending Limits</h1>
      </div>
      <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
        <button
          type="button"
          className={`aura-card-button ${state.frozen ? "is-frozen" : ""}`}
          aria-pressed={state.frozen}
          onClick={() => {
            update({ ...state, frozen: !state.frozen });
            setRevealed(false);
          }}
        >
          <Icon className="text-base">
            {state.frozen ? "lock" : "lock_open"}
          </Icon>
          {state.frozen ? "Unfreeze Card" : "Freeze Card"}
        </button>
        <button
          type="button"
          className="aura-card-button"
          onClick={() => openDialog("limit")}
        >
          <Icon className="text-base">trending_up</Icon>Request Limit Increase
        </button>
        <button
          type="button"
          className="aura-card-button primary"
          onClick={() => openDialog("virtual")}
        >
          <Icon className="text-base">add</Icon>Issue Virtual Card
        </button>
      </div>
    </div>
  );
}
