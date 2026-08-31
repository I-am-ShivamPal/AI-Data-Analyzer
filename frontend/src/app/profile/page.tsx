"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  History,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  CheckCircle2,
  Lock,
  Laptop,
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  Edit2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Sidebar & TopBar
// ────────────────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { key: "dashboard",  label: "Dashboard",        icon: LayoutDashboard, href: "/dashboard" },
  { key: "datasets",   label: "My Datasets",      icon: Database,        href: "/datasets"  },
  { key: "analyze",    label: "Analyze",          icon: Sparkles,        href: "/analyze"   },
  { key: "history",    label: "Analysis History", icon: History,         href: "/history"   },
];

const NAV_ACCOUNT = [
  { key: "profile",  label: "Profile",  icon: User,     href: "/profile"  },
  { key: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

function Sidebar({ active, mobileOpen, setMobileOpen }: { active: string; mobileOpen: boolean; setMobileOpen: (v: boolean) => void; }) {
  function NavItem({ nav }: { nav: typeof NAV_MAIN[0] }) {
    const isActive = active === nav.key;
    return (
      <Link href={nav.href} onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive ? "bg-blue-600/20 text-blue-400 border border-blue-500/25" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
      >
        <nav.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
        {nav.label}
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
        <button className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Main</p>
        {NAV_MAIN.map((n) => <NavItem key={n.key} nav={n} />)}
        <div className="pt-4">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Account</p>
          {NAV_ACCOUNT.map((n) => <NavItem key={n.key} nav={n} />)}
        </div>
      </nav>
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Shivam Pal</p>
            <p className="text-[10px] text-slate-500">Normal User</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group">
          <LogOut className="w-4 h-4 group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#070B14] border-r border-white/[0.06] h-full">{inner}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col bg-[#070B14] border-r border-white/[0.06] h-full z-10">{inner}</aside>
        </div>
      )}
    </>
  );
}

function TopBar({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
  const [userOpen, setUserOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white capitalize leading-none">My Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Manage your account information and security.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Session Active
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]">
          <Bell className="w-4 h-4" />
        </button>
        <div className="relative">
          <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05]">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">Shivam Pal</p>
              <p className="text-[10px] text-slate-500">Normal User</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut className="w-4 h-4" />Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Modals
// ────────────────────────────────────────────────────────────────────────────

function PhoneVerificationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2">Verify Phone Number</h3>
        <p className="text-sm text-slate-400 mb-6">A verification code would be sent to +91 XXXXX XXXXX in a real application.</p>
        
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <input key={i} type="text" maxLength={1} disabled className="w-10 h-12 bg-white/[0.03] border border-white/10 rounded-lg text-center text-lg font-bold text-slate-400 opacity-50 cursor-not-allowed" />
          ))}
        </div>
        
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Verify Mock
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Change Password</h3>
        <p className="text-sm text-slate-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Current Password</label>
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-3 py-2 pr-10 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
              <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 space-y-1">
              <p className={newPass.length >= 8 ? "text-emerald-400" : ""}>• At least 8 characters</p>
              <p className={/[A-Z]/.test(newPass) ? "text-emerald-400" : ""}>• One uppercase letter</p>
              <p className={/[0-9]/.test(newPass) ? "text-emerald-400" : ""}>• One number</p>
              <p className={/[^A-Za-z0-9]/.test(newPass) ? "text-emerald-400" : ""}>• One special character</p>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <input type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveSessionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Active Sessions</h3>
        <p className="text-sm text-slate-400 mb-6">Review the devices currently signed into your account.</p>
        
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Windows Laptop</h4>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full">Current Session</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 mt-3 text-xs">
                <div>
                  <p className="text-slate-500">Browser</p>
                  <p className="text-slate-300">Chrome</p>
                </div>
                <div>
                  <p className="text-slate-500">Location</p>
                  <p className="text-slate-300">Current session</p>
                </div>
                <div>
                  <p className="text-slate-500">Last active</p>
                  <p className="text-slate-300">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="text-sm text-slate-400 hover:text-white transition-colors">Sign Out Other Sessions</button>
          <button onClick={onClose} className="px-5 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete your account?</h3>
        </div>
        <p className="text-sm text-slate-300 mb-6">
          This action cannot be undone. Your account and associated data will be permanently removed.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_0_15px_-5px_rgba(220,38,38,0.5)]">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Profile Sections
// ────────────────────────────────────────────────────────────────────────────

function ProfileHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1120] to-[#070B14] border border-white/10 rounded-3xl p-6 sm:p-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl font-bold text-white border-4 border-[#070B14] shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            SP
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#070B14] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Shivam Pal</h2>
          <p className="text-slate-400 text-sm mt-1">Normal User <span className="mx-2 text-white/20">•</span> Member since March 2026</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
            <span className="text-[10px] text-slate-400">Your profile information is private to your account.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfo({ onVerifyPhone }: { onVerifyPhone: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for mock editing
  const [name, setName] = useState("Shivam Pal");
  const [email, setEmail] = useState("shivam@example.com");
  const [phone, setPhone] = useState("+91 XXXXX XXXXX");

  function handleSave() {
    setIsEditing(false);
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Personal Information</h3>
          <p className="text-sm text-slate-400 mt-1">Update the information associated with your account.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-sm font-medium text-slate-200 transition-colors">
            <Edit2 className="w-4 h-4 text-slate-400" /> Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            {isEditing ? (
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
            ) : (
              <p className="text-sm font-medium text-slate-200 px-3 py-2 bg-white/[0.01] border border-transparent">{name}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              {isEditing ? (
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
              ) : (
                <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.01]">
                  <p className="text-sm font-medium text-slate-200">{email}</p>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
            <div className="relative">
              {isEditing ? (
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none transition-colors" />
              ) : (
                <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.01]">
                  <p className="text-sm font-medium text-slate-200">{phone}</p>
                  <span className="text-[10px] text-slate-500">Not verified</span>
                  <button onClick={onVerifyPhone} className="ml-auto text-xs text-blue-400 hover:text-blue-300 font-medium">Verify</button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Account Role</label>
            <div className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg opacity-70">
              <p className="text-sm font-medium text-slate-300">Normal User</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 px-1">Role is managed by the system.</p>
          </div>
        </div>

        {isEditing && (
          <div className="pt-6 border-t border-white/[0.05] flex items-center justify-end gap-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Modal states
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.05]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]" />
        </div>
      </div>

      <Sidebar active="profile" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-y-auto">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl w-full mx-auto space-y-6">
          
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Main) */}
            <div className="lg:col-span-2 space-y-6">
              
              <PersonalInfo onVerifyPhone={() => setPhoneOpen(true)} />

              {/* Security Card */}
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white">Security</h3>
                  <p className="text-sm text-slate-400 mt-1">Manage the security of your account.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Password</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Last changed recently</p>
                    </div>
                    <button onClick={() => setPasswordOpen(true)} className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-xl text-sm font-medium text-slate-300 transition-colors w-fit">
                      Change Password
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Active Sessions</h4>
                      <p className="text-xs text-slate-500 mt-0.5">1 active session</p>
                    </div>
                    <button onClick={() => setSessionsOpen(true)} className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-xl text-sm font-medium text-slate-300 transition-colors w-fit">
                      View Sessions
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Not enabled</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 text-blue-400 rounded-xl text-sm font-medium transition-colors w-fit">
                      Set Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">Danger Zone</h3>
                    <p className="text-sm text-slate-400 mt-1">Actions here can affect your account permanently.</p>
                  </div>
                  <button onClick={() => setDeleteOpen(true)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-colors w-fit">
                    Delete Account
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column (Side) */}
            <div className="space-y-6">
              
              {/* Account Stats */}
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Account Statistics</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-slate-400"><Database className="w-3.5 h-3.5" /> Datasets</span>
                    <span className="text-sm font-semibold text-slate-200">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-slate-400"><Sparkles className="w-3.5 h-3.5" /> Analyses</span>
                    <span className="text-sm font-semibold text-slate-200">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-slate-400"><FileSpreadsheet className="w-3.5 h-3.5" /> Rows Analyzed</span>
                    <span className="text-sm font-semibold text-slate-200">48,320</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-slate-400"><Database className="w-3.5 h-3.5" /> Storage Used</span>
                    <span className="text-sm font-semibold text-slate-200">428 MB</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Recent Account Activity</h3>
                <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-white/10">
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#070B14] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                      <Lock className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-slate-200">Password changed</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Today · 4:10 PM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#070B14] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-slate-200">Signed in</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Today · 2:15 PM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#070B14] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                      <Database className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-slate-200">Dataset uploaded</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Today · 1:42 PM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#070B14] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                      <Activity className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-slate-200">Analysis completed</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Yesterday · 6:32 PM</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Security Info */}
          <div className="mt-8 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Your account is protected</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your account uses session-based authentication and private user-level data isolation.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Session Protected", "Private Account", "Verified Analytics"].map((badge) => (
                <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full whitespace-nowrap">
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </main>
      </div>

      <PhoneVerificationModal isOpen={phoneOpen} onClose={() => setPhoneOpen(false)} />
      <ChangePasswordModal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <ActiveSessionsModal isOpen={sessionsOpen} onClose={() => setSessionsOpen(false)} />
      <DeleteAccountModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />

    </div>
  );
}
