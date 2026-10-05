"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface HeroAmbientBackgroundProps {
  videoSrc?: string;
  className?: string;
}

export function HeroAmbientBackground({
  videoSrc = "/videos/hero-finance.mp4",
  className = "",
}: HeroAmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  // ── Canvas Volumetric Light Rays & Glowing Nebula Simulation ─────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Nebula Orbs definition
    const isDark = resolvedTheme === "dark";
    
    // Ambient light orbs that slowly float and morph colors
    const orbs = [
      {
        x: width * 0.3,
        y: height * 0.25,
        radius: Math.min(width, height) * 0.45,
        vx: 0.15,
        vy: 0.12,
        baseHue: 42, // Warm Gold
        phase: 0,
      },
      {
        x: width * 0.7,
        y: height * 0.35,
        radius: Math.min(width, height) * 0.5,
        vx: -0.12,
        vy: 0.16,
        baseHue: 32, // Deep Amber / Bronze
        phase: Math.PI / 3,
      },
      {
        x: width * 0.5,
        y: height * 0.6,
        radius: Math.min(width, height) * 0.4,
        vx: 0.08,
        vy: -0.14,
        baseHue: 48, // Champagne Gold
        phase: Math.PI,
      },
      {
        x: width * 0.2,
        y: height * 0.7,
        radius: Math.min(width, height) * 0.35,
        vx: 0.14,
        vy: -0.1,
        baseHue: 220, // Celestial Indigo accent
        phase: Math.PI * 1.5,
      },
    ];

    // Subtle financial light particles
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.35 - 0.1, // float gently upwards
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Volumetric Light Ray Beams
    const rayCount = 7;
    const rays = Array.from({ length: rayCount }).map((_, i) => ({
      angle: (i / rayCount) * Math.PI * 0.7 - Math.PI * 0.35,
      width: Math.PI * 0.06,
      speed: 0.0003 + Math.random() * 0.0002,
      intensity: 0.12 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.008;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Nebula Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce gently inside canvas bounds
        if (orb.x < -orb.radius * 0.2) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + orb.radius * 0.2) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.radius * 0.2) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + orb.radius * 0.2) orb.vy = -Math.abs(orb.vy);

        // Color shift over time
        const dynamicHue = (orb.baseHue + Math.sin(time + orb.phase) * 14 + 360) % 360;
        const saturation = isDark ? 65 : 45;
        const lightness = isDark ? 32 : 72;
        const alpha = isDark ? 0.28 : 0.18;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );

        gradient.addColorStop(0, `hsla(${dynamicHue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${dynamicHue}, ${saturation}%, ${lightness}%, ${alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Volumetric Light Rays (Angling from top center)
      const originX = width * 0.5;
      const originY = -50;
      const rayLength = Math.max(width, height) * 1.4;

      rays.forEach((ray) => {
        const currentAngle = ray.angle + Math.sin(time * 0.5 + ray.phase) * 0.12;
        const rayAlpha = (Math.sin(time + ray.phase) * 0.5 + 0.5) * (isDark ? 0.08 : 0.05);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(originX, originY);

        const leftAngle = currentAngle - ray.width;
        const rightAngle = currentAngle + ray.width;

        ctx.lineTo(
          originX + Math.sin(leftAngle) * rayLength,
          originY + Math.cos(leftAngle) * rayLength
        );
        ctx.lineTo(
          originX + Math.sin(rightAngle) * rayLength,
          originY + Math.cos(rightAngle) * rayLength
        );
        ctx.closePath();

        const rayGrad = ctx.createRadialGradient(
          originX,
          originY,
          50,
          originX,
          originY + height * 0.7,
          rayLength
        );

        const rayHue = isDark ? "43" : "40"; // Warm gold rays
        rayGrad.addColorStop(0, `hsla(${rayHue}, 80%, 75%, ${rayAlpha * 1.5})`);
        rayGrad.addColorStop(0.4, `hsla(${rayHue}, 70%, 65%, ${rayAlpha})`);
        rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = rayGrad;
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Floating Micro Financial Data Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const particleAlpha = (Math.sin(p.pulsePhase) * 0.3 + 0.7) * (isDark ? p.alpha : p.alpha * 0.6);
        ctx.fillStyle = isDark
          ? `rgba(225, 195, 135, ${particleAlpha})`
          : `rgba(180, 140, 75, ${particleAlpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* HTML5 Video Layer with Autoplay, Muted, Loop & Inline */}
      {videoSrc && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-30 dark:opacity-35" : "opacity-0"
          } mix-blend-screen dark:mix-blend-lighten`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Volumetric Rays & Shifting Glowing Nebula Canvas Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover mix-blend-normal"
      />

      {/* Atmospheric Subtle Geometric Finance Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--text-display) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text-display) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial Atmospheric Lighting Vignette & Smooth Bottom Bleed */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-page)]/70 via-transparent to-[var(--bg-page)]" />
    </div>
  );
}
