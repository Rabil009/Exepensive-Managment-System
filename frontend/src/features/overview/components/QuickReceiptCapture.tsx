type Props = { onUpload: () => void };
export function QuickReceiptCapture({ onUpload }: Props) {
  return (
    <section className="relative rounded-xl bg-surface-container-lowest p-space-lg shadow-sm overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-space-lg">
      <div className="flex items-center gap-space-lg">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shadow-inner flex-shrink-0">
          <span className="material-symbols-outlined text-2xl">
            document_scanner
          </span>
        </div>
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="">Add an Expense Receipt</span>
            <span className="bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2 py-0.5 rounded uppercase">
              Receipt Upload
            </span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Upload a receipt, then review and enter your expense details.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
        <label className="cursor-pointer inline-flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm transition-all shadow-sm active:scale-95">
          <span className="material-symbols-outlined text-base">
            upload_file
          </span>
          <span className="">Upload File</span>
          <input
            accept=".pdf,image/*"
            aria-label="Quick receipt upload"
            className="hidden"
            type="file"
            onChange={(event) => {
              if (event.target.files?.[0]) {
                onUpload();
                event.target.value = "";
              }
            }}
          />
        </label>
      </div>
    </section>
  );
}
