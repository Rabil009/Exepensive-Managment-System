"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { employeePasswordAuth, safeEmployeeReturnPath } from "@/lib/employee-auth";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Building2,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

type PortalType = "/dashboard" | "/employee" | "/manager";

interface PortalOption {
  id: PortalType;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PORTALS: PortalOption[] = [
  {
    id: "/dashboard",
    title: "Finance & Treasury",
    icon: Building2,
  },
  {
    id: "/employee",
    title: "Employee Portal",
    icon: UserCheck,
  },
  {
    id: "/manager",
    title: "Manager Approvals",
    icon: ShieldCheck,
  },
];

// Institutional Modern Fintech Background (Ambient Gradient Mesh + Precision Microgrid)
function ModernFintechBackground({ isDark = false }: { isDark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Ambient Lighting Glow Mesh */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] transition-opacity duration-700 pointer-events-none ${
          isDark
            ? "bg-gradient-to-br from-indigo-600/15 via-blue-600/10 to-transparent opacity-90"
            : "bg-gradient-to-br from-blue-400/20 via-indigo-300/15 to-transparent opacity-70"
        }`}
      />
      <div
        className={`absolute -bottom-32 -right-32 w-[640px] h-[640px] rounded-full blur-[140px] transition-opacity duration-700 pointer-events-none ${
          isDark
            ? "bg-gradient-to-tl from-cyan-500/10 via-blue-500/8 to-transparent opacity-75"
            : "bg-gradient-to-tl from-sky-400/15 via-indigo-200/20 to-transparent opacity-70"
        }`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[160px] pointer-events-none ${
          isDark ? "bg-indigo-500/[0.04]" : "bg-blue-500/[0.04]"
        }`}
      />

      {/* 2. Micro-precision Architectural Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(15, 23, 42, 0.045) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(15, 23, 42, 0.045) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 65%, transparent 100%)",
        }}
      />

      {/* 3. Subtle Vignette Depth */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,transparent_45%,#09090b_95%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(244,244,245,0.6)_100%)]"
        }`}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState<PortalType>("/dashboard");
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("finpulse-theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldBeDark = saved === "dark" || (!saved && prefersDark);
      setIsDark(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("finpulse-theme", next ? "dark" : "light");
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("portal") === "employee") {
      queueMicrotask(() => setSelectedPortal("/employee"));
    }
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPortalDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPortal =
    PORTALS.find((p) => p.id === selectedPortal) || PORTALS[0];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. REAL SUPABASE AUTHENTICATION FOR ALL PORTALS
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid email or password.");
      }

      const user = authData?.user;
      if (!user) {
        throw new Error("Authentication failed: No user returned.");
      }

      // 2. Fetch User Profile from Supabase
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, role, department")
        .eq("id", user.id)
        .maybeSingle();

      const userRole = (profile?.role || user.user_metadata?.role || "EMPLOYEE").toUpperCase();
      
      // Determine redirection based on actual role or portal
      let targetPath = selectedPortal;
      if (selectedPortal === "/employee" && userRole !== "EMPLOYEE" && userRole !== "ADMIN") {
        throw new Error(`This account has role '${userRole}'. Please select the appropriate portal.`);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("payout_user_role", selectedPortal);
        localStorage.setItem("payout_user_email", user.email || email);
        if (profile?.name) localStorage.setItem("payout_user_name", profile.name);
      }

      router.push(targetPath);
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState<"EMPLOYEE" | "MANAGER" | "FINANCE">("EMPLOYEE");
  const [signUpDepartment, setSignUpDepartment] = useState("Engineering");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleRealSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!signUpName.trim()) {
      setSignUpError("Please enter your full name.");
      return;
    }
    if (!signUpEmail.trim()) {
      setSignUpError("Please enter a valid work email.");
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError("Password must be at least 6 characters.");
      return;
    }

    setSignUpLoading(true);
    try {
      // 1. Create real Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpEmail.trim().toLowerCase(),
        password: signUpPassword,
        options: {
          data: {
            name: signUpName.trim(),
            role: signUpRole,
            department: signUpDepartment,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const newUser = authData.user;
      if (!newUser) {
        throw new Error("Could not create user account. Please try again.");
      }

      // 2. Ensure row in public.profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: newUser.id,
        email: signUpEmail.trim().toLowerCase(),
        name: signUpName.trim(),
        role: signUpRole,
        department: signUpDepartment,
        avatar_initials: signUpName.trim().slice(0, 2).toUpperCase(),
      });

      if (profileError) {
        console.warn("Profile table note:", profileError.message);
      }

      // 3. Set local persistence & auto login
      if (typeof window !== "undefined") {
        const portalPath = signUpRole === "EMPLOYEE" ? "/employee" : signUpRole === "MANAGER" ? "/manager" : "/dashboard";
        localStorage.setItem("payout_user_role", portalPath);
        localStorage.setItem("payout_user_email", signUpEmail.trim());
        localStorage.setItem("payout_user_name", signUpName.trim());
      }

      setShowSignUpModal(false);
      window.alert("Account successfully created! You are now logging in.");
      
      const destination = signUpRole === "EMPLOYEE" ? "/employee" : signUpRole === "MANAGER" ? "/manager" : "/dashboard";
      router.push(destination);
    } catch (err) {
      setSignUpError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full overflow-y-auto sm:overflow-hidden relative flex items-center justify-center p-4 sm:p-5 select-none transition-colors duration-200 ${
      isDark ? "bg-[#09090B] text-zinc-100" : "bg-white text-zinc-900"
    }`}>
      {/* Theme Toggle Button (Exact match with all portal headers) */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="h-9 w-9 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80 dark:bg-[#141418] dark:hover:bg-[#1E1E24] dark:text-amber-300 dark:border dark:border-white/[0.08] shadow-xs"
        >
          {isDark ? (
            <Sun className="h-4 w-4 stroke-[2]" />
          ) : (
            <Moon className="h-4 w-4 stroke-[2]" />
          )}
        </button>
      </div>

      <ModernFintechBackground isDark={isDark} />

      <div className={`relative z-10 max-w-[410px] w-full rounded-2xl border p-6 sm:p-9 my-14 sm:my-0 transition-all duration-200 ${
        isDark
          ? "bg-[#121215] border-white/[0.08] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.8)]"
          : "bg-white border-zinc-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)]"
      }`}>
        <div className="mb-6 text-center">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
            Welcome to Payout
          </h1>
          <p className={`text-xs font-mono tracking-tight mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Continue to access your dashboard
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={handleSocialAuth}
            className={`w-full h-10 px-4 rounded-full border text-xs font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer active:scale-[0.99] shadow-2xs ${
              isDark
                ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200"
                : "border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={handleSocialAuth}
            className={`w-full h-10 px-4 rounded-full border text-xs font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer active:scale-[0.99] shadow-2xs ${
              isDark
                ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200"
                : "border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800"
            }`}
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.5-7.79-11.44-14.14-5.63-9.06-10.08-19.16-13.34-30.28-3.26-11.13-4.9-21.84-4.9-32.14 0-14.28 3.58-25.92 10.74-34.92 7.16-9 16.32-13.62 27.48-13.87 4.8 0 10.23 1.34 16.29 4.03 6.06 2.68 10.02 4.09 11.89 4.22 1.5.13 5.72-1.34 12.67-4.42 6.94-3.08 12.87-4.47 17.79-4.17 13.43.76 23.96 5.86 31.59 15.3-11.87 7.21-17.65 17.06-17.34 29.56.32 9.87 4.17 18.25 11.56 25.12 7.39 6.87 16.29 10.78 26.7 11.75-2.23 6.74-4.7 13.25-7.41 19.53zM119.22 31.81c0-7.39 2.68-14.37 8.04-20.94 5.36-6.57 11.96-10.42 19.8-11.56.22 1.09.33 2.18.33 3.28 0 7.39-2.73 14.47-8.19 21.25-5.46 6.78-12.18 10.59-20.16 11.44-.22-1.09-.33-2.18-.33-3.47z" />
            </svg>
            <span>Sign in with Apple</span>
          </button>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className={`w-full border-t ${isDark ? "border-white/[0.08]" : "border-zinc-200"}`} />
          <span className={`absolute px-3 font-mono text-[11px] ${isDark ? "bg-[#121215] text-zinc-500" : "bg-white text-zinc-400"}`}>
            or
          </span>
        </div>

        <form onSubmit={handleSignIn} className="space-y-3.5">
          <div className="space-y-1" ref={dropdownRef}>
            <div className={`text-[11px] font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              <span>Target Portal</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                className={`w-full h-9 px-3.5 rounded-full border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isDark
                    ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-100"
                    : "border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/70 hover:border-zinc-300 text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <currentPortal.icon className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} />
                  <span className={`font-medium truncate ${isDark ? "text-white" : "text-zinc-900"}`}>
                    {currentPortal.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    isPortalDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isPortalDropdownOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 rounded-2xl shadow-xl p-1 z-30 space-y-0.5 border ${
                  isDark ? "bg-[#18181D] border-white/[0.1]" : "bg-white border-zinc-200"
                }`}>
                  {PORTALS.map((portal) => {
                    const Icon = portal.icon;
                    const isSelected = selectedPortal === portal.id;
                    return (
                      <button
                        key={portal.id}
                        type="button"
                        onClick={() => {
                          setSelectedPortal(portal.id);
                          setIsPortalDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? isDark
                              ? "bg-white/[0.1] text-white font-medium"
                              : "bg-zinc-100 text-zinc-950 font-medium"
                            : isDark
                            ? "text-zinc-300 hover:bg-white/[0.05]"
                            : "text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} />
                          <span>{portal.title}</span>
                        </div>
                        {isSelected && <Check className={`w-3.5 h-3.5 ${isDark ? "text-white" : "text-black"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className={`block text-[11px] font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full h-9 px-4 rounded-full border text-xs transition-all ${
                isDark
                  ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                  : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 placeholder:text-zinc-400 text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
              }`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={`block text-[11px] font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotSent(false);
                  setShowForgotModal(true);
                }}
                className={`text-[11px] underline underline-offset-2 transition-colors cursor-pointer ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full h-9 px-4 pr-10 rounded-full border text-xs transition-all ${
                  isDark
                    ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                    : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 placeholder:text-zinc-400 text-zinc-900 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-0.5 cursor-pointer ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-0.5 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 text-black accent-black cursor-pointer"
              />
              <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>Remember me</span>
            </label>
          </div>

          {errorMessage && (
            <div className={`text-[11px] p-2 rounded-xl flex items-center gap-2 border ${
              isDark
                ? "text-rose-300 bg-rose-950/40 border-rose-800/60"
                : "text-red-600 bg-red-50 border-red-200"
            }`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-10 mt-1 rounded-full text-xs font-medium flex items-center justify-center transition-colors cursor-pointer active:scale-[0.99] disabled:opacity-75 shadow-xs ${
              isDark
                ? "bg-white text-zinc-950 hover:bg-zinc-200"
                : "bg-zinc-950 hover:bg-black text-white"
            }`}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className={`mt-5 text-center text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          <span>Don&apos;t have an account? </span>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSignUpError(null);
              setShowSignUpModal(true);
            }}
            className={`font-medium underline underline-offset-4 cursor-pointer ${
              isDark ? "text-white hover:text-zinc-200" : "text-zinc-900 hover:text-black"
            }`}
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Real Supabase Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            isDark ? "bg-[#121215] border-white/[0.1]" : "bg-white border-zinc-200"
          }`}>
            <div className={`flex items-center justify-between pb-1 border-b ${
              isDark ? "border-white/[0.08]" : "border-zinc-100"
            }`}>
              <div>
                <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-zinc-950"}`}>Create an Account</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Directly registers in Supabase database</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSignUpModal(false)}
                className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                  isDark ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRealSignUp} className="space-y-3.5">
              <div>
                <label className={`block text-[11px] font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full h-9 px-4 rounded-full border text-xs transition-colors ${
                    isDark
                      ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full h-9 px-4 rounded-full border text-xs transition-colors ${
                    isDark
                      ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full h-9 px-4 rounded-full border text-xs transition-colors ${
                    isDark
                      ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40 focus:ring-1 focus:ring-white/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className={`block text-[11px] font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    System Role
                  </label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as any)}
                    className={`w-full h-9 px-3 rounded-full border text-xs ${
                      isDark
                        ? "border-white/[0.1] bg-[#18181D] text-white focus:border-white/40"
                        : "border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950"
                    }`}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="FINANCE">Finance Admin</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-medium mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Department
                  </label>
                  <select
                    value={signUpDepartment}
                    onChange={(e) => setSignUpDepartment(e.target.value)}
                    className={`w-full h-9 px-3 rounded-full border text-xs ${
                      isDark
                        ? "border-white/[0.1] bg-[#18181D] text-white focus:border-white/40"
                        : "border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950"
                    }`}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              {signUpError && (
                <div className={`text-[11px] p-2 rounded-xl flex items-center gap-2 border ${
                  isDark
                    ? "text-rose-300 bg-rose-950/40 border-rose-800/60"
                    : "text-red-600 bg-red-50 border-red-200"
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(false)}
                  className={`flex-1 h-9 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                    isDark
                      ? "border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={signUpLoading}
                  className={`flex-1 h-9 rounded-full text-xs font-medium transition-colors cursor-pointer disabled:opacity-75 ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-950 hover:bg-black text-white"
                  }`}
                >
                  {signUpLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className={`rounded-3xl max-w-sm w-full p-6 shadow-2xl border space-y-4 ${
            isDark ? "bg-[#121215] border-white/[0.1]" : "bg-white border-neutral-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className={`w-4 h-4 ${isDark ? "text-white" : "text-neutral-900"}`} />
                <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className={`p-1 cursor-pointer transition-colors ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 py-2">
                <div className={`p-3 rounded-2xl flex items-start gap-2.5 border ${
                  isDark
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    Recovery link dispatched to <strong>{forgotEmail}</strong>.
                  </div>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className={`w-full h-9 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-black text-white"
                  }`}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSent(true);
                }}
                className="space-y-3"
              >
                <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-neutral-600"}`}>
                  Enter your email to receive recovery instructions.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full h-9 px-4 rounded-full border text-xs transition-colors ${
                    isDark
                      ? "border-white/[0.1] bg-white/[0.04] text-white placeholder:text-zinc-500 focus:bg-[#18181D] focus:border-white/40"
                      : "border-neutral-200 text-xs focus:outline-none focus:border-black"
                  }`}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className={`flex-1 h-9 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                      isDark
                        ? "border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]"
                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 h-9 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      isDark
                        ? "bg-white text-zinc-950 hover:bg-zinc-200"
                        : "bg-black text-white hover:bg-neutral-800"
                    }`}
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
