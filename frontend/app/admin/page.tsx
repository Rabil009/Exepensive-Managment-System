"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Users, Sliders, FileText, CheckCircle2, Lock, ExternalLink } from "lucide-react";

export default function SystemAdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-5 w-5 rounded-full border-[2px] border-zinc-900 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
            </div>
            <span className="font-extrabold tracking-wider text-zinc-900 text-sm uppercase">PAYOUT</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1.5">
            <Shield className="h-3 w-3" /> System Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            Switch to Finance Operations <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Platform Governance & System Settings
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Global Policy Rules &bull; Role-Based Access Control (RBAC) &bull; Audit Trail Log (Immutable)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Finance Treasury Dashboard &rarr;
            </Link>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">User Access & Roles</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              142 active enterprise users mapped to 4 roles (Employee, Manager, Finance, Admin).
            </p>
            <span className="text-[11px] font-medium text-blue-600 mt-3 block">Manage directory &rarr;</span>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Expense Policy Engine</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Automated threshold rules ($5,000 threshold, weekend meal limits, receipt OCR validation).
            </p>
            <span className="text-[11px] font-medium text-blue-600 mt-3 block">Configure policies &rarr;</span>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
            <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">Compliance & Audit Trails</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Cryptographically hashed ledger entries for all approvals, overrides, and bank transfers.
            </p>
            <span className="text-[11px] font-medium text-blue-600 mt-3 block">Download audit logs &rarr;</span>
          </div>
        </div>
      </main>
    </div>
  );
}

