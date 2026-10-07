"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, RotateCcw } from "lucide-react";
import { useTheme } from "@/lib/theme-store";

export interface FilterState {
  employee: string;
  dateRange: string;
  status: string;
  department: string;
  project: string;
  costCenter: string;
  category: string;
}

export const DEFAULT_FILTERS: FilterState = {
  employee: "All Employees",
  dateRange: "This Month",
  status: "All Statuses",
  department: "All Departments",
  project: "All Projects",
  costCenter: "All Cost Centers",
  category: "All Categories",
};

interface GlobalFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export function GlobalFilters({
  filters,
  onFilterChange,
  onReset,
}: GlobalFiltersProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count active non-default filters
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => value !== DEFAULT_FILTERS[key as keyof FilterState]
  ).length;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectClass = `w-full h-8 px-2.5 rounded-lg text-xs outline-none border transition-colors ${
    isDark
      ? "bg-[#18181D] border-white/[0.08] text-zinc-100 focus:border-white/20"
      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
  }`;

  const labelClass = `block text-[11px] font-medium mb-1 ${
    isDark ? "text-zinc-400" : "text-zinc-600"
  }`;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Single Top-Right Filter Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
          activeCount > 0
            ? isDark
              ? "bg-white text-zinc-950 border-white"
              : "bg-black text-white border-black"
            : isDark
            ? "bg-[#18181D] hover:bg-[#222228] border-white/[0.08] text-zinc-200"
            : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800"
        }`}
      >
        <Filter
          className={`h-3.5 w-3.5 ${
            activeCount > 0
              ? isDark
                ? "text-zinc-950"
                : "text-white"
              : isDark
              ? "text-zinc-400"
              : "text-zinc-600"
          }`}
        />
        <span>Filters</span>
        {activeCount > 0 && (
          <span
            className={`h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
              isDark ? "bg-zinc-900 text-white" : "bg-white text-black"
            }`}
          >
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          } ${
            activeCount > 0
              ? isDark
                ? "text-zinc-950"
                : "text-white"
              : isDark
              ? "text-zinc-400"
              : "text-zinc-500"
          }`}
        />
      </button>

      {/* Floating Filter Popover in Top Right Corner */}
      {isOpen && (
        <div
          className={`absolute right-0 top-10 z-50 w-80 rounded-xl border p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 font-sans select-none transition-colors ${
            isDark
              ? "bg-[#111113] border-white/[0.08] text-zinc-100 shadow-2xl"
              : "bg-white border-zinc-200 text-zinc-900 shadow-xl"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between pb-2 border-b ${
              isDark ? "border-white/[0.06]" : "border-zinc-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                Filter Dashboard
              </span>
              {activeCount > 0 && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                    isDark
                      ? "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
                      : "bg-zinc-100 text-zinc-600 border-zinc-200/80"
                  }`}
                >
                  {activeCount} active
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className={`text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Form Fields Stack */}
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Employee */}
            <div>
              <label className={labelClass}>Employee</label>
              <select
                value={filters.employee}
                onChange={(e) =>
                  onFilterChange({ ...filters, employee: e.target.value })
                }
                className={selectClass}
              >
                <option value="All Employees">All Employees</option>
                <option value="Rahul Sharma">Rahul Sharma</option>
                <option value="Priya Singh">Priya Singh</option>
                <option value="Amit Kumar">Amit Kumar</option>
                <option value="Neha Verma">Neha Verma</option>
                <option value="Aditya Kumar">Aditya Kumar</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className={labelClass}>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  onFilterChange({ ...filters, dateRange: e.target.value })
                }
                className={selectClass}
              >
                <option value="This Month">This Month (Oct 2026)</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months (Q3-Q4)</option>
                <option value="Current Fiscal Year">Current Fiscal Year (FY 26-27)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ ...filters, status: e.target.value })
                }
                className={selectClass}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Awaiting Verification">Awaiting Verification</option>
                <option value="Approved">Approved</option>
                <option value="Reimbursement Pending">Reimbursement Pending</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Paid">Paid / Settled</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className={labelClass}>Department</label>
              <select
                value={filters.department}
                onChange={(e) =>
                  onFilterChange({ ...filters, department: e.target.value })
                }
                className={selectClass}
              >
                <option value="All Departments">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className={labelClass}>Project</label>
              <select
                value={filters.project}
                onChange={(e) =>
                  onFilterChange({ ...filters, project: e.target.value })
                }
                className={selectClass}
              >
                <option value="All Projects">All Projects</option>
                <option value="Project Phoenix">Project Phoenix</option>
                <option value="Core Platform Cloud">Core Platform Cloud</option>
                <option value="Brand Identity 2026">Brand Identity 2026</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  onFilterChange({ ...filters, category: e.target.value })
                }
                className={selectClass}
              >
                <option value="All Categories">All Categories</option>
                <option value="Travel">Travel & Flight</option>
                <option value="Meals">Meals & Hospitality</option>
                <option value="Software">Software & Cloud</option>
                <option value="Hardware">Hardware</option>
                <option value="Hotel">Hotel & Lodging</option>
              </select>
            </div>
          </div>

          {/* Footer Action */}
          <div
            className={`pt-2.5 border-t flex items-center justify-between text-[11px] ${
              isDark ? "border-white/[0.06] text-zinc-500" : "border-zinc-100 text-zinc-400"
            }`}
          >
            <span>Auto-applies instantly</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`h-7 px-3 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                isDark
                  ? "bg-white text-zinc-950 hover:bg-zinc-200"
                  : "bg-black text-white hover:bg-zinc-800"
              }`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
