"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Globe,
  LockKeyhole,
  HardDrive,
  Zap,
  BellRing,
  FileSearch,
  Wrench,
  AlertTriangle,
  Save,
  Undo2,
  Ban,
  CheckCircle2,
  FolderArchive,
  TerminalSquare
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
  { key: "settings", label: "Admin Settings", icon: SettingsIcon, href: "/admin/settings" },
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
// Setting Controls
// ────────────────────────────────────────────────────────────────────────────

function Toggle({ label, checked, onChange, desc }: { label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0 last:pb-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
      </div>
      <button 
        type="button" 
        role="switch" 
        aria-checked={checked} 
        onClick={() => onChange(!checked)} 
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-cyan-500" : "bg-slate-700"} focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function SelectInput({ label, value, onChange, options, desc }: { label: string; value: string; onChange: (v: string) => void; options: string[]; desc?: string }) {
  return (
    <div className="py-3 border-b border-white/[0.06] last:border-0 last:pb-0">
      <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>
      {desc && <p className="text-xs text-slate-500 mb-2">{desc}</p>}
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextInput({ label, value, onChange, desc, type = "text" }: { label: string; value: string; onChange: (v: string) => void; desc?: string; type?: string }) {
  return (
    <div className="py-3 border-b border-white/[0.06] last:border-0 last:pb-0">
      <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>
      {desc && <p className="text-xs text-slate-500 mb-2">{desc}</p>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("general");
  const rightColumnRef = useRef<HTMLDivElement>(null);
  
  // ── Mock Form States ──
  const [unsaved, setUnsaved] = useState(false);
  const markUnsaved = () => setUnsaved(true);

  // General
  const [platformName, setPlatformName] = useState("AI DATA ANALYZER");
  const [env, setEnv] = useState("Development");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("English");
  const [maxConcurrent, setMaxConcurrent] = useState("4");
  
  // Security
  const [authSession, setAuthSession] = useState(true);
  const [rbacEnabled, setRbacEnabled] = useState(true);
  const [sessionDur, setSessionDur] = useState("8 hours");
  const [maxSessions, setMaxSessions] = useState("5");
  const [reqReauth, setReqReauth] = useState(true);
  const [mfaPolicy, setMfaPolicy] = useState("Required for Administrators");
  const [mfaApp, setMfaApp] = useState(true);
  const [mfaBackup, setMfaBackup] = useState(true);
  const [mfaNew, setMfaNew] = useState(true);
  
  // Data
  const [maxDatasetSize, setMaxDatasetSize] = useState("1 GB");
  const [csvEnabled, setCsvEnabled] = useState(true);
  const [xlsxEnabled, setXlsxEnabled] = useState(true);
  const [jsonEnabled, setJsonEnabled] = useState(true);
  const [zipEnabled, setZipEnabled] = useState(true);
  const [autoCleanup, setAutoCleanup] = useState(true);
  
  // Notifications
  const [notifHealth, setNotifHealth] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifFail, setNotifFail] = useState(true);
  const [notifProcess, setNotifProcess] = useState(true);
  
  // Audit
  const [auditAuth, setAuditAuth] = useState(true);
  const [auditDataset, setAuditDataset] = useState(true);
  const [auditAnalysis, setAuditAnalysis] = useState(true);
  const [auditAdmin, setAuditAdmin] = useState(true);
  const [retention, setRetention] = useState("90 days");
  
  // Advanced
  const [ffMultiDim, setFfMultiDim] = useState(true);
  const [ffAdvDate, setFfAdvDate] = useState(true);
  const [ffExport, setFfExport] = useState(true);
  const [ffZip, setFfZip] = useState(true);
  const [ffChart, setFfChart] = useState(true);
  const [ffExp, setFfExp] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [disableReg, setDisableReg] = useState(false);

  // Modals
  const [saveModal, setSaveModal] = useState(false);
  const [revokeModal, setRevokeModal] = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");
  const [maintModal, setMaintModal] = useState(false);
  const [maintPendingVal, setMaintPendingVal] = useState(false);

  // Helper to intercept changes
  const intercept = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (val: T) => {
    setter(val);
    markUnsaved();
  };

  const handleMaintenanceToggle = (val: boolean) => {
    if (val) {
      setMaintPendingVal(val);
      setMaintModal(true);
    } else {
      intercept(setMaintenance)(false);
    }
  };

  const handleSaveAll = () => {
    setSaveModal(false);
    setUnsaved(false);
  };

  const handleDiscard = () => {
    setUnsaved(false);
    // In a real app we'd revert state here
  };

  // Scroll to section on mobile if selected from dropdown
  useEffect(() => {
    if (window.innerWidth < 1024 && rightColumnRef.current) {
      const el = document.getElementById(`section-${activeTab}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      
      <AdminSidebar active="settings" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white leading-none">Admin Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Configure platform behavior, security policies, system defaults, and administrative controls.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Session Active
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
            </div>
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

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
          
          {/* ── Left Navigation (Desktop) / Dropdown (Mobile) ── */}
          <div className="lg:w-[260px] lg:border-r border-white/[0.06] flex-shrink-0 flex flex-col bg-[#070B14]/50 z-20">
            <div className="p-4 lg:hidden border-b border-white/[0.06]">
              <select value={activeTab} onChange={e => setActiveTab(e.target.value)} className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none font-medium">
                <option value="general">General</option>
                <option value="security">Security</option>
                <option value="data">Data & Storage</option>
                <option value="ai">AI Engine</option>
                <option value="notifications">Notifications</option>
                <option value="audit">Audit & Logs</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="hidden lg:block p-4 overflow-y-auto custom-scrollbar flex-1">
              <nav className="space-y-6">
                {[
                  { section: "General", items: [{ id: "general", label: "Platform", icon: Globe }] },
                  { section: "Security", items: [{ id: "security", label: "Authentication & Security", icon: LockKeyhole }] },
                  { section: "Data", items: [{ id: "data", label: "Upload Limits & Storage", icon: HardDrive }] },
                  { section: "AI Engine", items: [{ id: "ai", label: "Analysis Engine & Limits", icon: Zap }] },
                  { section: "Notifications", items: [{ id: "notifications", label: "System Alerts", icon: BellRing }] },
                  { section: "Audit", items: [{ id: "audit", label: "Audit Logging", icon: FileSearch }] },
                  { section: "Advanced", items: [{ id: "advanced", label: "Maintenance & Flags", icon: Wrench }] },
                ].map(group => (
                  <div key={group.section}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">{group.section}</p>
                    <div className="space-y-0.5">
                      {group.items.map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: "smooth" }); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"}`}>
                          <item.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === item.id ? "text-cyan-400" : "text-slate-500"}`} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* ── Right Content ── */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 pb-32 scroll-smooth" ref={rightColumnRef}>
            <div className="max-w-[800px] space-y-8 sm:space-y-10">

              {/* SECTION: GENERAL */}
              <section id="section-general" className="space-y-6">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> Platform Configuration</h2>
                    <p className="text-xs text-slate-400 mt-1">Manage global configuration used across AI DATA ANALYZER.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <TextInput label="Platform Name" value={platformName} onChange={intercept(setPlatformName)} />
                    <SelectInput label="Environment" value={env} onChange={intercept(setEnv)} options={["Development", "Staging", "Production"]} />
                    <TextInput label="Maximum Concurrent Analyses" value={maxConcurrent} onChange={intercept(setMaxConcurrent)} type="number" />
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white">Regional Defaults</h2>
                    <p className="text-xs text-slate-400 mt-1">These are platform defaults, not individual user preferences.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <SelectInput label="Timezone" value={timezone} onChange={intercept(setTimezone)} options={["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"]} />
                    <SelectInput label="Currency" value={currency} onChange={intercept(setCurrency)} options={["USD", "EUR", "INR", "GBP"]} />
                    <SelectInput label="Language" value={language} onChange={intercept(setLanguage)} options={["English", "Spanish", "French"]} />
                  </div>
                </div>
              </section>

              {/* SECTION: SECURITY */}
              <section id="section-security" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><LockKeyhole className="w-4 h-4 text-emerald-400" /> Authentication & Security</h2>
                    <p className="text-xs text-slate-400 mt-1">Configure global authentication requirements.</p>
                  </div>
                  <div className="p-6">
                    <Toggle label="Session Authentication" desc="Users must authenticate through a valid server-side session." checked={authSession} onChange={intercept(setAuthSession)} />
                    <Toggle label="Role-Based Access Control" desc="Administrative routes require administrator privileges." checked={rbacEnabled} onChange={intercept(setRbacEnabled)} />
                    <Toggle label="Require Re-authentication for Sensitive Actions" desc="Require additional verification before privileged administrative operations." checked={reqReauth} onChange={intercept(setReqReauth)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                      <h3 className="text-sm font-bold text-white">Password Policy</h3>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 mb-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Strong password policy
                      </div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Min Length</span> <span>8</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Require Uppercase</span> <span>ON</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Require Lowercase</span> <span>ON</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Require Number</span> <span>ON</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Require Special Char</span> <span>ON</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Expiration</span> <span>90 days</span></div>
                      <div className="flex justify-between text-xs text-slate-300"><span className="text-slate-400">Prevent Reuse</span> <span>5 passwords</span></div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                      <h3 className="text-sm font-bold text-white">Session Management</h3>
                    </div>
                    <div className="p-5">
                      <SelectInput label="Session Lifetime" value={sessionDur} onChange={intercept(setSessionDur)} options={["30 minutes", "1 hour", "4 hours", "8 hours", "24 hours"]} />
                      <TextInput label="Maximum Sessions per User" value={maxSessions} onChange={intercept(setMaxSessions)} type="number" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white">Multi-Factor Authentication</h2>
                    <p className="text-xs text-amber-500 mt-1">Changing MFA policy can affect existing accounts.</p>
                  </div>
                  <div className="p-6 space-y-2">
                    <SelectInput label="Platform Requirement" value={mfaPolicy} onChange={intercept(setMfaPolicy)} options={["Disabled", "Optional", "Required for Administrators", "Required for All Users"]} />
                    <div className="pt-2">
                      <Toggle label="Allow Authenticator App" checked={mfaApp} onChange={intercept(setMfaApp)} />
                      <Toggle label="Allow Backup Codes" checked={mfaBackup} onChange={intercept(setMfaBackup)} />
                      <Toggle label="Require MFA for New Administrators" checked={mfaNew} onChange={intercept(setMfaNew)} />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: DATA */}
              <section id="section-data" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><HardDrive className="w-4 h-4 text-indigo-400" /> Dataset Upload Policy</h2>
                    <p className="text-xs text-indigo-400/80 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg inline-block mt-3">Dataset access is isolated by authenticated user ownership.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <SelectInput label="Maximum Dataset Size" value={maxDatasetSize} onChange={intercept(setMaxDatasetSize)} options={["100 MB", "500 MB", "1 GB", "5 GB"]} />
                    <div className="pt-2 pb-2">
                      <p className="text-sm font-medium text-slate-200 mb-3">Supported File Types</p>
                      <Toggle label="CSV" checked={csvEnabled} onChange={intercept(setCsvEnabled)} />
                      <Toggle label="XLSX" checked={xlsxEnabled} onChange={intercept(setXlsxEnabled)} />
                      <Toggle label="JSON" checked={jsonEnabled} onChange={intercept(setJsonEnabled)} />
                      <Toggle label="ZIP" checked={zipEnabled} onChange={intercept(setZipEnabled)} desc="Maximum ZIP size: 1 GB" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white">Storage Configuration</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-2"><span className="text-slate-300 font-medium">Platform Storage</span><span className="text-slate-400">216.3 / 500 GB (43.2%)</span></div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="bg-indigo-500" style={{ width: '37.3%' }} title="Datasets: 186.4 GB" />
                        <div className="bg-cyan-500" style={{ width: '4.3%' }} title="Exports: 21.7 GB" />
                        <div className="bg-slate-500" style={{ width: '1.6%' }} title="Temp: 8.2 GB" />
                      </div>
                      <div className="flex gap-4 mt-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"/> Datasets (186.4 GB)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"/> Exports (21.7 GB)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500"/> Temp (8.2 GB)</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                       <Toggle label="Automatic Temporary File Cleanup" desc="Cleanup After 24 hours" checked={autoCleanup} onChange={intercept(setAutoCleanup)} />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: AI ENGINE */}
              <section id="section-ai" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10 px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> AI Analysis Engine</h2>
                    <p className="text-xs text-slate-400 mt-1">These visual controls map to backend configuration logic.</p>
                  </div>
                  <div className="relative z-10 p-6 space-y-6">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { l: "Model", v: "Qwen2.5-7B-Instruct", c: "text-cyan-400" },
                        { l: "Status", v: "Loaded", c: "text-emerald-400" },
                        { l: "GPU", v: "NVIDIA RTX 4050", c: "text-amber-400" },
                        { l: "VRAM", v: "5.18 GB / 6 GB", c: "text-white" },
                        { l: "Inference Mode", v: "Local", c: "text-slate-300" },
                        { l: "Analysis Engine", v: "DuckDB", c: "text-slate-300" },
                        { l: "Schema Engine", v: "Dynamic", c: "text-slate-300" },
                        { l: "Verification", v: "Deterministic", c: "text-slate-300" },
                      ].map(m => (
                        <div key={m.l} className="bg-black/30 border border-white/5 p-3 rounded-xl">
                          <p className="text-[10px] text-slate-500 mb-1">{m.l}</p>
                          <p className={`text-xs font-bold truncate ${m.c}`}>{m.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Architecture Flow</p>
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] font-mono text-slate-400">
                        <span className="px-2.5 py-1 bg-white/5 rounded">Question</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 rotate-90 md:rotate-0" />
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded">Qwen Parser</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 rotate-90 md:rotate-0" />
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded">Structured Intent</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 rotate-90 md:rotate-0" />
                        <span className="px-2.5 py-1 bg-white/5 rounded">DuckDB</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 rotate-90 md:rotate-0" />
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded">Verified Result</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 rotate-90 md:rotate-0" />
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded">Answer Gen</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white">AI Query Limits</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-4">
                      <span className="text-[10px] bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded font-semibold text-slate-300 uppercase tracking-widest">Current Policy</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { l: "Maximum Rows Analyzed", v: "10,000,000" },
                        { l: "Maximum Query Execution Time", v: "120 seconds" },
                        { l: "Maximum Result Rows", v: "1,000" },
                        { l: "Maximum Group Dimensions", v: "3" },
                        { l: "Maximum Concurrent AI Analyses", v: "4" },
                      ].map(item => (
                        <div key={item.l} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 last:pb-0">
                          <span className="text-xs text-slate-400">{item.l}</span>
                          <span className="text-xs font-bold text-slate-200">{item.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: NOTIFICATIONS */}
              <section id="section-notifications" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><BellRing className="w-4 h-4 text-blue-400" /> System Notifications</h2>
                  </div>
                  <div className="p-6">
                    <Toggle label="System Health Alerts" checked={notifHealth} onChange={intercept(setNotifHealth)} />
                    <Toggle label="Security Alerts" checked={notifSecurity} onChange={intercept(setNotifSecurity)} />
                    <Toggle label="Failed Analysis Alerts" checked={notifFail} onChange={intercept(setNotifFail)} />
                    <Toggle label="Dataset Processing Failures" checked={notifProcess} onChange={intercept(setNotifProcess)} />
                    <div className="mt-4 p-4 bg-black/20 border border-white/5 rounded-xl flex items-center gap-6">
                      <p className="text-xs font-medium text-slate-400">Notification Channel:</p>
                      <label className="text-xs text-slate-200 flex items-center gap-2 cursor-not-allowed"><input type="checkbox" checked disabled className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/50" /> Dashboard</label>
                      <label className="text-xs text-slate-500 flex items-center gap-2 cursor-not-allowed"><input type="checkbox" disabled className="rounded border-white/20 bg-black text-cyan-500 focus:ring-cyan-500/50" /> Email (OFF)</label>
                      <label className="text-xs text-slate-500 flex items-center gap-2 cursor-not-allowed"><input type="checkbox" disabled className="rounded border-white/20 bg-black text-cyan-500 focus:ring-cyan-500/50" /> SMS (OFF)</label>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: AUDIT */}
              <section id="section-audit" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><FileSearch className="w-4 h-4 text-emerald-400" /> Audit & Activity Logging</h2>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Audit Logging Enabled</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <Toggle label="Log Authentication Events" checked={auditAuth} onChange={intercept(setAuditAuth)} />
                    <Toggle label="Log Dataset Operations" checked={auditDataset} onChange={intercept(setAuditDataset)} />
                    <Toggle label="Log Analysis Operations" checked={auditAnalysis} onChange={intercept(setAuditAnalysis)} />
                    <Toggle label="Log Administrative Actions" checked={auditAdmin} onChange={intercept(setAuditAdmin)} />
                    
                    <div className="pt-4 border-t border-white/[0.06]">
                      <SelectInput label="Retention Period" value={retention} onChange={intercept(setRetention)} options={["30 days", "60 days", "90 days", "180 days", "365 days"]} />
                    </div>
                    <div className="flex gap-6 p-4 bg-black/20 border border-white/5 rounded-xl">
                      <div><p className="text-[10px] text-slate-500">Events Logged</p><p className="text-sm font-bold text-white">2,486,321</p></div>
                      <div><p className="text-[10px] text-slate-500">Oldest Retained Event</p><p className="text-sm font-bold text-white">03 Jun 2026</p></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: ADVANCED & DANGER */}
              <section id="section-advanced" className="space-y-6 pt-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><Wrench className="w-4 h-4 text-slate-400" /> Feature Flags</h2>
                  </div>
                  <div className="p-6">
                    <Toggle label="Multi-Dimensional Analysis" checked={ffMultiDim} onChange={intercept(setFfMultiDim)} />
                    <Toggle label="Advanced Date Filters" checked={ffAdvDate} onChange={intercept(setFfAdvDate)} />
                    <Toggle label="Export Results" checked={ffExport} onChange={intercept(setFfExport)} />
                    <Toggle label="ZIP Dataset Support" checked={ffZip} onChange={intercept(setFfZip)} />
                    <Toggle label="AI Chart Generation" checked={ffChart} onChange={intercept(setFfChart)} />
                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                      <Toggle label="Experimental Features" desc="Enable beta features. May be unstable." checked={ffExp} onChange={intercept(setFfExp)} />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-amber-500/20 bg-amber-500/5">
                    <h2 className="text-base font-bold text-amber-500">Maintenance Mode</h2>
                    <p className="text-xs text-amber-500/70 mt-1 flex items-center gap-1">{maintenance ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3 text-emerald-500" />} {maintenance ? "System Maintenance Active" : "System Online"}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-300 mb-4">Maintenance mode will prevent normal users from accessing analysis functionality.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-500">Toggle Maintenance</span>
                      <button type="button" onClick={() => handleMaintenanceToggle(!maintenance)} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${maintenance ? "bg-amber-500" : "bg-slate-700"}`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${maintenance ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/10 border border-red-500/20 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/5">
                    <h2 className="text-base font-bold text-red-500">Danger Zone</h2>
                  </div>
                  <div className="p-6 divide-y divide-red-500/10">
                    <div className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h4 className="text-sm font-bold text-white mb-0.5">Clear Temporary Storage</h4><p className="text-xs text-slate-400">Remove temporary files created during dataset processing.</p></div>
                      <button onClick={() => setClearModal(true)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Clear Temporary Storage</button>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h4 className="text-sm font-bold text-white mb-0.5">Revoke All User Sessions</h4><p className="text-xs text-slate-400">Immediately terminate all active user sessions.</p></div>
                      <button onClick={() => setRevokeModal(true)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all whitespace-nowrap">Revoke All Sessions</button>
                    </div>
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h4 className="text-sm font-bold text-white mb-0.5">Disable New Registrations</h4><p className="text-xs text-slate-400">Prevent new users from creating accounts.</p></div>
                      <button onClick={() => intercept(setDisableReg)(!disableReg)} className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${disableReg ? "bg-red-500" : "bg-slate-700"}`}><span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${disableReg ? "translate-x-4" : "translate-x-0"}`} /></button>
                    </div>
                    <div className="py-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h4 className="text-sm font-bold text-white mb-0.5">Platform Reset</h4><p className="text-xs text-slate-400">Reset platform configuration to default values.</p></div>
                      <button onClick={() => { setResetConfirm(""); setResetModal(true); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)] whitespace-nowrap">Reset Configuration</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Admin Banner */}
              <div className="pt-6 pb-2">
                <div className="bg-black/30 border border-white/[0.05] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Administrative Configuration</h4>
                    <p className="text-xs text-slate-400">Changes made here affect platform-wide behavior and may impact all users.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold rounded uppercase tracking-wider">RBAC Protected</span>
                    <span className="px-2 py-1 bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold rounded uppercase tracking-wider">Audit Logged</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Unsaved Changes Sticky Bar ── */}
      {unsaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-amber-950/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8 fade-in">
          <div>
            <p className="text-sm font-bold text-amber-400">Unsaved changes</p>
            <p className="text-xs text-amber-200/70 hidden sm:block">You have unapplied configuration changes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDiscard} className="px-4 py-2 text-xs font-semibold text-amber-200/70 hover:text-amber-400 transition-colors flex items-center gap-1.5"><Undo2 className="w-3.5 h-3.5" /> Discard</button>
            <button onClick={() => setSaveModal(true)} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(245,158,11,0.4)] flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Changes</button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* Modals */}
      {/* ──────────────────────────────────────────────────────────────────────── */}

      {/* Save Modal */}
      <Modal open={saveModal} onClose={() => setSaveModal(false)} title="Apply Configuration">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Configuration changes are ready to be applied. Some services may briefly restart.</p>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setSaveModal(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={handleSaveAll} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-cyan-950 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)]">Apply Changes</button>
          </div>
        </div>
      </Modal>

      {/* Revoke All Modal */}
      <Modal open={revokeModal} onClose={() => setRevokeModal(false)} title="Revoke All User Sessions" alert>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-center text-slate-300">This will sign out all currently active users across the platform.</p>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setRevokeModal(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={() => setRevokeModal(false)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]">Revoke Sessions</button>
          </div>
        </div>
      </Modal>

      {/* Clear Temp Storage Modal */}
      <Modal open={clearModal} onClose={() => setClearModal(false)} title="Clear Temporary Storage" alert>
        <div className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <FolderArchive className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-400">Remove Temporary Files</h4>
              <p className="text-xs text-red-300/80 mt-1">Approximately <b>8.2 GB</b> will be removed. In-progress analyses may fail.</p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setClearModal(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={() => setClearModal(false)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all">Clear Storage</button>
          </div>
        </div>
      </Modal>

      {/* Platform Reset Modal */}
      <Modal open={resetModal} onClose={() => setResetModal(false)} title="Platform Reset" alert>
        <div className="space-y-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <TerminalSquare className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-400">Irreversible Action</h4>
              <p className="text-xs text-red-300/80 mt-1">This will reset platform configuration to default values. User data and datasets are not affected.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">To confirm, type <span className="font-bold text-white select-none">RESET</span> below:</label>
            <input type="text" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="RESET" className="w-full bg-[#070B14] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500/50" />
          </div>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setResetModal(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button disabled={resetConfirm !== "RESET"} onClick={() => setResetModal(false)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/20 disabled:text-red-500/50 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)] disabled:shadow-none flex justify-center items-center gap-2"><Ban className="w-4 h-4" /> Reset Config</button>
          </div>
        </div>
      </Modal>

      {/* Maintenance Mode Modal */}
      <Modal open={maintModal} onClose={() => { setMaintModal(false); }} title="Enable Maintenance Mode" alert>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
            <Wrench className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-sm text-center text-slate-300">This will lock out normal users and pause all non-critical background processing.</p>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setMaintModal(false)} className="flex-1 py-2.5 border border-white/10 hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={() => { intercept(setMaintenance)(maintPendingVal); setMaintModal(false); }} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(245,158,11,0.4)]">Enable Mode</button>
          </div>
        </div>
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
