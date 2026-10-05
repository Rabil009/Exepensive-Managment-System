const FEATURES = [
  {
    title: "One-off or recurring",
    description: "Add a single expense or set up recurring ones that log themselves.",
  },
  {
    title: "Attach receipts",
    description: "Upload receipts and invoices and keep them linked to every entry.",
  },
  {
    title: "Add notes your way",
    description: "Tag, categorise and comment so every expense has context.",
  },
  {
    title: "Track & Trace",
    description: "See in real time when an expense is submitted, reviewed and approved.",
  },
];

export function FeatureRow() {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-left mt-20 sm:mt-28">
      {FEATURES.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight">
            {item.title}
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-[#888888] leading-relaxed font-normal">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
