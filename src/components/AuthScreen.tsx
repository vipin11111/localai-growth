import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { Sparkles, Mail, Lock, ShieldAlert, Cpu, LogIn, ArrowRight } from "lucide-react";

interface AuthScreenProps {
  onDemoLogin: () => void;
}

export default function AuthScreen({ onDemoLogin }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill out both email and password fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      // Clean up Firebase error messages for professional UX
      let friendlyMsg = err.message || "Authentication failed. Please verify credentials.";
      if (err.code === "auth/invalid-credential") {
        friendlyMsg = "Invalid email or password. Please verify and try again.";
      } else if (err.code === "auth/email-already-in-use") {
        friendlyMsg = "This email is already registered. Please login instead.";
      } else if (err.code === "auth/weak-password") {
        friendlyMsg = "Password must be at least 6 characters long.";
      }
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google Login failed:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
        {/* Brand visual panel */}
        <div className="md:col-span-5 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-850 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Ambient background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit text-white">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight leading-none">LocalAI Growth</h1>
              <p className="text-xs text-indigo-100 font-medium">Small Business SaaS Suite</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10 pt-12 md:pt-0">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
              Unchain your local digital potential.
            </h2>
            <p className="text-xs text-indigo-100 leading-relaxed max-w-sm">
              Create complete online landing pages, high-converting social media posts, Google Ads copy, and customer leads directly tracked from a unified, beautiful Material Design 3 cockpit.
            </p>
          </div>

          <div className="pt-8 md:pt-0 flex items-center gap-1.5 text-[10px] text-indigo-200 uppercase tracking-widest font-black">
            <Cpu className="w-4 h-4 animate-spin-slow" />
            <span>Powered by Gemini & Firebase</span>
          </div>
        </div>

        {/* Auth Forms panel */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">
              {isRegister ? "Create business account" : "Sign in to Dashboard"}
            </h3>
            <p className="text-xs text-slate-400">
              {isRegister ? "Start your 14-day free trial of LocalAI Growth Pro today." : "Welcome back! Enter your login details to resume local outreach."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/55 text-rose-700 dark:text-rose-400 flex items-center gap-2.5 text-xs">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                id="auth-submit-btn"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-full text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogIn className="w-4.5 h-4.5" />
                    <span>{isRegister ? "Register Account" : "Sign In to System"}</span>
                  </>
                )}
              </button>

              {/* Demo Sandbox Launch */}
              <button
                type="button"
                onClick={onDemoLogin}
                id="auth-demo-btn"
                className="w-full py-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-extrabold rounded-full text-xs tracking-wider uppercase border border-amber-200/50 dark:border-amber-900/30 transition-all flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-950/50"
              >
                <span>Instant Demo Mode Preview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Social Authentications */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-full text-xs tracking-wide border border-slate-200 dark:border-slate-700/50 flex items-center justify-center gap-2 transition-all shadow-sm"
              id="google-login-btn"
            >
              <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Authenticate with Google Auth</span>
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                type="button"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
