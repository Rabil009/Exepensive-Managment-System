"use client";

import React, { useState } from "react";
import { Columns, ChevronDown, Plus } from "lucide-react";

interface TableTabsAndActionsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAddSection?: () => void;
}

export function TableTabsAndActions({
  activeTab = "Outline",
  onTabChange,
  onAddSection,
}: TableTabsAndActionsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    { label: "Outline", count: null },
    { label: "Past Performance", count: 3 },
    { label: "Key Personnel", count: 2 },
    { label: "Focus Documents", count: null },
  ];

  const handleSelect = (label: string) => {
    setCurrentTab(label);
    onTabChange?.(label);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Tabs */}
      <div className="inline-flex items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleSelect(tab.label)}
              className={`h-8 px-3.5 rounded-md text-[13px] font-normal inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#1E1E23] text-[#F4F4F5] border border-white/[0.12] font-medium"
                  : "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="h-4 min-w-4 px-1 rounded-full bg-[#27272A] text-[10px] font-mono text-[#A1A1AA] flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="h-8 px-3 rounded-md bg-[#141417] hover:bg-[#1E1E23] border border-white/[0.08] text-[#F4F4F5] text-[13px] font-normal flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Columns className="h-3.5 w-3.5 text-[#A1A1AA]" />
          <span>Customize Columns</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#71717A]" />
        </button>

        <button
          type="button"
          onClick={onAddSection}
          className="h-8 px-3 rounded-md bg-[#141417] hover:bg-[#1E1E23] border border-white/[0.08] text-[#F4F4F5] text-[13px] font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 text-[#A1A1AA]" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
}

