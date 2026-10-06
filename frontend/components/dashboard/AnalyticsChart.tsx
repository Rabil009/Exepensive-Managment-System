"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Data points matching the rhythmic wavy curves in the screenshot across June
const CHART_DATA = [
  { date: "Jun 1", blue: 110, green: 40 },
  { date: "Jun 2", blue: 95, green: 35 },
  { date: "Jun 3", blue: 310, green: 90 },
  { date: "Jun 4", blue: 120, green: 45 },
  { date: "Jun 5", blue: 330, green: 80 },
  { date: "Jun 6", blue: 105, green: 35 },
  { date: "Jun 7", blue: 320, green: 95 },
  { date: "Jun 8", blue: 345, green: 130 },
  { date: "Jun 9", blue: 430, green: 175 },
  { date: "Jun 10", blue: 210, green: 85 },
  { date: "Jun 11", blue: 130, green: 40 },
  { date: "Jun 12", blue: 340, green: 95 },
  { date: "Jun 13", blue: 140, green: 50 },
  { date: "Jun 14", blue: 360, green: 125 },
  { date: "Jun 15", blue: 310, green: 110 },
  { date: "Jun 16", blue: 440, green: 180 },
  { date: "Jun 17", blue: 230, green: 90 },
  { date: "Jun 18", blue: 150, green: 55 },
  { date: "Jun 19", blue: 350, green: 130 },
  { date: "Jun 20", blue: 320, green: 115 },
  { date: "Jun 21", blue: 210, green: 70 },
  { date: "Jun 22", blue: 450, green: 175 },
  { date: "Jun 23", blue: 190, green: 75 },
  { date: "Jun 24", blue: 320, green: 110 },
  { date: "Jun 25", blue: 430, green: 170 },
  { date: "Jun 26", blue: 210, green: 85 },
  { date: "Jun 27", blue: 135, green: 50 },
  { date: "Jun 28", blue: 280, green: 100 },
  { date: "Jun 29", blue: 190, green: 65 },
  { date: "Jun 30", blue: 380, green: 120 },
];

export function AnalyticsChart() {
  const [filter, setFilter] = useState<"3m" | "30d" | "7d">("30d");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="rounded-lg bg-[#0E0E11] border border-white/[0.08] p-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-[#F4F4F5] tracking-tight">
            Total Visitors
          </h3>
          <p className="text-[12px] text-[#71717A] mt-0.5">
            Total for the last 3 months
          </p>
        </div>

        {/* Filter buttons matching screenshot */}
        <div className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#141417] p-0.5">
          <button
            type="button"
            onClick={() => setFilter("3m")}
            className={`px-3 py-1 text-[12px] font-normal rounded transition-colors ${
              filter === "3m"
                ? "bg-[#27272A] text-[#F4F4F5]"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Last 3 months
          </button>
          <button
            type="button"
            onClick={() => setFilter("30d")}
            className={`px-3 py-1 text-[12px] font-normal rounded transition-colors ${
              filter === "30d"
                ? "bg-[#27272A] text-[#F4F4F5]"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Last 30 days
          </button>
          <button
            type="button"
            onClick={() => setFilter("7d")}
            className={`px-3 py-1 text-[12px] font-normal rounded transition-colors ${
              filter === "7d"
                ? "bg-[#27272A] text-[#F4F4F5]"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Last 7 days
          </button>
        </div>
      </div>

      {/* Chart Visual matching screenshot */}
      <div className="h-[200px] w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.65} />
                  <stop offset="90%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.65} />
                  <stop offset="90%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0 0"
                stroke="rgba(255, 255, 255, 0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={1}
                tick={{ fill: "#71717A" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181B",
                  borderColor: "rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#F4F4F5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              />
              <Area
                type="monotone"
                dataKey="blue"
                stroke="#3B82F6"
                strokeWidth={1.75}
                fillOpacity={1}
                fill="url(#blueGradient)"
              />
              <Area
                type="monotone"
                dataKey="green"
                stroke="#10B981"
                strokeWidth={1.75}
                fillOpacity={1}
                fill="url(#greenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-[#121215] animate-pulse rounded" />
        )}
      </div>
    </div>
  );
}

