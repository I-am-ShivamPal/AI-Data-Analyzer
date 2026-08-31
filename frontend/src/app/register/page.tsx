"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Circle,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Abstract data visualisation for the brand panel */
function DataVisualization() {
  const cols = [
    [30, 60, 45, 80],
    [50, 35, 70, 55],
    [65, 80, 40, 90],
    [45, 55, 85, 60],
    [70, 40, 65, 75],
  ];

  const nodes = [
    { cx: 40,  cy: 30  },
    { cx: 130, cy: 15  },
    { cx: 220, cy: 40  },
    { cx: 170, cy: 90  },
    { cx: 80,  cy: 100 },
    { cx: 270, cy: 95  },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3], [2, 5],
  ];

  return (
    <div className="relative w-full select-none" aria-hidden="true">
      {/* Stacked bar chart */}
      <div className="flex items-end gap-2 h-24 mb-4 px-1">
        {cols.map((segments, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col-reverse gap-0.5 h-full justify-start items-stretch">
            {segments.map((pct, segIdx) => {
              const opacities = [0.35, 0.5, 0.65, 0.85];
              return (
                <div
                  key={segIdx}
                  className="rounded-sm"
                  style={{
                    height: `${pct * 0.22}px`,
                    background: "linear-gradient(to top, #1d4ed8, #60a5fa)",
                    opacity: opacities[segIdx],
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Connected nodes */}
      <svg viewBox="0 0 300 120" className="w-full h-20 opacity-45">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="#3b82f6" strokeWidth="1"
            strokeDasharray="3 3" opacity="0.6"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="7" fill="#0f2a4a" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx={n.cx} cy={n.cy} r="2.5" fill="#60a5fa" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Small trust indicator pill */
function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
        <Check className="w-2.5 h-2.5 text-blue-400" />
      </div>
      {children}
    </div>
  );
}

/** Single password requirement indicator */
function ReqItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
      ) : (
        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
      )}
      <span className={met ? "text-emerald-400" : "text-slate-500"}>{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /** Mock submit -- UI phase only, no backend */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col overflow-x-hidden selection:bg-blue-500/30">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Top-right accent glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] opacity-[0.12]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[140px]" />
        </div>
        {/* Bottom-left accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] opacity-[0.08]">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[110px]" />
        </div>
        {/* Faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
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
        className="relative z-10 flex flex-1 items-start lg:items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center">

          {/* =================================================================
              LEFT PANEL - BRAND
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
              Start turning your data<br />
              into{" "}
              <span className="text-blue-400">verified answers.</span>
            </h1>

            {/* Supporting text */}
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
              Create your secure workspace and start analyzing your datasets
              with natural language.
            </p>

            {/* Data visualization */}
            <div className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <DataVisualization />
            </div>

            {/* Trust items */}
            <div className="flex flex-col gap-3">
              <TrustItem>Secure sessions</TrustItem>
              <TrustItem>Private datasets</TrustItem>
              <TrustItem>Deterministic analytics</TrustItem>
            </div>
          </aside>

          {/* =================================================================
              RIGHT PANEL - REGISTER CARD
          ================================================================= */}
          <section
            className="w-full lg:max-w-md flex-shrink-0"
            aria-label="Registration form"
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-9 shadow-[0_4px_60px_-10px_rgba(0,0,0,0.5)]">

              {/* Card header */}
              <div className="mb-7">
                {/* Mobile-only brand mark */}
                <div className="flex items-center gap-2 mb-5 md:hidden">
                  <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-bold tracking-tight text-white text-sm">
                    AI DATA ANALYZER
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1.5">
                  Create your account
                </h2>
                <p className="text-slate-400 text-sm">
                  Join AI DATA ANALYZER and start exploring your data.
                </p>
              </div>

              {/* SUCCESS STATE */}
              {success && (
                <div
                  role="status"
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">
                      Account created successfully
                    </p>
                    <p className="text-slate-400 text-sm">
                      Your account has been created. You can now sign in.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                  >
                    Sign in to your account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {!success && (
                <>
                  {/* ERROR ALERT */}
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* FORM */}
                  <form onSubmit={handleSubmit} noValidate>

                    {/* Full name */}
                    <div className="mb-4">
                      <label
                        htmlFor="reg-name"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Full name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-name"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label
                        htmlFor="reg-email"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label
                        htmlFor="reg-phone"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Phone number{" "}
                        <span className="text-slate-500 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Include country code, e.g. +1 555 000 0000
                      </p>
                    </div>

                    {/* Password */}
                    <div className="mb-2">
                      <label
                        htmlFor="reg-password"
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
                          id="reg-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 focus:outline-none focus:text-slate-300 focus:ring-2 focus:ring-blue-500/40 focus:rounded transition-colors duration-200"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password requirements */}
                    {password.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                          Password must contain
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {PASSWORD_REQUIREMENTS.map((req) => (
                            <ReqItem
                              key={req.label}
                              met={req.test(password)}
                              label={req.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Password requirements hint -- shown when field is empty */}
                    {password.length === 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                          Password must contain
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {PASSWORD_REQUIREMENTS.map((req) => (
                            <ReqItem key={req.label} met={false} label={req.label} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confirm password */}
                    <div className="mb-5">
                      <label
                        htmlFor="reg-confirm"
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                      >
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                          aria-hidden="true"
                        />
                        <input
                          id="reg-confirm"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className={`w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:ring-2 hover:border-white/20 ${
                            confirmPassword.length > 0 && confirmPassword !== password
                              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                              : confirmPassword.length > 0 && confirmPassword === password
                              ? "border-emerald-500/50 focus:border-emerald-500/70 focus:ring-emerald-500/20"
                              : "border-white/10 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-blue-500/20"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 focus:outline-none focus:text-slate-300 focus:ring-2 focus:ring-blue-500/40 focus:rounded transition-colors duration-200"
                        >
                          {showConfirm ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {/* Inline match feedback */}
                      {confirmPassword.length > 0 && confirmPassword !== password && (
                        <p className="mt-1 text-xs text-red-400">Passwords do not match.</p>
                      )}
                      {confirmPassword.length > 0 && confirmPassword === password && (
                        <p className="mt-1 text-xs text-emerald-400">Passwords match.</p>
                      )}
                    </div>

                    {/* Terms & Privacy */}
                    <div className="mb-6">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={agreedToTerms}
                          onClick={() => setAgreedToTerms((v) => !v)}
                          className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded ${
                            agreedToTerms
                              ? "bg-blue-600 border-blue-500"
                              : "bg-white/[0.04] border-white/20 group-hover:border-white/30"
                          }`}
                          aria-label="Agree to Terms of Service and Privacy Policy"
                        >
                          {agreedToTerms && (
                            <Check className="w-3 h-3 text-white mx-auto" />
                          )}
                        </button>
                        <span className="text-sm text-slate-400 leading-snug select-none">
                          I agree to the{" "}
                          <Link
                            href="#"
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="#"
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </div>

                    {/* Create Account button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      aria-busy={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5" aria-hidden="true">
                    <div className="flex-1 h-px bg-white/[0.07]" />
                    <span className="text-slate-600 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/[0.07]" />
                  </div>

                  {/* Login link */}
                  <p className="text-center text-sm text-slate-400">
                    {"Already have an account? "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                      aria-label="Sign in to existing account"
                    >
                      Sign in
                    </Link>
                  </p>

                  {/* Security badge */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Your account is protected by secure session-based authentication.</span>
                  </div>
                </>
              )}

            </div>
          </section>

        </div>
      </main>

    </div>
  );
}
