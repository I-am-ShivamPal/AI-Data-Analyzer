"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  History,
  User,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  ChevronDown,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Mail,
  Key,
  HardDrive,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "datasets", label: "My Datasets", icon: Database, href: "/datasets" },
  { key: "analyze", label: "Analyze", icon: Sparkles, href: "/analyze" },
  { key: "history", label: "Analysis History", icon: History, href: "/history" },
];

const NAV_ACCOUNT = [
  { key: "profile", label: "Profile", icon: User, href: "/profile" },
  { key: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
];

function Sidebar({ active, mobileOpen, setMobileOpen }: {
  active: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  function NavItem({ nav }: { nav: typeof NAV_MAIN[0] }) {
    const isActive = active === nav.key;
    return (
      <Link
        href={nav.href}
        onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "bg-blue-600/20 text-blue-400 border border-blue-500/25"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <nav.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
        {nav.label}
        {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-400/60" />}
      </Link>
    );
  }

  const inner = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30 flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div className="leading-tight">
          <div className="text-xs font-bold text-white tracking-wider">AI DATA</div>
          <div className="text-xs font-bold text-blue-400 tracking-wider">ANALYZER</div>
        </div>
        <button
          className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Main</p>
        {NAV_MAIN.map((n) => <NavItem key={n.key} nav={n} />)}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Account</p>
          {NAV_ACCOUNT.map((n) => <NavItem key={n.key} nav={n} />)}
        </div>
      </nav>

      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Shivam Pal</p>
            <p className="text-[10px] text-slate-500">Normal User</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group">
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#070B14] border-r border-white/[0.06] h-full">
        {inner}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col bg-[#070B14] border-r border-white/[0.06] h-full z-10">
            {inner}
          </aside>
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Top Bar
// ────────────────────────────────────────────────────────────────────────────

function TopBar({ pageTitle, setMobileOpen }: { pageTitle: string; setMobileOpen: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <button
        className="lg:hidden text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white capitalize leading-none">{pageTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Manage your preferences, privacy and account security.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Session Active
        </div>

        <div className="relative">
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
          </button>
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">Shivam Pal</p>
              <p className="text-[10px] text-slate-500">Normal User</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Reusable UI Components
// ────────────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode, maxWidth?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Settings Page
// ────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("General");
  
  // Section state
  const [generalSaved, setGeneralSaved] = useState(false);
  const [exportState, setExportState] = useState("Request Export");
  
  // Notification Toggles
  const [notifs, setNotifs] = useState({
    analysis: true,
    datasetComplete: true,
    datasetFailed: true,
    security: true,
    updates: false,
    marketing: false
  });
  
  // Modals
  const [passwordModal, setPasswordModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [phoneModal, setPhoneModal] = useState(false);

  // Forms
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [pwdForm, setPwdForm] = useState({ current: "", new: "", confirm: "" });

  const sections = ["General", "Appearance", "Notifications", "Privacy & Security", "Data & Storage"];

  const handleGeneralSave = () => {
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 3000);
  };

  const handleExport = () => {
    setExportState("Export request submitted");
    setTimeout(() => setExportState("Request Export"), 5000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "General":
        return (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white">General</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your basic application preferences.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                  <select className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <select className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date Format</label>
                  <select className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Dataset</label>
                  <select className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>sales.csv</option>
                    <option>customer_analysis.csv</option>
                    <option>None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Analysis View</label>
                  <select className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none">
                    <option>Table</option>
                    <option>Chart</option>
                    <option>Summary</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={handleGeneralSave}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                >
                  Save Changes
                </button>
                {generalSaved && (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium animate-in fade-in zoom-in duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Settings saved
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      
      case "Appearance":
        return (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
              <p className="text-sm text-slate-500 mt-1">Customize how AI DATA ANALYZER looks.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="flex flex-col items-center p-4 rounded-xl border-2 border-blue-500 bg-blue-500/5 transition-all text-left">
                  <div className="w-full h-24 rounded-lg bg-[#070B14] border border-white/10 mb-3 flex flex-col p-2 gap-1.5 overflow-hidden">
                    <div className="w-full h-3 bg-white/10 rounded-sm" />
                    <div className="w-3/4 h-3 bg-white/5 rounded-sm" />
                    <div className="w-full h-10 mt-auto bg-blue-600/20 rounded-md border border-blue-500/30" />
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium text-sm">
                    <Moon className="w-4 h-4 text-blue-400" />
                    Dark
                  </div>
                </button>
                
                <button disabled className="flex flex-col items-center p-4 rounded-xl border-2 border-transparent bg-white/[0.02] opacity-50 cursor-not-allowed">
                  <div className="w-full h-24 rounded-lg bg-slate-100 border border-slate-300 mb-3 flex flex-col p-2 gap-1.5 overflow-hidden">
                    <div className="w-full h-3 bg-slate-300 rounded-sm" />
                    <div className="w-3/4 h-3 bg-slate-200 rounded-sm" />
                    <div className="w-full h-10 mt-auto bg-blue-100 rounded-md border border-blue-200" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                </button>

                <button disabled className="flex flex-col items-center p-4 rounded-xl border-2 border-transparent bg-white/[0.02] opacity-50 cursor-not-allowed">
                  <div className="w-full h-24 rounded-lg bg-gradient-to-br from-slate-800 to-slate-200 border border-white/10 mb-3 flex flex-col p-2 gap-1.5 overflow-hidden">
                    <div className="w-full h-3 bg-white/20 rounded-sm" />
                    <div className="w-3/4 h-3 bg-white/10 rounded-sm" />
                    <div className="w-full h-10 mt-auto bg-white/20 rounded-md border border-white/30" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Monitor className="w-4 h-4" />
                    System
                  </div>
                </button>
              </div>
              <div className="mt-6 flex items-start gap-2.5 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300/90 text-sm">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <p>Dark mode is currently the only supported appearance. Light mode and system synchronization are coming in a future update.</p>
              </div>
            </div>
          </div>
        );
      
      case "Notifications":
        return (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <p className="text-sm text-slate-500 mt-1">Choose which account notifications you receive.</p>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {[
                { key: "analysis", title: "Analysis completed", desc: "Get notified when a large query finishes processing." },
                { key: "datasetComplete", title: "Dataset processing completed", desc: "Get notified when your uploaded dataset is ready to use." },
                { key: "datasetFailed", title: "Dataset processing failed", desc: "Get notified if there was an issue processing your data." },
                { key: "security", title: "Security alerts", desc: "Important security notifications about your account." },
                { key: "updates", title: "Product updates", desc: "News about new features and improvements." },
                { key: "marketing", title: "Marketing emails", desc: "Occasional promotional emails and offers." },
              ].map((item) => (
                <div key={item.key} className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <Toggle checked={notifs[item.key as keyof typeof notifs]} onChange={(v) => setNotifs(prev => ({...prev, [item.key]: v}))} />
                </div>
              ))}
            </div>
          </div>
        );

      case "Privacy & Security":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white px-1">Privacy & Security</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600/15 rounded-lg border border-blue-500/25">
                    <Key className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Password</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4 flex-1">Keep your account password secure.</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Password protected</span>
                  <button onClick={() => setPasswordModal(true)} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">Change Password</button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600/15 rounded-lg border border-purple-500/25">
                    <Monitor className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Active Sessions</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4 flex-1">Review devices currently signed into your account.</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-slate-300">1 active session</span>
                  <button onClick={() => setSessionsModal(true)} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">View Sessions</button>
                </div>
              </div>

              {/* 2FA */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-600/15 rounded-lg border border-amber-500/25">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4 flex-1">Add an additional layer of account security.</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-slate-500">Not enabled</span>
                  <button onClick={() => setTwoFaModal(true)} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">Enable 2FA</button>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden mt-6">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h3 className="text-base font-semibold text-white">Verification Methods</h3>
              </div>
              <div className="divide-y divide-white/[0.06]">
                <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/[0.05] rounded-lg border border-white/10">
                      <Mail className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Email Verification</p>
                      <p className="text-xs text-slate-500 mt-0.5">shivam@example.com</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>

                <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/[0.05] rounded-lg border border-white/10">
                      <Smartphone className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Phone Verification</p>
                      <p className="text-xs text-slate-500 mt-0.5">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">Not verified</span>
                    <button onClick={() => setPhoneModal(true)} className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all">Verify</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Data & Storage":
        return (
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white">Data & Storage</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your datasets and generated results.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-200">Storage Used</span>
                  </div>
                  <span className="text-sm font-medium text-white">428 MB / 1 GB</span>
                </div>
                <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '42.8%' }} />
                </div>
                
                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white">Dataset retention</h4>
                    <p className="text-xs text-slate-500 mt-1">Your datasets remain private to your account.</p>
                  </div>
                  <Link href="/datasets" className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
                    Manage Datasets
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-slate-300" /> Export Data
                </h3>
                <p className="text-sm text-slate-500 mt-1">Download a copy of your account data.</p>
              </div>
              <button 
                onClick={handleExport}
                disabled={exportState !== "Request Export"}
                className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportState}
              </button>
            </div>

            <div className="bg-red-500/[0.02] border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-red-400 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Delete Account
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-xl">
                Permanently delete your account and associated datasets. This action is irreversible and all your data will be wiped.
              </p>
              <button 
                onClick={() => setDeleteModal(true)}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-800/10 blur-[100px]" />
      </div>

      <Sidebar active="settings" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <TopBar pageTitle="Settings" setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Settings Nav */}
              <div className="lg:w-64 flex-shrink-0">
                {/* Desktop Nav */}
                <div className="hidden lg:flex flex-col gap-1 sticky top-6">
                  {sections.map(sec => (
                    <button
                      key={sec}
                      onClick={() => setActiveSection(sec)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeSection === sec
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
                
                {/* Mobile/Tablet Nav */}
                <div className="lg:hidden flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
                  {sections.map(sec => (
                    <button
                      key={sec}
                      onClick={() => setActiveSection(sec)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeSection === sec
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                          : "bg-white/[0.03] text-slate-400 border border-transparent hover:bg-white/[0.06] hover:text-slate-200"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {renderContent()}

                {/* Trust Card */}
                <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white mb-1">Your account is protected</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      AI DATA ANALYZER uses authenticated sessions and user-level data isolation to protect your workspace.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Session Protected", "Private Datasets", "Role-Based Access"].map((badge) => (
                        <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}

      {/* Change Password Modal */}
      <Modal open={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Current Password</label>
            <input type="password" value={pwdForm.current} onChange={e => setPwdForm({...pwdForm, current: e.target.value})} className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">New Password</label>
            <input type="password" value={pwdForm.new} onChange={e => setPwdForm({...pwdForm, new: e.target.value})} className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Confirm New Password</label>
            <input type="password" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Confirm new password" />
          </div>
          
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] mt-2 space-y-2">
            <p className="text-xs font-medium text-slate-300 mb-2">Password requirements:</p>
            {[
              { req: "At least 8 characters", met: pwdForm.new.length >= 8 },
              { req: "Uppercase letter", met: /[A-Z]/.test(pwdForm.new) },
              { req: "Number", met: /[0-9]/.test(pwdForm.new) },
              { req: "Special character", met: /[^A-Za-z0-9]/.test(pwdForm.new) }
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {rule.met ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                <span className={rule.met ? "text-slate-300" : "text-slate-500"}>{rule.req}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
            <button onClick={() => setPasswordModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={() => { setPasswordModal(false); setPwdForm({current:"",new:"",confirm:""}) }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_-4px_rgba(37,99,235,0.5)]">Update Password</button>
          </div>
        </div>
      </Modal>

      {/* Active Sessions Modal */}
      <Modal open={sessionsModal} onClose={() => setSessionsModal(false)} title="Active Sessions" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-blue-500/30 bg-blue-600/10">
            <div className="p-2.5 bg-blue-500/20 rounded-lg text-blue-400 mt-0.5">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Windows Laptop</h4>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-medium rounded-full uppercase tracking-wider">Current Session</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Chrome</p>
              <p className="text-xs text-slate-500 mt-1">Last active: Just now</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="p-2.5 bg-white/[0.05] rounded-lg text-slate-400 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Android Device</h4>
              <p className="text-xs text-slate-400 mt-1">Chrome Mobile</p>
              <p className="text-xs text-slate-500 mt-1">Last active: 2 days ago</p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/[0.06]">
            <button onClick={() => setSessionsModal(false)} className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
              Sign Out Other Sessions
            </button>
          </div>
        </div>
      </Modal>

      {/* 2FA Modal */}
      <Modal open={twoFaModal} onClose={() => setTwoFaModal(false)} title="Enable Two-Factor Authentication">
        <div className="flex flex-col items-center text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-300 mb-6 px-4">Protect your account with an additional verification step. Scan this code using your authenticator app.</p>
          
          <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6 mx-auto flex items-center justify-center border-4 border-white/20">
            {/* Mock QR Code Pattern */}
            <div className="w-full h-full relative" style={{background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '16px 16px', backgroundPosition: '0 0, 8px 8px'}}>
              <div className="absolute inset-x-0 inset-y-0 m-auto w-12 h-12 bg-white rounded flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-800" />
              </div>
            </div>
          </div>

          <div className="w-full mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-2 text-left">Verification Code</label>
            <div className="flex justify-between gap-2">
              {[...Array(6)].map((_, i) => (
                <input key={i} type="text" maxLength={1} className="w-12 h-14 bg-[#070B14] border border-white/10 rounded-xl text-center text-xl text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="_" />
              ))}
            </div>
          </div>

          <div className="w-full flex items-center gap-3">
            <button onClick={() => setTwoFaModal(false)} className="flex-1 py-2.5 text-sm text-slate-400 border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors">Cancel</button>
            <button onClick={() => setTwoFaModal(false)} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_-4px_rgba(37,99,235,0.5)]">Enable 2FA</button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete your account?">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">This action cannot be undone. Your account, datasets and analysis history will be permanently removed.</p>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm text-slate-300 mb-1.5">To confirm, type <span className="font-mono font-bold text-white bg-white/10 px-1 rounded">DELETE</span></label>
            <input 
              type="text" 
              value={deleteConfirm} 
              onChange={e => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500/50 outline-none font-mono" 
              placeholder="DELETE" 
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-4">
            <button onClick={() => { setDeleteModal(false); setDeleteConfirm("") }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button 
              disabled={deleteConfirm !== "DELETE"} 
              onClick={() => { setDeleteModal(false); setDeleteConfirm("") }}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Phone Verification Modal (Minimal mock) */}
      <Modal open={phoneModal} onClose={() => setPhoneModal(false)} title="Verify Phone Number">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">We will send a code to your registered phone number.</p>
          <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.06]">
            <button onClick={() => setPhoneModal(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
            <button onClick={() => setPhoneModal(false)} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl">Send Code</button>
          </div>
        </div>
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
