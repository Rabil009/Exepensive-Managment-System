"use client";

interface HeroAmbientBackgroundProps {
  className?: string;
}

export function HeroAmbientBackground({ className = "" }: HeroAmbientBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* ── Soft Sky-Blue / Ice-Cyan Radiant Center Glow ── */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[1200px] h-[900px] opacity-75 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(186, 230, 253, 0.8) 0%, rgba(224, 242, 254, 0.6) 35%, rgba(240, 249, 255, 0.2) 65%, transparent 85%)",
        }}
      />

      {/* ── Secondary Powder Blue Soft Wings ── */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[550px] opacity-65 blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 70%, rgba(147, 197, 253, 0.45) 0%, rgba(191, 219, 254, 0.2) 50%, transparent 80%)",
        }}
      />

      {/* ── Subtle Concentric Radial Rings (Matching Pathio Centerpiece) ── */}
      <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-sky-300/30 opacity-60 pointer-events-none" />
      <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full border border-sky-200/25 opacity-50 pointer-events-none" />
      <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1240px] h-[1240px] rounded-full border border-sky-100/20 opacity-40 pointer-events-none" />

      {/* ── Seamless Top & Bottom Bleed ── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
    </div>
  );
}
