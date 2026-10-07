import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { CardControlsModel } from "../hooks/useCardControls";

type Props = {
  model: Pick<
    CardControlsModel,
    | "dialogRef"
    | "dialogType"
    | "setDialogType"
    | "saveDialog"
    | "virtualName"
    | "setVirtualName"
    | "requestedAmount"
    | "setRequestedAmount"
    | "dialogError"
  >;
};
export function CardDialog({ model }: Props) {
  const {
    dialogRef,
    dialogType,
    setDialogType,
    saveDialog,
    virtualName,
    setVirtualName,
    requestedAmount,
    setRequestedAmount,
    dialogError,
  } = model;
  return (
    <dialog
      ref={dialogRef}
      className="aura-card-dialog"
      onCancel={() => setDialogType(null)}
      onClose={() => setDialogType(null)}
    >
      <form onSubmit={saveDialog}>
        <div className="flex items-center justify-between gap-4">
          <h2>
            {dialogType === "limit"
              ? "Request limit increase"
              : "Issue virtual card"}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setDialogType(null)}
          >
            <Icon className="text-xl">close</Icon>
          </button>
        </div>
        <p>
          This is a demo. Changes are saved in this browser and are not sent to
          a card issuer.
        </p>
        {dialogType === "virtual" && (
          <label>
            Card name
            <input
              autoFocus
              value={virtualName}
              onChange={(event) => setVirtualName(event.target.value)}
              placeholder="e.g. Design software"
              required
            />
          </label>
        )}
        <label>
          {dialogType === "limit"
            ? "Requested monthly limit (USD)"
            : "Spending limit (USD)"}
          <input
            type="number"
            min={dialogType === "limit" ? "7500.01" : "0.01"}
            step="0.01"
            value={requestedAmount}
            onChange={(event) => setRequestedAmount(event.target.value)}
            required
          />
        </label>
        {dialogError && (
          <p role="alert" className="text-error">
            {dialogError}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="aura-card-button"
            onClick={() => setDialogType(null)}
          >
            Cancel
          </button>
          <button type="submit" className="aura-card-button primary">
            Save Demo {dialogType === "limit" ? "Request" : "Card"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
