"use client";

import React, { useState } from "react";
import {
  GripVertical,
  MoreVertical,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface TableRowData {
  id: string;
  header: string;
  sectionType: string;
  status: "In Process" | "Done";
  target: number;
  limit: number;
  reviewer: string;
}

const INITIAL_ROWS: TableRowData[] = [
  {
    id: "row-1",
    header: "Cover page",
    sectionType: "Cover page",
    status: "In Process",
    target: 18,
    limit: 5,
    reviewer: "Eddie Lake",
  },
  {
    id: "row-2",
    header: "Table of contents",
    sectionType: "Table of contents",
    status: "Done",
    target: 29,
    limit: 24,
    reviewer: "Eddie Lake",
  },
  {
    id: "row-3",
    header: "Executive Summary",
    sectionType: "Narrative",
    status: "In Process",
    target: 15,
    limit: 12,
    reviewer: "Eddie Lake",
  },
  {
    id: "row-4",
    header: "Technical Approach",
    sectionType: "Methodology",
    status: "Done",
    target: 42,
    limit: 38,
    reviewer: "Eddie Lake",
  },
  {
    id: "row-5",
    header: "Cost & Budget Breakdown",
    sectionType: "Financial Table",
    status: "Done",
    target: 30,
    limit: 25,
    reviewer: "Eddie Lake",
  },
];

export function DocumentsTable() {
  const [rows, setRows] = useState<TableRowData[]>(INITIAL_ROWS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isAllSelected = selectedIds.size === rows.length && rows.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="rounded-lg bg-[#0E0E11] border border-white/[0.08] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#141417] border-b border-white/[0.08] text-[12px] font-normal text-[#A1A1AA]">
              {/* Checkbox + Header column */}
              <th className="py-2.5 px-4 font-normal w-[240px]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border border-white/20 bg-[#18181B] checked:bg-[#27272A] accent-[#71717A] cursor-pointer"
                  />
                  <span>Header</span>
                </div>
              </th>

              {/* Section Type */}
              <th className="py-2.5 px-4 font-normal">Section Type</th>

              {/* Status */}
              <th className="py-2.5 px-4 font-normal">Status</th>

              {/* Target */}
              <th className="py-2.5 px-4 font-normal">Target</th>

              {/* Limit */}
              <th className="py-2.5 px-4 font-normal">Limit</th>

              {/* Reviewer */}
              <th className="py-2.5 px-4 font-normal">Reviewer</th>

              {/* Options */}
              <th className="py-2.5 px-3 font-normal w-8"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/[0.04] text-[13px]">
            {rows.map((row) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-white/[0.02] ${
                    isSelected ? "bg-white/[0.03]" : ""
                  }`}
                >
                  {/* Grip + Checkbox + Header name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Reorder"
                        className="text-[#71717A] hover:text-[#A1A1AA] cursor-grab p-0.5"
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(row.id)}
                        className="h-3.5 w-3.5 rounded border border-white/20 bg-[#18181B] checked:bg-[#27272A] accent-[#71717A] cursor-pointer"
                      />
                      <span className="font-normal text-[#F4F4F5]">
                        {row.header}
                      </span>
                    </div>
                  </td>

                  {/* Section Type Badge */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded border border-white/[0.08] bg-[#141417] text-[12px] font-normal text-[#A1A1AA]">
                      {row.sectionType}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {row.status === "In Process" ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-white/[0.08] bg-[#141417] text-[12px] font-normal text-[#A1A1AA]">
                        <Loader2 className="h-3 w-3 animate-spin text-[#A1A1AA]" />
                        <span>In Process</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-white/[0.08] bg-[#141417] text-[12px] font-normal text-[#F4F4F5]">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>Done</span>
                      </div>
                    )}
                  </td>

                  {/* Target */}
                  <td className="py-3 px-4 text-[#F4F4F5] font-normal">
                    {row.target}
                  </td>

                  {/* Limit */}
                  <td className="py-3 px-4 text-[#F4F4F5] font-normal">
                    {row.limit}
                  </td>

                  {/* Reviewer */}
                  <td className="py-3 px-4 text-[#F4F4F5] font-normal">
                    {row.reviewer}
                  </td>

                  {/* Options */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      aria-label="Options"
                      className="text-[#71717A] hover:text-[#F4F4F5] p-1 rounded transition-colors"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

