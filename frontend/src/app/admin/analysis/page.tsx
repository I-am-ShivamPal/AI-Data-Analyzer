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
  Loader2,
  Flag,
  Clock,
  Zap,
  TrendingUp,
  SearchX,
  BadgeCheck
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

type AnalysisStatus = "Verified" | "Running" | "Failed";
type AnalysisOperation = "Total" | "Group" | "Ranking" | "Filtered" | "Multi-dimensional";

interface AnalysisRecord {
  id: string;
  question: string;
  user: string;
  dataset: string;
  datasetId: string;
  operation: AnalysisOperation;
  metric: string;
  executionTime: string;
  status: AnalysisStatus;
  createdAt: string;
  result?: string;
  filters?: string;
  groupBy?: string;
}

const MOCK_ANALYSES: AnalysisRecord[] = [
  { id: "anlys_a1b2", question: "What was the total revenue in March?", user: "shivam\u2022\u2022\u2022@gmail.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Total", metric: "Revenue", executionTime: "2.1 sec", status: "Verified", createdAt: "29 Aug 2026", result: "$1,695,616.29", filters: "date: March", groupBy: "\u2014" },
  { id: "anlys_c3d4", question: "Which product generated the highest revenue?", user: "user\u2022\u2022\u2022@gmail.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Ranking", metric: "Revenue", executionTime: "3.4 sec", status: "Verified", createdAt: "29 Aug 2026", result: "Widget Pro — $284,120", filters: "\u2014", groupBy: "Product" },
  { id: "anlys_e5f6", question: "Show revenue by product and location", user: "anal\u2022\u2022\u2022@gmail.com", dataset: "customer_analysis.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Group", metric: "Revenue", executionTime: "5.8 sec", status: "Verified", createdAt: "28 Aug 2026", result: "12 groups", filters: "\u2014", groupBy: "Product, Location" },
  { id: "anlys_g7h8", question: "Show revenue by product, location and channel in March in Virginia.", user: "shivam\u2022\u2022\u2022@gmail.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Multi-dimensional", metric: "Revenue", executionTime: "8.2 sec", status: "Verified", createdAt: "29 Aug 2026", result: "48 combinations", filters: "location: Virginia, date: March", groupBy: "Product, Location, Channel" },
  { id: "anlys_i9j0", question: "Total number of customers in Q3", user: "demo\u2022\u2022\u2022@gmail.com", dataset: "customer_analysis.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Total", metric: "Customers", executionTime: "1.8 sec", status: "Verified", createdAt: "28 Aug 2026", result: "8,241", filters: "date: Q3", groupBy: "\u2014" },
  { id: "anlys_k1l2", question: "Top 10 orders by revenue", user: "hr\u2022\u2022\u2022@company.com", dataset: "q3_financials.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Ranking", metric: "Revenue", executionTime: "4.1 sec", status: "Verified", createdAt: "27 Aug 2026", result: "10 rows", filters: "\u2014", groupBy: "Order" },
  { id: "anlys_m3n4", question: "Revenue grouped by channel", user: "sales\u2022\u2022\u2022@corp.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Group", metric: "Revenue", executionTime: "3.2 sec", status: "Verified", createdAt: "27 Aug 2026", result: "5 channels", filters: "\u2014", groupBy: "Channel" },
  { id: "anlys_o5p6", question: "Show revenue by product, location and channel", user: "user\u2022\u2022\u2022@gmail.com", dataset: "large_dataset.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Multi-dimensional", metric: "Revenue", executionTime: "\u2014", status: "Running", createdAt: "29 Aug 2026", result: "\u2014", filters: "\u2014", groupBy: "Product, Location, Channel" },
  { id: "anlys_q7r8", question: "Show revenue by branch", user: "ceo\u2022\u2022\u2022@corp.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Group", metric: "Revenue", executionTime: "\u2014", status: "Failed", createdAt: "29 Aug 2026", result: "\u2014", filters: "\u2014", groupBy: "Branch" },
  { id: "anlys_s9t0", question: "Revenue in December", user: "dev\u2022\u2022\u2022@startup.io", dataset: "q3_financials.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Filtered", metric: "Revenue", executionTime: "\u2014", status: "Failed", createdAt: "26 Aug 2026", result: "\u2014", filters: "date: December", groupBy: "\u2014" },
  { id: "anlys_u1v2", question: "Total quantity sold per product", user: "support\u2022\u2022\u2022@app.com", dataset: "sales.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Group", metric: "Quantity", executionTime: "2.9 sec", status: "Verified", createdAt: "26 Aug 2026", result: "24 products", filters: "\u2014", groupBy: "Product" },
  { id: "anlys_w3x4", question: "Average order value by customer segment", user: "shivam\u2022\u2022\u2022@gmail.com", dataset: "customer_analysis.csv", datasetId: "ds_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", operation: "Group", metric: "Orders", executionTime: "6.4 sec", status: "Verified", createdAt: "25 Aug 2026", result: "4 segments", filters: "\u2014", groupBy: "Customer Segment" },
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
        <div className="p-1.5 bg-cyan-500/15 rounded-lg border border-cyan-500/30 flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>
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
// Top Bar
// ────────────────────────────────────────────────────────────────────────────

function AdminTopBar({ pageTitle, subtitle, setMobileOpen }: { pageTitle: string; subtitle: string; setMobileOpen: (v: boolean) => void }) {
  const [userOpen, setUserOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white leading-none">{pageTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />System Operational
        </div>
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
      <div className={`relative w-full ${maxWidth} bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
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
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminAnalysisPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [operationFilter, setOperationFilter] = useState("All");
  const [datasetFilter, setDatasetFilter] = useState("All Datasets");
  const [userFilter, setUserFilter] = useState("All Users");
  const [dateFilter, setDateFilter] = useState("Last 7 Days");
  const [sortOrder, setSortOrder] = useState("Newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisRecord | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewReason, setReviewReason] = useState("Unexpected result");
  const [reviewNotes, setReviewNotes] = useState("");

  // Menus
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const uniqueDatasets = Array.from(new Set(MOCK_ANALYSES.map(a => a.dataset)));
  const uniqueUsers = Array.from(new Set(MOCK_ANALYSES.map(a => a.user)));

  const filtered = useMemo(() => {
    return MOCK_ANALYSES.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = a.question.toLowerCase().includes(q) || a.user.toLowerCase().includes(q) || a.dataset.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchOp = operationFilter === "All" || a.operation === operationFilter;
      const matchDs = datasetFilter === "All Datasets" || a.dataset === datasetFilter;
      const matchUser = userFilter === "All Users" || a.user === userFilter;
      return matchSearch && matchStatus && matchOp && matchDs && matchUser;
    });
  }, [search, statusFilter, operationFilter, datasetFilter, userFilter]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const handleClearFilters = () => {
    setSearch(""); setStatusFilter("All"); setOperationFilter("All");
    setDatasetFilter("All Datasets"); setUserFilter("All Users");
    setDateFilter("Last 7 Days"); setSortOrder("Newest"); setCurrentPage(1);
  };

  const openModal = (a: AnalysisRecord, type: "details" | "review") => {
    setActiveAnalysis(a);
    setActionMenuOpen(null);
    if (type === "details") setDetailsModal(true);
    if (type === "review") { setReviewReason("Unexpected result"); setReviewNotes(""); setReviewModal(true); }
  };

  const statusBadge = (status: AnalysisStatus) => {
    const map = {
      Verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${map[status]}`}>
        {status === "Verified" && <CheckCircle2 className="w-3 h-3" />}
        {status === "Running" && <Loader2 className="w-3 h-3 animate-spin" />}
        {status === "Failed" && <XCircle className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="analysis" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar
          pageTitle="Analysis"
          subtitle="Monitor analytical activity and execution performance across the platform."
          setMobileOpen={setMobileOpen}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: "TOTAL ANALYSES", value: "18,492", desc: "All platform analyses", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "SUCCESSFUL", value: "17,846", desc: "96.5%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "FAILED", value: "646", desc: "3.5%", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
                { label: "RUNNING", value: "12", desc: "Currently executing", icon: Loader2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "AVG PROCESSING", value: "4.8 sec", desc: "Average execution time", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "TODAY", value: "428", desc: "Analyses today", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.03] transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
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

              {/* ── Left Column (2/3) ── */}
              <div className="xl:col-span-2 space-y-6">

                {/* Failed & Running Alert Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Failed Analyses */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <h4 className="text-sm font-semibold text-red-400">Failed Analyses</h4>
                    </div>
                    <div className="space-y-3 mb-4">
                      {[
                        { q: "Show revenue by branch", ds: "sales.csv", r: "Requested dimension \u2018branch\u2019 is unavailable.", t: "29 Aug 2026 \u00b7 09:22 AM" },
                        { q: "Revenue in December", ds: "q3_financials.csv", r: "No matching data in requested date range.", t: "26 Aug 2026 \u00b7 14:10 PM" },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs font-medium text-slate-200 truncate">&quot;{item.q}&quot;</p>
                          <p className="text-[10px] text-slate-500 mt-1">Dataset: {item.ds}</p>
                          <p className="text-[10px] text-red-300/80 mt-1">Reason: &quot;{item.r}&quot;</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-500">{item.t}</span>
                            <button className="text-[10px] text-red-400 hover:text-red-300 font-medium transition-colors">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Currently Running */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <h4 className="text-sm font-semibold text-blue-400">Currently Running</h4>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-medium text-slate-200">user&bull;&bull;&bull;@gmail.com</p>
                      <p className="text-[10px] text-slate-500">Dataset: large_dataset.csv</p>
                      <p className="text-[10px] text-slate-300 italic">&quot;Show revenue by product, location and channel&quot;</p>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-slate-400">Executing deterministic query...</span>
                          <span className="text-blue-400 font-medium">68%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "68%" }} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {["Parsing", "Validating", "Executing", "Building Context", "Generating Answer"].map((stage, i) => (
                          <span key={stage} className={`text-[9px] px-2 py-0.5 rounded font-medium border ${i < 2 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : i === 2 ? "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse" : "bg-white/[0.03] text-slate-500 border-white/5"}`}>{stage}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search questions, users or datasets..."
                      className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs font-medium text-slate-400">Filters:</span></div>
                    {[
                      { val: statusFilter, set: setStatusFilter, opts: ["All", "Verified", "Running", "Failed"], label: "Status" },
                      { val: operationFilter, set: setOperationFilter, opts: ["All", "Total", "Group", "Ranking", "Filtered", "Multi-dimensional"], label: "Operation" },
                      { val: datasetFilter, set: setDatasetFilter, opts: ["All Datasets", ...uniqueDatasets], label: "Dataset" },
                      { val: userFilter, set: setUserFilter, opts: ["All Users", ...uniqueUsers], label: "User" },
                      { val: dateFilter, set: setDateFilter, opts: ["Today", "Last 7 Days", "Last 30 Days"], label: "Date" },
                      { val: sortOrder, set: setSortOrder, opts: ["Newest", "Oldest", "Fastest", "Slowest"], label: "Sort" },
                    ].map(({ val, set, opts, label }) => (
                      <select key={label} value={val} onChange={e => set(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                        {opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ))}
                    {(search || statusFilter !== "All" || operationFilter !== "All" || datasetFilter !== "All Datasets" || userFilter !== "All Users") && (
                      <button onClick={handleClearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 ml-auto">Clear Filters</button>
                    )}
                  </div>
                </div>

                {/* Analysis Table */}
                {filtered.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                      <SearchX className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">No analyses found</h3>
                    <p className="text-sm text-slate-400 mb-6">No analyses match the current filters.</p>
                    <button onClick={handleClearFilters} className="px-5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">Clear Filters</button>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm text-left" style={{ minWidth: "1000px" }}>
                        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                          <tr>
                            {["Question", "User", "Dataset", "Operation", "Metric", "Time", "Status", "Created", "Actions"].map(col => (
                              <th key={col} className="px-4 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paginated.map(a => (
                            <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-3.5 max-w-[220px]">
                                <p className="text-xs text-slate-200 truncate" title={a.question}>&quot;{a.question}&quot;</p>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{a.user}</td>
                              <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{a.dataset}</td>
                              <td className="px-4 py-3.5">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-slate-300 font-medium">{a.operation}</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-slate-400">{a.metric}</td>
                              <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{a.executionTime}</td>
                              <td className="px-4 py-3.5">{statusBadge(a.status)}</td>
                              <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{a.createdAt}</td>
                              <td className="px-4 py-3.5 text-right relative">
                                <button onClick={() => setActionMenuOpen(actionMenuOpen === a.id ? null : a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {actionMenuOpen === a.id && (
                                  <div className="absolute right-8 top-10 mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                    <button onClick={() => openModal(a, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Details</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View User</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Dataset</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View History</button>
                                    <div className="border-t border-white/[0.06]" />
                                    <button onClick={() => openModal(a, "review")} className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 text-left">Mark for Review</button>
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
                      {paginated.map(a => (
                        <div key={a.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-slate-200 leading-snug">&quot;{a.question}&quot;</p>
                            <div className="relative flex-shrink-0">
                              <button onClick={() => setActionMenuOpen(actionMenuOpen === a.id ? null : a.id)} className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"><MoreVertical className="w-4 h-4" /></button>
                              {actionMenuOpen === a.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                                  <button onClick={() => openModal(a, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Details</button>
                                  <button onClick={() => openModal(a, "review")} className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 text-left">Mark for Review</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                            <div><span className="text-slate-400">User:</span> {a.user}</div>
                            <div><span className="text-slate-400">Dataset:</span> {a.dataset}</div>
                            <div><span className="text-slate-400">Operation:</span> {a.operation}</div>
                            <div><span className="text-slate-400">Metric:</span> {a.metric}</div>
                            <div><span className="text-slate-400">Time:</span> {a.executionTime}</div>
                            <div><span className="text-slate-400">Created:</span> {a.createdAt}</div>
                          </div>
                          <div>{statusBadge(a.status)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-500 hidden sm:block">Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of {filtered.length} analyses</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-50 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-all">Previous</button>
                        <div className="hidden sm:flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium">1</button>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">2</button>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">3</button>
                          <span className="text-slate-500 text-xs px-1">...</span>
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">1850</button>
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-50 border border-white/10 rounded-lg text-xs font-medium text-slate-300 transition-all">Next</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right Column (1/3) ── */}
              <div className="space-y-6">

                {/* Analysis Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-3">Analysis Health</h3>
                  <div className="h-2.5 rounded-full flex overflow-hidden mb-5">
                    <div className="h-full bg-emerald-400" style={{ width: "96.5%" }} />
                    <div className="h-full bg-red-400" style={{ width: "3.5%" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div><p className="text-[10px] text-slate-500 uppercase">Successful</p><p className="text-sm font-semibold text-emerald-400">96.5%</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase">Failed</p><p className="text-sm font-semibold text-red-400">3.5%</p></div>
                  </div>
                  <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                    {[
                      { l: "Average execution", v: "4.8 sec" },
                      { l: "P95 execution", v: "11.2 sec" },
                      { l: "Fastest", v: "0.42 sec" },
                      { l: "Slowest", v: "38.7 sec" },
                      { l: "Running now", v: "12" },
                    ].map(({ l, v }) => (
                      <div key={l} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{l}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Volume Trend */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-white">Analysis Activity</h3>
                    <span className="text-xs font-semibold text-cyan-400">18.4K</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">analyses this week</p>
                  <div className="h-28 flex items-end justify-between gap-1">
                    {[
                      { day: "Mon", total: 65, ok: 62, fail: 3 },
                      { day: "Tue", total: 80, ok: 77, fail: 3 },
                      { day: "Wed", total: 95, ok: 91, fail: 4 },
                      { day: "Thu", total: 70, ok: 67, fail: 3 },
                      { day: "Fri", total: 85, ok: 82, fail: 3 },
                      { day: "Sat", total: 40, ok: 38, fail: 2 },
                      { day: "Sun", total: 30, ok: 29, fail: 1 },
                    ].map(d => (
                      <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                        <div className="w-full flex justify-center items-end h-[88px] relative">
                          <div className="w-1/2 max-w-[18px] bg-slate-700/50 rounded-t-sm absolute bottom-0" style={{ height: `${d.total}%` }} />
                          <div className="w-1/2 max-w-[18px] bg-emerald-500 rounded-t-sm absolute bottom-0 z-10" style={{ height: `${d.ok}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase">{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-3 text-[10px]">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-700" /> Total</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Successful</span>
                  </div>
                </div>

                {/* Analysis Operations */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Analysis Operations</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Total", pct: "32%", w: "32%" },
                      { name: "Group", pct: "28%", w: "28%" },
                      { name: "Top / Ranking", pct: "21%", w: "21%" },
                      { name: "Filtered", pct: "12%", w: "12%" },
                      { name: "Multi-dimensional", pct: "7%", w: "7%" },
                    ].map(op => (
                      <div key={op.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{op.name}</span>
                          <span className="text-white font-medium">{op.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full opacity-80" style={{ width: op.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequently Analyzed Metrics */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Frequently Analyzed Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Revenue", pct: "42%", w: "42%" },
                      { name: "Quantity", pct: "21%", w: "21%" },
                      { name: "Orders", pct: "16%", w: "16%" },
                      { name: "Customers", pct: "11%", w: "11%" },
                      { name: "Other", pct: "10%", w: "10%" },
                    ].map(m => (
                      <div key={m.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{m.name}</span>
                          <span className="text-white font-medium">{m.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-400 rounded-full opacity-80" style={{ width: m.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Distribution */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Execution Time Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { bucket: "< 1 sec", pct: "18%", count: "3,328", w: "18%" },
                      { bucket: "1–3 sec", pct: "39%", count: "7,212", w: "39%" },
                      { bucket: "3–5 sec", pct: "28%", count: "5,177", w: "28%" },
                      { bucket: "5–10 sec", pct: "12%", count: "2,219", w: "12%" },
                      { bucket: "10+ sec", pct: "3%", count: "556", w: "3%" },
                    ].map(b => (
                      <div key={b.bucket}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 font-medium">{b.bucket}</span>
                          <span className="text-slate-400">{b.count} <span className="text-white font-medium ml-1">{b.pct}</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full opacity-80" style={{ width: b.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-5">Recent Activity</h3>
                  <div className="relative border-l border-white/[0.1] ml-3 space-y-5 pb-2">
                    {[
                      { t: "09:42", ev: "Analysis completed", u: "shivam\u2022\u2022\u2022@gmail.com", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/20" },
                      { t: "09:38", ev: "Analysis started", u: "user\u2022\u2022\u2022@gmail.com", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/20" },
                      { t: "09:31", ev: "Analysis failed", u: "anal\u2022\u2022\u2022@gmail.com", icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
                      { t: "09:24", ev: "Multi-dim analysis done", u: "shivam\u2022\u2022\u2022@gmail.com", icon: BarChart3, color: "text-cyan-400", bg: "bg-cyan-500/20" },
                    ].map((item, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border border-[#0B1120] ${item.bg}`}>
                          <item.icon className={`w-3 h-3 ${item.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-medium text-slate-200">{item.ev}</p>
                            <span className="text-[10px] text-slate-500">{item.t}</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{item.u}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Active Users */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Most Active Users</h3>
                  <div className="space-y-4">
                    {[
                      { u: "shivam\u2022\u2022\u2022@gmail.com", count: 428, rate: "98.1%", avg: "3.8 sec" },
                      { u: "anal\u2022\u2022\u2022@gmail.com", count: 316, rate: "95.8%", avg: "5.1 sec" },
                      { u: "user\u2022\u2022\u2022@gmail.com", count: 284, rate: "97.2%", avg: "4.4 sec" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-300">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{item.u}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            <span>{item.count} analyses</span>
                            <span className="text-emerald-400">{item.rate}</span>
                            <span>{item.avg}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Analyzed Datasets */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Most Analyzed Datasets</h3>
                  <div className="space-y-4">
                    {[
                      { ds: "sales.csv", owner: "shivam\u2022\u2022\u2022@gmail.com", count: 428, rows: "11,000", last: "2 min ago" },
                      { ds: "customer_analysis.csv", owner: "anal\u2022\u2022\u2022@gmail.com", count: 316, rows: "82,450", last: "14 min ago" },
                      { ds: "q3_financials.csv", owner: "admin\u2022\u2022\u2022@company.com", count: 184, rows: "450,000", last: "1 hr ago" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-2 bg-white/[0.05] rounded-lg text-slate-400 flex-shrink-0">
                          <Database className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{item.ds}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            <span>{item.owner}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>{item.count} analyses</span>
                            <span>{item.rows} rows</span>
                            <span className="text-cyan-400">{item.last}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Analysis Monitoring</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  Platform analysis metadata is available only to authorized administrators for operational and security monitoring.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["RBAC Protected", "Session Authenticated", "Audit Logged", "Private Data"].map(badge => (
                    <span key={badge} className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-medium rounded-full uppercase tracking-wider">{badge}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Analysis Details Modal ── */}
      <Modal open={detailsModal} onClose={() => setDetailsModal(false)} title="Analysis Details" maxWidth="max-w-[640px]">
        {activeAnalysis && (
          <div className="space-y-6">
            {/* Question */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Question</p>
              <p className="text-sm text-slate-100 leading-relaxed italic">&quot;{activeAnalysis.question}&quot;</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: "User", v: activeAnalysis.user },
                { l: "Dataset", v: activeAnalysis.dataset },
                { l: "Dataset ID", v: activeAnalysis.datasetId },
                { l: "Operation", v: activeAnalysis.operation },
                { l: "Metric", v: activeAnalysis.metric },
                { l: "Group By", v: activeAnalysis.groupBy ?? "\u2014" },
                { l: "Filters", v: activeAnalysis.filters ?? "\u2014" },
                { l: "Applied Range", v: "2024-03-01 \u2192 2024-03-31" },
                { l: "Execution Time", v: activeAnalysis.executionTime },
                { l: "Status", v: activeAnalysis.status },
              ].map(({ l, v }) => (
                <div key={l} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{l}</p>
                  <p className="text-xs font-medium text-slate-200 break-words">{v}</p>
                </div>
              ))}
            </div>

            {/* Verified Result */}
            {activeAnalysis.status === "Verified" && activeAnalysis.result && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">Verified Result</p>
                </div>
                <p className="text-2xl font-bold text-white mb-3">{activeAnalysis.result}</p>
                <div className="flex gap-6 text-xs text-slate-400">
                  <span>Source: <span className="text-slate-200">{activeAnalysis.dataset}</span></span>
                  <span>Rows Analyzed: <span className="text-slate-200">11,000</span></span>
                </div>
              </div>
            )}

            {/* Analysis Pipeline */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-4">Analysis Pipeline</p>
              <div className="space-y-2">
                {[
                  { step: "01", label: "Question Parsed", time: "0.8 sec" },
                  { step: "02", label: "Intent Validated", time: "0.1 sec" },
                  { step: "03", label: "DuckDB Analysis", time: "1.1 sec" },
                  { step: "04", label: "Result Context Built", time: "0.1 sec" },
                  { step: "05", label: "Answer Generated", time: "0.9 sec" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{s.step}</span>
                        <span className="text-xs font-medium text-slate-200">{s.label}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{s.time}</span>
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

      {/* ── Mark for Review Modal ── */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Mark Analysis for Review">
        {activeAnalysis && (
          <div className="space-y-5">
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Analysis</p>
              <p className="text-xs text-slate-200 italic">&quot;{activeAnalysis.question}&quot;</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Reason</label>
              <select value={reviewReason} onChange={e => setReviewReason(e.target.value)} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-amber-500/50">
                {["Unexpected result", "Long execution time", "Invalid request", "Data quality concern", "Possible abuse", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Notes (Optional)</label>
              <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} placeholder="Add additional context..." rows={4} className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
              <button onClick={() => setReviewModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => setReviewModal(false)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2">
                <Flag className="w-4 h-4" />Mark for Review
              </button>
            </div>
          </div>
        )}
      </Modal>

        </div>
    </ProtectedRoute>
  );
}
