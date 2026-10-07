export function SpendingOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Spending Trend
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-0.5 rounded-lg bg-surface-container-low font-label-md text-label-md">
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                type="button"
              >
                Daily
              </button>
              <button
                className="px-2.5 py-1 rounded-md text-outline hover:text-on-surface transition-colors"
                type="button"
              >
                Weekly
              </button>
            </div>
            <span className="font-label-caps text-label-caps uppercase px-2 py-1 rounded bg-surface-container-low text-outline">
              Oct 1 – Oct 31
            </span>
          </div>
        </div>
        <div className="relative w-full h-64 mt-2 select-none">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 740 220"
          >
            <defs>
              <linearGradient id="spendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0071e3" stopOpacity="0.22"></stop>
                <stop
                  offset="100%"
                  stopColor="#0071e3"
                  stopOpacity="0.0"
                ></stop>
              </linearGradient>
            </defs>
            <line
              stroke="#eeedf3"
              strokeDasharray="3 3"
              strokeWidth="1"
              x1="40"
              x2="720"
              y1="20"
              y2="20"
            ></line>
            <line
              stroke="#eeedf3"
              strokeDasharray="3 3"
              strokeWidth="1"
              x1="40"
              x2="720"
              y1="65"
              y2="65"
            ></line>
            <line
              stroke="#eeedf3"
              strokeDasharray="3 3"
              strokeWidth="1"
              x1="40"
              x2="720"
              y1="110"
              y2="110"
            ></line>
            <line
              stroke="#eeedf3"
              strokeDasharray="3 3"
              strokeWidth="1"
              x1="40"
              x2="720"
              y1="155"
              y2="155"
            ></line>
            <line
              stroke="#eeedf3"
              strokeWidth="1"
              x1="40"
              x2="720"
              y1="200"
              y2="200"
            ></line>
            <text
              className="font-financial-tabular"
              fill="#717785"
              fontSize="10"
              textAnchor="end"
              x="32"
              y="24"
            >
              $4k
            </text>
            <text
              className="font-financial-tabular"
              fill="#717785"
              fontSize="10"
              textAnchor="end"
              x="32"
              y="69"
            >
              $3k
            </text>
            <text
              className="font-financial-tabular"
              fill="#717785"
              fontSize="10"
              textAnchor="end"
              x="32"
              y="114"
            >
              $2k
            </text>
            <text
              className="font-financial-tabular"
              fill="#717785"
              fontSize="10"
              textAnchor="end"
              x="32"
              y="159"
            >
              $1k
            </text>
            <text
              className="font-financial-tabular"
              fill="#717785"
              fontSize="10"
              textAnchor="end"
              x="32"
              y="203"
            >
              $0
            </text>
            <polygon
              fill="url(#spendGradient)"
              points="50,200 50,178 110,182 170,165 230,130 290,148 350,118 410,136 470,95 530,120 590,52 650,140 710,162 710,200"
            ></polygon>
            <polyline
              fill="none"
              points="50,178 110,182 170,165 230,130 290,148 350,118 410,136 470,95 530,120 590,52 650,140 710,162"
              stroke="#0071e3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            ></polyline>
            <circle
              cx="170"
              cy="165"
              fill="#ffffff"
              r="3.5"
              stroke="#0071e3"
              strokeWidth="2"
            ></circle>
            <circle
              cx="290"
              cy="148"
              fill="#ffffff"
              r="3.5"
              stroke="#0071e3"
              strokeWidth="2"
            ></circle>
            <circle
              cx="410"
              cy="136"
              fill="#ffffff"
              r="3.5"
              stroke="#0071e3"
              strokeWidth="2"
            ></circle>
            <circle
              cx="470"
              cy="95"
              fill="#ffffff"
              r="3.5"
              stroke="#0071e3"
              strokeWidth="2"
            ></circle>
            <line
              opacity="0.6"
              stroke="#0071e3"
              strokeDasharray="2 2"
              strokeWidth="1.5"
              x1="590"
              x2="590"
              y1="52"
              y2="200"
            ></line>
            <circle cx="590" cy="52" fill="#0071e3" r="6"></circle>
            <circle cx="590" cy="52" fill="#ffffff" r="2.5"></circle>
          </svg>
          <div className="absolute top-2 left-[73%] -translate-x-1/2 bg-on-background/95 backdrop-blur-md text-surface-container-lowest px-3 py-1.5 rounded-lg shadow-xl pointer-events-none text-left">
            <div className="font-financial-tabular text-body-sm font-semibold tracking-tight">
              $1,120.00
            </div>
            <div className="font-label-caps text-label-caps text-outline-variant flex items-center gap-1 mt-0.5">
              <span className="">Oct 24</span>
              <span className="">·</span>
              <span className="">Delta Air Lines</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-6 pt-2 font-financial-tabular text-body-sm text-outline">
          <span className="">Oct 5</span>
          <span className="">Oct 10</span>
          <span className="">Oct 15</span>
          <span className="">Oct 20</span>
          <span className="text-primary font-semibold">Oct 24</span>
          <span className="">Oct 30</span>
        </div>
      </div>
      <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Category Breakdown
            </h2>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              FY25
            </span>
          </div>
        </div>
        <div className="relative flex items-center justify-center my-3">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#eeedf3"
              strokeWidth="14"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#0071e3"
              strokeDasharray="107.44 238.76"
              strokeDashoffset="0"
              strokeWidth="14"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#008633"
              strokeDasharray="54.91 238.76"
              strokeDashoffset="-107.44"
              strokeWidth="14"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#5f5e60"
              strokeDasharray="45.36 238.76"
              strokeDashoffset="-162.35"
              strokeWidth="14"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#0059b5"
              strokeDasharray="31.03 238.76"
              strokeDashoffset="-207.71"
              strokeWidth="14"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              $38,420
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0"></span>
              <span className="truncate font-medium text-on-surface">
                Travel &amp; Lodging
              </span>
            </div>
            <span className="font-financial-tabular text-outline font-medium">
              45%
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container shrink-0"></span>
              <span className="truncate font-medium text-on-surface">
                Software &amp; SaaS
              </span>
            </div>
            <span className="font-financial-tabular text-outline font-medium">
              23%
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
              <span className="truncate font-medium text-on-surface">
                Meals &amp; Entertainment
              </span>
            </div>
            <span className="font-financial-tabular text-outline font-medium">
              19%
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-low/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
              <span className="truncate font-medium text-on-surface">
                Hardware &amp; Gear
              </span>
            </div>
            <span className="font-financial-tabular text-outline font-medium">
              13%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
