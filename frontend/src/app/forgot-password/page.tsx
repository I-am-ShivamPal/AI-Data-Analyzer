"use client";

import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle2,
  Check,
  Circle,
  RefreshCw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type Step = 1 | 2 | 3 | 4;

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const PW_REQS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter",   test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter",   test: (pw) => /[a-z]/.test(pw) },
  { label: "One number",             test: (pw) => /[0-9]/.test(pw) },
];

/** Mask an email or phone for display */
function maskContact(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) {
    const [local, domain] = trimmed.split("@");
    const visible = local.slice(0, 1);
    return `${visible}${"•".repeat(Math.max(5, local.length - 1))}@${domain}`;
  }
  // Phone-style
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 4) {
    const last2 = digits.slice(-2);
    const prefix = trimmed.slice(0, 3);
    return `${prefix} ••••• ••${last2}`;
  }
  return `••••••`;
}

// ---------------------------------------------------------------------------
// Sub-components — Left Panel
// ---------------------------------------------------------------------------

function SecurityVisualization() {
  const rings = [72, 54, 36];
  const nodes = [
    { cx: 160, cy: 60 },
    { cx: 80,  cy: 130 },
    { cx: 240, cy: 130 },
    { cx: 120, cy: 200 },
    { cx: 200, cy: 200 },
  ];
  const edges: [number, number][] = [[0,1],[0,2],[1,3],[2,4],[1,4],[0,3]];

  return (
    <div className="relative w-full select-none" aria-hidden="true">
      {/* Concentric ring glow */}
      <div className="relative flex items-center justify-center h-36 mb-3">
        {rings.map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-500/20"
            style={{ width: r * 2, height: r * 2, opacity: 0.4 - i * 0.08 }}
          />
        ))}
        <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Connected nodes */}
      <svg viewBox="0 0 320 240" className="w-full h-20 opacity-40">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="6" fill="#0f2a4a" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx={n.cx} cy={n.cy} r="2" fill="#60a5fa" />
          </g>
        ))}
      </svg>
    </div>
  );
}

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

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

const STEPS_META = [
  { num: 1, label: "Account" },
  { num: 2, label: "Verify"  },
  { num: 3, label: "Reset"   },
];

function ProgressIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-7" aria-label="Progress">
      {STEPS_META.map((s, idx) => {
        const done    = current > s.num;
        const active  = current === s.num;
        // pending = current < s.num  (drives the else branch in className below)
        return (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                  done
                    ? "bg-blue-600 border-blue-500 text-white"
                    : active
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "bg-white/[0.03] border-white/10 text-slate-600"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : <span>{s.num}</span>}
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  active ? "text-blue-400" : done ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS_META.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-4 transition-all duration-300 ${
                  current > s.num ? "bg-blue-600/60" : "bg-white/[0.08]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password requirement item
// ---------------------------------------------------------------------------

function ReqItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
      ) : (
        <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
      )}
      <span className={`text-xs ${met ? "text-emerald-400" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OTP input group
// ---------------------------------------------------------------------------

function OtpInput({
  value,
  onChange,
  hasError,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...value];
      if (next[idx]) {
        next[idx] = "";
        onChange(next);
      } else if (idx > 0) {
        next[idx - 1] = "";
        onChange(next);
        refs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;
    // Handle paste
    if (raw.length > 1) {
      const next = [...value];
      raw.split("").slice(0, 6).forEach((ch, i) => {
        if (idx + i < 6) next[idx + i] = ch;
      });
      onChange(next);
      const focusIdx = Math.min(idx + raw.length, 5);
      refs.current[focusIdx]?.focus();
      return;
    }
    const next = [...value];
    next[idx] = raw;
    onChange(next);
    if (idx < 5) refs.current[idx + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, idx: number) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6 - idx);
    if (!pasted) return;
    const next = [...value];
    pasted.split("").forEach((ch, i) => {
      if (idx + i < 6) next[idx + i] = ch;
    });
    onChange(next);
    const focusIdx = Math.min(idx + pasted.length, 5);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="6-digit verification code">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={value[i]}
          aria-label={`Digit ${i + 1} of 6`}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onFocus={(e) => e.target.select()}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          className={`w-11 h-12 text-center text-lg font-bold rounded-xl border bg-white/[0.04] text-white outline-none transition-all duration-200 caret-transparent focus:ring-2 ${
            hasError
              ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20"
              : value[i]
              ? "border-blue-500/60 focus:border-blue-500/80 focus:ring-blue-500/20"
              : "border-white/10 focus:border-blue-500/60 focus:ring-blue-500/20 hover:border-white/20"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Countdown timer hook
// ---------------------------------------------------------------------------

function useCountdown(initialSeconds: number, active: boolean) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const prevActive = useRef(false);

  useEffect(() => {
    if (!active) {
      prevActive.current = false;
      return;
    }
    // Reset timer when active flips from false to true
    if (!prevActive.current) {
      prevActive.current = true;
      setSeconds(initialSeconds);
    }
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, initialSeconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, expired: seconds === 0, reset: () => setSeconds(initialSeconds) };
}


// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ForgotPasswordPage() {
  // ── Step state ──
  const [step, setStep] = useState<Step>(1);

  // ── Step 1 ──
  const [contact, setContact]           = useState("");
  const [lookupState, setLookupState]   = useState<"idle" | "checking" | "found" | "not-found">("idle");
  const [lookupError, setLookupError]   = useState<string | null>(null);

  // ── Step 2 ──
  const [otp, setOtp]                   = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError]         = useState<string | null>(null);
  const [otpLoading, setOtpLoading]     = useState(false);
  const [timerActive, setTimerActive]   = useState(false);
  const timer = useCountdown(270, timerActive); // 4m 30s

  // ── Step 3 ──
  const [newPw, setNewPw]               = useState("");
  const [confirmPw, setConfirmPw]       = useState("");
  const [showNewPw, setShowNewPw]       = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Step 1 handlers
  // ─────────────────────────────────────────────────────────────────────────

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupError(null);
    if (!contact.trim()) {
      setLookupError("Please enter your email or phone number.");
      return;
    }
    setLookupState("checking");
    setTimeout(() => {
      // Mock: anything with "@" or 7+ digits = "found"
      const hasAt    = contact.includes("@");
      const hasPhone = contact.replace(/\D/g, "").length >= 7;
      if (hasAt || hasPhone) {
        setLookupState("found");
        setTimeout(() => {
          setStep(2);
          setTimerActive(true);
        }, 1200);
      } else {
        setLookupState("not-found");
      }
    }, 1800);
  }

  function handleRetry() {
    setContact("");
    setLookupState("idle");
    setLookupError(null);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 2 handlers
  // ─────────────────────────────────────────────────────────────────────────

  const otpComplete = otp.every((d) => d !== "");

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setOtpError(null);
    if (!otpComplete) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      // Mock: any 6-digit code advances the flow
      setStep(3);
    }, 1500);
  }

  function handleResend() {
    if (!timer.expired) return;
    setOtp(Array(6).fill(""));
    setOtpError(null);
    setTimerActive(false);
    setTimeout(() => setTimerActive(true), 50);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Step 3 handlers
  // ─────────────────────────────────────────────────────────────────────────

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    if (!newPw || !confirmPw) {
      setResetError("Please fill in both password fields.");
      return;
    }
    if (newPw !== confirmPw) {
      setResetError("Passwords do not match.");
      return;
    }
    const allMet = PW_REQS.every((r) => r.test(newPw));
    if (!allMet) {
      setResetError("Your password does not meet all requirements.");
      return;
    }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setStep(4);
    }, 2000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Back navigation
  // ─────────────────────────────────────────────────────────────────────────

  function goBack() {
    if (step === 2) {
      setStep(1);
      setLookupState("idle");
      setOtp(Array(6).fill(""));
      setOtpError(null);
      setTimerActive(false);
    } else if (step === 3) {
      setStep(2);
      setOtp(Array(6).fill(""));
      setOtpError(null);
      setResetError(null);
      setTimerActive(true);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col overflow-x-hidden selection:bg-blue-500/30">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] opacity-[0.13]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[140px]" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.08]">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[110px]" />
        </div>
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

      {/* MAIN */}
      <main
        id="main-content"
        className="relative z-10 flex flex-1 items-start lg:items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center">

          {/* ================================================================
              LEFT PANEL
          ================================================================ */}
          <aside className="hidden md:flex flex-col flex-1 max-w-md" aria-label="Brand panel">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">AI DATA ANALYZER</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Recover your account<br />
              <span className="text-blue-400">securely.</span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
              Verify your account before creating a new password.
            </p>

            <div className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <SecurityVisualization />
            </div>

            <div className="flex flex-col gap-3">
              <TrustItem>Secure account recovery</TrustItem>
              <TrustItem>Identity verification</TrustItem>
              <TrustItem>Protected sessions</TrustItem>
            </div>
          </aside>

          {/* ================================================================
              RIGHT PANEL — CARD
          ================================================================ */}
          <section className="w-full lg:max-w-md flex-shrink-0" aria-label="Account recovery">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-9 shadow-[0_4px_60px_-10px_rgba(0,0,0,0.5)]">

              {/* Mobile brand mark */}
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-bold tracking-tight text-white text-sm">AI DATA ANALYZER</span>
              </div>

              {/* Progress — steps 1-3 only */}
              {step !== 4 && <ProgressIndicator current={step} />}

              {/* ============================================================
                  STEP 1 — ACCOUNT IDENTIFICATION
              ============================================================ */}
              {step === 1 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1.5">Forgot your password?</h2>
                    <p className="text-slate-400 text-sm">
                      Enter the email address or phone number associated with your account.
                    </p>
                  </div>

                  {/* Lookup states */}
                  {lookupState === "checking" && (
                    <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm" role="status" aria-live="polite">
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                      <span>Checking your account...</span>
                    </div>
                  )}

                  {lookupState === "found" && (
                    <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm" role="status" aria-live="polite">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Account found</p>
                        <p className="text-emerald-400/70 text-xs mt-0.5">
                          {"We've sent a verification code to "}
                          <span className="font-mono">{maskContact(contact)}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {lookupState === "not-found" && (
                    <div className="flex items-start gap-2.5 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm" role="alert" aria-live="assertive">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{"We couldn't find an account with those details."}</p>
                        <p className="text-red-400/70 text-xs mt-0.5">Check your email or phone number and try again.</p>
                      </div>
                    </div>
                  )}

                  {lookupError && lookupState === "idle" && (
                    <div className="flex items-start gap-2.5 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm" role="alert">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{lookupError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLookup} noValidate>
                    <div className="mb-5">
                      <label htmlFor="fp-contact" className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email or phone number
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                        <input
                          id="fp-contact"
                          name="contact"
                          type="text"
                          autoComplete="email"
                          required
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="Enter your email or phone number"
                          disabled={lookupState === "checking" || lookupState === "found"}
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {lookupState === "not-found" ? (
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                      >
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
                        Try again
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={lookupState === "checking" || lookupState === "found"}
                        aria-busy={lookupState === "checking"}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                      >
                        {lookupState === "checking" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Checking...</>
                        ) : (
                          <>Continue <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                        )}
                      </button>
                    )}
                  </form>

                  <div className="mt-5 flex items-center justify-center gap-3" aria-hidden="true">
                    <div className="flex-1 h-px bg-white/[0.07]" />
                    <span className="text-slate-600 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/[0.07]" />
                  </div>
                  <p className="text-center text-sm text-slate-400 mt-4">
                    {"Remember your password? "}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded">
                      Back to Sign In
                    </Link>
                  </p>
                </>
              )}

              {/* ============================================================
                  STEP 2 — OTP VERIFICATION
              ============================================================ */}
              {step === 2 && (
                <>
                  {/* Back */}
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200 mb-5 group focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                    aria-label="Back to account identification"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back
                  </button>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1.5">Verify your account</h2>
                    <p className="text-slate-400 text-sm">
                      Enter the 6-digit verification code sent to your registered contact.
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Code sent to{" "}
                      <span className="font-mono text-slate-400">{maskContact(contact)}</span>
                    </p>
                  </div>

                  {/* OTP error */}
                  {otpError && (
                    <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm" role="alert" aria-live="assertive">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Invalid verification code.</p>
                        <p className="text-red-400/70 text-xs mt-0.5">The code you entered is incorrect or has expired.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} noValidate>
                    <div className="mb-6">
                      <OtpInput value={otp} onChange={setOtp} hasError={!!otpError} />
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-between mb-6 text-xs">
                      {!timer.expired ? (
                        <span className="text-slate-500" aria-live="polite">
                          Code expires in{" "}
                          <span className="font-mono text-slate-400">{timer.display}</span>
                        </span>
                      ) : (
                        <span className="text-red-400" aria-live="polite">Code expired</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">{"Didn't receive the code?"}</span>
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={!timer.expired}
                          className="text-blue-400 hover:text-blue-300 font-medium disabled:text-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                          aria-label="Resend verification code"
                        >
                          Resend
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!otpComplete || otpLoading}
                      aria-busy={otpLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                    >
                      {otpLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Verifying...</>
                      ) : (
                        <>Verify Code <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* ============================================================
                  STEP 3 — NEW PASSWORD
              ============================================================ */}
              {step === 3 && (
                <>
                  {/* Back */}
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors duration-200 mb-5 group focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
                    aria-label="Back to OTP verification"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back
                  </button>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1.5">Create a new password</h2>
                    <p className="text-slate-400 text-sm">Choose a strong password for your account.</p>
                  </div>

                  {resetError && (
                    <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm" role="alert" aria-live="assertive">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <form onSubmit={handleReset} noValidate>
                    {/* New password */}
                    <div className="mb-2">
                      <label htmlFor="fp-newpw" className="block text-sm font-medium text-slate-300 mb-1.5">New password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                        <input
                          id="fp-newpw"
                          type={showNewPw ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="Create a new password"
                          className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/20 hover:border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw((v) => !v)}
                          aria-label={showNewPw ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded transition-colors duration-200"
                        >
                          {showNewPw ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password requirements */}
                    <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Password requirements</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PW_REQS.map((req) => (
                          <ReqItem key={req.label} met={req.test(newPw)} label={req.label} />
                        ))}
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div className="mb-6">
                      <label htmlFor="fp-confirm" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm new password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                        <input
                          id="fp-confirm"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          placeholder="Confirm your new password"
                          className={`w-full pl-10 pr-11 py-3 bg-white/[0.04] border rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none transition-all duration-200 focus:ring-2 hover:border-white/20 ${
                            confirmPw.length > 0 && confirmPw !== newPw
                              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                              : confirmPw.length > 0 && confirmPw === newPw
                              ? "border-emerald-500/50 focus:border-emerald-500/70 focus:ring-emerald-500/20"
                              : "border-white/10 focus:border-blue-500/60 focus:bg-blue-500/[0.04] focus:ring-blue-500/20"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded transition-colors duration-200"
                        >
                          {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPw.length > 0 && confirmPw !== newPw && (
                        <p className="mt-1 text-xs text-red-400" role="alert">Passwords do not match.</p>
                      )}
                      {confirmPw.length > 0 && confirmPw === newPw && (
                        <p className="mt-1 text-xs text-emerald-400">Passwords match.</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      aria-busy={resetLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                    >
                      {resetLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Updating password...</>
                      ) : (
                        <>Reset Password <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* ============================================================
                  STEP 4 — SUCCESS
              ============================================================ */}
              {step === 4 && (
                <div className="flex flex-col items-center text-center py-6" role="status">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Password reset successfully</h2>
                  <p className="text-slate-400 text-sm max-w-xs mb-7">
                    Your password has been updated. You can now sign in to your account.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.55)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#020617]"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Security badge */}
              {step !== 4 && (
                <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Your account is protected by secure verification.</span>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>

    </div>
  );
}
