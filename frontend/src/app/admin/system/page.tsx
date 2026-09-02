"use client";

import React, { useState, useCallback } from "react";
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
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Cpu,
  HardDrive,
  Zap,
  Thermometer,
  Play,
  Clock,
  TrendingUp,
  Wifi,
  CircleCheck
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type ServiceStatus = "Operational" | "Degraded" | "Down";
type AlertLevel = "success" | "info" | "warning" | "error";
type WorkerState = "Idle" | "Running" | "Error";

interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: string;
  metric: string;
  metricLabel: string;
  responseMs?: number;
  icon: React.ElementType;
}

interface SystemAlert {
  id: string;
  level: AlertLevel;
  message: string;
  ago: string;
}

interface Incident {
  id: string;
  title: string;
  date: string;
  duration: string;
  resolved: boolean;
}

interface WorkerStatus {
  id: string;
  name: string;
  role: string;
  state: WorkerState;
}

// ────────────────────────────────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────────────────────────────────

const MOCK_SERVICES: ServiceHealth[] = [
  { id: "fastapi", name: "FastAPI API", status: "Operational", uptime: "99.99%", metric: "42 ms", metricLabel: "Response", responseMs: 42, icon: Wifi },
  { id: "postgres", name: "PostgreSQL", status: "Operational", uptime: "99.98%", metric: "18 / 100", metricLabel: "Connections", icon: Database },
  { id: "duckdb", name: "DuckDB Engine", status: "Operational", uptime: "100%", metric: "428", metricLabel: "Queries today", icon: BarChart3 },
  { id: "qwen", name: "Qwen AI Engine", status: "Operational", uptime: "99.97%", metric: "Qwen2.5-7B", metricLabel: "Model", icon: Zap },
  { id: "storage", name: "Data Storage", status: "Operational", uptime: "99.99%", metric: "37.3%", metricLabel: "Usage", icon: HardDrive },
  { id: "workers", name: "Background Workers", status: "Operational", uptime: "99.95%", metric: "4 / 4", metricLabel: "Workers active", icon: Server },
];

const MOCK_ALERTS: SystemAlert[] = [
  { id: "a1", level: "warning", message: "GPU VRAM reached 82% utilization.", ago: "5 minutes ago" },
  { id: "a2", level: "info", message: "Dataset processing queue cleared.", ago: "18 minutes ago" },
  { id: "a3", level: "warning", message: "Two slow PostgreSQL queries detected.", ago: "42 minutes ago" },
  { id: "a4", level: "success", message: "Automated database backup completed successfully.", ago: "2 hours ago" },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: "i1", title: "PostgreSQL elevated latency", date: "27 Aug 2026", duration: "8 minutes", resolved: true },
  { id: "i2", title: "Dataset processing delay", date: "21 Aug 2026", duration: "14 minutes", resolved: true },
];

const MOCK_WORKERS: WorkerStatus[] = [
  { id: "w1", name: "Worker 01", role: "Dataset Processing", state: "Idle" },
  { id: "w2", name: "Worker 02", role: "Dataset Processing", state: "Running" },
  { id: "w3", name: "Worker 03", role: "Analysis Processing", state: "Running" },
  { id: "w4", name: "Worker 04", role: "Cleanup", state: "Idle" },
];

const ENDPOINTS = [
  { path: "POST /api/analyze", requests: "4,821", avg: "182 ms", p95: "492 ms", success: "99.5%", healthy: true },
  { path: "POST /api/datasets/upload", requests: "1,284", avg: "246 ms", p95: "612 ms", success: "99.8%", healthy: true },
  { path: "GET /api/datasets", requests: "3,842", avg: "81 ms", p95: "190 ms", success: "99.9%", healthy: true },
  { path: "POST /auth/login", requests: "2,895", avg: "96 ms", p95: "211 ms", success: "99.9%", healthy: true },
];

const TIMELINE_EVENTS = [
  { time: "09:42", label: "Health check completed", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  { time: "09:39", label: "Qwen inference completed", icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  { time: "09:37", label: "Dataset processing completed", icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/20" },
  { time: "09:31", label: "PostgreSQL backup verified", icon: CircleCheck, color: "text-blue-400", bg: "bg-blue-500/20" },
  { time: "09:24", label: "Worker restarted", icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-500/20" },
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
        <div className="pt-5"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Admin Account</p>{NAV_ACCOUNT.map(n => <NavItem key={n.key} nav={n} />)}</div>
      </nav>
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"><User className="w-3.5 h-3.5 text-indigo-300" /></div>
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

function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function ResourceBar({ value, warn = 70, crit = 85, label, sub }: { value: number; warn?: number; crit?: number; label: string; sub: string }) {
  const color = value >= crit ? "bg-red-500" : value >= warn ? "bg-amber-400" : "bg-emerald-400";
  const textColor = value >= crit ? "text-red-400" : value >= warn ? "text-amber-400" : "text-emerald-400";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}

function StatusDot({ status }: { status: ServiceStatus }) {
  const map = { Operational: "bg-emerald-400", Degraded: "bg-amber-400", Down: "bg-red-400" };
  return <span className={`w-1.5 h-1.5 rounded-full ${map[status]}`} />;
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminSystemPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("29 Aug 2026 · 09:42 AM");
  const [cpuVal, setCpuVal] = useState(42);
  const [ramVal, setRamVal] = useState(68);
  const [gpuVal, setGpuVal] = useState(74);
  const [diskVal, setDiskVal] = useState(37);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Modals
  const [serviceModal, setServiceModal] = useState<ServiceHealth | null>(null);
  const [gpuModal, setGpuModal] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setLastUpdated(`29 Aug 2026 · ${h}:${m} AM`);
      setCpuVal(Math.floor(Math.random() * 15) + 35);
      setRamVal(Math.floor(Math.random() * 10) + 63);
      setGpuVal(Math.floor(Math.random() * 12) + 68);
      setDiskVal(Math.floor(Math.random() * 4) + 35);
      setIsRefreshing(false);
    }, 800);
  }, []);

  const alertIcon = (level: AlertLevel) => {
    if (level === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    if (level === "info") return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    if (level === "warning") return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
  };

  const alertBg = (level: AlertLevel) => {
    if (level === "success") return "border-emerald-500/20 bg-emerald-500/5";
    if (level === "info") return "border-blue-500/20 bg-blue-500/5";
    if (level === "warning") return "border-amber-500/20 bg-amber-500/5";
    return "border-red-500/20 bg-red-500/5";
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="system" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white leading-none">System Health</h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Monitor platform services, infrastructure resources, and analytical engine health.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />All Systems Operational
            </div>
            <div className="hidden lg:block text-[10px] text-slate-500">Updated: {lastUpdated}</div>
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs text-slate-300 transition-all disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:block">Refresh</span>
            </button>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
              <Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>
            <div className="relative">
              <button onClick={() => setUserOpen(v => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"><User className="w-3.5 h-3.5 text-indigo-300" /></div>
                <p className="text-xs font-semibold text-white leading-none hidden sm:block">Administrator</p>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {NAV_ACCOUNT.map(item => (<button key={item.label} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05]"><item.icon className="w-4 h-4" />{item.label}</button>))}
                  <div className="border-t border-white/[0.06]" />
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut className="w-4 h-4" />Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* Global Health Banner */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/30 flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-0.5">All Systems Operational</h2>
                  <p className="text-sm text-emerald-300/70">All critical AI DATA ANALYZER services are currently healthy.</p>
                </div>
              </div>
              <div className="flex gap-6 sm:gap-8 text-center">
                <div><p className="text-xs text-slate-400 mb-0.5">Uptime</p><p className="text-lg font-bold text-emerald-400">99.98%</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">Last Incident</p><p className="text-lg font-bold text-white">12 days</p></div>
                <div><p className="text-xs text-slate-400 mb-0.5">Active Incidents</p><p className="text-lg font-bold text-emerald-400">0</p></div>
              </div>
            </div>

            {/* Service Health Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {MOCK_SERVICES.map(svc => (
                <button key={svc.id} onClick={() => setServiceModal(svc)}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors text-left group relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg"><svc.icon className="w-4 h-4 text-cyan-400" /></div>
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={svc.status} />
                      <span className="text-[10px] font-medium text-emerald-400">{svc.status}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 truncate">{svc.name}</p>
                  <p className="text-base font-bold text-white mb-0.5 truncate">{svc.metric}</p>
                  <p className="text-[10px] text-slate-400">{svc.metricLabel}</p>
                  <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Uptime</span>
                    <span className="text-[10px] font-semibold text-emerald-400">{svc.uptime}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Left Column (2/3) */}
              <div className="xl:col-span-2 space-y-6">

                {/* Infrastructure Resources */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-5">Infrastructure Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button onClick={() => {}} className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-slate-300">CPU</span>
                        <span className="ml-auto text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">Normal</span>
                      </div>
                      <ResourceBar value={cpuVal} warn={70} crit={85} label="Utilization" sub={`${cpuVal}% of 8 cores · Peak: 81%`} />
                    </button>
                    <button onClick={() => {}} className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <Server className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-300">RAM</span>
                        <span className="ml-auto text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">Moderate</span>
                      </div>
                      <ResourceBar value={ramVal} warn={65} crit={85} label="Memory Used" sub={`${(ramVal * 0.16).toFixed(1)} / 16 GB · Cached: 1.8 GB`} />
                    </button>
                    <button onClick={() => setGpuModal(true)} className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-300">GPU / VRAM</span>
                        <span className="ml-auto text-[10px] text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">Moderate</span>
                      </div>
                      <ResourceBar value={gpuVal} warn={70} crit={85} label="VRAM Usage" sub={`${(gpuVal * 0.06).toFixed(1)} / 6 GB · Temp: 67°C`} />
                    </button>
                    <button onClick={() => {}} className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-4 text-left hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <HardDrive className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-300">Disk</span>
                        <span className="ml-auto text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">Healthy</span>
                      </div>
                      <ResourceBar value={diskVal} warn={70} crit={85} label="Storage Used" sub={`186 / 500 GB · Available: 314 GB`} />
                    </button>
                  </div>
                </div>

                {/* GPU / Qwen Monitor */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h3 className="text-base font-semibold text-white">AI Engine / GPU</h3>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Healthy</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">GPU</p>
                        <p className="text-xs font-semibold text-white">NVIDIA GeForce RTX 4050</p>
                        <p className="text-[10px] text-slate-400">Laptop GPU</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-[10px] text-slate-500 mb-1">VRAM</p>
                          <p className="text-sm font-bold text-white">4.5 / 6 GB</p>
                          <div className="w-full h-1 bg-white/5 rounded-full mt-1.5"><div className="h-full bg-amber-400 rounded-full" style={{ width: "75%" }} /></div>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-[10px] text-slate-500 mb-1">Temperature</p>
                          <div className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-400" /><p className="text-sm font-bold text-amber-400">67°C</p></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-[10px] text-slate-500 mb-1">Utilization</p>
                          <p className="text-sm font-bold text-white">82%</p>
                        </div>
                        <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-[10px] text-slate-500 mb-1">GPU Val</p>
                          <p className="text-sm font-bold text-white">{gpuVal}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Qwen Model</p>
                        <p className="text-xs font-semibold text-cyan-400">Qwen2.5-7B-Instruct</p>
                        <span className="text-[10px] px-2 py-0.5 mt-1 inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Loaded</span>
                      </div>
                      {[
                        { l: "Model Load Time", v: "34.2 sec" },
                        { l: "Inference Requests", v: "428 today" },
                        { l: "Avg Inference", v: "1.9 sec" },
                      ].map(({ l, v }) => (
                        <div key={l} className="p-3 bg-black/30 border border-white/5 rounded-xl flex justify-between items-center">
                          <p className="text-[10px] text-slate-400">{l}</p>
                          <p className="text-xs font-semibold text-white">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Database Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="w-4 h-4 text-blue-400" />
                    <h3 className="text-base font-semibold text-white">Database</h3>
                    <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium"><StatusDot status="Operational" /> Operational</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { l: "Active Connections", v: "18", color: "text-white" },
                      { l: "Idle", v: "82", color: "text-slate-400" },
                      { l: "Avg Query", v: "14 ms", color: "text-emerald-400" },
                      { l: "Slow Queries", v: "2", color: "text-amber-400" },
                      { l: "DB Size", v: "1.8 GB", color: "text-white" },
                      { l: "Last Backup", v: "03:00 AM", color: "text-cyan-400" },
                    ].map(({ l, v, color }) => (
                      <div key={l} className="bg-black/20 border border-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-slate-500 mb-1">{l}</p>
                        <p className={`text-sm font-bold ${color}`}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                      <span>Connection Pool — 18 / 100</span><span>18% used</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>
                </div>

                {/* API Performance */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-semibold text-white">API Performance</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { l: "Requests Today", v: "12,842", color: "text-white" },
                      { l: "Success Rate", v: "99.7%", color: "text-emerald-400" },
                      { l: "Avg Response", v: "142 ms", color: "text-blue-400" },
                      { l: "P95", v: "418 ms", color: "text-amber-400" },
                      { l: "P99", v: "823 ms", color: "text-amber-400" },
                      { l: "Errors", v: "38", color: "text-red-400" },
                    ].map(({ l, v, color }) => (
                      <div key={l} className="bg-black/20 border border-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-slate-500 mb-1">{l}</p>
                        <p className={`text-sm font-bold ${color}`}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Endpoint Health Table */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">API Endpoint Health</p>
                    <div className="hidden md:block overflow-x-auto rounded-xl border border-white/[0.06]">
                      <table className="w-full text-xs text-left" style={{ minWidth: "600px" }}>
                        <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                          <tr>
                            {["Endpoint", "Requests", "Avg", "P95", "Success", "Status"].map(col => (
                              <th key={col} className="px-4 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {ENDPOINTS.map(ep => (
                            <tr key={ep.path} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">{ep.path}</td>
                              <td className="px-4 py-3 text-slate-400">{ep.requests}</td>
                              <td className="px-4 py-3 text-blue-400">{ep.avg}</td>
                              <td className="px-4 py-3 text-amber-400">{ep.p95}</td>
                              <td className="px-4 py-3 text-emerald-400">{ep.success}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" />Healthy
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile endpoint cards */}
                    <div className="md:hidden space-y-3 mt-3">
                      {ENDPOINTS.map(ep => (
                        <div key={ep.path} className="bg-black/20 border border-white/5 rounded-xl p-3">
                          <p className="font-mono text-[11px] text-slate-300 mb-2">{ep.path}</p>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <span className="text-slate-400">Requests: <span className="text-white">{ep.requests}</span></span>
                            <span className="text-slate-400">Avg: <span className="text-blue-400">{ep.avg}</span></span>
                            <span className="text-slate-400">P95: <span className="text-amber-400">{ep.p95}</span></span>
                            <span className="text-slate-400">Success: <span className="text-emerald-400">{ep.success}</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Workers */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-base font-semibold text-white">Background Workers</h3>
                    <span className="ml-auto text-[10px] text-emerald-400 font-medium">4 / 4 Active</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MOCK_WORKERS.map(w => (
                      <div key={w.id} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-xl">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${w.state === "Running" ? "bg-emerald-400 animate-pulse" : w.state === "Idle" ? "bg-slate-400" : "bg-red-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">{w.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{w.role}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${w.state === "Running" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-slate-400 bg-white/[0.03] border-white/10"}`}>{w.state}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Operations */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-semibold text-white">Active Operations</h3>
                    <span className="ml-auto text-[10px] text-cyan-400">3 running</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Dataset Processing", sub: "marketing_data.xlsx", pct: 72, stage: "Extracting schema...", color: "bg-blue-500", textColor: "text-blue-400" },
                      { label: "AI Analysis", sub: "user\u2022\u2022\u2022@gmail.com", pct: 68, stage: "Executing query...", color: "bg-cyan-500", textColor: "text-cyan-400" },
                      { label: "Dataset Upload", sub: "anal\u2022\u2022\u2022@gmail.com", pct: 41, stage: "Uploading...", color: "bg-indigo-500", textColor: "text-indigo-400" },
                    ].map((op, i) => (
                      <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-slate-200">{op.label}</p>
                          <span className={`text-xs font-bold ${op.textColor}`}>{op.pct}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-2.5">{op.sub}</p>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                          <div className={`h-full rounded-full ${op.color}`} style={{ width: `${op.pct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 italic">{op.stage}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">System Alerts</h3>
                  <div className="space-y-3">
                    {MOCK_ALERTS.map(alert => (
                      <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border ${alertBg(alert.level)}`}>
                        {alertIcon(alert.level)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-200">{alert.message}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{alert.ago}</p>
                        </div>
                        <div className="relative flex-shrink-0">
                          <button onClick={() => setMenuOpen(menuOpen === alert.id ? null : alert.id)} className="text-slate-500 hover:text-slate-300 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                          {menuOpen === alert.id && (
                            <div className="absolute right-0 top-full mt-1 w-28 bg-[#0B1120] border border-white/10 rounded-lg shadow-xl z-10">
                              <button onClick={() => setMenuOpen(null)} className="w-full px-3 py-2 text-[10px] text-slate-300 hover:bg-white/[0.05] text-left">Dismiss</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incidents */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Incidents</h3>
                  <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-300">No active incidents.</p>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Historical</p>
                  <div className="space-y-3">
                    {MOCK_INCIDENTS.map(inc => (
                      <div key={inc.id} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-xl">
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium flex-shrink-0">Resolved</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{inc.title}</p>
                          <p className="text-[10px] text-slate-500">{inc.date} · Duration: {inc.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (1/3) */}
              <div className="space-y-6">

                {/* CPU Chart */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-1">CPU Utilization</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div><p className="text-[10px] text-slate-500">Average</p><p className="text-sm font-bold text-white">{cpuVal}%</p></div>
                    <div><p className="text-[10px] text-slate-500">Peak</p><p className="text-sm font-bold text-amber-400">81%</p></div>
                    <div><p className="text-[10px] text-slate-500">Current</p><p className="text-sm font-bold text-emerald-400">39%</p></div>
                  </div>
                  <div className="h-28 flex items-end justify-between gap-1">
                    {[45, 62, 78, 55, 70, 38, 42].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                        <div className="w-full flex justify-center items-end h-[88px]">
                          <div className="w-full max-w-[24px] rounded-t-sm" style={{ height: `${v}%`, background: v >= 75 ? "#f59e0b" : "#3b82f6", opacity: 0.7 }} />
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase">{["M","T","W","T","F","S","S"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Chart */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Memory Usage</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">RAM: {(ramVal * 0.16).toFixed(1)} GB / 16 GB</span>
                      <span className="text-amber-400 font-medium">{ramVal}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full flex overflow-hidden bg-white/5">
                      <div className="h-full bg-amber-400" style={{ width: `${ramVal}%` }} />
                      <div className="h-full bg-slate-600" style={{ width: "8%" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Used</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Cached</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10" /> Available</span>
                    </div>
                  </div>
                  <div className="h-20 flex items-end justify-between gap-1">
                    {[60, 65, 72, 68, 71, 62, 68].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                        <div className="w-full flex justify-center items-end h-[60px]">
                          <div className="w-full max-w-[22px] bg-amber-400/60 rounded-t-sm" style={{ height: `${v}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase">{["M","T","W","T","F","S","S"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Response Chart */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">API Response Trend</h3>
                  <div className="h-24 flex items-end justify-between gap-1">
                    {[120, 180, 145, 160, 135, 90, 142].map((v, i) => {
                      const pct = Math.round((v / 250) * 100);
                      const color = v > 200 ? "#ef4444" : v > 150 ? "#f59e0b" : "#34d399";
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                          <div className="w-full flex justify-center items-end h-[72px]">
                            <div className="w-full max-w-[22px] rounded-t-sm" style={{ height: `${pct}%`, background: color, opacity: 0.7 }} />
                          </div>
                          <span className="text-[9px] text-slate-500 uppercase">{["M","T","W","T","F","S","S"][i]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-2">Average response time (ms)</p>
                </div>

                {/* Service Uptime */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Service Uptime</h3>
                  <div className="space-y-4">
                    {[
                      { name: "API", val: 99.99 },
                      { name: "Database", val: 99.98 },
                      { name: "Analysis Engine", val: 99.97 },
                      { name: "Storage", val: 99.99 },
                      { name: "Authentication", val: 99.99 },
                    ].map(s => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{s.name}</span>
                          <span className="text-emerald-400 font-bold">{s.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${s.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Time Distribution */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Response Time Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { bucket: "< 100 ms", pct: "42%", count: "5,393", w: "42%" },
                      { bucket: "100–250 ms", pct: "31%", count: "3,981", w: "31%" },
                      { bucket: "250–500 ms", pct: "18%", count: "2,312", w: "18%" },
                      { bucket: "500 ms–1 sec", pct: "7%", count: "899", w: "7%" },
                      { bucket: "> 1 sec", pct: "2%", count: "257", w: "2%" },
                    ].map(b => (
                      <div key={b.bucket}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{b.bucket}</span>
                          <span className="text-slate-400">{b.count} <span className="text-white font-semibold ml-1">{b.pct}</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400/70 rounded-full" style={{ width: b.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Processing Queues</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Dataset Queue", depth: 12, rate: "8/min", wait: "1.5 min", color: "text-blue-400", bar: "bg-blue-400" },
                      { name: "Analysis Queue", depth: 7, rate: "12/min", wait: "0.6 min", color: "text-cyan-400", bar: "bg-cyan-400" },
                      { name: "Export Queue", depth: 2, rate: "4/min", wait: "0.5 min", color: "text-indigo-400", bar: "bg-indigo-400" },
                      { name: "Failed Queue", depth: 0, rate: "—", wait: "—", color: "text-emerald-400", bar: "bg-emerald-400" },
                    ].map(q => (
                      <div key={q.name} className="p-3 bg-black/20 border border-white/5 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-slate-300">{q.name}</span>
                          <span className={`text-sm font-bold ${q.color}`}>{q.depth}</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                          <span>Rate: {q.rate}</span><span>Avg wait: {q.wait}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Event Timeline */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-semibold text-white">System Activity</h3>
                  </div>
                  <div className="relative border-l border-white/[0.1] ml-3 space-y-5 pb-2">
                    {TIMELINE_EVENTS.map((ev, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border border-[#0B1120] ${ev.bg}`}>
                          <ev.icon className={`w-3 h-3 ${ev.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-medium text-slate-200">{ev.label}</p>
                            <span className="text-[10px] text-slate-500">{ev.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Degraded State Example */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <p className="text-sm font-semibold text-amber-400">Example: Service Degraded</p>
                  </div>
                  <p className="text-xs text-amber-200/70 mb-4">The service is responding slower than expected.</p>
                  <div className="space-y-2 mb-4">
                    {[
                      { l: "Current Latency", v: "842 ms" },
                      { l: "Threshold", v: "500 ms" },
                      { l: "Last Checked", v: "09:42 AM" },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex justify-between text-xs">
                        <span className="text-slate-400">{l}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium rounded-xl transition-all">View Details</button>
                </div>

              </div>
            </div>

            {/* TrendingUp stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Requests Today", val: "12,842", icon: TrendingUp, color: "text-blue-400" },
                { label: "Analyses Today", val: "428", icon: BarChart3, color: "text-cyan-400" },
                { label: "Datasets Processed", val: "126", icon: Database, color: "text-indigo-400" },
                { label: "Avg AI Inference", val: "1.9 sec", icon: Zap, color: "text-amber-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/5 ${stat.color} flex-shrink-0`}><stat.icon className="w-5 h-5" /></div>
                  <div><p className="text-xs text-slate-400">{stat.label}</p><p className="text-lg font-bold text-white">{stat.val}</p></div>
                </div>
              ))}
            </div>

            {/* Security Banner */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-cyan-400" /></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">System Monitoring</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">Infrastructure and service health information is available only to authorized administrators.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["RBAC Protected", "Session Authenticated", "Audit Logged", "Operational Monitoring"].map(badge => (
                    <span key={badge} className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-medium rounded-full uppercase tracking-wider">{badge}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Service Details Modal ── */}
      <Modal open={!!serviceModal} onClose={() => setServiceModal(null)} title="Service Details" maxWidth="max-w-lg">
        {serviceModal && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <serviceModal.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{serviceModal.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <StatusDot status={serviceModal.status} />
                  <span className="text-sm text-emerald-400 font-medium">{serviceModal.status}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Uptime", v: serviceModal.uptime },
                { l: serviceModal.metricLabel, v: serviceModal.metric },
                { l: "Requests Today", v: "12,842" },
                { l: "Average Response", v: serviceModal.responseMs ? `${serviceModal.responseMs} ms` : "—" },
                { l: "P95 Response", v: "418 ms" },
                { l: "Errors", v: "38" },
                { l: "Last Health Check", v: lastUpdated },
              ].map(({ l, v }) => (
                <div key={l} className="bg-black/20 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 mb-1">{l}</p>
                  <p className="text-xs font-semibold text-white">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Recent Events</p>
              <div className="space-y-2">
                {TIMELINE_EVENTS.slice(0, 3).map((ev, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-black/20 rounded-lg">
                    <p className="text-xs text-slate-300">{ev.label}</p>
                    <span className="text-[10px] text-slate-500">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setServiceModal(null)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── GPU Details Modal ── */}
      <Modal open={gpuModal} onClose={() => setGpuModal(false)} title="GPU Details" maxWidth="max-w-md">
        <div className="space-y-5">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">GPU</p>
            <p className="text-base font-bold text-white">NVIDIA GeForce RTX 4050</p>
            <p className="text-xs text-slate-400">Laptop GPU</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "VRAM", v: "4.5 / 6 GB" },
              { l: "Utilization", v: "82%" },
              { l: "Temperature", v: "67°C" },
              { l: "VRAM Used %", v: `${gpuVal}%` },
              { l: "Primary Process", v: "Qwen2.5-7B" },
              { l: "Inference Workers", v: "2" },
              { l: "Status", v: "Healthy" },
            ].map(({ l, v }) => (
              <div key={l} className="bg-black/20 border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 mb-1">{l}</p>
                <p className="text-xs font-semibold text-white">{v}</p>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <button onClick={() => setGpuModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
          </div>
        </div>
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
