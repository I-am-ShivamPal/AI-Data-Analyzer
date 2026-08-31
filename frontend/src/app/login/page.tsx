"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DataVisualization() {
  const bars = [40, 65, 50, 80, 55, 70, 45, 90, 60, 75];
  const nodes = [
    { cx: 60, cy: 40 },
    { cx: 160, cy: 20 },
    { cx: 260, cy: 55 },
    { cx: 200, cy: 100 },
    { cx: 100, cy: 110 },
    { cx: 310, cy: 110 },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3], [2, 5],
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto select-none" aria-hidden="true">
      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-28 mb-6 px-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: "linear-gradient(to top, #2563eb, #60a5fa)",
              opacity: 0.55 + i * 0.04,
            }}
          />
        ))}
      </div>

      {/* Connected nodes */}
      <svg viewBox="0 0 360 140" className="w-full h-28 opacity-50">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.5"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="8" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx={n.cx} cy={n.cy} r="3" fill="#60a5fa" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70" />
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Mock submit - no real auth in this UI phase */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError("Invalid email or password. (Mock -- backend not connected)");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col overflow-x-hidden selection:bg-blue-500/30">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Deep blue top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.15]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[130px]" />
        </div>
        {/* Left accent glow */}
        <div className="absolute top-1/4 left-0 w-[400px] h-[600px] opacity-[0.08]">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px]" />
        </div>
        {/* Faint dot-grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* BACK TO HOME */}
      <div className="relative z-10 px-4 pt-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200 group"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to home
        </Link>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main
        id="main-content"
        className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

          {/* =================================================================
              LEFT PANEL - BRAND EXPERIENCE
          ================================================================= */}
          <aside
            className="hidden md:flex flex-col flex-1 max-w-md"
            aria-label="Brand panel"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">
                AI DATA ANALYZER
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Your data.<br />
              Your questions.<br />
              <span className="text-blue-400">Verified answers.</span>
            </h1>

            {/* Supporting text */}
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
              Analyze datasets with natural language and get answers backed by
              deterministic analytics.
            </p>

            {/* Abstract data visualization */}
            <div className="mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <DataVisualization />
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2">
              <TrustBadge>Deterministic analytics</TrustBadge>
              <TrustBadge>Secure sessions</TrustBadge>
              <TrustBadge>Private datasets</TrustBadge>
            </div>
          </aside>

          {/* =================================================================
              RIGHT PANEL - LOGIN CARD
          ================================================================= */}
          <section
            className="w-full lg:max-w-md flex-shrink-0"
            aria-label="Login form"
          >
            {/* Glassmorphic card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_4px_60px_-10px_rgba(0,0,0,0.5)]">

              {/* Card header */}
              <div className="flex flex-col items-start mb-8">
                {/* Mobile-only brand mark */}
                <div className="flex items-center gap-2 mb-6 md:hidden">
                  <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-bold tracking-tight text-white text-sm">
                    AI DATA ANALYZER
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>
                <p className="text-slate-400 text-sm">Sign in to continue to your workspace.</p>
              </div>

              {/* ----------------------------------------------------------
                  ERROR ALERT - hidden when error is null
              ---------------------------------------------------------- */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ----------------------------------------------------------
                  FORM
              ---------------------------------------------------------- */}
              <form onSubmit={handleSubmit} noValidate>

                {/* Email or phone */}
                <div className="mb-5">
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-slate-300 mb-1.5"
                  >
                    Email or phone
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                      aria-hidden="true"
                    />
                    <input
                      id="login-email"
                      name="email"
                      type="text"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or phone number"
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                    />
                    {/* Visibility toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 focus:outline-none focus:text-slate-300 focus:ring-2 focus:ring-blue-500/40 focus:rounded transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between mb-6">
                  {/* Remember me */}
                  <button
                    type="button"
                    onClick={() => setRememberMe((v) => !v)}
                    aria-pressed={rememberMe}
                    aria-label="Remember me"
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-300 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded group"
                  >
                    {rememberMe ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    )}
                    <span>Remember me</span>
                  </button>

                  {/* Forgot password */}
                  <Link
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6" aria-hidden="true">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-slate-600 text-xs">or</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-slate-400">
                {"Don't have an account? "}
                <Link
                  href="#"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                  aria-label="Create a new account"
                >
                  Create an account
                </Link>
              </p>

              {/* Security badge */}
              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Secure session-based authentication</span>
              </div>

            </div>
          </section>

        </div>
      </main>

    </div>
  );
}
