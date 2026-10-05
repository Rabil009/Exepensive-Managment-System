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
      {/* ── High-Luxury Ambient Radial Spotlight (Cool Platinum, Pure Monochromatic) ── */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] opacity-75 dark:opacity-35"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(120, 130, 150, 0.15) 0%, rgba(100, 110, 130, 0.05) 45%, transparent 75%)",
        }}
      />

      {/* ── Soft Volumetric Ambient Diffusion Cone (Cool Silver/Slate) ── */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[500px] opacity-50 dark:opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(160, 175, 200, 0.18) 0%, rgba(140, 155, 180, 0.06) 50%, transparent 80%)",
        }}
      />

      {/* ── Crisp Static Architectural Financial Grid ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
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
