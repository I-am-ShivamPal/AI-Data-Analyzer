"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Search,
  Plus,
  CalendarDays,
  MoreHorizontal,
  Trash2,
  Copy,
  Download,
  AlertCircle,
  FileSpreadsheet,
  RotateCw,
  Filter
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

interface AnalysisRecord {
  id: string;
  question: string;
  dataset: string;
  resultTitle: string;
  resultValue?: string;
  status: "Verified" | "Failed" | "Processing";
  timestamp: string;
  timestampRaw: number; // for sorting
  failReason?: string;
  metrics?: { label: string; value: string }[];
  intent?: Record<string, string>;
  nlAnswer?: string;
}

const MOCK_HISTORY: AnalysisRecord[] = [
  {
    id: "h1",
    question: "Which product generated the highest revenue in March?",
    dataset: "sales.csv",
    resultTitle: "Drone",
    resultValue: "$258,962.42",
    status: "Verified",
    timestamp: "March 28, 2026 · 4:32 PM",
    timestampRaw: 1711643520000,
    metrics: [{ label: "Units Sold", value: "130" }, { label: "Orders", value: "41" }],
    intent: { operation: "group", group_by: "product", metric: "revenue", limit: "1", sort_order: "desc", filters: "date = March" },
    nlAnswer: "The product that generated the highest revenue in March was the Drone, with a revenue of $258,962.42."
  },
  {
    id: "h2",
    question: "What was the total revenue in Virginia?",
    dataset: "sales.csv",
    resultTitle: "Total Revenue",
    resultValue: "$411,098.58",
    status: "Verified",
    timestamp: "March 27, 2026 · 2:14 PM",
    timestampRaw: 1711548840000,
    intent: { operation: "total", metric: "revenue", filters: "location = Virginia" },
    nlAnswer: "The total revenue generated in Virginia across all recorded periods is $411,098.58."
  },
  {
    id: "h3",
    question: "Show revenue by product and location.",
    dataset: "regional_sales.csv",
    resultTitle: "24 products · 50 locations",
    status: "Verified",
    timestamp: "March 26, 2026 · 11:08 AM",
    timestampRaw: 1711451280000,
    intent: { operation: "group", group_by: "product, location", metric: "revenue" },
    nlAnswer: "Here is the multi-dimensional revenue breakdown by product and location."
  },
  {
    id: "h4",
    question: "Show revenue by branch.",
    dataset: "sales.csv",
    resultTitle: "Analysis Failed",
    status: "Failed",
    failReason: "The requested dimension 'branch' is not available in this dataset.",
    timestamp: "March 25, 2026 · 9:15 AM",
    timestampRaw: 1711358100000
  },
  {
    id: "h5",
    question: "Which product generated the highest revenue in March in Virginia?",
    dataset: "sales.csv",
    resultTitle: "Smart TV",
    resultValue: "$7,366.24",
    status: "Verified",
    timestamp: "March 24, 2026 · 3:45 PM",
    timestampRaw: 1711295100000,
    metrics: [{ label: "Units Sold", value: "8" }, { label: "Orders", value: "6" }],
    intent: { operation: "group", group_by: "product", metric: "revenue", limit: "1", sort_order: "desc", filters: "date = March AND location = Virginia" },
    nlAnswer: "The product that generated the highest revenue in March in Virginia was the Smart TV, with a revenue of $7,366.24."
  },
  {
    id: "h6",
    question: "How many active users are in the North region?",
    dataset: "customer_analysis.csv",
    resultTitle: "Total Users",
    resultValue: "8,421",
    status: "Verified",
    timestamp: "March 22, 2026 · 10:20 AM",
    timestampRaw: 1711102800000,
    intent: { operation: "count", metric: "users", filters: "region = North AND status = active" },
    nlAnswer: "There are 8,421 active users in the North region."
  },
  {
    id: "h7",
    question: "Average order value over the last 30 days.",
    dataset: "sales.csv",
    resultTitle: "Average Value",
    resultValue: "$124.50",
    status: "Verified",
    timestamp: "March 20, 2026 · 1:05 PM",
    timestampRaw: 1710939900000,
    intent: { operation: "average", metric: "order_value", filters: "date >= last 30 days" },
    nlAnswer: "The average order value over the last 30 days is $124.50."
  },
  {
    id: "h8",
    question: "Show revenue by product.",
    dataset: "sales.csv",
    resultTitle: "24 products",
    status: "Verified",
    timestamp: "March 18, 2026 · 11:30 AM",
    timestampRaw: 1710761400000,
    intent: { operation: "group", group_by: "product", metric: "revenue", sort_order: "desc" },
    nlAnswer: "Here is the revenue breakdown grouped by product."
  }
];

function StatusBadge({ status }: { status: AnalysisRecord["status"] }) {
  if (status === "Verified") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  if (status === "Failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-400 text-xs font-medium">
      <RotateCw className="w-3.5 h-3.5 animate-spin" /> {status}
    </span>
  );
}

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
        <h1 className="text-base font-bold text-white capitalize leading-none">Analysis History</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Review your previous questions and verified insights.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-500 w-40">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs truncate">Search...</span>
        </div>
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
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
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

function DetailsModal({ record, onClose, onRerun }: { record: AnalysisRecord | null; onClose: () => void; onRerun: () => void }) {
  if (!record) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/[0.06] gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Analysis Result</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5" /> {record.dataset}</span>
              <span>11,000 rows</span>
              <span className="hidden sm:inline">•</span>
              <span>{record.timestamp.split('·')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={onRerun} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">
              <RotateCw className="w-3.5 h-3.5" /> Re-run
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          <div className="bg-white/[0.03] border border-white/10 px-5 py-4 rounded-xl">
            <p className="text-sm sm:text-base font-medium text-slate-200">{record.question}</p>
          </div>

          {record.status === "Failed" ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">{record.resultTitle}</h4>
              <p className="text-sm text-slate-300">{record.failReason}</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-900/10 to-slate-900/30 border border-blue-500/15 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500/10 px-3 py-1 rounded-bl-lg border-b border-l border-blue-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] font-bold tracking-wider uppercase text-blue-400">Verified Result</span>
              </div>
              
              <div className="mt-2">
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{record.resultTitle}</p>
                {record.resultValue && <p className="text-xl sm:text-2xl font-medium text-blue-400 mb-5">{record.resultValue}</p>}
                
                {record.metrics && (
                  <div className="flex flex-wrap gap-6 border-t border-white/10 pt-5 mt-2">
                    {record.metrics.map(m => (
                      <div key={m.label}>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{m.label}</p>
                        <p className="text-base font-semibold text-slate-200">{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {record.nlAnswer && (
            <div>
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Answer</h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                {record.nlAnswer}
              </p>
            </div>
          )}

          {record.intent && (
            <div className="border border-white/5 bg-black/20 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Analysis Details</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Deterministic analysis</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(record.intent).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{k.replace('_', ' ')}</span>
                    <span className="font-mono text-xs text-blue-300 bg-blue-900/20 border border-blue-500/10 px-2 py-1.5 rounded inline-block w-fit">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Applied Context Mock */}
          <div className="border border-white/5 bg-white/[0.02] rounded-xl p-4">
             <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Applied Context</h4>
             <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 mb-1">Date</p>
                  <p className="text-slate-300">March 1, 2024 — March 31, 2024</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Rows analyzed</p>
                  <p className="text-slate-300">11,000</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 mb-2">Available dimensions</p>
                  <div className="flex flex-wrap gap-2">
                    {["Product", "Location", "Customer", "Channel", "Date"].map(d => (
                      <span key={d} className="px-2 py-0.5 bg-white/[0.04] border border-white/5 text-[10px] text-slate-400 rounded">{d}</span>
                    ))}
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-slate-300 text-xs font-medium rounded-lg transition-colors">
              <Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copy Answer</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-slate-300 text-xs font-medium rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export Result</span>
            </button>
          </div>
          <button onClick={onClose} className="px-5 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium rounded-xl transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

function DeleteModal({ record, onClose, onConfirm }: { record: AnalysisRecord | null; onClose: () => void; onConfirm: () => void }) {
  if (!record) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0B1120] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete analysis?</h3>
        </div>
        <p className="text-sm text-slate-300 mb-6">
          This analysis will be permanently removed from your history.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm font-medium rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_0_15px_-5px_rgba(220,38,38,0.5)]">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page component
// ────────────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>(MOCK_HISTORY);
  
  const [search, setSearch] = useState("");
  const [datasetFilter, setDatasetFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [viewRecord, setViewRecord] = useState<AnalysisRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<AnalysisRecord | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [dsOpen, setDsOpen] = useState(false);
  const [stOpen, setStOpen] = useState(false);

  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const matchSearch = search ? h.question.toLowerCase().includes(search.toLowerCase()) || h.dataset.toLowerCase().includes(search.toLowerCase()) : true;
      const matchDs = datasetFilter === "All" ? true : h.dataset === datasetFilter;
      const matchStatus = statusFilter === "All" ? true : h.status === statusFilter;
      return matchSearch && matchDs && matchStatus;
    }).sort((a, b) => b.timestampRaw - a.timestampRaw); // newest first default
  }, [history, search, datasetFilter, statusFilter]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleRerun(q?: string) {
    // In a real app, you might pass the question via query param or global state
    router.push("/analyze");
  }

  function confirmDelete() {
    if (deleteRecord) {
      setHistory(prev => prev.filter(h => h.id !== deleteRecord.id));
      setDeleteRecord(null);
    }
  }

  const STATS = [
    { label: "Total Analyses", value: history.length.toString(), icon: BarChart3, color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/20" },
    { label: "This Month", value: "12", icon: CalendarDays, color: "text-violet-400", bg: "bg-violet-600/10 border-violet-500/20" },
    { label: "Verified Results", value: history.filter(h => h.status === "Verified").length.toString(), icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/20" },
    { label: "Datasets Analyzed", value: "8", icon: Database, color: "text-amber-400", bg: "bg-amber-600/10 border-amber-500/20" },
  ];

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.05]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]" />
        </div>
      </div>

      <Sidebar active="history" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-y-auto">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Analysis History</h2>
              <p className="text-slate-400 text-sm mt-1.5">View, search, and revisit your previous data analysis results.</p>
            </div>
            <button onClick={() => router.push("/analyze")} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]">
              <Plus className="w-4 h-4" /> New Analysis
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
                  <div className={`p-1.5 rounded-lg border ${s.bg}`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter Bar */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search questions or datasets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Dataset Custom Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setDsOpen(!dsOpen)}
                  className="flex items-center justify-between min-w-[160px] pl-3 pr-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                >
                  <span>{datasetFilter === "All" ? "All datasets" : datasetFilter}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {dsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 w-full bg-[#0B1120] border border-white/10 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                      {[
                        { label: "All datasets", val: "All" },
                        { label: "sales.csv", val: "sales.csv" },
                        { label: "customer_analysis.csv", val: "customer_analysis.csv" },
                        { label: "regional_sales.csv", val: "regional_sales.csv" },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => { setDatasetFilter(opt.val); setDsOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${datasetFilter === opt.val ? "bg-blue-600/15 text-blue-400" : "text-slate-300 hover:bg-white/[0.05]"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Status Custom Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setStOpen(!stOpen)}
                  className="flex items-center justify-between min-w-[120px] pl-3 pr-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                >
                  <span>{statusFilter === "All" ? "All status" : statusFilter}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                {stOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setStOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 w-full bg-[#0B1120] border border-white/10 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                      {[
                        { label: "All status", val: "All" },
                        { label: "Verified", val: "Verified" },
                        { label: "Failed", val: "Failed" },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          onClick={() => { setStatusFilter(opt.val); setStOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${statusFilter === opt.val ? "bg-blue-600/15 text-blue-400" : "text-slate-300 hover:bg-white/[0.05]"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                <Filter className="w-4 h-4" /> Newest first
              </button>
            </div>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <History className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No analysis history yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
                Your completed analyses will appear here after you start asking questions about your datasets.
              </p>
              <div className="flex gap-4">
                <button onClick={() => router.push("/analyze")} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl">Start Analyzing</button>
                <button onClick={() => router.push("/datasets")} className="px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-300 text-sm font-medium rounded-xl">View My Datasets</button>
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-12 text-center flex flex-col items-center">
              <Search className="w-8 h-8 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No analyses found</h3>
              <p className="text-sm text-slate-400 mb-6">Try a different question, dataset, or filter.</p>
              <button onClick={() => { setSearch(""); setDatasetFilter("All"); setStatusFilter("All"); }} className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-sm font-medium rounded-lg">Clear Filters</button>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-visible mb-6">
              
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-1/3">Question</th>
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dataset</th>
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Result</th>
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Analyzed</th>
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((h, i) => (
                      <tr key={h.id} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === filteredHistory.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-200 line-clamp-2">{h.question}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border border-white/5 rounded-md text-xs text-slate-400">
                            <FileSpreadsheet className="w-3.5 h-3.5" /> {h.dataset}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {h.status === "Failed" ? (
                            <span className="text-sm text-red-400">Failed</span>
                          ) : (
                            <div>
                              <p className="text-sm font-semibold text-white">{h.resultTitle}</p>
                              {h.resultValue && <p className="text-xs text-blue-400 mt-0.5 font-medium">{h.resultValue}</p>}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-400">{h.timestamp.split('·')[0].trim()}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{h.timestamp.split('·')[1]?.trim()}</p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={h.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewRecord(h)} className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-colors">
                              View
                            </button>
                            <div className="relative">
                              <button onClick={() => setMenuOpenId(menuOpenId === h.id ? null : h.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              {menuOpenId === h.id && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl z-30 py-1">
                                  <button onClick={() => { setViewRecord(h); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]">View Result</button>
                                  <button onClick={() => { handleRerun(h.question); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]">Re-run</button>
                                  <div className="my-1 border-t border-white/[0.05]" />
                                  <button onClick={() => { setDeleteRecord(h); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden flex flex-col">
                {filteredHistory.map((h, i) => (
                  <div key={h.id} className={`p-4 ${i !== 0 ? 'border-t border-white/[0.05]' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="text-sm font-medium text-slate-200">{h.question}</p>
                      <div className="relative">
                        <button onClick={() => setMenuOpenId(menuOpenId === h.id ? null : h.id)} className="p-1 text-slate-400 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {menuOpenId === h.id && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-[#0B1120] border border-white/10 rounded-lg shadow-xl z-30 py-1">
                            <button onClick={() => { handleRerun(h.question); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05]">Re-run</button>
                            <button onClick={() => { setDeleteRecord(h); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4">
                      <div>
                        <p className="text-slate-500 mb-1">Dataset</p>
                        <p className="text-slate-300 truncate">{h.dataset}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Status</p>
                        <StatusBadge status={h.status} />
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 mb-1">Result</p>
                        {h.status === "Failed" ? <span className="text-red-400">Failed</span> : (
                          <p className="font-semibold text-white">{h.resultTitle} {h.resultValue && <span className="text-blue-400 ml-1">{h.resultValue}</span>}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <p className="text-[10px] text-slate-500">{h.timestamp}</p>
                      <button onClick={() => setViewRecord(h)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-lg">
                        View Result
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Pagination */}
          {filteredHistory.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>Showing 1–{filteredHistory.length} of {history.length} analyses</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors">Previous</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm">1</button>
                <button className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors text-slate-300">2</button>
                <button className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors text-slate-300">3</button>
                <button className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors">Next</button>
              </div>
            </div>
          )}

          {/* Security Footer */}
          <div className="mt-12 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Your analysis history is private</h4>
                <p className="text-xs text-slate-500 mt-0.5">Only analyses associated with your account are displayed here.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Private", "Session Protected", "Verified Analytics"].map((badge) => (
                <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full whitespace-nowrap">
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </main>
      </div>

      <DetailsModal record={viewRecord} onClose={() => setViewRecord(null)} onRerun={() => { handleRerun(viewRecord?.question); setViewRecord(null); }} />
      <DeleteModal record={deleteRecord} onClose={() => setDeleteRecord(null)} onConfirm={confirmDelete} />

    </div>
  );
}
