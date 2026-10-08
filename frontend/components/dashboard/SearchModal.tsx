"use client";

import React, { useState } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { formatCurrency } from "@/lib";
import { useTheme } from "@/lib/theme-store";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { claims, setActiveView } = useFinanceStore();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? claims.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.employeeName.toLowerCase().includes(query.toLowerCase()) ||
          c.id.toLowerCase().includes(query.toLowerCase()) ||
          (c.paymentReference && c.paymentReference.toLowerCase().includes(query.toLowerCase())) ||
          (c.merchant && c.merchant.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-4 relative select-none transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.08] text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-white border-zinc-200/90 text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative flex items-center border-b pb-3 ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
        >
          <Search
            className={`h-4 w-4 ml-2 shrink-0 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claims, employee names, UTR numbers, merchants..."
            className={`w-full h-8 pl-3 pr-8 bg-transparent text-[13px] focus:outline-none ${
              isDark
                ? "text-zinc-100 placeholder-zinc-500"
                : "text-zinc-900 placeholder-zinc-400"
            }`}
          />
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
          {query.trim() && results.length === 0 && (
            <p className="text-center py-6 text-[12px] text-zinc-500">
              No financial records matched &ldquo;{query}&rdquo;
            </p>
          )}

          {!query.trim() && (
            <p className="text-center py-4 text-[11px] text-zinc-400">
              Type an employee name, claim ID (e.g. CLM-001), or UTR reference...
            </p>
          )}

          {results.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setActiveView("Verification");
                onClose();
              }}
              className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                isDark
                  ? "hover:bg-white/[0.04]"
                  : "hover:bg-zinc-100/70"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-blue-500 font-semibold">{c.id}</span>
                  <span
                    className={`text-[13px] font-medium ${
                      isDark ? "text-zinc-100" : "text-zinc-900"
                    }`}
                  >
                    {c.title}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {c.employeeName} ({c.employeeDepartment}) • {(c.paymentMethod || "").replace("_", " ")}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[12px] text-emerald-500 font-semibold block">
                  {formatCurrency(c.amount, c.currency)}
                </span>
                <span className="text-[10px] text-zinc-400">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
