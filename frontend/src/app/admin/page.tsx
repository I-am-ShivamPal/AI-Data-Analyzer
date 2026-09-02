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
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Smartphone,
  Laptop,
  Monitor,
  Apple,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock3
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
      {/* Logo */}
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

      {/* Nav */}
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

      {/* User card + logout */}
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

function AdminTopBar({ pageTitle, setMobileOpen }: { pageTitle: string; setMobileOpen: (v: boolean) => void }) {
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
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Platform overview and system activity.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-slate-500 w-48">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs">Search resources...</span>
        </div>

        {/* System Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All Systems Operational
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </button>

        {/* User */}
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
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Subtle Admin Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="dashboard" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar pageTitle="Admin Dashboard" setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            
            {/* System Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Platform Overview</h2>
                <p className="text-slate-400 text-sm mt-1.5">Monitor users, datasets, analyses and system activity.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Last updated: <span className="text-slate-300">Just now</span></span>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-sm text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: "TOTAL USERS", value: "1,248", change: "+8.4%", pos: true, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "ACTIVE SESSIONS", value: "86", change: "+12 today", pos: true, icon: MonitorSmartphone, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "DATASETS", value: "3,842", change: "+124 this month", pos: true, icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { label: "ANALYSES", value: "18,492", change: "+1,284 this month", pos: true, icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "STORAGE USED", value: "428 GB", change: "of 1 TB", pos: null, icon: HardDrive, color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "FAILED ANALYSES", value: "23", change: "-18%", pos: true, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.pos === true && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                    {stat.pos === false && <TrendingDown className="w-3 h-3 text-red-400" />}
                    <span className={stat.pos === true ? "text-emerald-400" : stat.pos === false ? "text-red-400" : "text-slate-500"}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (2/3 width on LG) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* User Activity Chart (Mock CSS/SVG) */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-white">User Activity</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Sessions and analysis activity over the last 7 days.</p>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Active Sessions</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Analyses</div>
                    </div>
                  </div>
                  
                  {/* CSS Mock Chart */}
                  <div className="h-48 w-full flex items-end justify-between gap-2 px-2">
                    {[
                      { day: "Mon", s: 40, a: 30 },
                      { day: "Tue", s: 60, a: 50 },
                      { day: "Wed", s: 80, a: 90 },
                      { day: "Thu", s: 50, a: 45 },
                      { day: "Fri", s: 75, a: 60 },
                      { day: "Sat", s: 30, a: 20 },
                      { day: "Sun", s: 45, a: 35 },
                    ].map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group">
                        {/* Bars container */}
                        <div className="w-full flex justify-center gap-1 items-end h-[140px] relative">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0B1120] border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-10 transition-opacity pointer-events-none shadow-xl">
                            {d.s} Sessions / {d.a} Analyses
                          </div>
                          <div className="w-1/3 max-w-[12px] bg-cyan-400/80 rounded-t-sm hover:bg-cyan-400 transition-colors" style={{ height: `${d.s}%` }} />
                          <div className="w-1/3 max-w-[12px] bg-indigo-500/80 rounded-t-sm hover:bg-indigo-500 transition-colors" style={{ height: `${d.a}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{d.day}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent User Activity */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                    <h3 className="text-base font-semibold text-white">Recent User Activity</h3>
                    <button className="text-xs text-cyan-400 font-medium hover:text-cyan-300">View all logs</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                          {["User", "Action", "Resource", "Timestamp", "Status"].map((h) => (
                            <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {[
                          { user: "user@example.com", action: "Uploaded dataset", resource: "sales.csv", time: "2 min ago", status: "Success", ok: true },
                          { user: "analyst@example.com", action: "Completed analysis", resource: "customer_data.csv", time: "5 min ago", status: "Success", ok: true },
                          { user: "user2@example.com", action: "Login", resource: "Session", time: "8 min ago", status: "Success", ok: true },
                          { user: "demo@example.com", action: "Analysis failed", resource: "sales.csv", time: "12 min ago", status: "Failed", ok: false },
                          { user: "admin@example.com", action: "Viewed dashboard", resource: "Admin UI", time: "15 min ago", status: "Success", ok: true },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5 text-slate-300 font-medium">{row.user}</td>
                            <td className="px-5 py-3.5 text-slate-400">{row.action}</td>
                            <td className="px-5 py-3.5 text-slate-500">{row.resource}</td>
                            <td className="px-5 py-3.5 text-slate-500">{row.time}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${row.ok ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {row.ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Analysis Activity */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Analysis Activity</h3>
                    </div>
                    
                    <div className="mb-5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Total Analyses</p>
                      <p className="text-3xl font-bold text-white">18,492</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 font-medium">Successful</span>
                        <span className="text-white">18,210</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-400 font-medium">Failed</span>
                        <span className="text-white">282</span>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Success Rate</span>
                          <span className="text-white font-medium">98.5%</span>
                        </div>
                        <div className="w-full h-1.5 bg-red-500/20 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: '98.5%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dataset Overview */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Database className="w-4 h-4 text-indigo-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Dataset Overview</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Total</p>
                        <p className="text-xl font-bold text-white">3,842</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Ready</p>
                        <p className="text-xl font-bold text-indigo-400">3,721</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Processing</p>
                        <p className="text-xl font-bold text-blue-400">84</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Failed</p>
                        <p className="text-xl font-bold text-red-400">37</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Storage Used</span>
                        <span className="text-white font-medium">428 GB / 1 TB</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: '42.8%' }} />
                      </div>
                      <Link href="/admin/datasets" className="w-full flex items-center justify-center py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white text-xs font-medium rounded-lg transition-all">
                        View Datasets
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (1/3 width on LG) */}
              <div className="space-y-6">
                
                {/* System Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">System Health</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "API", stat: "42 ms", ok: true },
                      { name: "Database", stat: "18 ms", ok: true },
                      { name: "Analysis Engine", stat: "1.8 s", ok: true },
                      { name: "Storage", stat: "Healthy", ok: true },
                    ].map((svc) => (
                      <div key={svc.name} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${svc.ok ? 'bg-emerald-400' : 'bg-red-400'} shadow-[0_0_8px_rgba(52,211,153,0.5)]`} />
                          <span className="text-sm text-slate-200">{svc.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Operational</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{svc.stat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Sessions Preview */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white">Active Sessions</h3>
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full">
                      86 Active
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {[
                      { u: "user•••@gmail.com", d: "Windows Laptop", b: "Chrome", t: "Just now" },
                      { u: "anal•••@gmail.com", d: "iPhone", b: "Safari", t: "2 min ago" },
                      { u: "demo•••@gmail.com", d: "MacBook", b: "Chrome", t: "4 min ago" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start justify-between pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{s.u}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                            <Monitor className="w-3 h-3" /> {s.d} · {s.b}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-emerald-400 flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active</span>
                          <span className="text-[10px] text-slate-600 mt-1 block">{s.t}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/admin/sessions" className="w-full flex items-center justify-center py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white text-xs font-medium rounded-lg transition-all">
                    View All Sessions
                  </Link>
                </div>

                {/* Device Distribution */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Device Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Windows Laptop", pct: "42%", w: "42%", icon: Laptop },
                      { name: "Android", pct: "27%", w: "27%", icon: Smartphone },
                      { name: "iPhone / iOS", pct: "18%", w: "18%", icon: Apple },
                      { name: "MacBook", pct: "10%", w: "10%", icon: Monitor },
                      { name: "Other", pct: "3%", w: "3%", icon: MonitorSmartphone },
                    ].map((d) => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 flex items-center gap-1.5"><d.icon className="w-3.5 h-3.5 text-slate-500"/> {d.name}</span>
                          <span className="text-white font-medium">{d.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: d.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Events */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Security & Access Events</h3>
                  <div className="space-y-4">
                    {[
                      { e: "Successful admin login", t: "2 minutes ago", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", badge: "Info" },
                      { e: "New user session", t: "5 minutes ago", icon: User, color: "text-blue-400", bg: "bg-blue-500/10", badge: "Info" },
                      { e: "Multiple failed login attempts", t: "14 minutes ago", icon: Lock, color: "text-red-400", bg: "bg-red-500/10", badge: "Critical" },
                      { e: "Dataset access denied", t: "21 minutes ago", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", badge: "Warning" },
                    ].map((ev, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`p-1.5 rounded-lg border border-white/5 h-max mt-0.5 ${ev.bg}`}>
                          <ev.icon className={`w-3.5 h-3.5 ${ev.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 leading-snug">{ev.e}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock3 className="w-3 h-3" /> {ev.t}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${ev.badge === 'Info' ? 'bg-blue-500/10 text-blue-400' : ev.badge === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                              {ev.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/admin/users" className="py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-medium text-slate-300 text-center transition-all">Manage Users</Link>
                    <Link href="/admin/sessions" className="py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-medium text-slate-300 text-center transition-all">View Sessions</Link>
                    <Link href="/admin/activity" className="py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-medium text-slate-300 text-center transition-all">Review Activity</Link>
                    <Link href="/admin/system" className="py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-medium text-slate-300 text-center transition-all">System Health</Link>
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
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Administrative Environment</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  Administrative controls are restricted to authorized administrator accounts. All actions performed in this environment are tracked and logged for security auditing.
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
        </div>
    </ProtectedRoute>
  );
}
