import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { CardControlsModel } from "../hooks/useCardControls";
import { cardPanelClass as panel } from "../styles/cardClasses";
import { cardMoney as money } from "../utils/cardMoney";

type Props = {
  model: Pick<
    CardControlsModel,
    "state" | "revealed" | "setRevealed" | "setMessage"
  >;
};
export function CardPreview({ model }: Props) {
  const { state, revealed, setRevealed, setMessage } = model;
  return (
    <div className="lg:col-span-5 flex flex-col gap-2">
      <div className={`aura-physical-card ${state.frozen ? "frozen" : ""}`}>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <span className="aura-card-chip">
              <i />
              <i />
              <i />
            </span>
            <Icon className="text-xl text-white/80">contactless</Icon>
          </div>
          <span className="flex items-center gap-1.5 font-bold tracking-widest text-headline-sm">
            <Icon className="text-primary-fixed-dim text-lg">north</Icon>AURA
          </span>
        </div>
        <div className="relative z-10 my-auto py-1">
          <span className="aura-card-pan">
            {revealed ? "4921  8400  1294  3820" : "4921  8400  12••  ••••"}
          </span>
        </div>
        <div className="relative z-10 flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-label-caps uppercase text-white/60 tracking-wider">
              Cardholder
            </span>
            <strong className="text-headline-sm tracking-wider">
              RABIL KHAN
            </strong>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="flex flex-col text-right">
              <span className="text-label-caps uppercase text-white/60 tracking-wider">
                Expires
              </span>
              <span className="text-body-sm font-semibold">09/28</span>
            </div>
            <span className="text-[24px] font-bold italic tracking-tighter">
              VISA
            </span>
          </div>
        </div>
      </div>
      <div className={`${panel} p-space-md flex flex-col gap-space-sm`}>
        <div className="grid grid-cols-3 gap-space-xs">
          <button
            type="button"
            className="aura-card-control"
            aria-pressed={revealed}
            onClick={() => setRevealed((value) => !value)}
          >
            <Icon className="text-base">visibility</Icon>
            {revealed ? "Hide Details" : "Show Details"}
          </button>
          <button
            type="button"
            className="aura-card-control"
            onClick={() =>
              setMessage(
                "PIN reset requires a connected card issuer. This card is a demo.",
              )
            }
          >
            <Icon className="text-base">pin</Icon>Reset PIN
          </button>
          <button
            type="button"
            className="aura-card-control wallet"
            onClick={() =>
              setMessage(
                "Apple Wallet provisioning requires a connected card issuer. This card is a demo.",
              )
            }
          >
            <Icon className="text-base">wallet</Icon>Apple Wallet
          </button>
        </div>
        <div className="pt-space-xs border-t border-outline-variant/20 flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-tertiary/10 border border-outline-variant/20 text-label-caps">
            <span
              className={`w-2 h-2 rounded-full ${state.frozen ? "bg-outline" : "bg-tertiary-container"}`}
            />
            <span className="text-on-surface-variant">
              Card Status:{" "}
              <strong className="text-on-surface">
                {state.frozen
                  ? "Frozen · Temporarily Paused"
                  : "Active · Physical Linked"}
              </strong>
            </span>
          </span>
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <Icon className="text-sm text-tertiary">verified_user</Icon>
            Protected
          </span>
        </div>
      </div>
      {state.virtualCards.map((card, index) => (
        <article
          key={index}
          className={`${panel} p-space-md flex items-center justify-between gap-2`}
        >
          <div>
            <strong>{card.name}</strong>
            <p className="text-body-sm text-on-surface-variant">
              Demo virtual card · ••{card.last4}
            </p>
          </div>
          <span className="text-body-sm">{money(card.limit)} limit</span>
        </article>
      ))}
    </div>
  );
}
