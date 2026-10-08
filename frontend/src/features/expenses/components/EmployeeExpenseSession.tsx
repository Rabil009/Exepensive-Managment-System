"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function EmployeeExpenseSession() {
  const [email, setEmail] = useState("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setSignedInEmail(data.user?.email || null);
        setChecking(false);
      }
    }).catch(() => {
      if (active) setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setSignedInEmail(session?.user.email || null);
        setChecking(false);
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function sendLink() {
    if (sending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid Employee email address.");
      return;
    }
    setSending(true);
    setMessage("");
    setError("");
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/employee/expenses/new`,
      },
    });
    if (signInError) setError(signInError.message);
    else setMessage("Check your email for the sign-in link, then return to New Expense. Your entered details are kept in this browser; reattach a receipt if needed.");
    setSending(false);
  }

  async function switchAccount() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    else setSignedInEmail(null);
  }

  if (checking) return <p className="text-xs text-zinc-500" role="status">Checking Employee session…</p>;
  if (signedInEmail) return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-700/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-200">
      <span>Supabase session: {signedInEmail}</span>
      <button type="button" onClick={switchAccount} className="underline underline-offset-2">Use another email</button>
    </div>
  );
  return (
    <div className="rounded-lg border border-amber-600/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100">
      <p className="font-semibold">Sign in to save this expense to Supabase</p>
      <p className="mt-1">Enter your Employee email. We’ll send a sign-in link; no password is needed.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="email" value={email} onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void sendLink(); } }}
          placeholder="you@company.com" aria-label="Employee email"
          className="min-w-48 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
        <button type="button" onClick={() => void sendLink()} disabled={sending} className="rounded-md bg-zinc-900 px-3 py-2 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">
          {sending ? "Sending…" : "Email sign-in link"}
        </button>
      </div>
      {message && <p role="status" className="mt-2">{message}</p>}
      {error && <p role="alert" className="mt-2 text-rose-600 dark:text-rose-300">{error}</p>}
    </div>
  );
}
