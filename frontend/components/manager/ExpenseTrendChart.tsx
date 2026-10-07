"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ExpenseTrendDataPoint {
  month: string;
  teamExpense: number; // in thousands (e.g. 28)
  approvedExpense: number; // in thousands (e.g. 21)
  displayTeam: string;
  displayApproved: string;
}

const DEFAULT_DATA: ExpenseTrendDataPoint[] = [
  { month: "Jan", teamExpense: 22, approvedExpense: 14, displayTeam: "₹22,000", displayApproved: "₹14,000" },
  { month: "Feb", teamExpense: 18, approvedExpense: 13, displayTeam: "₹18,000", displayApproved: "₹13,000" },
  { month: "Mar", teamExpense: 31, approvedExpense: 23, displayTeam: "₹31,000", displayApproved: "₹23,000" },
  { month: "Apr", teamExpense: 24, approvedExpense: 17, displayTeam: "₹24,000", displayApproved: "₹17,000" },
  { month: "May", teamExpense: 33, approvedExpense: 25, displayTeam: "₹33,000", displayApproved: "₹25,000" },
  { month: "Jun", teamExpense: 35, approvedExpense: 29, displayTeam: "₹35,200", displayApproved: "₹29,000" },
];

export function ExpenseTrendChart({
  data = DEFAULT_DATA,
  className = "",
}: {
  data?: ExpenseTrendDataPoint[];
  className?: string;
}) {
  const [selectedRange, setSelectedRange] = useState("Last 6 months");
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 640;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const maxY = 40; // 40k ceiling

  const slotWidth = chartW / data.length;
  const barWidth = 16;
  const barGap = 6;

  return (
    <div
      className={`h-full bg-[#0b0c10] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-7 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.45),_inset_0_1px_0_rgba(255,255,255,0.06)] relative flex flex-col justify-between transition-all duration-200 ${className}`}
    >
      {/* Header Bar: Title + Legend + Range Filter aligned on same baseline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center">
          <h3 className="text-[18px] font-semibold text-white tracking-tight leading-none">
            Expense Trend
          </h3>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs sm:text-[13px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2563eb] shadow-xs" />
              <span className="text-zinc-400 font-medium">Team Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981] shadow-xs" />
              <span className="text-zinc-400 font-medium">Approved</span>
            </div>
          </div>

          {/* Range Selector Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="h-9 flex items-center gap-2 bg-[#121216] hover:bg-[#181820] border border-white/[0.08] hover:border-white/[0.14] text-xs font-medium text-zinc-300 hover:text-white px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>{selectedRange}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                  showRangeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showRangeDropdown && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-36 bg-[#0a0a0d]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
                {["Last 3 months", "Last 6 months", "Year to date", "Full year 2025"].map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedRange(opt);
                        setShowRangeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Canvas */}
      <div className="relative mt-6 w-full h-56 sm:h-60">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="teamBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="approvedBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Clean, low-noise horizontal grid lines */}
          {[40, 20, 0].map((val) => {
            const y = paddingTop + chartH - (val / maxY) * chartH;
            const isBase = val === 0;

            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isBase ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)"}
                  strokeWidth="1"
                  strokeDasharray={isBase ? undefined : "4 4"}
                />
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="12"
                  fontFamily="Inter, sans-serif"
                >
                  {val === 0 ? "0" : `${val}K`}
                </text>
              </g>
            );
          })}

          {/* Bar Groups per Month */}
          {data.map((d, i) => {
            const isHovered = hoveredIndex === i;
            const slotCenterX = paddingLeft + (i + 0.5) * slotWidth;

            const teamH = (d.teamExpense / maxY) * chartH;
            const teamY = paddingTop + chartH - teamH;
            const teamX = slotCenterX - barWidth - barGap / 2;

            const approvedH = (d.approvedExpense / maxY) * chartH;
            const approvedY = paddingTop + chartH - approvedH;
            const approvedX = slotCenterX + barGap / 2;

            const groupOpacity = hoveredIndex !== null && !isHovered ? 0.4 : 1;

            return (
              <g
                key={d.month}
                className="transition-opacity duration-200"
                style={{ opacity: groupOpacity }}
              >
                {/* Column Ambient Background Highlight on Hover */}
                {isHovered && (
                  <rect
                    x={slotCenterX - slotWidth / 2 + 8}
                    y={paddingTop - 4}
                    width={slotWidth - 16}
                    height={chartH + 8}
                    rx="8"
                    fill="rgba(255, 255, 255, 0.025)"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                  />
                )}

                {/* Team Bar (Brand Blue) */}
                <rect
                  x={teamX}
                  y={teamY}
                  width={barWidth}
                  height={teamH}
                  rx="4"
                  fill="url(#teamBarGrad)"
                  filter={isHovered ? "url(#barGlow)" : undefined}
                  className="transition-all duration-300"
                />

                {/* Approved Bar (Brand Emerald) */}
                <rect
                  x={approvedX}
                  y={approvedY}
                  width={barWidth}
                  height={approvedH}
                  rx="4"
                  fill="url(#approvedBarGrad)"
                  className="transition-all duration-300"
                />

                {/* X-axis Month Label */}
                <text
                  x={slotCenterX}
                  y={paddingTop + chartH + 24}
                  textAnchor="middle"
                  fill={isHovered ? "#ffffff" : "#94a3b8"}
                  fontSize="13"
                  fontWeight={isHovered ? "600" : "500"}
                  className="transition-colors duration-150 select-none"
                >
                  {d.month}
                </text>

                {/* Hit Box */}
                <rect
                  x={slotCenterX - slotWidth / 2}
                  y={paddingTop}
                  width={slotWidth}
                  height={chartH + 28}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-4 transform -translate-x-1/2 bg-[#0a0a0d]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] z-30 pointer-events-none text-xs transition-all duration-150 animate-in fade-in"
            style={{
              left: `${((paddingLeft + (hoveredIndex + 0.5) * slotWidth) / width) * 100}%`,
            }}
          >
            <div className="font-semibold text-white pb-1.5 border-b border-white/[0.06] text-xs flex items-center justify-between gap-4">
              <span>{data[hoveredIndex].month} 2025</span>
              <span className="text-[10px] text-zinc-500 font-mono">Overview</span>
            </div>
            <div className="flex items-center justify-between gap-4 mt-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#2563eb]" />
                <span className="text-zinc-400 text-[11px]">Team Spend:</span>
              </div>
              <span className="font-semibold text-white">
                {data[hoveredIndex].displayTeam}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#10b981]" />
                <span className="text-zinc-400 text-[11px]">Approved:</span>
              </div>
              <span className="font-semibold text-emerald-400">
                {data[hoveredIndex].displayApproved}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseTrendChart;

