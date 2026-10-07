"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface StatusSegment {
  label: "Pending" | "Approved" | "Rejected";
  count: number;
  percentage: number;
  color: string;
}

const DEFAULT_SEGMENTS: StatusSegment[] = [
  { label: "Pending", count: 24, percentage: 57, color: "#2563eb" }, // Brand Blue
  { label: "Approved", count: 13, percentage: 31, color: "#10b981" }, // Brand Emerald
  { label: "Rejected", count: 5, percentage: 12, color: "#a855f7" }, // Brand Purple
];

export function RequestStatusChart({
  segments = DEFAULT_SEGMENTS,
  className = "",
}: {
  segments?: StatusSegment[];
  className?: string;
}) {
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<StatusSegment | null>(null);

  const total = segments.reduce((acc, s) => acc + s.count, 0);

  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = -90;
  let accumulatedPercent = 0;

  const segmentSlices = segments.map((seg) => {
    const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += seg.percentage;

    const angleSpan = (seg.percentage / 100) * 360;
    const midAngle = accumulatedAngle + angleSpan / 2;
    accumulatedAngle += angleSpan;

    const rad = (midAngle * Math.PI) / 180;
    const textX = size / 2 + radius * Math.cos(rad);
    const textY = size / 2 + radius * Math.sin(rad);

    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
      textX,
      textY,
    };
  });

  return (
    <div
      className={`h-full bg-[#0b0c10] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-7 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.45),_inset_0_1px_0_rgba(255,255,255,0.06)] relative flex flex-col justify-between transition-all duration-200 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center">
          <h3 className="text-[18px] font-semibold text-white tracking-tight leading-none">
            Requests by Status
          </h3>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="h-9 flex items-center gap-2 bg-[#121216] hover:bg-[#181820] border border-white/[0.08] hover:border-white/[0.14] text-xs font-medium text-zinc-300 hover:text-white px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <span>{selectedFilter}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                showFilterDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-36 bg-[#0a0a0d]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
              {["All Time", "This Month", "Last Quarter", "This Year"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(opt);
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content (Donut + Legend) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 py-5 my-auto">
        {/* SVG Donut */}
        <div className="relative w-40 sm:w-44 h-40 sm:h-44 flex items-center justify-center shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />

            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              {segmentSlices.map((slice) => {
                const isHovered = hoveredSegment?.label === slice.label;
                return (
                  <circle
                    key={slice.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="butt"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(slice)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}
            </g>

            {segmentSlices.map((slice) => (
              <text
                key={`label-${slice.label}`}
                x={slice.textX}
                y={slice.textY + 3.5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                className="pointer-events-none select-none font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              >
                {slice.percentage}%
              </text>
            ))}
          </svg>

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-2">
            <span className="text-3xl sm:text-[34px] font-extrabold text-white tracking-tight leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              {total}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-1.5 leading-tight">
              Total Requests
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-2.5 w-full flex-1 max-w-sm">
          {segments.map((seg) => {
            const isHovered = hoveredSegment?.label === seg.label;
            return (
              <div
                key={seg.label}
                onMouseEnter={() => setHoveredSegment(seg)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 sm:gap-4 transition-all py-2.5 px-3.5 rounded-xl cursor-pointer border ${
                  isHovered
                    ? "bg-white/[0.06] border-white/[0.14] shadow-xs"
                    : "bg-[#121216]/50 border-white/[0.04] hover:border-white/[0.09] hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-zinc-200 font-medium text-[13px] truncate">
                    {seg.label}
                  </span>
                </div>

                <span className="text-white font-semibold text-[13px] tabular-nums text-right min-w-[28px]">
                  {seg.count}
                </span>

                <span className="text-zinc-400 font-medium text-xs tabular-nums text-right min-w-[42px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.04]">
                  {seg.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RequestStatusChart;

