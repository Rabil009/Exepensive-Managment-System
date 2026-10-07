"use client";

import React, { useState } from "react";

// Curated high-resolution professional portrait avatars matching employee profiles
export const EMPLOYEE_AVATARS: Record<string, string> = {
  // Manager Profile
  "Tejaswini": "/tejaswini.jpg",

  // Curated professional corporate portraits
  "Priya Nair":
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Priya Singh":
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",

  "Rahul Sharma":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Arjun Reddy":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Sneha Iyer":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Vikram Malhotra":
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Ananya Deshmukh":
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Rohan Kapoor":
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Aditya Kumar":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Amit Kumar":
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Neha Verma":
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
  "Kavita Desai":
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&h=160&fit=crop&crop=faces&auto=format&q=80",
};

const COLOR_GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-600",
  "from-amber-600 to-orange-600",
  "from-rose-600 to-pink-600",
  "from-fuchsia-600 to-purple-600",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return COLOR_GRADIENTS[Math.abs(hash) % COLOR_GRADIENTS.length];
}

export interface EmployeeAvatarProps {
  name: string;
  department?: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "squircle";
  className?: string;
}

export function EmployeeAvatar({
  name,
  department,
  src,
  size = "md",
  shape = "circle",
  className = "",
}: EmployeeAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = src || EMPLOYEE_AVATARS[name];

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-xs",
    lg: "h-11 w-11 text-sm",
    xl: "h-14 w-14 text-base",
  }[size];

  const shapeClasses =
    shape === "circle"
      ? "rounded-full"
      : size === "xs"
      ? "rounded-md"
      : size === "sm"
      ? "rounded-lg"
      : size === "xl"
      ? "rounded-2xl"
      : "rounded-xl";

  if (resolvedSrc && !hasError) {
    return (
      <img
        src={resolvedSrc}
        alt={name}
        onError={() => setHasError(true)}
        className={`${sizeClasses} ${shapeClasses} object-cover ring-1 ring-zinc-300 dark:ring-white/[0.15] shrink-0 shadow-2xs ${className}`}
        loading="lazy"
      />
    );
  }

  // Graceful fallback with luxury gradient & initials
  return (
    <div
      aria-label={name}
      title={department ? `${name} (${department})` : name}
      className={`${sizeClasses} ${shapeClasses} bg-gradient-to-tr ${getGradient(
        name
      )} flex items-center justify-center text-white font-semibold tracking-wider shrink-0 ring-1 ring-white/10 shadow-2xs select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export interface EmployeeCellProps {
  name: string;
  department?: string;
  avatarSrc?: string;
  size?: "sm" | "md";
  shape?: "circle" | "squircle";
}

/**
 * Standard table cell rendering Employee Avatar alongside Name and Department
 */
export function EmployeeCell({
  name,
  department,
  avatarSrc,
  size = "md",
  shape = "circle",
}: EmployeeCellProps) {
  return (
    <div className="flex items-center gap-3">
      <EmployeeAvatar name={name} department={department} src={avatarSrc} size={size} shape={shape} />
      <div className="min-w-0">
        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {name}
        </div>
        {department && (
          <div className="text-[11px] text-zinc-500 truncate">{department}</div>
        )}
      </div>
    </div>
  );
}

