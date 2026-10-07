"use client";

import React, { useState } from "react";
import { X, PlusCircle, Upload, ShieldAlert } from "lucide-react";
import { useFinanceStore } from "@/lib/finance-store";
import type { ExpenseCategory, PaymentMethod } from "@/types/finance";

interface QuickCreateModalProps {
  onClose: () => void;
}

export function QuickCreateModal({ onClose }: QuickCreateModalProps) {
  const { createClaim } = useFinanceStore();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("SOFTWARE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PERSONAL_CARD");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [employeeName, setEmployeeName] = useState("Rahul Sharma");
  const [department, setDepartment] = useState("Engineering");
  const [receiptName, setReceiptName] = useState("invoice_oct2026.pdf");

  const numAmount = parseFloat(amount) || 0;
  const isCapExceeded =
    (category === "HOTEL" && numAmount > 5000) ||
    (category === "MEALS" && numAmount > 1500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !numAmount) return;

    createClaim({
      title,
      amount: numAmount,
      category,
      paymentMethod,
      merchant: merchant || "Corporate Vendor",
      description,
      employeeName,
      employeeDepartment: department,
      receiptName,
      policyViolation: isCapExceeded
        ? `${category} standard daily limit exceeded (${category === "HOTEL" ? "₹5,000" : "₹1,500"}).`
        : undefined,
      policyExceededAmount: isCapExceeded ? numAmount - (category === "HOTEL" ? 5000 : 1500) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-lg bg-[#0E0E11] border border-white/[0.08] shadow-2xl p-6 text-[#F4F4F5] relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-[#F4F4F5]">
                Quick Create Expense
              </h3>
              <p className="text-[12px] text-[#71717A]">PRD FR-02: Log expense claim into Finance queue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#F4F4F5] p-1 rounded hover:bg-white/[0.04]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Expense Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Cloud Cluster Multi-AZ Compute"
              className="w-full h-8 px-3 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] placeholder-[#71717A] focus:border-white/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Amount (INR) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ 0.00"
                className="w-full h-8 px-3 font-mono rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] placeholder-[#71717A] focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full h-8 px-2.5 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none"
              >
                <option value="SOFTWARE">Software & Cloud</option>
                <option value="TRAVEL">Flight & Travel</option>
                <option value="HOTEL">Hotel & Lodging</option>
                <option value="MEALS">Meals & Hospitality</option>
                <option value="HARDWARE">Hardware Equipment</option>
                <option value="TRAINING">Conferences & Training</option>
                <option value="OTHER">Other Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full h-8 px-2.5 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none"
              >
                <option value="PERSONAL_CARD">Personal Card (Reimbursable)</option>
                <option value="PERSONAL_UPI">Personal UPI (Reimbursable)</option>
                <option value="CORPORATE_CARD">Corporate Card (Non-reimbursable)</option>
                <option value="PERSONAL_CASH">Personal Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Merchant / Payee
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="w-full h-8 px-3 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] placeholder-[#71717A] focus:border-white/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Claimant Employee
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full h-8 px-3 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#A1A1AA] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-8 px-2.5 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1">
              Business Purpose
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain business justification..."
              className="w-full p-2.5 rounded bg-[#141417] border border-white/[0.08] text-[12px] text-[#F4F4F5] placeholder-[#71717A] focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] text-[#A1A1AA] mb-1 flex items-center gap-1.5">
              <Upload className="h-3 w-3 text-[#71717A]" />
              Attached Receipt (PDF/JPG/PNG)
            </label>
            <input
              type="text"
              value={receiptName}
              onChange={(e) => setReceiptName(e.target.value)}
              className="w-full h-8 px-3 font-mono rounded bg-[#141417] border border-white/[0.08] text-[11px] text-[#F4F4F5] focus:outline-none"
            />
          </div>

          {isCapExceeded && (
            <div className="rounded bg-amber-500/10 border border-amber-500/20 p-2.5 flex items-start gap-2 text-[11px] text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                PRD FR-05 Policy Alert: Exceeds standard {category} cap. An exception warning will be logged for Finance verification.
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded bg-transparent hover:bg-white/[0.04] text-[12px] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded bg-white hover:bg-[#ECECED] text-black font-medium text-[12px] transition-colors cursor-pointer"
            >
              Submit to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

