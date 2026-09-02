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
  Smartphone,
  Monitor,
  Apple,
  Compass,
  Globe,
  MonitorPlay,
  Laptop
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

type DeviceStatus = "Active" | "Recently Seen" | "Inactive";
type DeviceType = "Laptop" | "Desktop" | "MacBook" | "iPhone" | "iPad" | "Android" | "Tablet" | "Other";
type OSType = "Windows 11" | "Windows 10" | "macOS" | "iOS" | "Android" | "Linux" | "Other";
type BrowserType = "Chrome" | "Safari" | "Edge" | "Firefox" | "Other";

interface DeviceRecord {
  id: string;
  user: string;
  deviceType: DeviceType;
  os: OSType;
  browser: BrowserType;
  firstSeen: string;
  lastSeen: string;
  sessions: number;
  status: DeviceStatus;
  isCurrent: boolean;
  screen?: string;
}

const MOCK_DEVICES: DeviceRecord[] = [
  { id: "dev_a1b2c3", user: "shivam•••@gmail.com", deviceType: "Laptop", os: "Windows 11", browser: "Chrome", firstSeen: "12 Aug 2026", lastSeen: "29 Aug 2026", sessions: 14, status: "Active", isCurrent: true, screen: "1920 × 1080" },
  { id: "dev_d4e5f6", user: "anal•••@gmail.com", deviceType: "MacBook", os: "macOS", browser: "Safari", firstSeen: "08 Aug 2026", lastSeen: "29 Aug 2026", sessions: 8, status: "Active", isCurrent: false, screen: "2560 × 1600" },
  { id: "dev_g7h8i9", user: "user•••@gmail.com", deviceType: "iPhone", os: "iOS", browser: "Safari", firstSeen: "20 Aug 2026", lastSeen: "28 Aug 2026", sessions: 5, status: "Recently Seen", isCurrent: false, screen: "1170 × 2532" },
  { id: "dev_j0k1l2", user: "demo•••@gmail.com", deviceType: "Android", os: "Android", browser: "Chrome", firstSeen: "15 Jul 2026", lastSeen: "20 Aug 2026", sessions: 22, status: "Inactive", isCurrent: false, screen: "1080 × 2400" },
  { id: "dev_m3n4o5", user: "admin•••@company.com", deviceType: "Desktop", os: "Linux", browser: "Firefox", firstSeen: "01 Jan 2026", lastSeen: "29 Aug 2026", sessions: 104, status: "Active", isCurrent: false, screen: "3840 × 2160" },
  { id: "dev_p6q7r8", user: "test•••@example.com", deviceType: "iPad", os: "iOS", browser: "Safari", firstSeen: "10 Aug 2026", lastSeen: "27 Aug 2026", sessions: 3, status: "Recently Seen", isCurrent: false, screen: "1668 × 2388" },
  { id: "dev_s9t0u1", user: "dev•••@startup.io", deviceType: "MacBook", os: "macOS", browser: "Chrome", firstSeen: "05 Mar 2026", lastSeen: "25 Aug 2026", sessions: 45, status: "Inactive", isCurrent: false, screen: "3024 × 1964" },
  { id: "dev_v2w3x4", user: "ceo•••@corp.com", deviceType: "Laptop", os: "Windows 10", browser: "Edge", firstSeen: "12 May 2026", lastSeen: "29 Aug 2026", sessions: 32, status: "Active", isCurrent: false, screen: "1920 × 1080" },
  { id: "dev_y5z6a7", user: "guest•••@mail.com", deviceType: "Tablet", os: "Android", browser: "Chrome", firstSeen: "28 Aug 2026", lastSeen: "28 Aug 2026", sessions: 1, status: "Recently Seen", isCurrent: false, screen: "1200 × 1920" },
  { id: "dev_b8c9d0", user: "hr•••@company.com", deviceType: "Laptop", os: "Windows 11", browser: "Chrome", firstSeen: "22 Feb 2026", lastSeen: "20 Jul 2026", sessions: 18, status: "Inactive", isCurrent: false, screen: "1920 × 1200" },
];

const RECENT_ACTIVITY_TIMELINE = [
  { time: "09:42 AM", text: "Session active", day: "Today" },
  { time: "09:12 AM", text: "Login", day: "Today" },
  { time: "Yesterday", text: "Session started", day: "Yesterday" },
  { time: "26 Aug", text: "Login", day: "26 Aug" },
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
// Main Admin Devices Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDevicesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [devices, setDevices] = useState<DeviceRecord[]>(MOCK_DEVICES);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [osFilter, setOsFilter] = useState("All");
  const [browserFilter, setBrowserFilter] = useState("All");
  const [activityFilter, setActivityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Today");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [activeDevice, setActiveDevice] = useState<DeviceRecord | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [revokeModal, setRevokeModal] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Menus
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Derived state
  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const matchSearch = d.user.toLowerCase().includes(search.toLowerCase()) || 
                          d.os.toLowerCase().includes(search.toLowerCase()) ||
                          d.browser.toLowerCase().includes(search.toLowerCase()) ||
                          d.deviceType.toLowerCase().includes(search.toLowerCase());
      const matchDevice = deviceFilter === "All" || d.deviceType === deviceFilter;
      const matchOS = osFilter === "All" || d.os === osFilter;
      const matchBrowser = browserFilter === "All" || d.browser === browserFilter;
      const matchActivity = activityFilter === "All" || d.status === activityFilter;
      return matchSearch && matchDevice && matchOS && matchBrowser && matchActivity;
    });
  }, [devices, search, deviceFilter, osFilter, browserFilter, activityFilter]);

  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDevices.slice(start, start + itemsPerPage);
  }, [filteredDevices, currentPage]);

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage) || 1;

  // Actions
  const openModal = (device: DeviceRecord, type: "details" | "revoke") => {
    setActiveDevice(device);
    setActionMenuOpen(null);
    if (type === "details") setDetailsModal(true);
    if (type === "revoke") setRevokeModal(true);
  };

  const handleRevoke = () => {
    if (activeDevice) {
      setDevices(prev => prev.map(d => d.id === activeDevice.id ? { ...d, status: "Inactive" } : d));
    }
    setRevokeModal(false);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDeviceFilter("All");
    setOsFilter("All");
    setBrowserFilter("All");
    setActivityFilter("All");
    setDateFilter("Today");
    setCurrentPage(1);
  };

  const getDeviceIcon = (device: string) => {
    switch(device) {
      case "Laptop": return <Laptop className="w-3.5 h-3.5" />;
      case "Desktop": return <Monitor className="w-3.5 h-3.5" />;
      case "MacBook": return <Apple className="w-3.5 h-3.5" />;
      case "iPhone": return <Smartphone className="w-3.5 h-3.5" />;
      case "iPad": return <Smartphone className="w-3.5 h-3.5" />;
      case "Android": return <Smartphone className="w-3.5 h-3.5" />;
      case "Tablet": return <Smartphone className="w-3.5 h-3.5" />;
      default: return <MonitorSmartphone className="w-3.5 h-3.5" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="devices" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar pageTitle="Devices" subtitle="Monitor devices and platforms accessing the AI DATA ANALYZER." setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Suspicious Device Alert */}
            {showAlert && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 mt-0.5 flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-1">Unusual Device Activity</h4>
                    <p className="text-xs text-amber-200/80 mb-2">3 users recently accessed the platform from new devices.</p>
                    <div className="flex items-center gap-2 text-[10px] text-amber-400/70">
                      <span>user•••@gmail.com</span>
                      <span>·</span>
                      <span>New Android Device</span>
                      <span>·</span>
                      <span>29 Aug 2026 · 09:32 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setShowAlert(false)}
                    className="px-4 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium rounded-xl transition-all">
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: "TOTAL DEVICES", value: "1,248", desc: "Registered devices", icon: MonitorSmartphone, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "ACTIVE DEVICES", value: "86", desc: "Currently active", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "WINDOWS", value: "512", desc: "41.0%", icon: Monitor, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "MACOS", value: "284", desc: "22.8%", icon: Apple, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { label: "MOBILE", value: "392", desc: "31.4%", icon: Smartphone, color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "OTHER", value: "60", desc: "4.8%", icon: MonitorPlay, color: "text-slate-400", bg: "bg-white/5" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-[10px] text-slate-400">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
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
                        placeholder="Search users or devices..."
                        className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-400 mr-1">Filters:</span>
                    </div>
                    
                    <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Device Type: All</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="MacBook">MacBook</option>
                      <option value="iPhone">iPhone</option>
                      <option value="iPad">iPad</option>
                      <option value="Android">Android</option>
                      <option value="Tablet">Tablet</option>
                    </select>

                    <select value={osFilter} onChange={e => setOsFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Operating System: All</option>
                      <option value="Windows 11">Windows</option>
                      <option value="macOS">macOS</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                      <option value="Linux">Linux</option>
                    </select>

                    <select value={browserFilter} onChange={e => setBrowserFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Browser: All</option>
                      <option value="Chrome">Chrome</option>
                      <option value="Safari">Safari</option>
                      <option value="Edge">Edge</option>
                      <option value="Firefox">Firefox</option>
                    </select>

                    <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Activity: All</option>
                      <option value="Active">Active</option>
                      <option value="Recently Seen">Recently Seen</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="Today">Today</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                    </select>

                    {(search || deviceFilter !== "All" || osFilter !== "All" || browserFilter !== "All" || activityFilter !== "All" || dateFilter !== "Today") && (
                      <button onClick={handleClearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 transition-colors ml-auto">
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Device Table / Mobile Cards */}
                {filteredDevices.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                      <MonitorSmartphone className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">No devices found</h3>
                    <p className="text-sm text-slate-400 mb-6">No devices match the current filters.</p>
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
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Device</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">OS</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Browser</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">First Seen</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Last Seen</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Sessions</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paginatedDevices.map((device) => (
                            <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2 font-medium text-slate-200">
                                  {getDeviceIcon(device.deviceType)}
                                  <span>{device.deviceType}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-slate-300">{device.user}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-xs">{device.os}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-xs">{device.browser}</td>
                              <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{device.firstSeen}</td>
                              <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{device.lastSeen}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-right">{device.sessions}</td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                  device.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  device.status === 'Recently Seen' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                  {device.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                  {device.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right relative">
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === device.id ? null : device.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {actionMenuOpen === device.id && (
                                  <div className="absolute right-8 top-10 mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                    <button onClick={() => openModal(device, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Details</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Sessions</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors text-left">Mark for Review</button>
                                    <div className="border-t border-white/[0.06]" />
                                    <button 
                                      onClick={() => openModal(device, "revoke")} 
                                      className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                      Revoke Device Sessions
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
                      {paginatedDevices.map(device => (
                        <div key={device.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 font-medium text-slate-200 mb-1">
                                {getDeviceIcon(device.deviceType)}
                                <span>{device.deviceType}</span>
                              </div>
                              <p className="text-xs text-slate-400">{device.user}</p>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setActionMenuOpen(actionMenuOpen === device.id ? null : device.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {actionMenuOpen === device.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                  <button onClick={() => openModal(device, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Details</button>
                                  <button onClick={() => openModal(device, "revoke")} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 text-left">Revoke Device Sessions</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-2">
                            <div><span className="text-slate-400">OS:</span> {device.os}</div>
                            <div><span className="text-slate-400">Browser:</span> {device.browser}</div>
                            <div><span className="text-slate-400">Seen:</span> {device.lastSeen}</div>
                            <div><span className="text-slate-400">Sessions:</span> {device.sessions}</div>
                          </div>
                          <div className="pt-2 border-t border-white/[0.04]">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              device.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              device.status === 'Recently Seen' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>
                              {device.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredDevices.length)}</span> of {filteredDevices.length} devices
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
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">125</button>
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

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Device Distribution */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Device Distribution</h3>
                  
                  <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
                    <div className="h-full bg-cyan-400" style={{ width: '41%' }} title="Windows Laptop 41%" />
                    <div className="h-full bg-indigo-400" style={{ width: '23%' }} title="MacBook 23%" />
                    <div className="h-full bg-emerald-400" style={{ width: '19%' }} title="Android 19%" />
                    <div className="h-full bg-amber-400" style={{ width: '12%' }} title="iPhone 12%" />
                    <div className="h-full bg-blue-400" style={{ width: '4%' }} title="iPad 4%" />
                    <div className="h-full bg-slate-400" style={{ width: '1%' }} title="Other 1%" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Windows Laptop</span> <span className="text-white font-medium">41%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-indigo-400" /> MacBook</span> <span className="text-white font-medium">23%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Android</span> <span className="text-white font-medium">19%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> iPhone</span> <span className="text-white font-medium">12%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-blue-400" /> iPad</span> <span className="text-white font-medium">4%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-400" /> Other</span> <span className="text-white font-medium">1%</span></div>
                  </div>
                </div>

                {/* Operating Systems */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Operating Systems</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Windows 11", count: "384 devices", pct: "30.8%", w: "30.8%" },
                      { name: "Windows 10", count: "128 devices", pct: "10.2%", w: "10.2%" },
                      { name: "macOS", count: "284 devices", pct: "22.8%", w: "22.8%" },
                      { name: "iOS", count: "200 devices", pct: "16.0%", w: "16.0%" },
                      { name: "Android", count: "192 devices", pct: "15.4%", w: "15.4%" },
                      { name: "Linux", count: "60 devices", pct: "4.8%", w: "4.8%" },
                    ].map((os) => (
                      <div key={os.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{os.name} <span className="text-slate-500 font-normal ml-1">({os.count})</span></span>
                          <span className="text-white font-medium">{os.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: os.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Usage */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Browser Usage</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Chrome", count: "740 users", pct: "59.3%", w: "59.3%", icon: Globe },
                      { name: "Safari", count: "350 users", pct: "28.0%", w: "28.0%", icon: Compass },
                      { name: "Edge", count: "95 users", pct: "7.6%", w: "7.6%", icon: Globe },
                      { name: "Firefox", count: "50 users", pct: "4.0%", w: "4.0%", icon: Globe },
                      { name: "Other", count: "13 users", pct: "1.1%", w: "1.1%", icon: Globe },
                    ].map((b) => (
                      <div key={b.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-300 font-medium"><b.icon className="w-3.5 h-3.5 text-slate-400"/> {b.name} <span className="text-slate-500 font-normal ml-1">({b.count})</span></span>
                          <span className="text-white font-medium">{b.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 rounded-full" style={{ width: b.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Activity Trend */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Device Activity</h3>
                  
                  <div className="h-32 w-full flex items-end justify-between gap-1">
                    {[
                      { day: "Mon", total: 40, active: 30 },
                      { day: "Tue", total: 60, active: 50 },
                      { day: "Wed", total: 85, active: 65 },
                      { day: "Thu", total: 55, active: 45 },
                      { day: "Fri", total: 75, active: 60 },
                      { day: "Sat", total: 30, active: 20 },
                      { day: "Sun", total: 25, active: 15 },
                    ].map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative">
                        <div className="w-full flex justify-center items-end h-[100px] relative">
                          <div className="w-1/2 max-w-[16px] bg-slate-700/50 rounded-t-sm absolute bottom-0" style={{ height: `${d.total}%` }} />
                          <div className="w-1/2 max-w-[16px] bg-emerald-500 rounded-t-sm absolute bottom-0 z-10" style={{ height: `${d.active}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">{d.day}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-700" /> New Devices</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Devices</span>
                  </div>
                </div>

                {/* Recently Seen */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Recently Seen</h3>
                  <div className="space-y-4">
                    {[
                      { u: "shivam•••@gmail.com", d: "Windows Laptop", t: "2 minutes ago", icon: Monitor },
                      { u: "anal•••@gmail.com", d: "MacBook", t: "5 minutes ago", icon: Apple },
                      { u: "user•••@gmail.com", d: "iPhone", t: "12 minutes ago", icon: Smartphone },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/[0.05] rounded-lg text-slate-400">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{item.u}</p>
                            <p className="text-[10px] text-slate-500">{item.d}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{item.t}</span>
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
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Device Monitoring</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  Device information is available only to authorized administrators and is used for security and operational monitoring.
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

      {/* Device Details Modal */}
      <Modal open={detailsModal} onClose={() => setDetailsModal(false)} title="Device Details" maxWidth="max-w-md">
        {activeDevice && (
          <div className="space-y-6">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">User</p>
                <p className="text-sm font-medium text-slate-200">{activeDevice.user}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Device ID</p>
                <p className="text-xs font-mono text-slate-400">{activeDevice.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Device</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-200">
                  {getDeviceIcon(activeDevice.deviceType)} {activeDevice.deviceType}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Device Type</p>
                <p className="text-sm text-slate-200">{activeDevice.deviceType}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Operating System</p>
                <p className="text-sm text-slate-200">{activeDevice.os}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Browser</p>
                <p className="text-sm text-slate-200">{activeDevice.browser}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Screen</p>
                <p className="text-sm text-slate-200">{activeDevice.screen}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Total Sessions</p>
                <p className="text-sm text-slate-200">{activeDevice.sessions}</p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">First Seen</p>
                <div className="text-right">
                  <p className="text-sm text-slate-200">{activeDevice.firstSeen}</p>
                  <p className="text-xs text-slate-500">10:21 AM</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Last Seen</p>
                <div className="text-right">
                  <p className="text-sm text-slate-200">{activeDevice.lastSeen}</p>
                  <p className="text-xs text-slate-500">09:42 AM</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Current Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  activeDevice.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  activeDevice.status === 'Recently Seen' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {activeDevice.status}
                </span>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-4">Recent Activity</p>
              <div className="relative border-l border-white/[0.1] ml-3 space-y-5 pb-2">
                {RECENT_ACTIVITY_TIMELINE.map((ev, i) => (
                  <div key={i} className="relative pl-5">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400 ring-4 ring-[#0B1120]" />
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-200">{ev.text}</p>
                        <span className="text-[10px] text-slate-500">{ev.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ev.day}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setDetailsModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Revoke Sessions Confirmation Modal */}
      <Modal open={revokeModal} onClose={() => setRevokeModal(false)} title="Revoke all sessions for this device?">
        {activeDevice && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">All active sessions associated with this device will be terminated immediately.</p>
            </div>
            
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">User</p>
                <p className="text-sm text-slate-300">{activeDevice.user}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Device</p>
                  <p className="text-sm text-slate-300">{activeDevice.deviceType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">OS</p>
                  <p className="text-sm text-slate-300">{activeDevice.os}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Browser</p>
                  <p className="text-sm text-slate-300">{activeDevice.browser}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Active Sessions</p>
                  <p className="text-sm text-emerald-400 font-medium">3</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-4">
              <button onClick={() => setRevokeModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={handleRevoke}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Revoke Sessions
              </button>
            </div>
          </div>
        )}
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
