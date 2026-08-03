"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
} from "lucide-react";

/**
 * Shared Sign Up / Sign In gate — only a valid admin session unlocks the CMS.
 */
export function AdminAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/admin/dashboard";

  const [activeTab, setActiveTab] = useState<"signup" | "login">("login");
  const [checkingSession, setCheckingSession] = useState(true);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already logged in with a valid session → dashboard
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { apiMe } = await import("@/lib/cmsApi");
        const me = await apiMe();
        if (cancelled) return;
        if (me?.id && me?.email) {
          const dest =
            nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/login")
              ? nextPath
              : "/admin/dashboard";
          router.replace(dest);
          return;
        }
      } catch {
        /* stay on auth form */
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, nextPath]);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("kodraxelsoft_admin_credentials");
    if (savedAdmin) setActiveTab("login");
  }, []);

  const goAfterAuth = () => {
    const dest =
      nextPath.startsWith("/admin") &&
      nextPath !== "/admin" &&
      nextPath !== "/admin/" &&
      !nextPath.startsWith("/admin/login")
        ? nextPath
        : "/admin/dashboard";
    router.replace(dest);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    if (signUpPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      setSubmitting(false);
      return;
    }

    if (signUpPassword.length < 10) {
      setErrorMessage(
        "Password must be at least 10 characters with upper, lower, number, and special character."
      );
      setSubmitting(false);
      return;
    }

    try {
      const { apiBootstrapAdmin, apiLogin } = await import("@/lib/cmsApi");
      await apiBootstrapAdmin({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });
      const session = await apiLogin(signUpEmail, signUpPassword);
      sessionStorage.setItem("kodraxelsoft_admin_name", session.admin.name);
      localStorage.setItem("kodraxelsoft_admin_name", session.admin.name);
      setSignUpSuccess(true);
      setTimeout(() => goAfterAuth(), 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      if (/already exists|only one admin/i.test(msg)) {
        setErrorMessage(
          "Admin already exists. Use Sign In with your email and password."
        );
        setActiveTab("login");
        setLoginEmail(signUpEmail);
      } else if (/bootstrap|BOOTSTRAP_SECRET/i.test(msg)) {
        setErrorMessage(
          "Sign Up is only for the first admin. Use Sign In if your account already exists."
        );
        setActiveTab("login");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const { apiLogin } = await import("@/lib/cmsApi");
      const session = await apiLogin(loginEmail, loginPassword);
      sessionStorage.setItem("kodraxelsoft_admin_name", session.admin.name);
      localStorage.setItem("kodraxelsoft_admin_name", session.admin.name);
      goAfterAuth();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (/failed to fetch|network|reach|ECONNREFUSED/i.test(msg)) {
        setErrorMessage(
          "Cannot reach CMS API. Start backend: cd backend && npm run dev"
        );
      } else if (/invalid email or password/i.test(msg)) {
        setErrorMessage(
          "Wrong email or password. If you forgot it, reset with: cd backend && npm run seed:admin -- --reset"
        );
      } else if (/too many|try again later|locked|rate/i.test(msg)) {
        setErrorMessage(
          `${msg} Restart backend (cd backend && npm run dev) then try Sign In again.`
        );
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] flex items-center justify-center text-sm font-semibold text-[#004d4d] dark:text-cyan-400">
        Checking admin session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-colors duration-300">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#004d4d]/20 rounded-full blur-[140px]" />

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl border border-slate-300 dark:border-cyan-500/30 bg-white/95 dark:bg-[#111726]/95 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block mb-1">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {activeTab === "signup"
              ? "Create the System Admin account (first time only)"
              : "Sign in to access the Kodraxelsoft admin panel"}
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "signup"
                ? "bg-[#004d4d] text-white shadow-md border border-cyan-400/40"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "login"
                ? "bg-[#004d4d] text-white shadow-md border border-cyan-400/40"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {signUpSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Admin account ready — opening dashboard…</span>
          </div>
        )}

        {activeTab === "signup" ? (
          <form onSubmit={(e) => void handleSignUp(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Admin Work Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@kodraxelsoft.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Create Admin Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Create password..."
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-enter password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <Button
              type="submit"
              variant="teal-gradient"
              size="lg"
              disabled={submitting}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full justify-center text-xs py-3"
            >
              {submitting ? "Creating…" : "Create Admin Account"}
            </Button>
          </form>
        ) : (
          <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Admin Work Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@kodraxelsoft.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-1">
                Admin Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <Button
              type="submit"
              variant="teal-gradient"
              size="lg"
              disabled={submitting}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full justify-center text-xs py-3"
            >
              {submitting ? "Signing in…" : "Sign In to Dashboard"}
            </Button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800/80 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
          <span>Protected — only the admin account can access the CMS</span>
        </div>
      </div>
    </div>
  );
}
