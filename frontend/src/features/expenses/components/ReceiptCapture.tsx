import { AuraIcon as Icon } from "../../../shared/components/AuraIcon";
import type { ExpenseFormModel } from "../hooks/useExpenseForm";
type Props = {
  model: Pick<
    ExpenseFormModel,
    | "draft"
    | "preview"
    | "dragging"
    | "setDragging"
    | "attach"
    | "inputRef"
    | "setMessage"
  >;
};
export function ReceiptCapture({ model }: Props) {
  const {
    draft,
    preview,
    dragging,
    setDragging,
    attach,
    inputRef,
    setMessage,
  } = model;
  return (
    <>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-headline-sm">Expense Receipt</h2>
        <span className="inline-flex items-center gap-1.5 text-label-caps px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-outline" />
          {draft.receipt ? "Receipt Attached" : "No Receipt Attached"}
        </span>
      </div>
      <div
        className={`aura-receipt-dropzone bg-surface-container-lowest rounded-2xl p-space-xl border-2 border-dashed border-outline-variant/50 hover:border-primary-container/80 transition-all group flex flex-col items-center justify-center text-center gap-space-md shadow-sm ${dragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          attach(event.dataTransfer.files[0]);
        }}
      >
        {preview ? (
          <img
            className="aura-receipt-preview"
            src={preview}
            alt="Attached receipt preview"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary-container shadow-sm">
            <Icon className="text-3xl">
              {draft.receipt ? "description" : "document_scanner"}
            </Icon>
          </div>
        )}
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-headline-lg font-semibold">
            {draft.receipt || "Drag & drop your receipt or invoice"}
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            {draft.receipt
              ? "Receipt selected. Review your expense details before submitting."
              : "PDF, PNG, JPG, or HEIC supported up to 25MB"}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-space-sm">
          <button
            type="button"
            className="aura-submit-button"
            onClick={() => inputRef.current?.click()}
          >
            <Icon className="text-base">upload_file</Icon>
            {draft.receipt ? "Replace File" : "Browse Files"}
          </button>
          <button
            type="button"
            className="aura-draft-button inline-flex gap-1.5 items-center"
            onClick={() =>
              setMessage(
                "Choose Browse Files to select a receipt from this device.",
              )
            }
          >
            <Icon className="text-base">phone_iphone</Icon>Upload Help
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          aria-label="Upload receipt"
          accept=".pdf,.png,.jpg,.jpeg,.heic"
          hidden
          onChange={(event) => attach(event.target.files?.[0])}
        />
        <p className="inline-flex items-center gap-1.5 text-[10px] text-on-surface-variant">
          <Icon className="text-xs">lock</Icon>This preview saves the receipt name, not the uploaded file.
        </p>
      </div>
      <div className="px-1 flex flex-col gap-2">
        <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">
          Expense Checklist
        </span>
        <div className="flex flex-wrap gap-2 text-[10px] text-on-surface-variant">
          {[
            ["psychology", "Attach a receipt"],
            ["currency_exchange", "Enter amount in INR"],
            ["link", "Link a card transaction"],
          ].map(([icon, label]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30"
            >
              <Icon className="text-xs text-primary-container">{icon}</Icon>
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
