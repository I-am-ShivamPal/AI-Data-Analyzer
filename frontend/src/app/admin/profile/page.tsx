"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  MonitorSmartphone,
  Server,
  Database,
  BarChart3,
  Activity,
  ScrollText,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  LockKeyhole,
  Smartphone,
  Laptop,
  AlertTriangle,
  History,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldAlert,
  Terminal,
  Fingerprint,
  KeyRound,
  Trash2,
  Ban
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────────────────────────

const NAV_OVERVIEW = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { key: "users", label: "Users", icon: Users, href: "/admin/users" },
  { key: "sessions", label: "Sessions", icon: MonitorSmartphone, href: "/admin/sessions" },
  { key: "devices", label: "Devices", icon: Server, href: "/admin/devices" },
  { key: "datasets", label: "Datasets", icon: Database, href: "/admin/datasets" },
  { key: "analysis", label: "Analysis", icon: BarChart3, href: "/admin/analysis" },
];
const NAV_MONITORING = [
  { key: "system", label: "System Health", icon: Activity, href: "/admin/system" },
  { key: "activity", label: "Activity Logs", icon: ScrollText, href: "/admin/activity" },
];
const NAV_ACCOUNT = [
  { key: "profile", label: "Admin Profile", icon: User, href: "/admin/profile" },
  { key: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

function AdminSidebar({ active, mobileOpen, setMobileOpen }: { active: string; mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  function NavItem({ nav }: { nav: typeof NAV_OVERVIEW[0] }) {
    const isActive = active === nav.key;
    return (
      <Link href={nav.href} onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"}`}>
        <nav.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
        {nav.label}
        {isActive && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400/60" />}
      </Link>
    );
  }
  const inner = (
    <div className="flex flex-col h-full bg-[#070B14]">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="p-1.5 bg-cyan-500/15 rounded-lg border border-cyan-500/30 flex-shrink-0"><ShieldCheck className="w-5 h-5 text-cyan-400" /></div>
        <div className="leading-tight">
          <div className="text-xs font-bold text-white tracking-wider">AI DATA ANALYZER</div>
          <div className="text-xs font-bold text-cyan-400 tracking-wider">ADMIN CONSOLE</div>
        </div>
        <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5 custom-scrollbar">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Overview</p>
        {NAV_OVERVIEW.map(n => <NavItem key={n.key} nav={n} />)}
        <div className="pt-5"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Monitoring</p>{NAV_MONITORING.map(n => <NavItem key={n.key} nav={n} />)}</div>
        <div className="pt-5"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Account</p>{NAV_ACCOUNT.map(n => <NavItem key={n.key} nav={n} />)}</div>
      </nav>
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-2">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 relative">
            <User className="w-3.5 h-3.5 text-cyan-300" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#070B14]"></span>
          </div>
          <div className="min-w-0"><p className="text-xs font-semibold text-white truncate">Administrator</p><p className="text-[10px] text-cyan-500/80">Super Admin</p></div>
        </div>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"><LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-400" />Logout</button>
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#070B14] border-r border-white/[0.06] h-full z-20">{inner}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col bg-[#070B14] border-r border-white/[0.06] h-full z-10">{inner}</aside>
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Modal
// ────────────────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, maxWidth = "max-w-md", alert = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string; alert?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-[#0B1120] border ${alert ? "border-red-500/30" : "border-white/10"} rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className={`text-base font-semibold ${alert ? "text-red-400" : "text-white"}`}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1" aria-label="Close modal"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────────────────────────────────

const MOCK_ACTIVITY = [
  { id: 1, action: "Updated profile information", time: "Today \u00b7 14:32", device: "Windows \u00b7 Chrome", icon: User },
  { id: 2, action: "Viewed analysis monitoring", time: "Today \u00b7 11:15", device: "Windows \u00b7 Chrome", icon: BarChart3 },
  { id: 3, action: "Opened dataset monitoring", time: "Today \u00b7 10:45", device: "Windows \u00b7 Chrome", icon: Database },
  { id: 4, action: "Reviewed user activity", time: "Yesterday \u00b7 16:20", device: "Windows \u00b7 Chrome", icon: Users },
  { id: 5, action: "Viewed System Health", time: "Yesterday \u00b7 09:18", device: "Windows \u00b7 Chrome", icon: Activity },
  { id: 6, action: "Logged in from Windows Laptop", time: "Yesterday \u00b7 09:15", device: "Windows \u00b7 Chrome", icon: Fingerprint },
];

const MOCK_SESSIONS = [
  { id: "ses_1a2b3c4d5e", device: "Windows Laptop", os: "Windows 11", browser: "Chrome", location: "Local Development", ip: "192.168.\u2022\u2022\u2022.\u2022\u2022", current: true, icon: Laptop, lastActive: "Just now" },
  { id: "ses_9f8e7d6c5b", device: "MacBook Pro", os: "macOS Sonoma", browser: "Safari", location: "New York, USA", ip: "104.28.\u2022\u2022\u2022.\u2022\u2022", current: false, icon: Laptop, lastActive: "Yesterday \u00b7 18:42" },
  { id: "ses_5a4b3c2d1e", device: "Android Phone", os: "Android 14", browser: "Chrome Mobile", location: "New York, USA", ip: "172.56.\u2022\u2022\u2022.\u2022\u2022", current: false, icon: Smartphone, lastActive: "2 Aug 2026 \u00b7 09:15" },
];

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminProfilePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Modals state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [mfaOpen, setMfaOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // Form states
  const [editName, setEditName] = useState("Shivam Pal");
  const [editPhone, setEditPhone] = useState("+1 (555) 019-2834");
  const [editEmail, setEditEmail] = useState("admin@aidataanalyzer.local");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Validation visualizers for password
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const pwMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isPwValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && pwMatch && currentPassword.length > 0;

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[60%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="profile" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white leading-none">Admin Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Manage your administrator account and security settings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Session Active
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />All Systems Operational
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all" aria-label="Notifications">
              <Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>
            <div className="relative">
              <button onClick={() => setUserOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <p className="text-xs font-semibold text-white leading-none hidden sm:block">Administrator</p>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="border-b border-white/[0.06] px-3 py-2 bg-white/[0.02]">
                    <p className="text-[10px] text-cyan-400 font-bold tracking-wider">PLATFORM ADMIN</p>
                  </div>
                  {NAV_ACCOUNT.map(item => (<button key={item.label} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05]"><item.icon className="w-4 h-4" />{item.label}</button>))}
                  <div className="border-t border-white/[0.06]" />
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut className="w-4 h-4" />Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">

            {/* ── Privileged Access Warning ── */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-amber-400 mb-1">Privileged Administrator Account</h4>
                <p className="text-xs text-amber-200/80 leading-relaxed max-w-3xl">
                  This account has access to platform-wide monitoring and administrative controls. Keep administrator credentials secure and review active sessions regularly.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["RBAC Protected", "Session Authenticated", "Audit Logged", "Privileged Access"].map(badge => (
                    <span key={badge} className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">{badge}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Profile Hero ── */}
            <div className="bg-[#0B1120]/50 border border-white/[0.06] rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 p-1">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-900 to-indigo-900 flex items-center justify-center">
                        <User className="w-10 h-10 text-cyan-100" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-[#0B1120] flex items-center justify-center" title="Online">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Shivam Pal</h2>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded uppercase tracking-wider">Administrator</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Verified</span>
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" />MFA Enabled</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-cyan-400 mb-1">Platform Administrator</p>
                    <p className="text-sm text-slate-400 mb-3">admin@aidataanalyzer.local</p>
                    <p className="text-xs text-slate-500">Administrator since <span className="text-slate-300">January 2026</span></p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button onClick={() => setEditProfileOpen(true)} className="flex-1 sm:flex-none px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]">
                    Edit Profile
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
                    <History className="w-4 h-4 text-slate-400" /> View Activity
                  </button>
                </div>
              </div>
            </div>

            {/* ── Admin Statistics ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Admin Actions", val: "247", icon: Terminal, color: "text-blue-400" },
                { label: "Users Managed", val: "1,284", icon: Users, color: "text-indigo-400" },
                { label: "Datasets Monitored", val: "2,486", icon: Database, color: "text-cyan-400" },
                { label: "Security Events", val: "18", icon: ShieldCheck, color: "text-emerald-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/5 ${stat.color} flex-shrink-0`}><stat.icon className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* ── Left Column (2/3) ── */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                
                {/* Admin Account Information */}
                <section>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Administrator Information</h3>
                    <p className="text-sm text-slate-500 mt-1">Personal and administrator account information.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06]">
                      {[
                        { l: "Full Name", v: editName },
                        { l: "Email", v: editEmail },
                        { l: "Phone", v: editPhone },
                        { l: "Role", v: "PLATFORM ADMINISTRATOR", badge: true },
                        { l: "Account Status", v: "Active", green: true },
                        { l: "Created At", v: "15 Jan 2026, 08:30 IST" },
                        { l: "Last Login", v: "31 Aug 2026, 21:42 IST" },
                        { l: "Last Password Change", v: "45 days ago" },
                      ].map((f, i) => (
                        <div key={i} className="bg-[#0B1120] p-5">
                          <p className="text-xs text-slate-500 font-medium mb-1.5">{f.l}</p>
                          {f.badge ? (
                            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded uppercase tracking-wider">{f.v}</span>
                          ) : f.green ? (
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400"><CheckCircle2 className="w-4 h-4" />{f.v}</span>
                          ) : (
                            <p className="text-sm font-medium text-slate-200">{f.v}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Security Center */}
                <section>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Security Center</h3>
                    <p className="text-sm text-slate-500 mt-1">Protect your administrator account and privileged access.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Password */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><LockKeyhole className="w-5 h-5" /></div>
                        <div><h4 className="text-sm font-bold text-white">Password</h4><p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" />Password protected</p></div>
                      </div>
                      <p className="text-xs text-slate-400 mb-5 flex-1">Use a strong, unique password to protect your admin account.</p>
                      <button onClick={() => setChangePasswordOpen(true)} className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold rounded-xl transition-all">Change Password</button>
                    </div>

                    {/* MFA */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
                        <div><h4 className="text-sm font-bold text-white">Multi-Factor Auth</h4><p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" />Enabled</p></div>
                      </div>
                      <p className="text-xs text-slate-400 mb-5 flex-1">Adds an extra layer of security requiring a code from your device.</p>
                      <button onClick={() => setMfaOpen(true)} className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold rounded-xl transition-all">Manage MFA</button>
                    </div>

                    {/* Sessions */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400"><MonitorSmartphone className="w-5 h-5" /></div>
                        <div><h4 className="text-sm font-bold text-white">Active Sessions</h4><p className="text-xs text-blue-400 font-medium mt-0.5">3 active sessions</p></div>
                      </div>
                      <p className="text-xs text-slate-400 mb-5 flex-1">Review all devices currently logged into your admin account.</p>
                      <button onClick={() => setSessionsOpen(true)} className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold rounded-xl transition-all">View Sessions</button>
                    </div>

                    {/* Login Activity */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><Activity className="w-5 h-5" /></div>
                        <div><h4 className="text-sm font-bold text-white">Login Activity</h4><p className="text-xs text-indigo-400 font-medium mt-0.5">Last login 12 minutes ago</p></div>
                      </div>
                      <p className="text-xs text-slate-400 mb-5 flex-1">Monitor recent login attempts and geographic locations.</p>
                      <button className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold rounded-xl transition-all">View Activity</button>
                    </div>

                  </div>
                </section>

                {/* Danger Zone */}
                <section>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
                  </div>
                  <div className="border border-red-500/20 rounded-2xl overflow-hidden bg-red-950/10">
                    <div className="divide-y divide-red-500/10">
                      
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Revoke All Sessions</h4>
                          <p className="text-xs text-slate-400">Immediately sign out this administrator account from all active devices.</p>
                        </div>
                        <button onClick={() => setRevokeAllOpen(true)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex-shrink-0">Revoke All Sessions</button>
                      </div>

                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Disable Administrator Account</h4>
                          <p className="text-xs text-slate-400">Temporarily disable administrative access. Requires super-admin intervention to re-enable.</p>
                        </div>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex-shrink-0">Disable Account</button>
                      </div>

                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Delete Administrator Account</h4>
                          <p className="text-xs text-slate-400">Permanent deletion requires additional verification and cannot be undone.</p>
                        </div>
                        <button onClick={() => { setDeleteConfirmText(""); setDeleteAccountOpen(true); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap flex-shrink-0 shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]">Delete Account</button>
                      </div>

                    </div>
                  </div>
                </section>

              </div>

              {/* ── Right Column (1/3) ── */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Current Admin Session */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><ShieldCheck className="w-24 h-24 text-cyan-400" /></div>
                  <div className="relative z-10">
                    <h3 className="text-base font-bold text-white mb-4">Current Admin Session</h3>
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-5 space-y-3">
                      {[
                        { l: "Session ID", v: "ses_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", font: "font-mono" },
                        { l: "Status", v: "Active", color: "text-emerald-400 font-bold" },
                        { l: "Login Date", v: "31 Aug 2026" },
                        { l: "Login Time", v: "21:42 IST" },
                        { l: "Device", v: "Windows Laptop" },
                        { l: "OS", v: "Windows 11" },
                        { l: "Browser", v: "Chrome" },
                        { l: "IP", v: "192.168.\u2022\u2022\u2022.\u2022\u2022", font: "font-mono" },
                        { l: "Location", v: "Local Development" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-slate-500">{item.l}</span>
                          <span className={`${item.color || "text-slate-200"} ${item.font || ""}`}>{item.v}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setRevokeAllOpen(true)} className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-all">Sign out other sessions</button>
                  </div>
                </div>

                {/* Recent Admin Activity */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-6">
                    <History className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Recent Administrative Activity</h3>
                  </div>
                  <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
                    {MOCK_ACTIVITY.map(act => (
                      <div key={act.id} className="relative pl-6">
                        <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border border-[#0B1120] bg-cyan-500/20 text-cyan-400`}>
                          <act.icon className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200 leading-tight mb-1">{act.action}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="text-cyan-400/80">{act.time}</span>
                            <span>&bull;</span>
                            <span>{act.device}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors border border-transparent hover:border-white/[0.05]">View All Activity</button>
                </div>

              </div>
            </div>

            {/* Bottom Admin Banner */}
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-full">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-cyan-500/50" />ADMIN ONLY AREA</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* Modals */}
      {/* ──────────────────────────────────────────────────────────────────────── */}

      {/* Edit Profile */}
      <Modal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Full Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Email Address <span className="text-amber-500/70 ml-1 text-[10px]">(Requires re-verification)</span></label>
            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Phone Number</label>
            <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50" />
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-400">Role</label>
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 flex items-center justify-between cursor-not-allowed">
              PLATFORM ADMINISTRATOR <LockKeyhole className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Role is managed by backend configuration.</p>
          </div>
          <div className="pt-6 flex gap-3">
            <button onClick={() => setEditProfileOpen(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={() => setEditProfileOpen(false)} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-cyan-950 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)]">Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* Change Password */}
      <Modal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} title="Change Password">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Current Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-400">New Password</label>
            <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Confirm New Password</label>
            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono" placeholder="••••••••" />
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Password Requirements</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                { label: "Minimum 8 characters", met: hasMinLength },
                { label: "Uppercase letter", met: hasUpper },
                { label: "Lowercase letter", met: hasLower },
                { label: "Number", met: hasNumber },
                { label: "Special character", met: hasSpecial },
                { label: "Passwords match", met: pwMatch },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {req.met ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                  <span className={`text-[10px] ${req.met ? "text-slate-300" : "text-slate-500"}`}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button onClick={() => setChangePasswordOpen(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button disabled={!isPwValid} onClick={() => setChangePasswordOpen(false)} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/20 disabled:text-cyan-500/50 text-cyan-950 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)] disabled:shadow-none">Update Password</button>
          </div>
        </div>
      </Modal>

      {/* Manage MFA */}
      <Modal open={mfaOpen} onClose={() => setMfaOpen(false)} title="Multi-Factor Authentication">
        <div className="space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-400">MFA is enabled</h4>
              <p className="text-xs text-emerald-300/80 mt-1">Your administrator account is protected with an additional layer of security.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Authenticator App</p>
                  <p className="text-xs text-slate-500 mt-0.5">Configured on Jan 15, 2026</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">ACTIVE</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Backup Codes</p>
                  <p className="text-xs text-slate-500 mt-0.5">10 codes remaining</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg bg-cyan-500/5 transition-colors">Regenerate Backup Codes</button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
             <button onClick={() => setMfaOpen(false)} className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-semibold rounded-xl transition-all">Close</button>
          </div>
        </div>
      </Modal>

      {/* Active Sessions */}
      <Modal open={sessionsOpen} onClose={() => setSessionsOpen(false)} title="Active Sessions" maxWidth="max-w-lg">
        <div className="space-y-4">
          <p className="text-sm text-slate-400 mb-4">You are currently logged into the following devices. If you don&apos;t recognize a device, revoke it immediately.</p>
          <div className="space-y-3">
            {MOCK_SESSIONS.map(ses => (
              <div key={ses.id} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${ses.current ? "bg-cyan-500/10 text-cyan-400" : "bg-white/[0.05] text-slate-400"}`}>
                    <ses.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      {ses.device} 
                      {ses.current && <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded uppercase tracking-wider">This Device</span>}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{ses.os} &bull; {ses.browser}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-500">
                      <span>{ses.location}</span>
                      <span className="font-mono">{ses.ip}</span>
                      <span className={ses.current ? "text-emerald-400 font-medium" : ""}>{ses.lastActive}</span>
                    </div>
                  </div>
                </div>
                {!ses.current && (
                  <button className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-2.5 py-1 rounded-md bg-red-500/5 transition-colors uppercase tracking-wider">Revoke</button>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/[0.06] flex justify-end">
             <button onClick={() => setSessionsOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Close</button>
          </div>
        </div>
      </Modal>

      {/* Revoke All Confirm */}
      <Modal open={revokeAllOpen} onClose={() => setRevokeAllOpen(false)} title="Revoke All Other Sessions" alert maxWidth="max-w-sm">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-center text-slate-300">
            This will immediately sign you out from all other active devices. You will remain logged in on this current device.
          </p>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setRevokeAllOpen(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={() => setRevokeAllOpen(false)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]">Revoke Sessions</button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Confirm */}
      <Modal open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} title="Delete Administrator Account" alert maxWidth="max-w-sm">
        <div className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-400">Irreversible Action</h4>
              <p className="text-xs text-red-300/80 mt-1">This will permanently delete your administrator account, revoking all platform access and deleting associated activity logs.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">To confirm, type <span className="font-bold text-white select-none">DELETE</span> below:</label>
            <input 
              type="text" 
              value={deleteConfirmText} 
              onChange={e => setDeleteConfirmText(e.target.value)} 
              placeholder="DELETE"
              className="w-full bg-[#070B14] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50" 
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setDeleteAccountOpen(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button 
              disabled={deleteConfirmText !== "DELETE"} 
              onClick={() => setDeleteAccountOpen(false)} 
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/20 disabled:text-red-500/50 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)] disabled:shadow-none flex justify-center items-center gap-2">
              <Ban className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
