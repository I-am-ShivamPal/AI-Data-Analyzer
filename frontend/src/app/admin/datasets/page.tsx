"use client";

import React, { useState, useMemo } from "react";
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
  FileText,
  FileSpreadsheet,
  FileJson,
  FileArchive,
  DatabaseIcon,
  HardDrive,
  DatabaseBackup,
  Loader2,
  CheckCircle2,
  XCircle,
  Flag,
  FileCode2,
  Download
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

type DatasetStatus = "Ready" | "Processing" | "Failed";
type FileType = "CSV" | "XLSX" | "JSON" | "ZIP" | "SQL";

interface DatasetRecord {
  id: string;
  filename: string;
  owner: string;
  email: string;
  type: FileType;
  rows: string;
  size: string;
  status: DatasetStatus;
  uploadedAt: string;
  lastAnalysis: string;
  columns: number;
}

const MOCK_DATASETS: DatasetRecord[] = [
  { id: "ds_a1b2c3", filename: "sales.csv", owner: "shivam", email: "shivam•••@gmail.com", type: "CSV", rows: "11,000", size: "4.8 MB", status: "Ready", uploadedAt: "29 Aug 2026", lastAnalysis: "29 Aug 2026", columns: 12 },
  { id: "ds_d4e5f6", filename: "customer_analysis.csv", owner: "analyst", email: "anal•••@gmail.com", type: "CSV", rows: "82,450", size: "31.2 MB", status: "Ready", uploadedAt: "28 Aug 2026", lastAnalysis: "28 Aug 2026", columns: 24 },
  { id: "ds_g7h8i9", filename: "marketing_data.xlsx", owner: "user", email: "user•••@gmail.com", type: "XLSX", rows: "245,800", size: "86.4 MB", status: "Processing", uploadedAt: "29 Aug 2026", lastAnalysis: "—", columns: 45 },
  { id: "ds_j0k1l2", filename: "q3_financials.csv", owner: "admin", email: "admin•••@company.com", type: "CSV", rows: "450,000", size: "128.5 MB", status: "Ready", uploadedAt: "27 Aug 2026", lastAnalysis: "28 Aug 2026", columns: 18 },
  { id: "ds_m3n4o5", filename: "user_events.json", owner: "dev", email: "dev•••@startup.io", type: "JSON", rows: "1,200,000", size: "342.1 MB", status: "Failed", uploadedAt: "26 Aug 2026", lastAnalysis: "—", columns: 0 },
  { id: "ds_p6q7r8", filename: "product_catalog.xlsx", owner: "sales", email: "sales•••@corp.com", type: "XLSX", rows: "5,420", size: "2.1 MB", status: "Ready", uploadedAt: "25 Aug 2026", lastAnalysis: "26 Aug 2026", columns: 8 },
  { id: "ds_s9t0u1", filename: "historical_logs.zip", owner: "ceo", email: "ceo•••@corp.com", type: "ZIP", rows: "5,000,000", size: "1.2 GB", status: "Ready", uploadedAt: "20 Aug 2026", lastAnalysis: "22 Aug 2026", columns: 32 },
  { id: "ds_v2w3x4", filename: "app_metrics.csv", owner: "support", email: "support•••@app.com", type: "CSV", rows: "89,000", size: "24.5 MB", status: "Ready", uploadedAt: "28 Aug 2026", lastAnalysis: "29 Aug 2026", columns: 15 },
  { id: "ds_y5z6a7", filename: "survey_results.xlsx", owner: "hr", email: "hr•••@company.com", type: "XLSX", rows: "1,200", size: "0.8 MB", status: "Ready", uploadedAt: "15 Aug 2026", lastAnalysis: "16 Aug 2026", columns: 40 },
  { id: "ds_b8c9d0", filename: "raw_telemetry.csv", owner: "dev", email: "dev•••@startup.io", type: "CSV", rows: "850,000", size: "215.3 MB", status: "Processing", uploadedAt: "29 Aug 2026", lastAnalysis: "—", columns: 22 },
  { id: "ds_e1f2g3", filename: "legacy_db_export.sql", owner: "admin", email: "admin•••@company.com", type: "SQL", rows: "N/A", size: "4.5 GB", status: "Failed", uploadedAt: "24 Aug 2026", lastAnalysis: "—", columns: 0 },
  { id: "ds_h4i5j6", filename: "q4_projections.csv", owner: "shivam", email: "shivam•••@gmail.com", type: "CSV", rows: "15,000", size: "5.2 MB", status: "Ready", uploadedAt: "29 Aug 2026", lastAnalysis: "29 Aug 2026", columns: 10 },
];

const MOCK_DIMENSIONS = ["Product", "Location", "Customer", "Channel", "Status", "Date", "Revenue", "Quantity"];

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

function AdminSidebar({ active, mobileOpen, setMobileOpen }: { active: string; mobileOpen: boolean; setMobileOpen: (v: boolean) => void; }) {
  function NavItem({ nav }: { nav: typeof NAV_OVERVIEW[0] }) {
    const isActive = active === nav.key;
    return (
      <Link href={nav.href} onClick={() => setMobileOpen(false)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"}`}>
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
        <button className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5 custom-scrollbar" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Overview</p>
        {NAV_OVERVIEW.map((n) => <NavItem key={n.key} nav={n} />)}
        <div className="pt-5"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Monitoring</p>{NAV_MONITORING.map((n) => <NavItem key={n.key} nav={n} />)}</div>
        <div className="pt-5"><p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Admin Account</p>{NAV_ACCOUNT.map((n) => <NavItem key={n.key} nav={n} />)}</div>
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
      <button className="lg:hidden text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:rounded" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
      <div className="flex-1 min-w-0"><h1 className="text-base font-bold text-white capitalize leading-none">{pageTitle}</h1><p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p></div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />System Operational</div>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"><Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" /></button>
        <div className="relative">
          <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"><User className="w-3.5 h-3.5 text-indigo-300" /></div>
            <div className="hidden sm:block text-left"><p className="text-xs font-semibold text-white leading-none">Administrator</p></div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              {NAV_ACCOUNT.map((item) => (<button key={item.label} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"><item.icon className="w-4 h-4" />{item.label}</button>))}
              <div className="border-t border-white/[0.06]" />
              <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"><LogOut className="w-4 h-4" />Logout</button>
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
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Admin Datasets Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDatasetsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [datasets, setDatasets] = useState<DatasetRecord[]>(MOCK_DATASETS);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All Users");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [activeDataset, setActiveDataset] = useState<DatasetRecord | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [ownerModal, setOwnerModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [reviewReason, setReviewReason] = useState("Suspicious upload");
  const [reviewNotes, setReviewNotes] = useState("");

  // Menus
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Derived state
  const filteredDatasets = useMemo(() => {
    let result = datasets.filter(d => {
      const matchSearch = d.filename.toLowerCase().includes(search.toLowerCase()) || 
                          d.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      const matchType = typeFilter === "All" || d.type === typeFilter;
      const matchOwner = ownerFilter === "All Users" || d.email === ownerFilter;
      const matchDate = dateFilter === "All" || (dateFilter === "Today" && d.uploadedAt.includes("29 Aug")); // Simple mock logic
      let matchSize = true;
      if (sizeFilter !== "All") {
        const val = parseFloat(d.size.split(" ")[0]);
        const unit = d.size.split(" ")[1];
        const bytes = val * (unit === "GB" ? 1024 : 1);
        if (sizeFilter === "< 10 MB") matchSize = bytes < 10;
        else if (sizeFilter === "10–100 MB") matchSize = bytes >= 10 && bytes <= 100;
        else if (sizeFilter === "100 MB–1 GB") matchSize = bytes > 100 && bytes <= 1024;
        else if (sizeFilter === "> 1 GB") matchSize = bytes > 1024;
      }
      return matchSearch && matchStatus && matchType && matchOwner && matchDate && matchSize;
    });

    if (sortOrder === "Newest") result = result.sort((a, b) => a.uploadedAt < b.uploadedAt ? 1 : -1);
    if (sortOrder === "Oldest") result = result.sort((a, b) => a.uploadedAt > b.uploadedAt ? 1 : -1);
    if (sortOrder === "Largest") result = result.sort((a, b) => {
      const getBytes = (s: string) => parseFloat(s.split(" ")[0]) * (s.split(" ")[1] === "GB" ? 1024 : 1);
      return getBytes(b.size) - getBytes(a.size);
    });
    if (sortOrder === "Smallest") result = result.sort((a, b) => {
      const getBytes = (s: string) => parseFloat(s.split(" ")[0]) * (s.split(" ")[1] === "GB" ? 1024 : 1);
      return getBytes(a.size) - getBytes(b.size);
    });
    if (sortOrder === "Most Rows") result = result.sort((a, b) => {
      const rA = a.rows === "N/A" ? 0 : parseInt(a.rows.replace(/,/g, ""));
      const rB = b.rows === "N/A" ? 0 : parseInt(b.rows.replace(/,/g, ""));
      return rB - rA;
    });

    return result;
  }, [datasets, search, statusFilter, typeFilter, ownerFilter, sizeFilter, dateFilter, sortOrder]);

  const paginatedDatasets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDatasets.slice(start, start + itemsPerPage);
  }, [filteredDatasets, currentPage]);

  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage) || 1;

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setOwnerFilter("All Users");
    setSizeFilter("All");
    setDateFilter("All");
    setSortOrder("Newest");
    setCurrentPage(1);
  };

  const openModal = (dataset: DatasetRecord, type: "details" | "owner" | "delete" | "review") => {
    setActiveDataset(dataset);
    setActionMenuOpen(null);
    if (type === "details") setDetailsModal(true);
    if (type === "owner") setOwnerModal(true);
    if (type === "delete") {
      setDeleteConfirmText("");
      setDeleteModal(true);
    }
    if (type === "review") {
      setReviewReason("Suspicious upload");
      setReviewNotes("");
      setReviewModal(true);
    }
  };

  const handleDelete = () => {
    if (activeDataset && deleteConfirmText === "DELETE") {
      setDatasets(prev => prev.filter(d => d.id !== activeDataset.id));
      setDeleteModal(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case "CSV": return <FileText className="w-4 h-4" />;
      case "XLSX": return <FileSpreadsheet className="w-4 h-4" />;
      case "JSON": return <FileJson className="w-4 h-4" />;
      case "ZIP": return <FileArchive className="w-4 h-4" />;
      case "SQL": return <DatabaseIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const uniqueOwners = Array.from(new Set(MOCK_DATASETS.map(d => d.email)));

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="datasets" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar pageTitle="Datasets" subtitle="Monitor and manage datasets across the AI DATA ANALYZER platform." setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* Platform Dataset Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: "TOTAL DATASETS", value: "2,486", desc: "All uploaded datasets", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "READY", value: "2,341", desc: "94.2%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "PROCESSING", value: "87", desc: "3.5%", icon: Loader2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                { label: "FAILED", value: "58", desc: "2.3%", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
                { label: "TOTAL ROWS", value: "48.7M", desc: "Across all datasets", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { label: "STORAGE USED", value: "186.4 GB", desc: "of 500 GB", icon: HardDrive, color: "text-amber-400", bg: "bg-amber-500/10" },
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
              
              {/* Left Column (2/3 width) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Processing and Failed Alerts (Top) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Failed Datasets Panel */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h4 className="text-sm font-semibold text-red-400">Datasets Requiring Attention</h4>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs font-medium text-slate-200 truncate">marketing_data.xlsx</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-slate-500">Status: <span className="text-red-400">Failed</span></span>
                          </div>
                          <p className="text-[10px] text-red-300/70 mt-1">Reason: &quot;Unable to parse workbook structure.&quot;</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <p className="text-xs font-medium text-slate-200 truncate">large_dataset.csv</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-slate-500">Status: <span className="text-red-400">Failed</span></span>
                          </div>
                          <p className="text-[10px] text-red-300/70 mt-1">Reason: &quot;Schema extraction timeout.&quot;</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-all">Review</button>
                      <button className="flex-1 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium rounded-lg transition-all">Retry</button>
                      <button className="flex-1 px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium transition-all">Dismiss</button>
                    </div>
                  </div>

                  {/* Currently Processing Panel */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <h4 className="text-sm font-semibold text-blue-400">Currently Processing</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-200 truncate pr-2">marketing_data.xlsx</p>
                            <span className="text-xs text-blue-400 font-medium">72%</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-2">user•••@gmail.com</p>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
                          </div>
                          <p className="text-[10px] text-blue-300/70">&quot;Extracting schema...&quot;</p>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-200 truncate pr-2">raw_telemetry.csv</p>
                            <span className="text-xs text-cyan-400 font-medium">14%</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-2">dev•••@startup.io</p>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '14%' }} />
                          </div>
                          <p className="text-[10px] text-cyan-300/70">&quot;Reading file...&quot;</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Search and Filter Toolbar */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search datasets or users..."
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
                      <option value="Ready">Ready</option>
                      <option value="Processing">Processing</option>
                      <option value="Failed">Failed</option>
                    </select>

                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Type: All</option>
                      <option value="CSV">CSV</option>
                      <option value="XLSX">XLSX</option>
                      <option value="JSON">JSON</option>
                      <option value="ZIP">ZIP</option>
                    </select>

                    <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All Users">Owner: All Users</option>
                      {uniqueOwners.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>

                    <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Size: All</option>
                      <option value="< 10 MB">{"< 10 MB"}</option>
                      <option value="10–100 MB">{"10–100 MB"}</option>
                      <option value="100 MB–1 GB">{"100 MB–1 GB"}</option>
                      <option value="> 1 GB">{"> 1 GB"}</option>
                    </select>

                    <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                      <option value="All">Date: All</option>
                      <option value="Today">Today</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                    </select>

                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer ml-auto">
                      <option value="Newest">Sort: Newest</option>
                      <option value="Oldest">Sort: Oldest</option>
                      <option value="Largest">Sort: Largest</option>
                      <option value="Smallest">Sort: Smallest</option>
                      <option value="Most Rows">Sort: Most Rows</option>
                    </select>

                    {(search || statusFilter !== "All" || typeFilter !== "All" || ownerFilter !== "All Users" || sizeFilter !== "All" || dateFilter !== "All" || sortOrder !== "Newest") && (
                      <button onClick={handleClearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 transition-colors">
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Dataset Table / Mobile Cards */}
                {filteredDatasets.length === 0 ? (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                      <Database className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">No datasets found</h3>
                    <p className="text-sm text-slate-400 mb-6">No datasets match the current filters.</p>
                    <button onClick={handleClearFilters} className="px-5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
                    {/* Desktop/Tablet Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-sm text-left min-w-[950px]">
                        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                          <tr>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Dataset</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Owner</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-center">Type</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Rows</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Size</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-center">Uploaded</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-center">Last Analysis</th>
                            <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paginatedDatasets.map((dataset) => (
                            <tr key={dataset.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2 font-medium text-slate-200">
                                  <div className="p-1.5 bg-white/[0.05] rounded text-slate-400">{getFileIcon(dataset.type)}</div>
                                  <span className="truncate max-w-[150px]">{dataset.filename}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-slate-300 text-xs">{dataset.email}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-xs text-center">{dataset.type}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-xs text-right">{dataset.rows}</td>
                              <td className="px-5 py-3.5 text-slate-400 text-xs text-right whitespace-nowrap">{dataset.size}</td>
                              <td className="px-5 py-3.5 text-center">
                                <span className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                                  dataset.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  dataset.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                  'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                  {dataset.status === 'Ready' && <CheckCircle2 className="w-3 h-3" />}
                                  {dataset.status === 'Processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                                  {dataset.status === 'Failed' && <XCircle className="w-3 h-3" />}
                                  {dataset.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-slate-500 text-xs text-center whitespace-nowrap">{dataset.uploadedAt}</td>
                              <td className="px-5 py-3.5 text-slate-500 text-xs text-center whitespace-nowrap">{dataset.lastAnalysis}</td>
                              <td className="px-5 py-3.5 text-right relative">
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === dataset.id ? null : dataset.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {actionMenuOpen === dataset.id && (
                                  <div className="absolute right-8 top-10 mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                    <button onClick={() => openModal(dataset, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Details</button>
                                    <button onClick={() => openModal(dataset, "owner")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Owner</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Activity</button>
                                    <button className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] transition-colors text-left">View Analysis History</button>
                                    <div className="border-t border-white/[0.06]" />
                                    <button onClick={() => openModal(dataset, "review")} className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors text-left">Mark for Review</button>
                                    <button onClick={() => openModal(dataset, "delete")} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left">Delete Dataset</button>
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
                      {paginatedDatasets.map(dataset => (
                        <div key={dataset.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/[0.05] rounded-lg text-slate-400">{getFileIcon(dataset.type)}</div>
                              <div>
                                <p className="text-sm font-medium text-slate-200">{dataset.filename}</p>
                                <p className="text-xs text-slate-400">{dataset.email}</p>
                              </div>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setActionMenuOpen(actionMenuOpen === dataset.id ? null : dataset.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {actionMenuOpen === dataset.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                  <button onClick={() => openModal(dataset, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Details</button>
                                  <button onClick={() => openModal(dataset, "delete")} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 text-left">Delete Dataset</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-2 bg-white/[0.02] p-2 rounded-lg">
                            <div><span className="text-slate-400">Type:</span> {dataset.type}</div>
                            <div><span className="text-slate-400">Size:</span> {dataset.size}</div>
                            <div><span className="text-slate-400">Rows:</span> {dataset.rows}</div>
                            <div><span className="text-slate-400">Uploaded:</span> {dataset.uploadedAt}</div>
                          </div>
                          <div className="pt-2 border-t border-white/[0.04]">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              dataset.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              dataset.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                              'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {dataset.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium hidden sm:block">
                        Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredDatasets.length)}</span> of {filteredDatasets.length} datasets
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
                          <button className="w-7 h-7 rounded-lg text-slate-400 hover:bg-white/[0.05] text-xs font-medium">249</button>
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
                
                {/* Platform Storage Utilization */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-white">Platform Storage</h3>
                    <DatabaseBackup className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-4">186.4 GB <span className="text-slate-500 font-normal">/ 500 GB</span></p>
                  
                  <div className="w-full h-3 rounded-full flex overflow-hidden mb-2 bg-white/5">
                    <div className="h-full bg-cyan-400" style={{ width: '35.3%' }} title="Datasets" />
                    <div className="h-full bg-indigo-400" style={{ width: '1.2%' }} title="Exports" />
                    <div className="h-full bg-slate-400" style={{ width: '0.8%' }} title="Temporary" />
                  </div>
                  <p className="text-xs text-slate-400 mb-6 text-right">37.3% Used</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Datasets</span>
                      <span className="text-white font-medium">176.8 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Exports</span>
                      <span className="text-white font-medium">6.4 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-400" /> Temporary</span>
                      <span className="text-white font-medium">3.2 GB</span>
                    </div>
                    <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs mt-3">
                      <span className="text-emerald-400 font-medium">Available Space</span>
                      <span className="text-emerald-400 font-medium">313.6 GB</span>
                    </div>
                  </div>
                </div>

                {/* Processing Health */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Processing Health</h3>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-emerald-400" style={{ width: '94.2%' }} />
                    <div className="h-full bg-blue-400" style={{ width: '3.5%' }} />
                    <div className="h-full bg-red-400" style={{ width: '2.3%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Ready</p>
                      <p className="text-sm font-medium text-emerald-400">94.2%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Processing</p>
                      <p className="text-sm font-medium text-blue-400">3.5%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Failed</p>
                      <p className="text-sm font-medium text-red-400">2.3%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Average processing time</span>
                      <span className="text-white font-medium">18.4 sec</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Today&apos;s uploads</span>
                      <span className="text-white font-medium">126</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Failed today</span>
                      <span className="text-red-400 font-medium">3</span>
                    </div>
                  </div>
                </div>

                {/* File Types Distribution */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">File Types</h3>
                  <div className="space-y-4">
                    {[
                      { name: "CSV", pct: "68%", w: "68%", icon: FileText },
                      { name: "XLSX", pct: "21%", w: "21%", icon: FileSpreadsheet },
                      { name: "JSON", pct: "7%", w: "7%", icon: FileJson },
                      { name: "ZIP", pct: "4%", w: "4%", icon: FileArchive },
                    ].map((f) => (
                      <div key={f.name}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-300 font-medium"><f.icon className="w-3.5 h-3.5 text-slate-400"/> {f.name}</span>
                          <span className="text-white font-medium">{f.pct}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full opacity-80" style={{ width: f.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dataset Upload Activity Trend */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Dataset Upload Activity</h3>
                  <div className="h-32 w-full flex items-end justify-between gap-1">
                    {[
                      { day: "Mon", up: 40, proc: 35, fail: 5 },
                      { day: "Tue", up: 60, proc: 58, fail: 2 },
                      { day: "Wed", up: 85, proc: 80, fail: 5 },
                      { day: "Thu", up: 55, proc: 50, fail: 5 },
                      { day: "Fri", up: 75, proc: 70, fail: 5 },
                      { day: "Sat", up: 30, proc: 28, fail: 2 },
                      { day: "Sun", up: 25, proc: 25, fail: 0 },
                    ].map((d) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative">
                        <div className="w-full flex justify-center items-end h-[100px] relative">
                          <div className="w-1/2 max-w-[16px] bg-slate-700/50 rounded-t-sm absolute bottom-0" style={{ height: `${d.up}%` }} />
                          <div className="w-1/2 max-w-[16px] bg-emerald-500 rounded-t-sm absolute bottom-0 z-10" style={{ height: `${d.proc}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">{d.day}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4 text-[10px]">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-700" /> Uploads</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Processed</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-red-500" /> Failed</span>
                  </div>
                </div>

                {/* Recent Uploads */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-white mb-4">Recent Uploads</h3>
                  <div className="space-y-4">
                    {[
                      { f: "sales.csv", o: "shivam•••@gmail.com", s: "4.8 MB", t: "2 minutes ago", st: "Ready", type: "CSV" },
                      { f: "marketing_data.xlsx", o: "user•••@gmail.com", s: "86.4 MB", t: "15 minutes ago", st: "Processing", type: "XLSX" },
                      { f: "app_metrics.csv", o: "support•••@app.com", s: "24.5 MB", t: "1 hour ago", st: "Ready", type: "CSV" },
                      { f: "user_events.json", o: "dev•••@startup.io", s: "342.1 MB", t: "3 hours ago", st: "Failed", type: "JSON" },
                      { f: "q3_financials.csv", o: "admin•••@company.com", s: "128.5 MB", t: "5 hours ago", st: "Ready", type: "CSV" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white/[0.05] rounded-lg text-slate-400 mt-0.5">
                            {getFileIcon(item.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200 truncate max-w-[120px]">{item.f}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{item.o}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.s} · {item.t}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-medium ${item.st === 'Ready' ? 'text-emerald-400' : item.st === 'Processing' ? 'text-blue-400' : 'text-red-400'}`}>{item.st}</span>
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
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Dataset Administration</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  Dataset metadata and administrative controls are available only to authorized administrators.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["RBAC Protected", "Session Authenticated", "Audit Logged", "Private Data"].map((badge) => (
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

      {/* Dataset Details Modal */}
      <Modal open={detailsModal} onClose={() => setDetailsModal(false)} title="Dataset Details" maxWidth="max-w-[600px]">
        {activeDataset && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="p-3 bg-white/[0.05] rounded-xl text-slate-400">{getFileIcon(activeDataset.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-white truncate">{activeDataset.filename}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {activeDataset.email}</span>
                  <span>·</span>
                  <span className="font-mono text-xs">ID: {activeDataset.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">File Type</p>
                <p className="text-sm font-medium text-white">{activeDataset.type}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Size</p>
                <p className="text-sm font-medium text-white">{activeDataset.size}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rows</p>
                <p className="text-sm font-medium text-white">{activeDataset.rows}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Columns</p>
                <p className="text-sm font-medium text-white">{activeDataset.columns}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/[0.06]">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Timestamps</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${activeDataset.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : activeDataset.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{activeDataset.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Uploaded</span>
                    <span className="text-white text-right">29 Aug 2026<br/><span className="text-slate-500 text-[10px]">09:12 AM</span></span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-white text-right">29 Aug 2026<br/><span className="text-slate-500 text-[10px]">09:14 AM</span></span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Physical Storage</p>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3 font-mono text-[10px] text-slate-400 break-all">
                  <div className="flex items-center gap-2 text-cyan-500 mb-1"><HardDrive className="w-3 h-3" /> storage/datasets/</div>
                  ••••••••••••.csv
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Available Dimensions</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_DIMENSIONS.map(dim => (
                  <span key={dim} className="px-2 py-1 bg-white/[0.03] border border-white/10 text-slate-300 text-[10px] font-medium rounded uppercase tracking-wider">{dim}</span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-4">Recent Activity</p>
              <div className="relative border-l border-white/[0.1] ml-3 space-y-5 pb-2">
                {[
                  { t: "09:14 AM", d: "29 Aug", txt: "Dataset processing completed", icon: CheckCircle2, color: "text-emerald-400" },
                  { t: "09:13 AM", d: "29 Aug", txt: "Schema extraction completed", icon: FileCode2, color: "text-blue-400" },
                  { t: "09:12 AM", d: "29 Aug", txt: "Dataset uploaded", icon: Download, color: "text-cyan-400" },
                ].map((ev, i) => (
                  <div key={i} className="relative pl-5">
                    <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-[#0B1120] border border-white/10 flex items-center justify-center">
                      <ev.icon className={`w-3 h-3 ${ev.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-200">{ev.txt}</p>
                        <span className="text-[10px] text-slate-500">{ev.d} · {ev.t}</span>
                      </div>
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

      {/* Owner Details Modal */}
      <Modal open={ownerModal} onClose={() => setOwnerModal(false)} title="Dataset Owner">
        {activeDataset && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-indigo-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1 capitalize">{activeDataset.owner}</h4>
              <p className="text-sm text-slate-400 mb-3">{activeDataset.email}</p>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full uppercase tracking-wider">Active Account</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Created</p>
                <p className="text-sm font-medium text-white">12 Aug 2026</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Datasets</p>
                <p className="text-sm font-medium text-white">6</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Analyses</p>
                <p className="text-sm font-medium text-white">34</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
              <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">View User Activity</button>
              <button className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-semibold rounded-xl transition-all">View User</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Dataset Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Dataset?">
        {activeDataset && (
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">This will permanently remove the dataset from the platform and make its associated analyses unavailable.</p>
            </div>
            
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Dataset</p>
                <p className="text-sm font-medium text-slate-200 truncate">{activeDataset.filename}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Owner</p>
                  <p className="text-sm text-slate-300 truncate">{activeDataset.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Size</p>
                  <p className="text-sm text-slate-300">{activeDataset.size}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <label className="block text-xs text-slate-400 font-medium">Type <span className="text-red-400 font-bold">DELETE</span> to confirm:</label>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#070B14] border border-red-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-4">
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={handleDelete}
                disabled={deleteConfirmText !== "DELETE"}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
              >
                Delete Dataset
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Mark for Review Modal */}
      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Mark Dataset for Review">
        {activeDataset && (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-400">Reason</label>
              <select 
                value={reviewReason}
                onChange={e => setReviewReason(e.target.value)}
                className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer"
              >
                <option value="Suspicious upload">Suspicious upload</option>
                <option value="Processing issue">Processing issue</option>
                <option value="Unexpected size">Unexpected size</option>
                <option value="Data quality concern">Data quality concern</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-400">Notes (Optional)</label>
              <textarea 
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="Add additional context for this review..."
                rows={4}
                className="w-full bg-[#070B14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 custom-scrollbar resize-none"
              />
            </div>
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
              <button onClick={() => setReviewModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={() => setReviewModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Mark for Review
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
