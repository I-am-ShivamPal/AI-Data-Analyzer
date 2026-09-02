"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  History,
  User,
  Settings,
  LogOut,
  Upload,
  Bell,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  BarChart3,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Menu,
  X,
  Rows3,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
  Trash2,
  Tag
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  name: string;
  rows: number;
  size: string;
  status: "Ready" | "Processing" | "Failed";
  uploaded: string;
  analyzed: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────────────────────────────────

const INITIAL_DATASETS: Dataset[] = [
  { id: "1", name: "sales.csv",             rows: 11000, size: "4.8 MB",  status: "Ready",      uploaded: "Today",      analyzed: "2 hours ago" },
  { id: "2", name: "customer_analysis.csv", rows: 18420, size: "7.2 MB",  status: "Ready",      uploaded: "Yesterday",  analyzed: "Yesterday"   },
  { id: "3", name: "regional_sales.csv",    rows: 32190, size: "14.6 MB", status: "Ready",      uploaded: "Aug 26",     analyzed: "Aug 27"      },
  { id: "4", name: "inventory.csv",         rows: 22681, size: "9.1 MB",  status: "Processing", uploaded: "Aug 25",     analyzed: "—"           },
  { id: "5", name: "marketing_data.csv",    rows: 8400,  size: "3.2 MB",  status: "Failed",     uploaded: "Aug 24",     analyzed: "—"           },
  { id: "6", name: "q3_financials.csv",     rows: 5120,  size: "1.8 MB",  status: "Ready",      uploaded: "Aug 20",     analyzed: "Aug 22"      },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function fmtRows(n: number): string {
  return n.toLocaleString();
}

function StatusBadge({ status }: { status: Dataset["status"] }) {
  const map = {
    Ready:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    Processing: "bg-blue-500/15   text-blue-400   border-blue-500/25",
    Failed:     "bg-red-500/15    text-red-400    border-red-500/25",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Ready" ? "bg-emerald-400" : status === "Processing" ? "bg-blue-400" : "bg-red-400"}`} />
      {status}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sidebar
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
      </Link>
    );
  }

  const inner = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]">
        <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30 flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div className="leading-tight">
          <div className="text-xs font-bold text-white tracking-wider">AI DATA</div>
          <div className="text-xs font-bold text-blue-400 tracking-wider">ANALYZER</div>
        </div>
        {/* Mobile close */}
        <button
          className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Main</p>
        {NAV_MAIN.map((n) => <NavItem key={n.key} nav={n} />)}

        <div className="pt-4">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Account</p>
          {NAV_ACCOUNT.map((n) => <NavItem key={n.key} nav={n} />)}
        </div>
      </nav>

      {/* User card + logout */}
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

function TopBar({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <button
        className="lg:hidden text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white capitalize leading-none">My Datasets</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Manage your uploaded data and analysis-ready files.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-500 w-40">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs">Search...</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Session Active
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl p-3 z-50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Notifications</p>
              <div className="text-sm text-slate-500 px-1 py-2">No new notifications.</div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
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
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
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
// Summary Cards
// ────────────────────────────────────────────────────────────────────────────

function StatsGrid() {
  const STATS = [
    { label: "Total Datasets", value: "8",        icon: Database,     color: "text-blue-400",   bg: "bg-blue-600/10 border-blue-500/20"   },
    { label: "Total Rows",     value: "84,291",   icon: Rows3,        color: "text-violet-400", bg: "bg-violet-600/10 border-violet-500/20"},
    { label: "Ready",          value: "7",        icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-600/10 border-emerald-500/20"},
    { label: "Storage Used",   value: "286 MB",   icon: HardDrive,    color: "text-amber-400",  bg: "bg-amber-600/10 border-amber-500/20"  },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/[0.12] transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
            <div className={`p-1.5 rounded-lg border ${s.bg} transition-all duration-200 group-hover:scale-110`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Upload Area
// ────────────────────────────────────────────────────────────────────────────

function UploadArea({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Upload a dataset</h3>
        <p className="text-xs text-slate-500 mt-1">Add a CSV file up to 1 GB to start analyzing your data.</p>
      </div>
      
      <div 
        onClick={onUploadClick}
        className="border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-white/[0.01] hover:bg-blue-500/[0.02] rounded-xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.03] transition-colors duration-300" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] group-hover:bg-blue-500/10 border border-white/10 group-hover:border-blue-500/30 flex items-center justify-center mb-4 transition-all duration-300 shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
            <FileSpreadsheet className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors duration-300" />
          </div>
          <p className="text-sm font-medium text-slate-200 mb-1">
            Drag & drop your CSV file here
          </p>
          <p className="text-sm text-slate-500 mb-4">or <span className="text-blue-400 font-medium">Browse files</span></p>
          
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> CSV files only</span>
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> Maximum file size: 1 GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Upload Progress Mock
// ────────────────────────────────────────────────────────────────────────────

function UploadProgressMock({ onDismiss }: { onDismiss: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"uploading" | "processing" | "ready">("uploading");

  useEffect(() => {
    let int1: NodeJS.Timeout, int2: NodeJS.Timeout;
    if (stage === "uploading") {
      int1 = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(int1);
            setStage("processing");
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 400);
    } else if (stage === "processing") {
      int2 = setTimeout(() => {
        setStage("ready");
      }, 2000);
    }
    return () => { clearInterval(int1); clearTimeout(int2); };
  }, [stage]);

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden">
      {/* Glow effect for ready state */}
      {stage === "ready" && (
        <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${
            stage === "ready" ? "bg-emerald-500/15 border-emerald-500/30" : "bg-blue-600/15 border-blue-500/30"
          }`}>
            {stage === "ready" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">sales_2026.csv</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {stage === "uploading" ? `Uploading dataset... ${Math.min(progress, 100)}%` : 
               stage === "processing" ? "Processing dataset..." : 
               "Dataset ready"}
            </p>
          </div>
        </div>
        {stage === "ready" && (
          <button 
            onClick={onDismiss}
            className="text-xs px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg text-slate-300 transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>

      <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden relative z-10">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            stage === "ready" ? "bg-emerald-500" : "bg-blue-500 relative"
          }`}
          style={{ width: `${stage === "processing" || stage === "ready" ? 100 : Math.min(progress, 100)}%` }}
        >
          {stage === "processing" && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Modals
// ────────────────────────────────────────────────────────────────────────────

function DeleteModal({ dataset, onClose, onConfirm }: { dataset: Dataset | null; onClose: () => void; onConfirm: () => void }) {
  if (!dataset) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete dataset?</h3>
        </div>
        <p className="text-sm text-slate-300 mb-2">
          Are you sure you want to remove <span className="font-semibold text-white">{dataset.name}</span>?
        </p>
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>This action cannot be undone. All analyses related to this dataset will also be permanently deleted.</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_0_15px_-5px_rgba(220,38,38,0.5)]"
          >
            Delete Dataset
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailsModal({ dataset, onClose }: { dataset: Dataset | null; onClose: () => void }) {
  if (!dataset) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/15 rounded-xl border border-blue-500/25">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white truncate max-w-[250px] sm:max-w-xs">{dataset.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">File type</p>
              <p className="text-sm font-medium text-slate-200">CSV</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <div className="-ml-2"><StatusBadge status={dataset.status} /></div>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Rows</p>
              <p className="text-sm font-medium text-slate-200">{fmtRows(dataset.rows)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Size</p>
              <p className="text-sm font-medium text-slate-200">{dataset.size}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Uploaded</p>
              <p className="text-sm font-medium text-slate-200">{dataset.uploaded}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Last analyzed</p>
              <p className="text-sm font-medium text-slate-200">{dataset.analyzed}</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
            <h4 className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Available dimensions
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Product", "Location", "Customer", "Channel", "Date"].map(dim => (
                <span key={dim} className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-xs text-slate-300 rounded-md">
                  {dim}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/[0.06] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            disabled={dataset.status !== "Ready"}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_-5px_rgba(37,99,235,0.5)]"
          >
            Analyze Dataset
          </button>
        </div>

      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Table
// ────────────────────────────────────────────────────────────────────────────

function DatasetTable({ 
  datasets, 
  onDelete, 
  onViewDetails 
}: { 
  datasets: Dataset[];
  onDelete: (d: Dataset) => void;
  onViewDetails: (d: Dataset) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Ready" | "Processing" | "Failed">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortCol, setSortCol] = useState<keyof Dataset>("uploaded");
  const [sortDesc, setSortDesc] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    let result = [...datasets];
    
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q));
    }
    
    // Filter
    if (statusFilter !== "All") {
      result = result.filter(d => d.status === statusFilter);
    }
    
    // Sort
    result.sort((a, b) => {
      let valA: string | number = a[sortCol];
      let valB: string | number = b[sortCol];
      
      if (sortCol === "size") {
        valA = parseFloat(valA as string);
        valB = parseFloat(valB as string);
      }
      
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
    
    return result;
  }, [datasets, search, statusFilter, sortCol, sortDesc]);

  function handleSort(col: keyof Dataset) {
    if (sortCol === col) setSortDesc(!sortDesc);
    else { setSortCol(col); setSortDesc(true); }
  }

  function SortIcon({ col }: { col: keyof Dataset }) {
    if (sortCol !== col) return <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-30 ml-1" />;
    return sortDesc ? <ChevronDown className="w-3 h-3 ml-1 text-blue-400" /> : <ChevronUp className="w-3 h-3 ml-1 text-blue-400" />;
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-visible relative z-10">
      
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-white/[0.06]">
        <h3 className="text-base font-semibold text-white">Your datasets</h3>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-slate-300 hover:bg-white/[0.06] transition-colors"
            >
              {statusFilter} <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-30 py-1">
                {(["All", "Ready", "Processing", "Failed"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setStatusFilter(f); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === f ? "text-blue-400 bg-blue-500/10" : "text-slate-300 hover:bg-white/[0.05]"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {[
                { label: "Dataset", col: "name" as const },
                { label: "Rows", col: "rows" as const },
                { label: "Size", col: "size" as const },
                { label: "Status", col: "status" as const },
                { label: "Uploaded", col: "uploaded" as const },
                { label: "Last analyzed", col: "analyzed" as const }
              ].map(th => (
                <th key={th.label} className="text-left px-5 py-3.5">
                  <button 
                    onClick={() => handleSort(th.col)}
                    className="flex items-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider group hover:text-slate-300 transition-colors"
                  >
                    {th.label} <SortIcon col={th.col} />
                  </button>
                </th>
              ))}
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                  No datasets match your filters.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((ds, i) => (
                <tr
                  key={ds.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === filteredAndSorted.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{ds.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">CSV Dataset</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{fmtRows(ds.rows)}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{ds.size}</td>
                  <td className="px-5 py-4"><StatusBadge status={ds.status} /></td>
                  <td className="px-5 py-4 text-sm text-slate-400">{ds.uploaded}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{ds.analyzed}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={ds.status !== "Ready"}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Analyze
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === ds.id ? null : ds.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpenId === ds.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-30 py-1">
                            <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors">Analyze</button>
                            <button onClick={() => { onViewDetails(ds); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors">View Details</button>
                            <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors">Rename</button>
                            <div className="my-1 border-t border-white/[0.05]" />
                            <button onClick={() => { onDelete(ds); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 flex flex-col items-center text-center mt-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
        <Database className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No datasets yet</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
        Upload your first CSV dataset and start asking questions about your data.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]"
        >
          <Upload className="w-4 h-4" />
          Upload Dataset
        </button>
        <button className="px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors border border-white/5">
          Learn how analysis works
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Security Footer
// ────────────────────────────────────────────────────────────────────────────

function SecurityFooter() {
  return (
    <div className="mt-8 mb-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">Private dataset workspace</h4>
          <p className="text-xs text-slate-500 mt-0.5">Your datasets are isolated to your account.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Private", "Session Protected", "Verified Analytics"].map((badge) => (
          <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

export default function DatasetsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [showUploadMock, setShowUploadMock] = useState(false);
  
  // Modals state
  const [deleteTarget, setDeleteTarget] = useState<Dataset | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<Dataset | null>(null);

  function handleUploadClick() {
    setShowUploadMock(true);
    // In a real app, this would open a file picker
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      setDatasets(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden">
      
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.05]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]" />
        </div>
      </div>

      <Sidebar
        active="datasets"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-y-auto">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">My Datasets</h2>
              <p className="text-slate-400 text-sm mt-1.5">Upload, manage, and analyze your datasets from one workspace.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="flex items-center justify-center p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-slate-300 transition-colors" aria-label="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]"
              >
                <Upload className="w-4 h-4" />
                Upload Dataset
              </button>
            </div>
          </div>

          <StatsGrid />

          <UploadArea onUploadClick={handleUploadClick} />
          
          {showUploadMock && (
            <UploadProgressMock onDismiss={() => setShowUploadMock(false)} />
          )}

          {datasets.length > 0 ? (
            <DatasetTable 
              datasets={datasets} 
              onDelete={(d) => setDeleteTarget(d)}
              onViewDetails={(d) => setDetailsTarget(d)}
            />
          ) : (
            <EmptyState onUpload={handleUploadClick} />
          )}

          <SecurityFooter />

        </main>
      </div>

      {/* Modals */}
      <DeleteModal 
        dataset={deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleConfirmDelete} 
      />
      <DetailsModal 
        dataset={detailsTarget} 
        onClose={() => setDetailsTarget(null)} 
      />

      </div>
    </ProtectedRoute>
  );
}
