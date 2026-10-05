"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  Receipt, 
  DollarSign, 
  Coins, 
  ShieldCheck, 
  ArrowDownUp, 
  Building2, 
  Smartphone,
  CheckCircle,
  PiggyBank,
  BadgePercent,
  CircleDollarSign,
  Scale
} from "lucide-react";

interface MethodTile {
  icon: typeof CreditCard;
  bg: string;
  fg: string;
  name: string;
}

const TILES_ROW_1: MethodTile[] = [
  { icon: CreditCard, bg: "bg-black", fg: "text-white", name: "Credit Card" },
  { icon: Landmark, bg: "bg-[#0A3CC8]", fg: "text-white", name: "Corporate Bank" },
  { icon: Wallet, bg: "bg-[#EC4899]", fg: "text-white", name: "Digital Wallet" },
  { icon: Receipt, bg: "bg-[#F59E0B]", fg: "text-black", name: "Expense Invoice" },
  { icon: DollarSign, bg: "bg-[#10B981]", fg: "text-white", name: "USD Rails" },
  { icon: Coins, bg: "bg-[#6366F1]", fg: "text-white", name: "Treasury Balance" },
  { icon: ShieldCheck, bg: "bg-[#EF4444]", fg: "text-white", name: "Fraud Guard" },
  { icon: Building2, bg: "bg-white", fg: "text-black", name: "Direct Bank" },
  { icon: ArrowDownUp, bg: "bg-[#3B82F6]", fg: "text-white", name: "NEFT / RTGS" },
  { icon: Smartphone, bg: "bg-[#8B5CF6]", fg: "text-white", name: "UPI Instant" },
  { icon: PiggyBank, bg: "bg-[#14B8A6]", fg: "text-white", name: "Savings Pool" },
  { icon: CircleDollarSign, bg: "bg-black", fg: "text-emerald-400", name: "Card Settlement" },
];

const TILES_ROW_2: MethodTile[] = [
  { icon: Wallet, bg: "bg-[#3B82F6]", fg: "text-white", name: "Virtual Wallet" },
  { icon: CreditCard, bg: "bg-[#F43F5E]", fg: "text-white", name: "Corporate Visa" },
  { icon: CheckCircle, bg: "bg-[#10B981]", fg: "text-white", name: "Cleared Payout" },
  { icon: Landmark, bg: "bg-black", fg: "text-white", name: "Central Clearing" },
  { icon: BadgePercent, bg: "bg-[#F59E0B]", fg: "text-black", name: "Tax Deductible" },
  { icon: Receipt, bg: "bg-[#6366F1]", fg: "text-white", name: "GSTIN Receipt" },
  { icon: Scale, bg: "bg-[#0A3CC8]", fg: "text-white", name: "Ledger Match" },
  { icon: DollarSign, bg: "bg-white", fg: "text-emerald-600", name: "Multi Currency" },
  { icon: ShieldCheck, bg: "bg-[#8B5CF6]", fg: "text-white", name: "Encrypted Rail" },
  { icon: Building2, bg: "bg-[#EC4899]", fg: "text-white", name: "Treasury Portal" },
  { icon: Coins, bg: "bg-[#14B8A6]", fg: "text-white", name: "Petty Cash" },
  { icon: Smartphone, bg: "bg-black", fg: "text-cyan-400", name: "Mobile Scan" },
];

export function MethodsSection() {
  return (
    <section className="relative w-full bg-[#F8F8F8] text-[#111111] py-24 sm:py-32 lg:py-36 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-6 sm:px-12 flex flex-col items-center">
        {/* Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-[64px] font-bold tracking-tight text-[#111111] leading-[1.06]"
        >
          All your accounts<br />in one place
        </motion.h2>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-5 sm:mt-6 text-xs sm:text-[13px] text-[#666666] max-w-md leading-relaxed font-normal"
        >
          FinPulse works with all your cards, banks and wallets. Track spending from every account in a single dashboard.
        </motion.p>
      </div>

      {/* 45-degree Tilted Diamond Tiles Ribbons with Continuous Subtle Drift */}
      <div className="relative mt-16 sm:mt-20 w-full overflow-hidden py-10 select-none pointer-events-none">
        {/* Subtle Edge Fade Gradients */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#F8F8F8] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#F8F8F8] to-transparent z-10" />

        {/* Row 1 - Drifting Left */}
        <div className="flex gap-6 sm:gap-8 w-max animate-marquee-left">
          {[...TILES_ROW_1, ...TILES_ROW_1].map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <div 
                key={idx}
                className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center p-3"
              >
                <div 
                  className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl rotate-45 ${tile.bg} shadow-md flex items-center justify-center transition-transform`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 -rotate-45 ${tile.fg}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2 - Drifting Right (Staggered) */}
        <div className="flex gap-6 sm:gap-8 w-max animate-marquee-right -mt-2">
          {[...TILES_ROW_2, ...TILES_ROW_2].map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <div 
                key={idx}
                className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center p-3"
              >
                <div 
                  className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl rotate-45 ${tile.bg} shadow-md flex items-center justify-center transition-transform`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 -rotate-45 ${tile.fg}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
