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
      {/* ── High-Luxury Ambient Radial Spotlight (Static, Serene, Zero Motion) ── */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] opacity-75 dark:opacity-40"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(195, 155, 90, 0.22) 0%, rgba(180, 140, 75, 0.07) 45%, transparent 75%)",
        }}
      />

      {/* ── Soft Volumetric Ambient Diffusion Cone ── */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[500px] opacity-60 dark:opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 122, 0.25) 0%, rgba(179, 139, 77, 0.1) 50%, transparent 80%)",
        }}
      />

      {/* ── Crisp Static Architectural Financial Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--text-display) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text-display) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Atmospheric Vignette and Seamless Base Bleed ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-page)]/50 via-transparent to-[var(--bg-page)]" />
    </div>
  );
}
