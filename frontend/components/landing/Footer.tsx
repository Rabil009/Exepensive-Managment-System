export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-16 pb-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-white/70">
      {/* Left Text */}
      <p className="text-left font-normal">
        FinPulse helps teams manage spending
      </p>

      {/* Centered Copyright */}
      <p className="text-center font-normal">
        Copyright © 2026 FinPulse. All rights reserved.
      </p>

      {/* Right Language Label */}
      <span className="text-right font-medium text-white/90">
        English
      </span>
    </footer>
  );
}
