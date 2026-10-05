"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Search, 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Plane, 
  ChevronRight, 
  Star,
  Receipt,
  Users,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  Check
} from "lucide-react";
import { HeroAmbientBackground } from "@/components/shared";

const ROLE_OPTIONS = [
  {
    value: "/employee",
    label: "Employee Portal",
    badge: "Submit & Track",
    desc: "Snap receipts, auto-scan OCR, track payouts",
    icon: Receipt,
    color: "text-blue-600 bg-blue-50 border border-blue-100",
  },
  {
    value: "/management",
    label: "Management Portal",
    badge: "Approvals & Audit",
    desc: "Review claims, policy exceptions, dept budgets",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50 border border-indigo-100",
  },
  {
    value: "/finance",
    label: "Finance Portal",
    badge: "Clearinghouse",
    desc: "Disbursement register, UTR ledger, settlements",
    icon: Building2,
    color: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  },
];

function HelixRibbon3D() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-44 object-contain">
      <defs>
        <linearGradient id="helixGrad1" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="65%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="helixGrad2" x1="80%" y1="20%" x2="20%" y2="80%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <filter id="helixShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#091e42" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#helixShadow)">
        <path
          d="M 60 145 C 30 85, 100 25, 160 55 C 220 85, 245 145, 205 170 C 165 195, 105 175, 90 135"
          stroke="url(#helixGrad2)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 45 125 C 65 45, 155 20, 205 75 C 255 125, 225 175, 155 160 C 95 145, 75 75, 140 45 C 190 25, 245 75, 235 140"
          stroke="url(#helixGrad1)"
          strokeWidth="34"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 55 115 C 75 50, 145 32, 195 75 C 225 110, 205 145, 160 145"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

function CogGear3D() {
  return (
    <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-44 object-contain">
      <defs>
        <radialGradient id="cogFaceGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="35%" stopColor="#2563eb" />
          <stop offset="75%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </radialGradient>
        <linearGradient id="cogDepthGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0a192f" />
        </linearGradient>
        <filter id="cogShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#091e42" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#cogShadow)" transform="translate(0, 12)">
        <path
          d="M 120 18 C 126 18, 131 27, 136 28 C 145 30, 155 26, 161 32 C 167 38, 165 49, 172 56 C 179 63, 190 63, 194 71 C 198 79, 191 88, 193 97 C 195 106, 204 112, 204 121 C 204 130, 195 136, 193 145 C 191 154, 198 163, 194 171 C 190 179, 179 179, 172 186 C 165 193, 167 204, 161 210 C 155 216, 145 212, 136 214 C 131 215, 126 224, 120 224 C 114 224, 109 215, 104 214 C 95 212, 85 216, 79 210 C 73 204, 75 193, 68 186 C 61 179, 50 179, 46 171 C 42 163, 49 154, 47 145 C 45 136, 36 130, 36 121 C 36 112, 45 106, 47 97 C 49 88, 42 79, 46 71 C 50 63, 61 63, 68 56 C 75 49, 73 38, 79 32 C 85 26, 95 30, 104 28 C 109 27, 114 18, 120 18 Z"
          fill="url(#cogDepthGrad)"
          opacity="0.8"
        />
      </g>
      <g filter="url(#cogShadow)">
        <path
          d="M 120 14 C 126 14, 131 23, 136 24 C 145 26, 155 22, 161 28 C 167 34, 165 45, 172 52 C 179 59, 190 59, 194 67 C 198 75, 191 84, 193 93 C 195 102, 204 108, 204 117 C 204 126, 195 132, 193 141 C 191 150, 198 159, 194 167 C 190 175, 179 175, 172 182 C 165 189, 167 200, 161 206 C 155 212, 145 208, 136 210 C 131 211, 126 220, 120 220 C 114 220, 109 211, 104 210 C 95 208, 85 212, 79 206 C 73 200, 75 189, 68 182 C 61 175, 50 175, 46 167 C 42 159, 49 150, 47 141 C 45 132, 36 126, 36 117 C 36 108, 45 102, 47 93 C 49 84, 42 75, 46 67 C 50 59, 61 59, 68 52 C 75 45, 73 34, 79 28 C 85 22, 95 26, 104 24 C 109 23, 114 14, 120 14 Z"
          fill="url(#cogFaceGrad)"
        />
        <circle cx="120" cy="117" r="38" fill="#0f172a" />
        <circle cx="120" cy="117" r="37" fill="#1e3a8a" opacity="0.7" />
        <circle cx="118" cy="114" r="36" stroke="#93c5fd" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M 115 15 L 125 15" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}

function RippleTorus3D() {
  return (
    <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-44 object-contain">
      <defs>
        <radialGradient id="sphereGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.15" />
        </linearGradient>
        <filter id="ringShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#091e42" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#ringShadow)">
        <ellipse cx="140" cy="110" rx="98" ry="70" stroke="url(#ringGrad)" strokeWidth="18" fill="none" opacity="0.45" />
        <ellipse cx="136" cy="112" rx="74" ry="54" stroke="url(#ringGrad)" strokeWidth="16" fill="none" opacity="0.65" />
        <circle cx="130" cy="110" r="48" fill="url(#sphereGrad)" />
        <ellipse cx="118" cy="95" rx="18" ry="10" fill="#ffffff" opacity="0.4" transform="rotate(-25 118 95)" />
        <ellipse cx="132" cy="114" rx="34" ry="24" stroke="#bfdbfe" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}

function IsometricCube3D({ className = "w-28 h-28", id = "cube1" }: { className?: string; id?: string }) {
  return (
    <svg
      viewBox="0 0 160 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-xl filter`}
    >
      <defs>
        {/* Top face: light ice-cyan to bright sky-blue */}
        <linearGradient id={`${id}-top`} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="45%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Left face: rich royal blue */}
        <linearGradient id={`${id}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Right face: deep cobalt / dark navy */}
        <linearGradient id={`${id}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="65%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Ambient shadow */}
        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground contact shadow */}
      <ellipse cx="80" cy="154" rx="55" ry="14" fill={`url(#${id}-shadow)`} />

      {/* Main Cube Group */}
      <g>
        {/* Left Face */}
        <path
          d="M 26 56 L 80 87 L 80 148 L 26 117 Z"
          fill={`url(#${id}-left)`}
        />

        {/* Right Face */}
        <path
          d="M 80 87 L 134 56 L 134 117 L 80 148 Z"
          fill={`url(#${id}-right)`}
        />

        {/* Top Face */}
        <path
          d="M 80 25 L 134 56 L 80 87 L 26 56 Z"
          fill={`url(#${id}-top)`}
        />

        {/* Top Face Specular Glare */}
        <path
          d="M 80 30 L 126 56 L 80 82 L 34 56 Z"
          fill="#ffffff"
          opacity="0.22"
        />

        {/* Edge Bevel Accents */}
        <path
          d="M 27 56 L 80 87 L 133 56"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <path
          d="M 80 87 L 80 147"
          stroke="#93c5fd"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 26 56 L 80 25 L 134 56"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      </g>
    </svg>
  );
}

function IsometricCubeMini({ className = "w-16 h-16", id = "cubemini" }: { className?: string; id?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-lg filter`}
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Left Face */}
      <path d="M 16 35 L 50 55 L 50 94 L 16 74 Z" fill={`url(#${id}-left)`} />
      {/* Right Face */}
      <path d="M 50 55 L 84 35 L 84 74 L 50 94 Z" fill={`url(#${id}-right)`} />
      {/* Top Face */}
      <path d="M 50 15 L 84 35 L 50 55 L 16 35 Z" fill={`url(#${id}-top)`} />

      {/* Edge highlight */}
      <path d="M 17 35 L 50 55 L 83 35" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 50 55 L 50 93" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 16 35 L 50 15 L 84 35" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function GlassSphere3D({ className = "w-20 h-20", id = "sphere3d" }: { className?: string; id?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-xl filter`}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="25%" stopColor="#93c5fd" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="85%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#172554" />
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#bfdbfe" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Ambient shadow */}
      <ellipse cx="60" cy="108" rx="36" ry="8" fill="#1e3a8a" opacity="0.2" filter="blur(4px)" />

      {/* Back orbit ring segment */}
      <ellipse
        cx="60"
        cy="60"
        rx="52"
        ry="18"
        stroke={`url(#${id}-ring)`}
        strokeWidth="3"
        fill="none"
        transform="rotate(-20 60 60)"
        strokeDasharray="90 120"
        opacity="0.5"
      />

      {/* Core Sphere */}
      <circle cx="60" cy="58" r="38" fill={`url(#${id}-body)`} />

      {/* Specular Highlight */}
      <ellipse cx="48" cy="45" rx="14" ry="8" fill="#ffffff" opacity="0.45" transform="rotate(-30 48 45)" />
      <circle cx="44" cy="40" r="3" fill="#ffffff" opacity="0.8" />

      {/* Bottom rim light */}
      <path
        d="M 38 78 C 45 88, 70 88, 80 76"
        stroke="#93c5fd"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* Front orbit ring segment */}
      <ellipse
        cx="60"
        cy="60"
        rx="52"
        ry="18"
        stroke={`url(#${id}-ring)`}
        strokeWidth="3.5"
        fill="none"
        transform="rotate(-20 60 60)"
        strokeDasharray="120 90"
      />
    </svg>
  );
}

function FloatingOctahedron3D({ className = "w-20 h-20", id = "octa" }: { className?: string; id?: string }) {
  return (
    <svg
      viewBox="0 0 110 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-xl filter`}
    >
      <defs>
        <linearGradient id={`${id}-tleft`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id={`${id}-tright`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`${id}-bleft`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id={`${id}-bright`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="55" cy="112" rx="30" ry="6" fill="#1e3a8a" opacity="0.2" filter="blur(4px)" />

      {/* Upper Left Facet */}
      <path d="M 55 12 L 18 55 L 55 68 Z" fill={`url(#${id}-tleft)`} />
      {/* Upper Right Facet */}
      <path d="M 55 12 L 92 55 L 55 68 Z" fill={`url(#${id}-tright)`} />
      {/* Lower Left Facet */}
      <path d="M 18 55 L 55 68 L 55 106 Z" fill={`url(#${id}-bleft)`} />
      {/* Lower Right Facet */}
      <path d="M 55 68 L 92 55 L 55 106 Z" fill={`url(#${id}-bright)`} />

      {/* Ridges */}
      <path d="M 55 12 L 55 68 L 55 106" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M 18 55 L 55 68 L 92 55" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <circle cx="55" cy="68" r="2.5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

const PORTALS = [
  {
    title: "Employee Portal",
    description: "Submit itemized expense claims, snap digital receipts, and track reimbursement milestones with zero friction.",
    href: "/employee",
    pillText: "Employee Workspace",
    renderArt: HelixRibbon3D,
  },
  {
    title: "Manager Portal",
    description: "Audit team submissions, adjudicate policy exception warnings, and protect quarterly budgets in real-time.",
    href: "/management",
    pillText: "Manager Review",
    renderArt: CogGear3D,
  },
  {
    title: "Finance Portal",
    description: "Execute consolidated disbursement batches, reconcile corporate cards, and log bank UTR references.",
    href: "/finance",
    pillText: "Finance Settlement",
    renderArt: RippleTorus3D,
  },
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState("/employee");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = ROLE_OPTIONS.find((opt) => opt.value === selectedRole) || ROLE_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 selection:bg-sky-500 selection:text-white font-sans antialiased flex flex-col">
      
      {/* ── Pathio Navbar (True Edge-to-Edge Full Width) ──────────────────── */}
      <header className="w-full px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between border-b border-slate-100/90 sticky top-0 z-30 bg-white/85 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <Receipt className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            FinPulse
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-600">
          <Link href="/employee" className="hover:text-slate-900 transition-colors">
            Employee Portal
          </Link>
          <Link href="/management" className="hover:text-slate-900 transition-colors">
            Manager Review
          </Link>
          <Link href="/finance" className="hover:text-slate-900 transition-colors">
            Finance Treasury
          </Link>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Action Pills */}
        <div className="flex items-center gap-3">
          <Link
            href="/employee"
            className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
          >
            Launch Portal
          </Link>
        </div>
      </header>

      {/* ── Pathio Hero Section with Full-Screen Sky-Blue Glow ─────────── */}
      <main className="w-full relative flex flex-col items-center justify-start pt-14 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Full-Screen Ambient Sky-Blue Glow Backdrop */}
        <HeroAmbientBackground />

        {/* ── Left Flank: Floating 3D Blue Cubes & Live OCR Metric ─────────── */}
        <div className="hidden lg:flex absolute left-3 xl:left-10 2xl:left-20 top-12 xl:top-16 z-20 flex-col items-start gap-5 pointer-events-none select-none max-w-[280px]">
          {/* Upper Left: Main 3D Isometric Cube + OCR Badge */}
          <motion.div
            animate={{ 
              y: [0, -14, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex items-center gap-3 group pointer-events-auto cursor-default"
          >
            <IsometricCube3D className="w-20 h-20 xl:w-28 xl:h-28 transition-transform group-hover:scale-105 duration-300" id="hero-left-cube" />
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-100 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.12)]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">OCR Scan Engine</span>
              </div>
              <p className="text-[10px] font-semibold text-blue-600 mt-0.5">99.4% Field Accuracy</p>
            </div>
          </motion.div>

          {/* Lower Left: 3D Blue Glass Sphere + Mini Isometric Cube + GSTIN Badge */}
          <motion.div
            animate={{ 
              y: [0, 12, 0],
              rotate: [1, -2, 1]
            }}
            transition={{ 
              duration: 7.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.6 
            }}
            className="flex items-center gap-2 pl-3 xl:pl-6 group pointer-events-auto cursor-default"
          >
            <GlassSphere3D className="w-16 h-16 xl:w-20 xl:h-20 transition-transform group-hover:scale-105 duration-300" id="hero-left-sphere" />
            <IsometricCubeMini className="w-10 h-10 xl:w-12 xl:h-12 -ml-2 -mt-3 opacity-90" id="hero-left-mini" />
            <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-[0_6px_20px_-4px_rgba(15,23,42,0.08)] flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-slate-700">Auto GSTIN Verify</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right Flank: Floating 3D Blue Cubes & Enterprise Audit Badge ─────────── */}
        <div className="hidden lg:flex absolute right-3 xl:right-10 2xl:right-20 top-12 xl:top-16 z-20 flex-col items-end gap-5 pointer-events-none select-none max-w-[280px]">
          {/* Upper Right: Tilted 3D Isometric Cube + Dual Signoff Badge */}
          <motion.div
            animate={{ 
              y: [0, -16, 0],
              rotate: [8, 14, 8]
            }}
            transition={{ 
              duration: 6.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.3 
            }}
            className="flex items-center gap-3 flex-row-reverse group pointer-events-auto cursor-default"
          >
            <IsometricCube3D className="w-20 h-20 xl:w-28 xl:h-28 transition-transform group-hover:scale-105 duration-300" id="hero-right-cube" />
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-100 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.12)] text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-900 tracking-tight">Dual-Signoff Gate</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              </div>
              <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Strict Audit Enforced</p>
            </div>
          </motion.div>

          {/* Lower Right: 3D Blue Octahedron Prism + Mini Isometric Cube + UTR Settlement Badge */}
          <motion.div
            animate={{ 
              y: [0, 14, 0],
              rotate: [-2, 3, -2]
            }}
            transition={{ 
              duration: 7.8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.8 
            }}
            className="flex items-center gap-2 pr-3 xl:pr-6 flex-row-reverse group pointer-events-auto cursor-default"
          >
            <FloatingOctahedron3D className="w-16 h-16 xl:w-20 xl:h-20 transition-transform group-hover:scale-105 duration-300" id="hero-right-octa" />
            <IsometricCubeMini className="w-10 h-10 xl:w-12 xl:h-12 -mr-2 -mt-3 opacity-90" id="hero-right-mini" />
            <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-[0_6px_20px_-4px_rgba(15,23,42,0.08)] flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-slate-700">Bank UTR Settlement</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Header Content */}
        <div className={`relative max-w-3xl mx-auto text-center flex flex-col items-center transition-all ${isDropdownOpen ? "z-50" : "z-30"}`}>
          {/* Pathio Punchy Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.06] max-w-2xl">
            Stop chasing receipts.<br />
            Start scanning.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
            The automated expense management platform that simplifies enterprise finances.
            Snap a receipt, enforce policy limits, and let real-time workflows handle the rest.
          </p>

          {/* Quick Portal Switcher Capsule with Custom Luxury Dropdown */}
          <div ref={dropdownRef} className="relative mt-8 w-full max-w-md z-50">
            {/* The Main Capsule Pill */}
            <div className="w-full bg-white rounded-full p-1.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-2">
              {/* Dropdown Toggle Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex-1 flex items-center justify-between pl-3 pr-2 py-1 text-left cursor-pointer group rounded-full focus:outline-none"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${activeOption.color}`}>
                    <ActiveIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {activeOption.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium truncate">
                      {activeOption.badge}
                    </span>
                  </div>
                </div>

                <div className="pl-2 pr-1 text-slate-400 group-hover:text-slate-700 transition-colors">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Launch Action Button */}
              <Link
                href={selectedRole}
                className="bg-slate-950 text-white hover:bg-slate-800 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shrink-0 inline-flex items-center gap-1.5 shadow-sm hover:shadow"
              >
                <span>Launch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Custom Luxury Floating Dropdown Popover */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-2 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] z-50 overflow-hidden"
                >
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Target Portal
                  </div>
                  <div className="space-y-1 mt-1">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedRole === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedRole(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                            isSelected
                              ? "bg-blue-50/70 border border-blue-100"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${option.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isSelected ? "text-blue-950" : "text-slate-900"}`}>
                                  {option.label}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/60">
                                  {option.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                {option.desc}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rating Stars & Trust Pill */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center text-blue-500">
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
              <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
            </div>
            <span className="text-slate-300">|</span>
            <span>Trusted by 1,200+ finance teams & employees</span>
          </div>
        </div>

        {/* ── Pathio Hero Centerpiece: Smartphone & Floating Interactive Cards ── */}
        <div className="relative z-10 mt-16 sm:mt-24 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          
          {/* ── Floating Card 1: Top-Left (Policy Exception Alert) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            transition={{ duration: 0.6 }}
            whileHover={{ rotate: -4, scale: 1.03 }}
            className="absolute left-2 sm:left-6 lg:left-12 top-2 sm:top-6 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[200px] sm:max-w-[240px] text-left cursor-default hidden sm:block"
          >
            <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              Policy Exception Alert
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Mandatory justification required when budget caps exceed
            </p>
          </motion.div>

          {/* ── Floating Card 2: Bottom-Left (Corporate Card) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ rotate: -2, scale: 1.03 }}
            className="absolute left-4 sm:left-10 lg:left-16 bottom-6 sm:bottom-12 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[190px] sm:max-w-[220px] text-left cursor-default hidden sm:block"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700">Corporate Card</p>
              <div className="h-4 px-1.5 rounded bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white tracking-wider">
                CORP
              </div>
            </div>
            <p className="text-xs font-bold text-slate-900">Direct Bank Feed</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated Receipt Matching</p>
          </motion.div>

          {/* ── Floating Card 3: Top-Right (Budget Health) ──────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 8 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ rotate: 4, scale: 1.03 }}
            className="absolute right-2 sm:right-6 lg:right-12 top-4 sm:top-8 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[200px] sm:max-w-[230px] text-left cursor-default hidden sm:block"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2.5">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              Department Budget
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Real-time expenditure tracking vs quarterly caps
            </p>
          </motion.div>

          {/* ── Floating Card 4: Bottom-Right (Compliance Check) ─────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ rotate: 2, scale: 1.03 }}
            className="absolute right-4 sm:right-10 lg:right-16 bottom-8 sm:bottom-14 z-20 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.12)] border border-slate-100 max-w-[190px] sm:max-w-[220px] text-left cursor-default hidden sm:block"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-700">Audit Compliance</p>
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Zero Duplicates</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Receipt SHA-256 Verified</p>
          </motion.div>

          {/* ── The Center Smartphone Frame ─────────────────────────── */}
          <div className="relative w-[280px] sm:w-[320px] h-[510px] sm:h-[550px] bg-slate-950 p-2.5 rounded-[44px] shadow-[0_30px_90px_-20px_rgba(15,23,42,0.22)] border-[5px] border-slate-900/90 overflow-hidden flex flex-col justify-between">
            
            {/* Phone Inner Screen with Sky-Blue Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-sky-100 via-sky-50 to-white rounded-[36px] p-4 pt-3 flex flex-col justify-between overflow-hidden relative">
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 pb-2 border-b border-sky-200/40">
                <span>9:41</span>
                <div className="h-3 w-16 bg-slate-900 rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="h-2 w-3.5 border border-slate-700 rounded-sm" />
                </div>
              </div>

              {/* Profile Header Row */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    FP
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-medium leading-none">
                      Active Portal Hub
                    </span>
                    <span className="block text-xs font-bold text-slate-800 mt-0.5">
                      FinPulse · Enterprise
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button className="h-7 w-7 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs">
                    <Search className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-full bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-600 shadow-2xs">
                    <Bell className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Personalized Greeting */}
              <div className="mt-2.5 text-left">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Expense System
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select workflow to inspect required fields
                </p>
              </div>

              {/* Quick Reimbursement Summary Bar */}
              <div className="mt-2.5 bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 border border-sky-100/90 shadow-xs flex items-center justify-between">
                <div className="text-left pl-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Claims</span>
                  <p className="text-xs font-extrabold text-slate-900 tracking-tight">Processed</p>
                </div>
                <div className="h-5 w-px bg-slate-200/60" />
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Audit</span>
                  <p className="text-xs font-extrabold text-emerald-600 tracking-tight">Verified</p>
                </div>
                <div className="h-5 w-px bg-slate-200/60" />
                <div className="text-left pr-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">Disbursed</span>
                  <p className="text-xs font-extrabold text-blue-600 tracking-tight">UTR Ready</p>
                </div>
              </div>

              {/* ── Enterprise Required Portals & Workflows (Pathio Signature Blue Capsules) ── */}
              <div className="mt-auto space-y-2 z-10 pb-1">
                {/* Portal Pill 1: Employee Workspace */}
                <Link
                  href="/employee"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl p-2 flex items-center justify-between shadow-md shadow-blue-500/20 transition-all block group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                      <Receipt className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">Employee Portal</p>
                      <p className="text-[9.5px] text-blue-100 font-medium truncate">
                        Required: Title, Category, Amount & Receipt
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </Link>

                {/* Portal Pill 2: Manager Review */}
                <Link
                  href="/management"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl p-2 flex items-center justify-between shadow-md shadow-blue-500/20 transition-all block group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">Manager Portal</p>
                      <p className="text-[9.5px] text-blue-100 font-medium truncate">
                        Required: Policy Audit & Manager Sign-off
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </Link>

                {/* Portal Pill 3: Finance Settlement */}
                <Link
                  href="/finance"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl p-2 flex items-center justify-between shadow-md shadow-blue-500/20 transition-all block group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">Finance Portal</p>
                      <p className="text-[9.5px] text-blue-100 font-medium truncate">
                        Required: Bank UTR & Treasury Settlement
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-200 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Proof / Partner Bar (Pathio Style) ─────────────── */}
        <div className="relative z-10 mt-16 sm:mt-24 text-center w-full max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-6">
            Trusted by modern founders and remote teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm tracking-tight grayscale opacity-75">
            <span className="hover:text-slate-800 transition-colors cursor-pointer">HubSpót</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">asana</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">GUMROAD</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Spotify</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">webflow</span>
            <span className="hover:text-slate-800 transition-colors cursor-pointer">Notion</span>
          </div>
        </div>
      </main>

      {/* ── 3 Operational Portals Section (Full Width, Centered Max-Width) ── */}
      <section id="how-it-works" className="w-full px-6 sm:px-12 lg:px-16 py-20 border-t border-slate-100 bg-slate-50/60">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              OPERATIONAL TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-3">
              One Unified System. Three Purpose-Built Portals.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Fast, deterministic expense workflows tailored to each organizational role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {PORTALS.map((portal) => {
              const Art = portal.renderArt;
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  className="bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] rounded-[32px] p-7 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[470px] shadow-xl shadow-blue-600/15 hover:shadow-2xl hover:shadow-blue-600/25 transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Subtle Top Radial Ambient Light */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_65%)] pointer-events-none" />

                  {/* Top Content: Title & Enterprise Description */}
                  <div className="relative z-10 text-left">
                    <h3 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white leading-tight">
                      {portal.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-[13px] text-white/85 font-normal leading-relaxed max-w-[270px]">
                      {portal.description}
                    </p>
                  </div>

                  {/* 3D Blue Sculptural Artwork */}
                  <div className="relative z-10 my-4 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <Art />
                  </div>

                  {/* Bottom Controls Row: Pill Tag + Circular Arrow Button */}
                  <div className="relative z-10 flex items-center justify-between pt-2">
                    <span className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                      {portal.pillText}
                    </span>

                    <div className="h-9 w-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer (True Full Width Edge-to-Edge) ─────────────────────────── */}
      <footer className="w-full px-4 sm:px-8 lg:px-10 py-8 border-t border-slate-100 bg-white">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 FinPulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/employee" className="hover:text-slate-900">Employee Workspace</Link>
            <Link href="/management" className="hover:text-slate-900">Manager Docket</Link>
            <Link href="/finance" className="hover:text-slate-900">Finance Settlement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
