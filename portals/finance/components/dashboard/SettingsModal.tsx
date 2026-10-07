"use client";

import React, { useState } from "react";
import { X, Settings, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [hotelCap, setHotelCap] = useState("5000");
  const [mealsCap, setMealsCap] = useState("1500");
  const [receiptRequiredAbove, setReceiptRequiredAbove] = useState("500");
  const [currency, setCurrency] = useState("INR");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Policy threshold rules updated successfully.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-lg bg-[#0E0E11] border border-white/[0.08] shadow-2xl p-6 text-[#F4F4F5] relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="h-4 w-4 text-[#A1A1AA]" />
            <h3 className="text-[15px] font-semibold text-[#F4F4F5]">
              Finance & Policy Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#F4F4F5] p-1 rounded hover:bg-white/[0.04]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Organization Currency (PRD Baseline)
            </label>
            <input
              type="text"
              disabled
              value={`${currency} (Indian Rupee - Fixed)`}
              className="w-full h-8 px-3 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#71717A] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Hotel Accommodation Cap (PRD Page 6)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[12px] text-[#71717A]">₹</span>
              <input
                type="number"
                value={hotelCap}
                onChange={(e) => setHotelCap(e.target.value)}
                className="w-full h-8 pl-7 pr-3 font-mono rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none focus:border-white/20"
              />
            </div>
            <p className="text-[11px] text-[#71717A] mt-0.5">Claims above this trigger policy exception alert</p>
          </div>

          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Meals & Hospitality Daily Cap (PRD Page 6)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[12px] text-[#71717A]">₹</span>
              <input
                type="number"
                value={mealsCap}
                onChange={(e) => setMealsCap(e.target.value)}
                className="w-full h-8 pl-7 pr-3 font-mono rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Mandatory Receipt Requirement Threshold
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[12px] text-[#71717A]">₹</span>
              <input
                type="number"
                value={receiptRequiredAbove}
                onChange={(e) => setReceiptRequiredAbove(e.target.value)}
                className="w-full h-8 pl-7 pr-3 font-mono rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none focus:border-white/20"
              />
            </div>
            <p className="text-[11px] text-[#71717A] mt-0.5">Receipt required for all claims above ₹500</p>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded bg-transparent hover:bg-white/[0.04] text-[12px] text-[#A1A1AA] hover:text-[#F4F4F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded bg-white hover:bg-[#ECECED] text-black font-medium text-[12px] transition-colors cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

