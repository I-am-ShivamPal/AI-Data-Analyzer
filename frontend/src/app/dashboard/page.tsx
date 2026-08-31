"use client";

import React, { useState } from "react";
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
  Upload,
  Send,
  Bell,
  ChevronDown,
  MoreHorizontal,
  BarChart3,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  Plus,
  Menu,
  X,
  ArrowUpRight,
  Rows3,
  Search,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  name: string;
  type: string;
  rows: number;
  size: string;
  status: "Ready" | "Processing" | "Failed";
  uploaded: string;
}

interface Analysis {
  id: string;
  question: string;
  result: string;
  value?: string;
  dataset: string;
  date: string;
  verified: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────────────────────────────────

const MOCK_DATASETS: Dataset[] = [
  { id: "1", name: "sales.csv",            type: "CSV", rows: 11000,  size: "4.8 MB",  status: "Ready",      uploaded: "Today"    },
  { id: "2", name: "customer_analysis.csv", type: "CSV", rows: 18420,  size: "7.2 MB",  status: "Ready",      uploaded: "Yesterday"},
  { id: "3", name: "regional_sales.csv",    type: "CSV", rows: 32190,  size: "14.6 MB", status: "Ready",      uploaded: "Aug 26"   },
  { id: "4", name: "inventory.csv",         type: "CSV", rows: 22681,  size: "9.1 MB",  status: "Processing", uploaded: "Aug 25"   },
];

const MOCK_ANALYSES: Analysis[] = [
  { id: "1", question: "Which product generated the highest revenue in March?", result: "Drone",         value: "$258,962.42", dataset: "sales.csv",          date: "Today, 10:14 AM",  verified: true },
  { id: "2", question: "What was the total revenue in Virginia?",               result: "$411,098.58",   value: undefined,     dataset: "regional_sales.csv", date: "Yesterday, 3:47 PM", verified: true },
  { id: "3", question: "Which channel generated the highest revenue?",          result: "Website",       value: "$1,204,771",  dataset: "sales.csv",          date: "Aug 26, 9:22 AM",  verified: true },
  { id: "4", question: "How many unique customers placed orders in Q1?",        result: "3,841",         value: undefined,     dataset: "customer_analysis.csv", date: "Aug 25, 2:30 PM", verified: true },
];

const EXAMPLE_QUESTIONS = [
  "Which product generated the highest revenue?",
  "Show revenue by location",
  "What was the total revenue in March?",
  "Which channel generated the most sales?",
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${map[status]}`}>
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
        {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-400/60" />}
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
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#070B14] border-r border-white/[0.06] h-full">
        {inner}
      </aside>

      {/* Mobile overlay */}
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
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const subtitles: Record<string, string> = {
    dashboard: "Your data analysis workspace",
    datasets:  "Manage your uploaded files",
    analyze:   "Ask questions about your data",
    history:   "View past analyses",
    profile:   "Manage your account",
    settings:  "Configure your preferences",
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-16 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Mobile menu button */}
      <button
        className="lg:hidden text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white capitalize leading-none">{pageTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitles[pageTitle] ?? ""}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search — desktop only */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-500 w-40">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs">Search...</span>
        </div>

        {/* Session active */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Session Active
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl p-3 z-50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Notifications</p>
              {[
                { title: "Dataset ready", body: "inventory.csv finished processing.", time: "2m ago" },
                { title: "Analysis complete", body: "Your query on sales.csv returned results.", time: "1h ago" },
              ].map((n, i) => (
                <div key={i} className="flex gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.body}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-lg"
            aria-label="User menu"
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
              {[
                { label: "Profile",   icon: User     },
                { label: "Settings",  icon: Settings },
              ].map((item) => (
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
// Welcome + Stats
// ────────────────────────────────────────────────────────────────────────────

function WelcomeHeader({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Good evening, Shivam</h2>
        <p className="text-slate-400 text-sm mt-1.5 max-w-lg">
          Upload your data, ask questions, and turn your datasets into verified insights.
        </p>
      </div>
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)] hover:shadow-[0_0_24px_-4px_rgba(59,130,246,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#070B14]"
        >
          <Upload className="w-4 h-4" />
          Upload Dataset
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-slate-200 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-xl">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Start Analysis
        </button>
      </div>
    </div>
  );
}

const STATS = [
  { label: "My Datasets",  value: "8",       sub: "2 uploaded this week",     icon: Database,  color: "text-blue-400",   bg: "bg-blue-600/10 border-blue-500/20"   },
  { label: "Total Rows",   value: "84,291",  sub: "Across your datasets",     icon: Rows3,     color: "text-violet-400", bg: "bg-violet-600/10 border-violet-500/20"},
  { label: "Analyses",     value: "42",      sub: "12 this month",            icon: BarChart3, color: "text-emerald-400",bg: "bg-emerald-600/10 border-emerald-500/20"},
  { label: "Storage Used", value: "286 MB",  sub: "of 1 GB per file limit",   icon: HardDrive, color: "text-amber-400",  bg: "bg-amber-600/10 border-amber-500/20"  },
];

function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/[0.12] transition-all duration-200 group"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
            <div className={`p-1.5 rounded-lg border ${s.bg} transition-all duration-200 group-hover:scale-110`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</p>
          <p className="text-xs text-slate-600">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Recent Datasets
// ────────────────────────────────────────────────────────────────────────────

function RecentDatasets({ datasets, onSelect }: { datasets: Dataset[]; onSelect: (d: Dataset) => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Datasets</h3>
          <p className="text-xs text-slate-500 mt-0.5">{datasets.length} datasets</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["Dataset", "Rows", "Size", "Status", "Uploaded", "Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datasets.map((ds, i) => (
              <tr
                key={ds.id}
                className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === datasets.length - 1 ? "border-b-0" : ""}`}
              >
                {/* Dataset name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{ds.name}</p>
                      <p className="text-[10px] text-slate-600">{ds.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-400">{fmtRows(ds.rows)}</td>
                <td className="px-5 py-3.5 text-sm text-slate-400">{ds.size}</td>
                <td className="px-5 py-3.5"><StatusBadge status={ds.status} /></td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{ds.uploaded}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelect(ds)}
                      disabled={ds.status !== "Ready"}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-lg"
                    >
                      Analyze
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === ds.id ? null : ds.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-lg"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === ds.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
                          {["View details", "Download", "Rename", "Delete"].map((action) => (
                            <button
                              key={action}
                              onClick={() => setOpenMenu(null)}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${action === "Delete" ? "text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"}`}
                            >
                              {action}
                            </button>
                          ))}
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
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Ask Your Data
// ────────────────────────────────────────────────────────────────────────────

function AskYourData({ datasets, selectedDs, setSelectedDs }: {
  datasets: Dataset[];
  selectedDs: Dataset;
  setSelectedDs: (d: Dataset) => void;
}) {
  const [question, setQuestion] = useState("");
  const [dsOpen, setDsOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setQuestion("");
    }, 2500);
  }

  function pickQuestion(q: string) {
    setQuestion(q);
  }

  const readyDatasets = datasets.filter((d) => d.status === "Ready");

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-600/15 rounded-lg border border-blue-500/25">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Ask Your Data</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select a dataset and ask a question in natural language.</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Dataset selector */}
        <div className="relative mb-4">
          <button
            onClick={() => setDsOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-left hover:border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60"
            aria-haspopup="listbox"
            aria-expanded={dsOpen}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">{selectedDs.name}</p>
              <p className="text-xs text-slate-500">{fmtRows(selectedDs.rows)} rows · {selectedDs.size}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${dsOpen ? "rotate-180" : ""}`} />
          </button>

          {dsOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20" role="listbox">
              {readyDatasets.map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => { setSelectedDs(ds); setDsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.05] transition-colors ${ds.id === selectedDs.id ? "bg-blue-600/10" : ""}`}
                  role="option"
                  aria-selected={ds.id === selectedDs.id}
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200">{ds.name}</p>
                    <p className="text-xs text-slate-500">{fmtRows(ds.rows)} rows · {ds.size}</p>
                  </div>
                  {ds.id === selectedDs.id && <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Question input */}
        <form onSubmit={handleAnalyze}>
          <div className="relative mb-4">
            <textarea
              id="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about your data..."
              rows={3}
              className="w-full px-4 pt-3 pb-12 bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 text-sm outline-none resize-none transition-all duration-200 focus:border-blue-500/60 focus:bg-blue-500/[0.03] focus:ring-2 focus:ring-blue-500/15 hover:border-white/20"
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze(e as unknown as React.FormEvent); }}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-[10px] text-slate-600 hidden sm:block">Ctrl+Enter to send</span>
              <button
                type="submit"
                disabled={!question.trim() || analyzing}
                aria-busy={analyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-[0_0_15px_-4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              >
                {analyzing ? (
                  <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Analyzing...</>
                ) : (
                  <><Send className="w-3 h-3" />Analyze</>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Example questions */}
        <div>
          <p className="text-xs text-slate-600 font-medium mb-2.5">Try asking</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => pickQuestion(q)}
                className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/30 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:rounded-xl"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Recent Analysis
// ────────────────────────────────────────────────────────────────────────────

function AnalysisCard({ item }: { item: Analysis }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/[0.12] transition-all duration-200 group">
      {/* Question */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-lg bg-slate-800/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare className="w-3 h-3 text-slate-400" />
        </div>
        <p className="text-sm text-slate-400 leading-snug">{item.question}</p>
      </div>

      {/* Result */}
      <div className="pl-8 mb-3">
        <div className="p-3 bg-blue-600/[0.07] border border-blue-500/20 rounded-xl">
          <p className="text-lg sm:text-xl font-bold text-white">{item.result}</p>
          {item.value && <p className="text-sm text-blue-400 font-medium mt-0.5">{item.value}</p>}
        </div>
      </div>

      {/* Metadata */}
      <div className="pl-8 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1"><Database className="w-3 h-3" />{item.dataset}</span>
          <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" />{item.date}</span>
        </div>
        {item.verified && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">Verified result</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentAnalysis({ items }: { items: Analysis[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Analysis</h3>
          <p className="text-xs text-slate-500 mt-0.5">{items.length} results</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
        {items.map((item) => (
          <AnalysisCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Security card
// ────────────────────────────────────────────────────────────────────────────

function SecurityCard() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1">Your data is private</h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
          Your datasets are isolated to your account and analysis results are generated from verified data processing.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["Session Protected", "Private Dataset", "Verified Analytics"].map((badge) => (
            <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Empty state
// ────────────────────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center mb-4">
        <Database className="w-7 h-7 text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">Start with your first dataset</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-5">
        Upload a CSV file up to 1 GB and start asking questions about your data.
      </p>
      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-[#070B14]"
      >
        <Plus className="w-4 h-4" />
        Upload Dataset
      </button>
      <p className="text-xs text-slate-600 mt-3">CSV files supported</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Upload modal (visual only)
// ────────────────────────────────────────────────────────────────────────────

function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B1120] border border-white/10 rounded-2xl p-7 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
            <Upload className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Upload Dataset</h3>
            <p className="text-xs text-slate-500">CSV files, up to 1 GB</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-8 text-center mb-5 transition-all duration-200 cursor-pointer group">
          <Upload className="w-8 h-8 text-slate-600 group-hover:text-blue-400 mx-auto mb-3 transition-colors duration-200" />
          <p className="text-sm text-slate-400 mb-1">Drag and drop your CSV file here</p>
          <p className="text-xs text-slate-600">or click to browse</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-5">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          Upload functionality will be available when backend is connected.
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [selectedDs, setSelectedDs]     = useState<Dataset>(MOCK_DATASETS[0]);
  const [uploadOpen, setUploadOpen]     = useState(false);
  const hasDatasets                     = MOCK_DATASETS.length > 0;
  const router                          = useRouter();

  const pageTitle = "dashboard";

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.07]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] opacity-[0.04]">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px]" />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        active="dashboard"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-y-auto">

        <TopBar pageTitle={pageTitle} setMobileOpen={setMobileOpen} />

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 max-w-7xl w-full mx-auto">

          <WelcomeHeader onUpload={() => setUploadOpen(true)} />

          <StatsGrid />

          {hasDatasets ? (
            <RecentDatasets
              datasets={MOCK_DATASETS}
              onSelect={(ds) => {
                setSelectedDs(ds);
                router.push("/analyze");
              }}
            />
          ) : (
            <EmptyState onUpload={() => setUploadOpen(true)} />
          )}

          <AskYourData
            datasets={MOCK_DATASETS}
            selectedDs={selectedDs}
            setSelectedDs={setSelectedDs}
          />

          <RecentAnalysis items={MOCK_ANALYSES} />

          <SecurityCard />

        </main>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

    </div>
  );
}
