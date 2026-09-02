"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Filter,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  Apple,
  Compass,
  LayoutTemplate,
  Globe
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

type SessionStatus = "Active" | "Idle" | "Expired" | "Revoked";
type DeviceType = "Windows Laptop" | "MacBook" | "iPhone" | "iPad" | "Android Phone" | "Other";
type BrowserType = "Chrome" | "Safari" | "Edge" | "Firefox" | "Other";
type OSType = "Windows 11" | "macOS" | "iOS" | "Android" | "Linux" | "Other";

interface SessionRecord {
  id: string;
  user: string;
  deviceType: DeviceType;
  os: OSType;
  browser: BrowserType;
  startedAt: string;
  lastActive: string;
  duration: string;
  status: SessionStatus;
  isCurrent: boolean;
}

const MOCK_SESSIONS: SessionRecord[] = [
  { id: "sess_x8f9a2", user: "shivam•••@gmail.com", deviceType: "Windows Laptop", os: "Windows 11", browser: "Chrome", startedAt: "09:12 AM", lastActive: "09:42 AM", duration: "30 min", status: "Active", isCurrent: true },
  { id: "sess_a1b2c3", user: "anal•••@gmail.com", deviceType: "MacBook", os: "macOS", browser: "Safari", startedAt: "08:45 AM", lastActive: "09:38 AM", duration: "53 min", status: "Active", isCurrent: false },
  { id: "sess_d4e5f6", user: "user•••@gmail.com", deviceType: "Android Phone", os: "Android", browser: "Chrome", startedAt: "07:21 AM", lastActive: "08:11 AM", duration: "50 min", status: "Idle", isCurrent: false },
  { id: "sess_g7h8i9", user: "demo•••@gmail.com", deviceType: "iPhone", os: "iOS", browser: "Safari", startedAt: "Yesterday", lastActive: "Yesterday", duration: "1h 12m", status: "Expired", isCurrent: false },
  { id: "sess_j0k1l2", user: "admin•••@company.com", deviceType: "MacBook", os: "macOS", browser: "Firefox", startedAt: "06:15 AM", lastActive: "06:45 AM", duration: "30 min", status: "Revoked", isCurrent: false },
  { id: "sess_m3n4o5", user: "test•••@example.com", deviceType: "Windows Laptop", os: "Windows 11", browser: "Edge", startedAt: "10:00 AM", lastActive: "10:15 AM", duration: "15 min", status: "Active", isCurrent: false },
  { id: "sess_p6q7r8", user: "dev•••@startup.io", deviceType: "iPad", os: "iOS", browser: "Safari", startedAt: "05:30 AM", lastActive: "05:45 AM", duration: "15 min", status: "Idle", isCurrent: false },
  { id: "sess_s9t0u1", user: "ceo•••@corp.com", deviceType: "MacBook", os: "macOS", browser: "Chrome", startedAt: "Yesterday", lastActive: "Yesterday", duration: "4h 20m", status: "Expired", isCurrent: false },
  { id: "sess_v2w3x4", user: "guest•••@mail.com", deviceType: "Android Phone", os: "Android", browser: "Firefox", startedAt: "09:00 AM", lastActive: "09:10 AM", duration: "10 min", status: "Revoked", isCurrent: false },
  { id: "sess_y5z6a7", user: "hr•••@company.com", deviceType: "Windows Laptop", os: "Windows 11", browser: "Chrome", startedAt: "08:00 AM", lastActive: "09:30 AM", duration: "1h 30m", status: "Active", isCurrent: false },
  { id: "sess_b8c9d0", user: "sales•••@corp.com", deviceType: "iPhone", os: "iOS", browser: "Safari", startedAt: "07:00 AM", lastActive: "07:05 AM", duration: "5 min", status: "Idle", isCurrent: false },
  { id: "sess_e1f2g3", user: "support•••@app.com", deviceType: "Other", os: "Linux", browser: "Other", startedAt: "Last week", lastActive: "Last week", duration: "8h 15m", status: "Expired", isCurrent: false }
];

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

function AdminSidebar({ active, mobileOpen, setMobileOpen }: {
  active: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  function NavItem({ nav }: { nav: typeof NAV_OVERVIEW[0] }) {
    const isActive = active === nav.key;
    return (
      <Link
        href={nav.href}
        onClick={() => setMobileOpen(false)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <nav.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
        {nav.label}
        {isActive && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400/60" />}
      </Link>
    );
  }

  const inner = (
    <div className="flex flex-col h-full bg-[#070B14]">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="p-1.5 bg-cyan-500/15 rounded-lg border border-cyan-500/30 flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="leading-tight">
          <div className="text-xs font-bold text-white tracking-wider">AI DATA ANALYZER</div>
          <div className="text-xs font-bold text-cyan-400 tracking-wider">ADMIN CONSOLE</div>
        </div>
        <button
          className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5 custom-scrollbar" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Overview</p>
        {NAV_OVERVIEW.map((n) => <NavItem key={n.key} nav={n} />)}

        <div className="pt-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Monitoring</p>
          {NAV_MONITORING.map((n) => <NavItem key={n.key} nav={n} />)}
        </div>

        <div className="pt-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Admin Account</p>
          {NAV_ACCOUNT.map((n) => <NavItem key={n.key} nav={n} />)}
        </div>
      </nav>

      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-indigo-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Administrator</p>
            <p className="text-[10px] text-cyan-500/80">Super Admin</p>
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
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#070B14] border-r border-white/[0.06] h-full z-20">
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

function AdminTopBar({ pageTitle, subtitle, setMobileOpen }: { pageTitle: string; subtitle: string; setMobileOpen: (v: boolean) => void }) {
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <button
        className="lg:hidden text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:rounded"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white capitalize leading-none">{pageTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          System Operational
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-indigo-300" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>
          
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              {NAV_ACCOUNT.map((item) => (
                <button key={item.label} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/[0.06]" />
              <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Reusable Modal Component
// ────────────────────────────────────────────────────────────────────────────

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
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Admin Sessions Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminSessionsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>(MOCK_SESSIONS);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [browserFilter, setBrowserFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [revokeModal, setRevokeModal] = useState(false);

  // Menus
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Derived state
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch = s.user.toLowerCase().includes(search.toLowerCase()) || 
                          s.os.toLowerCase().includes(search.toLowerCase()) ||
                          s.browser.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      const matchDevice = deviceFilter === "All" || s.deviceType === deviceFilter;
      const matchBrowser = browserFilter === "All" || s.browser === browserFilter;
      return matchSearch && matchStatus && matchDevice && matchBrowser;
    });
  }, [sessions, search, statusFilter, deviceFilter, browserFilter]);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(start, start + itemsPerPage);
  }, [filteredSessions, currentPage]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1;

  // Actions
  const openModal = (session: SessionRecord, type: "details" | "revoke") => {
    setActiveSession(session);
    setActionMenuOpen(null);
    if (type === "details") setDetailsModal(true);
    if (type === "revoke") setRevokeModal(true);
  };

  const handleRevoke = () => {
    if (activeSession) {
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, status: "Revoked" } : s));
    }
    setRevokeModal(false);
  };

  const handleBulkRevoke = () => {
    setSessions(prev => prev.map(s => selectedIds.has(s.id) ? { ...s, status: "Revoked" } : s));
    setSelectedIds(new Set());
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDeviceFilter("All");
    setBrowserFilter("All");
    setDateFilter("Last 7 Days");
    setCurrentPage(1);
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const getDeviceIcon = (device: DeviceType) => {
    switch(device) {
      case "Windows Laptop": return <Monitor className="w-3.5 h-3.5" />;
      case "MacBook": return <Apple className="w-3.5 h-3.5" />;
      case "iPhone": return <Smartphone className="w-3.5 h-3.5" />;
      case "iPad": return <Smartphone className="w-3.5 h-3.5" />;
      case "Android Phone": return <Smartphone className="w-3.5 h-3.5" />;
      default: return <MonitorSmartphone className="w-3.5 h-3.5" />;
    }
  };

  const getBrowserIcon = (browser: BrowserType) => {
    switch(browser) {
      case "Chrome": return <Globe className="w-3.5 h-3.5" />;
      case "Safari": return <Compass className="w-3.5 h-3.5" />;
      case "Edge": return <Globe className="w-3.5 h-3.5" />;
      case "Firefox": return <Globe className="w-3.5 h-3.5" />;
      default: return <LayoutTemplate className="w-3.5 h-3.5" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="sessions" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar pageTitle="Sessions" subtitle="Monitor authenticated user sessions across the platform." setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Session Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: "ACTIVE SESSIONS", value: "86", desc: "+12 today", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "TOTAL SESSIONS TODAY", value: "342", desc: "+8.4%", color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "NEW SESSIONS", value: "24", desc: "Last hour", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "IDLE SESSIONS", value: "7", desc: "Needs review", color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "EXPIRED", value: "218", desc: "Today", color: "text-slate-400", bg: "bg-white/5" },
                { label: "REVOKED", value: "31", desc: "Today", color: "text-red-400", bg: "bg-red-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className={`text-xs ${stat.color}`}>{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Stale Session Warning */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-400">7 idle sessions require attention</h4>
                  <p className="text-xs text-amber-200/60 mt-0.5">These sessions have not been active recently.</p>
                </div>
              </div>
              <button 
                onClick={() => setStatusFilter("Idle")}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium rounded-xl transition-all"
              >
                Review Idle Sessions
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column (2/3 width) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Search and Filter Toolbar */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by user, device or browser..."
                        className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-400 mr-1">Filters:</span>
                    </div>
                    
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Status: All</option>
                      <option value="Active">Active</option>
                      <option value="Idle">Idle</option>
                      <option value="Expired">Expired</option>
                      <option value="Revoked">Revoked</option>
                    </select>

                    <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Device: All</option>
                      <option value="Windows Laptop">Windows Laptop</option>
                      <option value="MacBook">MacBook</option>
                      <option value="iPhone">iPhone</option>
                      <option value="iPad">iPad</option>
                      <option value="Android Phone">Android</option>
                      <option value="Other">Other</option>
                    </select>

                    <select value={browserFilter} onChange={e => setBrowserFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Browser: All</option>
                      <option value="Chrome">Chrome</option>
                      <option value="Safari">Safari</option>
                      <option value="Edge">Edge</option>
                      <option value="Firefox">Firefox</option>
                    </select>

                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="Last 7 Days">Date: Last 7 Days</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                    </select>

                    {(search || statusFilter !== "All" || deviceFilter !== "All" || browserFilter !== "All" || dateFilter !== "Last 7 Days") && (
                      <button onClick={handleClearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 transition-colors ml-auto">
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Bulk Selection Toolbar */}
                {selectedIds.size > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium text-blue-400 px-2">{selectedIds.size} sessions selected</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg text-xs font-medium text-white transition-all">Mark for Review</button>
                      <button onClick={handleBulkRevoke} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 transition-all">Revoke Selected</button>
                      <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Clear Selection</button>
                    </div>
                  </div>
                )}

                {/* Main Session Table / Mobile Cards */}
                {filteredSessions.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                      <Monitor className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">No sessions found</h3>
                    <p className="text-sm text-slate-400 mb-6">No sessions match your current filters.</p>
                    <button onClick={handleClearFilters} className="px-5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
                    {/* Desktop/Tablet Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm text-left min-w-[900px]">
                        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                          <tr>
                            <th className="px-4 py-4 w-10"></th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Device</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">OS</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Browser</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Session Started</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Duration</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paginatedSessions.map((session) => (
                            <tr key={session.id} className={`hover:bg-white/[0.02] transition-colors ${selectedIds.has(session.id) ? 'bg-blue-500/5' : ''}`}>
                              <td className="px-4 py-3.5">
                                <div 
                                  onClick={() => toggleSelection(session.id)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedIds.has(session.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 hover:border-white/40'}`}
                                >
                                  {selectedIds.has(session.id) && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-200 font-medium">{session.user}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  {getDeviceIcon(session.deviceType)} <span className="text-xs">{session.deviceType}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-400 text-xs">{session.os}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  {getBrowserIcon(session.browser)} <span className="text-xs">{session.browser}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 text-xs">{session.startedAt}</td>
                              <td className="px-4 py-3.5 text-slate-500 text-xs">{session.lastActive}</td>
                              <td className="px-4 py-3.5 text-slate-500 text-xs">{session.duration}</td>
                              <td className="px-4 py-3.5">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                  session.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  session.status === 'Idle' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                  session.status === 'Revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                  {session.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                  {session.status === 'Idle' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                  {session.status === 'Revoked' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                                  {session.status === 'Expired' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                                  {session.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right relative">
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === session.id ? null : session.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {actionMenuOpen === session.id && (
                                  <div className="absolute right-8 top-10 mt-1 w-40 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                    <button onClick={() => openModal(session, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Details</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors text-left">Mark for Review</button>
                                    <div className="border-t border-white/[0.06]" />
                                    <button 
                                      onClick={() => openModal(session, "revoke")} 
                                      disabled={session.status === "Revoked" || session.status === "Expired"}
                                      className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Revoke Session
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden divide-y divide-white/[0.06]">
                      {paginatedSessions.map(session => (
                        <div key={session.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-200">{session.user}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                {getDeviceIcon(session.deviceType)} {session.deviceType} · {session.browser}
                              </div>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setActionMenuOpen(actionMenuOpen === session.id ? null : session.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {actionMenuOpen === session.id && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                  <button onClick={() => openModal(session, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Details</button>
                                  <button className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 text-left">Mark for Review</button>
                                  <div className="border-t border-white/[0.06]" />
                                  <button onClick={() => openModal(session, "revoke")} disabled={session.status === "Revoked" || session.status === "Expired"} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 text-left disabled:opacity-50 disabled:cursor-not-allowed">Revoke Session</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/[0.04]">
                            <span>Active: {session.lastActive}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              session.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              session.status === 'Idle' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              session.status === 'Revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredSessions.length)}</span> of {filteredSessions.length} sessions
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-50 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-all"
                        >
                          Previous
                        </button>
                        <div className="hidden sm:flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium">1</button>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">2</button>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">3</button>
                          <span className="text-slate-500 text-xs px-1">...</span>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">9</button>
                        </div>
                        <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-50 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-all"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (1/3 width) */}
              <div className="space-y-6">
                
                {/* Session Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Session Health</h3>
                  
                  <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
                    <div className="h-full bg-emerald-400" style={{ width: '50%' }} />
                    <div className="h-full bg-amber-400" style={{ width: '10%' }} />
                    <div className="h-full bg-slate-400" style={{ width: '30%' }} />
                    <div className="h-full bg-red-400" style={{ width: '10%' }} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Active</span>
                      <span className="text-white font-medium">86</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> Idle</span>
                      <span className="text-white font-medium">7</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-400" /> Expired</span>
                      <span className="text-white font-medium">218</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-red-400" /> Revoked</span>
                      <span className="text-white font-medium">31</span>
                    </div>
                  </div>
                </div>

                {/* Device Visualization */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Device Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Windows Laptop", count: 42, icon: Monitor },
                      { name: "MacBook", count: 18, icon: Apple },
                      { name: "Android", count: 14, icon: Smartphone },
                      { name: "iPhone", count: 9, icon: Smartphone },
                      { name: "Other", count: 3, icon: MonitorSmartphone },
                    ].map((d) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/[0.05] rounded-lg text-slate-400">
                            <d.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-200">{d.name}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400">{d.count} sessions</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Trend (Mock Chart) */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Session Activity</h3>
                  
                  <div className="h-32 w-full flex items-end justify-between gap-1">
                    {[
                      { day: "Mon", total: 60, active: 40 },
                      { day: "Tue", total: 80, active: 50 },
                      { day: "Wed", total: 95, active: 70 },
                      { day: "Thu", total: 75, active: 55 },
                      { day: "Fri", total: 85, active: 65 },
                      { day: "Sat", total: 40, active: 20 },
                      { day: "Sun", total: 35, active: 15 },
                    ].map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative">
                        <div className="w-full flex justify-center items-end h-[100px] relative">
                          <div className="w-1/2 max-w-[16px] bg-slate-700/50 rounded-t-sm absolute bottom-0" style={{ height: `${d.total}%` }} />
                          <div className="w-1/2 max-w-[16px] bg-blue-500 rounded-t-sm absolute bottom-0 z-10" style={{ height: `${d.active}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">{d.day}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-700" /> Sessions</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500" /> Active Sessions</span>
                  </div>
                </div>

                {/* Recent Session Activity Timeline */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-5">Recent Session Activity</h3>
                  <div className="relative border-l border-white/[0.1] ml-3 space-y-6 pb-2">
                    {[
                      { t: "09:42", ev: "User session active", sub: "Windows Laptop", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/20" },
                      { t: "09:38", ev: "New session started", sub: "MacBook", icon: MonitorSmartphone, color: "text-blue-400", bg: "bg-blue-500/20" },
                      { t: "09:31", ev: "Session revoked", sub: "Android", icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
                      { t: "09:15", ev: "New login", sub: "iPhone", icon: User, color: "text-cyan-400", bg: "bg-cyan-500/20" },
                    ].map((item, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border border-[#0B1120] ${item.bg}`}>
                          <item.icon className={`w-3 h-3 ${item.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-medium text-slate-200">{item.ev}</p>
                            <span className="text-[10px] text-slate-500">{item.t}</span>
                          </div>
                          <p className="text-xs text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Admin Security Banner */}
            <div className="mt-8 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Session Monitoring</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  Session information is available only to authorized administrators and should never expose authentication secrets.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["RBAC Protected", "Session Authenticated", "Audit Logged"].map((badge) => (
                    <span key={badge} className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-medium rounded-full uppercase tracking-wider">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modals */}

      {/* Session Details Modal */}
      <Modal open={detailsModal} onClose={() => setDetailsModal(false)} title="Session Details" maxWidth="max-w-md">
        {activeSession && (
          <div className="space-y-6">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">User</p>
                <p className="text-sm font-medium text-slate-200">{activeSession.user}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Session ID</p>
                <p className="text-xs font-mono text-slate-400">{activeSession.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Device</p>
                <p className="text-sm text-slate-200">{activeSession.deviceType}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Operating System</p>
                <p className="text-sm text-slate-200">{activeSession.os}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Browser</p>
                <p className="text-sm text-slate-200">{activeSession.browser}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  activeSession.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  activeSession.status === 'Idle' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                  activeSession.status === 'Revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {activeSession.status}
                </span>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Session Started</p>
                <div className="text-right">
                  <p className="text-sm text-slate-200">29 Aug 2026</p>
                  <p className="text-xs text-slate-500">{activeSession.startedAt}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Last Active</p>
                <div className="text-right">
                  <p className="text-sm text-slate-200">29 Aug 2026</p>
                  <p className="text-xs text-slate-500">{activeSession.lastActive}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Session Duration</p>
                <p className="text-sm text-slate-200">{activeSession.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {activeSession.isCurrent ? (
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium rounded uppercase tracking-wider">Current Session</span>
              ) : (
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-slate-400 text-[10px] font-medium rounded uppercase tracking-wider">Remote Session</span>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-end gap-3">
              <button onClick={() => setDetailsModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Revoke Confirmation Modal */}
      <Modal open={revokeModal} onClose={() => setRevokeModal(false)} title="Revoke this session?">
        {activeSession && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">The user will be immediately signed out from this device and their session token will be invalidated.</p>
            </div>
            
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">User</p>
                <p className="text-sm text-slate-300">{activeSession.user}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Device</p>
                  <p className="text-sm text-slate-300">{activeSession.deviceType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Browser</p>
                  <p className="text-sm text-slate-300">{activeSession.browser}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Last Active</p>
                <p className="text-sm text-slate-300">{activeSession.lastActive}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-4">
              <button onClick={() => setRevokeModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={handleRevoke}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Revoke Session
              </button>
            </div>
          </div>
        )}
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
