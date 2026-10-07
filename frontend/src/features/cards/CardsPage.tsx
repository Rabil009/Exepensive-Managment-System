import { AppShell } from "../../shared/layout/AppShell";
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
    <AppShell active="Cards & Limits">
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
          <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
            <CardPreview model={model} />
            <CardSecurity model={model} />
          </div>
          <SpendingLimits model={model} />
        </div>
        <CardTransactions model={model} />
        <CardDialog model={model} />
      </div>
    </AppShell>
  );
}
