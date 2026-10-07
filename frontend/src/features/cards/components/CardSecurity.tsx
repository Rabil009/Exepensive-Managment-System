import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardPanelClass as panel } from "../styles/cardClasses";
import { controls } from "../data/demoCards";

type Props = { model: Pick<CardControlsModel, "state" | "update"> };
export function CardSecurity({ model }: Props) {
  const { state, update } = model;
  return (
    <section className={`${panel} p-space-md flex flex-col gap-space-md`}>
      <div className="flex items-center gap-space-md border-b border-outline-variant/20 pb-space-md flex-wrap">
        <h2 className="text-headline-lg">Card Security &amp; Controls</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-label-caps border border-outline-variant/30">
          {state.controls.filter(Boolean).length} of 4 Active
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {controls.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 p-space-md bg-surface-container-low/60 rounded-xl border border-outline-variant/20"
          >
            <div className="flex items-center gap-space-sm">
              <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                <Icon className="text-base">{item.icon}</Icon>
              </span>
              <div className="flex flex-col">
                <strong className="text-label-md">{item.name}</strong>
                <span
                  className={`text-label-caps ${state.controls[index] ? "text-tertiary" : "text-on-surface-variant"}`}
                >
                  {state.controls[index] ? item.enabled : item.disabled}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-label={item.name}
              aria-checked={state.controls[index]}
              className={`aura-card-switch ${state.controls[index] ? "on" : ""}`}
              onClick={() =>
                update({
                  ...state,
                  controls: state.controls.map((value, position) =>
                    position === index ? !value : value,
                  ),
                })
              }
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
