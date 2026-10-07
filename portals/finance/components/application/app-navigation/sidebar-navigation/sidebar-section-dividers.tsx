"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { NavItemType, NavItemDividerType } from "../config";

interface SidebarNavigationSectionDividersProps {
  activeUrl?: string;
  items: (NavItemType | NavItemDividerType)[];
  className?: string;
}

export function SidebarNavigationSectionDividers({
  activeUrl = "/",
  items,
  className = "",
}: SidebarNavigationSectionDividersProps) {
  // Track open state for expandable accordion items
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Folders: true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <nav className={`space-y-1 select-none font-sans ${className}`}>
      {items.map((item, index) => {
        // Divider line
        if ("divider" in item && item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="my-3 h-px bg-white/[0.08]"
            />
          );
        }

        const navItem = item as NavItemType;
        const hasSubItems = !!(navItem.items && navItem.items.length > 0);
        const isOpen = openGroups[navItem.label] ?? false;
        const isActive = activeUrl === navItem.href;
        const IconComponent = navItem.icon;

        // Expandable group with sub-items
        if (hasSubItems) {
          return (
            <div key={navItem.label} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(navItem.label)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {IconComponent && (
                    <IconComponent className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                  )}
                  <span>{navItem.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-[#71717A]" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-[#71717A]" />
                )}
              </button>

              {isOpen && navItem.items && (
                <div className="pl-6 space-y-0.5 border-l border-white/[0.06] ml-4">
                  {navItem.items.map((sub) => {
                    const isSubActive = activeUrl === sub.href;
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-md text-[12px] transition-colors ${
                          isSubActive
                            ? "text-[#F4F4F5] font-medium bg-[#1E1E23]"
                            : "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04]"
                        }`}
                      >
                        <span>{sub.label}</span>
                        {sub.badge !== undefined && (
                          <span className="h-4 min-w-4 px-1 rounded-full bg-[#27272A] text-[10px] font-mono text-[#A1A1AA] flex items-center justify-center">
                            {sub.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Standard Nav Link
        return (
          <Link
            key={navItem.label}
            href={navItem.href || "#"}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
              isActive
                ? "bg-[#1E1E23] text-[#F4F4F5] font-medium"
                : "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {IconComponent && (
                <IconComponent className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
              )}
              <span>{navItem.label}</span>
            </div>

            {navItem.badge && (
              <div className="shrink-0">{navItem.badge}</div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

