import { AuraShell } from "../../shared/layout/AuraShell";
import { useCardControls } from "./hooks/useCardControls";
import { CardsHeader } from "./components/CardsHeader";
import { CardPreview } from "./components/CardPreview";
import { SpendingLimits } from "./components/SpendingLimits";
import { CardSecurity } from "./components/CardSecurity";
import { CardTransactions } from "./components/CardTransactions";
import { CardDialog } from "./components/CardDialog";
import { AuraIcon } from "../../shared/components/AuraIcon";
import "./styles/cards.css";
export default function CardsPage() {
  const model = useCardControls();
  return (
    <AuraShell active="Cards & Limits">
      <div className="aura-cards flex flex-col w-full gap-4">
        <CardsHeader model={model} />
        {model.message && (
          <div className="aura-card-notice" role="status">
            <span>{model.message}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => model.setMessage("")}
            >
              <AuraIcon className="text-base">close</AuraIcon>
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-space-lg">
          <CardPreview model={model} />
          <SpendingLimits model={model} />
        </div>
        <CardSecurity model={model} />
        <CardTransactions model={model} />
        <CardDialog model={model} />
      </div>
    </AuraShell>
  );
}
