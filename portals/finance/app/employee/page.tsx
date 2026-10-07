"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, GitMerge, ExternalLink } from "lucide-react";

export default function EmployeePortalPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-neutral-900 flex flex-col justify-between select-none">
      {/* Top Navbar */}
      <header className="h-14 border-b border-neutral-200/80 bg-white px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-5 h-5 text-black shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="12" cy="12" r="3.2" fill="currentColor" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight text-neutral-950">
              Payout
            </span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Employee Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1 transition-colors"
          >
            Go to Finance Dashboard <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-neutral-400 hover:text-black transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Content: Clean Placeholder for Team Member Code */}
      <main className="max-w-xl mx-auto px-6 py-16 text-center my-auto">
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-neutral-700">
          <GitMerge className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Employee Portal
        </h1>
        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
          This portal module is currently assigned to team members. Once completed, the repository branch will be cloned and merged here.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
          >
            Open Finance Dashboard &rarr;
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] font-mono text-neutral-400 border-t border-neutral-100">
        &copy; 2026 PAYOUT TECHNOLOGIES INC. &bull; Branch integration ready
      </footer>
    </div>
  );
}
