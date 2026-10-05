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
      {/* ── Soft Sky-Blue / Ice-Cyan Radiant Full-Screen Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[1600px] max-w-[100vw] h-[1000px] opacity-80 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(186, 230, 253, 0.85) 0%, rgba(224, 242, 254, 0.65) 35%, rgba(240, 249, 255, 0.3) 65%, transparent 85%)",
        }}
      />

      {/* ── Secondary Powder Blue Soft Wings ── */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] opacity-70 blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 70%, rgba(147, 197, 253, 0.5) 0%, rgba(191, 219, 254, 0.25) 50%, transparent 80%)",
        }}
      />

      {/* ── Subtle Concentric Radial Rings (Matching Pathio Centerpiece) ── */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full border border-sky-300/35 opacity-60 pointer-events-none" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1020px] h-[1020px] rounded-full border border-sky-200/30 opacity-50 pointer-events-none" />
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1320px] h-[1320px] rounded-full border border-sky-100/25 opacity-40 pointer-events-none" />

      {/* ── Seamless Top & Bottom Bleed ── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
    </div>
  );
}
