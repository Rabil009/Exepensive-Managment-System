"use client";

interface HeroAmbientBackgroundProps {
  className?: string;
}

export function HeroAmbientBackground({ className = "" }: HeroAmbientBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none w-full h-full ${className}`}
      aria-hidden="true"
    >
      {/* ── Precision Architectural Dot Matrix (Linear / Stripe Style) ── */}
      <div 
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.1px, transparent 1.1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 40%, transparent 95%)",
        }}
      />

      {/* ── Soft Emerald Treasury Radiant Glow (Finance / Positive Cashflow) ── */}
      <div 
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[1100px] max-w-[100vw] h-[600px] opacity-40 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16, 185, 129, 0.18) 0%, rgba(13, 148, 136, 0.08) 45%, transparent 75%)",
        }}
      />

      {/* ── Subtle Slate Ambient Counterbalance ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] opacity-30 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── Seamless Top & Bottom Bleed ── */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
    </div>
  );
}
