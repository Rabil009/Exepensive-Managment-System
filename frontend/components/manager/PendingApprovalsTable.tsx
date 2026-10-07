"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  ArrowRight,
  Plane,
  Building2,
  Utensils,
  Car,
  Check,
  X,
  Eye,
} from "lucide-react";
import { StatusBadge, ExpenseTypeBadge } from "./StatusBadge";
import { EmployeeAvatar } from "./EmployeeAvatar";

export interface ExpenseApprovalItem {
  id: string;
  employeeName: string;
  department: string;
  avatarColor: string;
  avatarLetter: string;
  expenseType: "Travel" | "Hotel" | "Meals" | "Transport" | string;
  description: string;
  amount: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const DEFAULT_APPROVALS: ExpenseApprovalItem[] = [
  {
    id: "EXP-101",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    avatarColor: "bg-blue-600",
    avatarLetter: "R",
    expenseType: "Travel",
    description: "Client meeting - Bangalore",
    amount: "₹8,500",
    date: "Jun 28, 2025",
    status: "Pending",
  },
  {
    id: "EXP-102",
    employeeName: "Priya Nair",
    department: "Product",
    avatarColor: "bg-purple-600",
    avatarLetter: "P",
    expenseType: "Hotel",
    description: "Conference stay",
    amount: "₹4,200",
    date: "Jun 26, 2025",
    status: "Pending",
  },
  {
    id: "EXP-103",
    employeeName: "Arjun Reddy",
    department: "Sales",
    avatarColor: "bg-emerald-600",
    avatarLetter: "A",
    expenseType: "Meals",
    description: "Client lunch",
    amount: "₹2,800",
    date: "Jun 25, 2025",
    status: "Pending",
  },
  {
    id: "EXP-104",
    employeeName: "Sneha Iyer",
    department: "Marketing",
    avatarColor: "bg-rose-600",
    avatarLetter: "S",
    expenseType: "Transport",
    description: "Airport taxi",
    amount: "₹1,500",
    date: "Jun 24, 2025",
    status: "Pending",
  },
];

export interface PendingApprovalsTableProps {
  items?: ExpenseApprovalItem[];
  description?: string;
  onApprove?: (item: ExpenseApprovalItem) => void;
  onReject?: (item: ExpenseApprovalItem) => void;
  onViewAll?: () => void;
  className?: string;
}

export function PendingApprovalsTable({
  items = DEFAULT_APPROVALS,
  description,
  onApprove,
  onReject,
  onViewAll,
  className = "",
}: PendingApprovalsTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getExpenseIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("travel")) return <Plane className="h-3 w-3" />;
    if (t.includes("hotel")) return <Building2 className="h-3 w-3" />;
    if (t.includes("meal")) return <Utensils className="h-3 w-3" />;
    return <Car className="h-3 w-3" />;
  };

  return (
    <div
      className={`bg-[#0b0c10] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.45),_inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-8 sm:py-5 border-b border-white/[0.06] gap-3">
        <div>
          <h3 className="text-[18px] font-semibold text-white tracking-tight leading-none">
            Pending Approvals
          </h3>
          {description && (
            <p className="text-sm sm:text-[15px] text-zinc-400 mt-1.5 font-normal">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="self-start sm:self-auto flex items-center gap-1.5 h-9 px-3.5 bg-[#121216] hover:bg-[#181820] border border-white/[0.08] hover:border-white/[0.14] rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Table Head: 16px, semibold, white */}
          <thead className="border-b border-white/[0.07] bg-white/[0.015] select-none">
            <tr>
              <th className="py-4 pl-6 sm:pl-8 pr-4 text-[16px] font-semibold text-white tracking-tight">
                Employee
              </th>
              <th className="py-4 px-4 text-[16px] font-semibold text-white tracking-tight">
                Expense Type
              </th>
              <th className="py-4 px-4 text-[16px] font-semibold text-white tracking-tight">
                Description
              </th>
              <th className="py-4 px-4 text-[16px] font-semibold text-white tracking-tight">
                Amount
              </th>
              <th className="py-4 px-4 text-[16px] font-semibold text-white tracking-tight">
                Date
              </th>
              <th className="py-4 px-4 text-[16px] font-semibold text-white tracking-tight">
                Status
              </th>
              <th className="py-4 pr-6 sm:pr-8 pl-4 text-right text-[16px] font-semibold text-white tracking-tight">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body: 64–72px row height (68px) and subtle hover states */}
          <tbody className="divide-y divide-white/[0.05]">
            {items.map((row) => {
              const isMenuOpen = activeMenuId === row.id;

              return (
                <tr
                  key={row.id}
                  className="h-[68px] transition-colors duration-150 hover:bg-white/[0.035]"
                >
                  {/* Employee Name & Avatar */}
                  <td className="pl-6 sm:pl-8 pr-4">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar
                        name={row.employeeName}
                        department={row.department}
                        size="md"
                      />
                      <div>
                        <div className="font-semibold text-white text-[14px] leading-tight">
                          {row.employeeName}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5 leading-tight">
                          {row.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Expense Type Badge */}
                  <td className="px-4 whitespace-nowrap">
                    <ExpenseTypeBadge
                      type={row.expenseType}
                      icon={getExpenseIcon(row.expenseType)}
                    />
                  </td>

                  {/* Description: 14–16px */}
                  <td className="px-4 text-zinc-300 text-[14px] sm:text-[15px] font-normal max-w-[280px] truncate leading-normal">
                    {row.description}
                  </td>

                  {/* Amount */}
                  <td className="px-4 font-semibold text-[15px] text-white tabular-nums">
                    {row.amount}
                  </td>

                  {/* Date */}
                  <td className="px-4 text-zinc-400 text-sm whitespace-nowrap">
                    {row.date}
                  </td>

                  {/* Refined Status Badge */}
                  <td className="px-4 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Actions Dropdown */}
                  <td className="pr-6 sm:pr-8 pl-4 text-right relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : row.id)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-6 sm:right-8 top-12 w-40 bg-[#0e0e12]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] py-1.5 z-30 text-xs text-left animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            onApprove?.(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-emerald-400 hover:bg-white/[0.06] cursor-pointer font-medium transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onReject?.(row);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-white/[0.06] cursor-pointer font-medium transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <div className="h-px bg-white/[0.06] my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:bg-white/[0.06] hover:text-white cursor-pointer font-medium transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-zinc-400" />
                          <span>View Details</span>
                        </button>
                      </div>
                    )}
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

export default PendingApprovalsTable;

