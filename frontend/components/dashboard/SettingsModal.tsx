"use client";

import React, { useState } from "react";
import { X, Settings, ShieldCheck, Check, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme-store";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [hotelCap, setHotelCap] = useState("5000");
  const [mealsCap, setMealsCap] = useState("1500");
  const [receiptRequiredAbove, setReceiptRequiredAbove] = useState("500");
  const [currency] = useState("INR");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Policy threshold rules updated successfully.");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 relative select-none transition-colors ${
          isDark
            ? "bg-[#111113] border-white/[0.08] text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-white border-zinc-200/90 text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b pb-3.5 mb-4 ${
            isDark ? "border-white/[0.08]" : "border-zinc-200/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDark ? "bg-white/[0.06] text-zinc-300" : "bg-zinc-100 text-zinc-700"
              }`}
            >
              <Settings className="h-4 w-4 stroke-[1.85]" />
            </div>
            <div>
              <h3
                className={`text-[15px] font-semibold tracking-tight ${
                  isDark ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                Manager & Policy Settings
              </h3>
              <p
                className={`text-[11px] ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Approval thresholds and interface preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Appearance Theme Selector */}
          <div>
            <label
              className={`block text-[12px] font-medium mb-1.5 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Interface Theme
            </label>
            <div
              className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${
                isDark ? "bg-[#18181D] border-white/[0.06]" : "bg-zinc-50 border-zinc-200/80"
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isDark
                    ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Light</span>
                {!isDark && <Check className="h-3 w-3 text-zinc-900 ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? "bg-[#25252D] text-white shadow-xs border border-white/[0.1] font-semibold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-blue-400" />
                <span>Dark</span>
                {isDark && <Check className="h-3 w-3 text-white ml-auto" />}
              </button>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label
              className={`block text-[12px] font-medium mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Organization Currency
            </label>
            <input
              type="text"
              disabled
              value={`${currency} (Indian Rupee - Baseline)`}
              className={`w-full h-8 px-3 rounded-lg text-[12px] cursor-not-allowed border ${
                isDark
                  ? "bg-[#161619] border-white/[0.08] text-zinc-500"
                  : "bg-zinc-100 border-zinc-200 text-zinc-500"
              }`}
            />
          </div>

          {/* Hotel Cap */}
          <div>
            <label
              className={`block text-[12px] font-medium mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Hotel Accommodation Daily Cap
            </label>
            <div className="relative">
              <span
                className={`absolute left-3 top-2 text-[12px] font-mono ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                ₹
              </span>
              <input
                type="number"
                value={hotelCap}
                onChange={(e) => setHotelCap(e.target.value)}
                className={`w-full h-8 pl-7 pr-3 font-mono rounded-lg border text-[12px] transition-colors focus:outline-none ${
                  isDark
                    ? "bg-[#161619] border-white/[0.08] text-zinc-100 focus:border-white/20"
                    : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20"
                }`}
              />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
              Claims above ₹{hotelCap} trigger policy exception review
            </p>
          </div>

          {/* Meals Cap */}
          <div>
            <label
              className={`block text-[12px] font-medium mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Meals & Hospitality Daily Cap
            </label>
            <div className="relative">
              <span
                className={`absolute left-3 top-2 text-[12px] font-mono ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                ₹
              </span>
              <input
                type="number"
                value={mealsCap}
                onChange={(e) => setMealsCap(e.target.value)}
                className={`w-full h-8 pl-7 pr-3 font-mono rounded-lg border text-[12px] transition-colors focus:outline-none ${
                  isDark
                    ? "bg-[#161619] border-white/[0.08] text-zinc-100 focus:border-white/20"
                    : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20"
                }`}
              />
            </div>
          </div>

          {/* Receipt Requirement */}
          <div>
            <label
              className={`block text-[12px] font-medium mb-1 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Mandatory Receipt Requirement Threshold
            </label>
            <div className="relative">
              <span
                className={`absolute left-3 top-2 text-[12px] font-mono ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                ₹
              </span>
              <input
                type="number"
                value={receiptRequiredAbove}
                onChange={(e) => setReceiptRequiredAbove(e.target.value)}
                className={`w-full h-8 pl-7 pr-3 font-mono rounded-lg border text-[12px] transition-colors focus:outline-none ${
                  isDark
                    ? "bg-[#161619] border-white/[0.08] text-zinc-100 focus:border-white/20"
                    : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20"
                }`}
              />
            </div>
            <p className={`text-[11px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
              Tax invoices required for all claims above ₹{receiptRequiredAbove}
            </p>
          </div>

          {/* Footer buttons */}
          <div
            className={`pt-3 border-t flex items-center justify-end gap-2 ${
              isDark ? "border-white/[0.08]" : "border-zinc-200/80"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`h-8 px-4 rounded-lg font-semibold text-[12px] transition-colors cursor-pointer shadow-xs ${
                isDark
                  ? "bg-white hover:bg-zinc-100 text-black"
                  : "bg-zinc-900 hover:bg-black text-white"
              }`}
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
