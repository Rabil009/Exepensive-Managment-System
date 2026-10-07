"use client";

import React, { useState } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import { formatCurrency } from "@/lib";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-lg bg-[#0E0E11] border border-white/[0.08] shadow-2xl p-4 text-[#F4F4F5] relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center border-b border-white/[0.08] pb-3">
          <Search className="h-4 w-4 text-[#71717A] ml-2" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claims, employee names, UTR numbers, merchants..."
            className="w-full h-8 pl-3 pr-8 bg-transparent text-[13px] text-[#F4F4F5] placeholder-[#71717A] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#F4F4F5] p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto space-y-1.5">
          {query.trim() && results.length === 0 && (
            <p className="text-center py-6 text-[12px] text-[#71717A]">
              No financial records matched &ldquo;{query}&rdquo;
            </p>
          )}

          {!query.trim() && (
            <p className="text-center py-4 text-[11px] text-[#71717A]">
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
              className="p-2.5 rounded hover:bg-white/[0.04] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-blue-400">{c.id}</span>
                  <span className="text-[13px] text-[#F4F4F5] font-normal">{c.title}</span>
                </div>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  {c.employeeName} ({c.employeeDepartment}) • {c.paymentMethod.replace("_", " ")}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[12px] text-emerald-400 block">
                  {formatCurrency(c.amount, c.currency)}
                </span>
                <span className="text-[10px] text-[#71717A]">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

