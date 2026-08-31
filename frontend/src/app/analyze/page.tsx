"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  FileSpreadsheet,
  Menu,
  X,
  ArrowUp,
  Info,
  Clock,
  Download,
  Copy,
  Plus,
  Circle,
  Table as TableIcon,
  BarChart,
  Filter,
  AlertCircle
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  size: string;
  status: string;
  dateRange: string;
  dimensions: string[];
}

const MOCK_DATASETS: Dataset[] = [
  { 
    id: "1", name: "sales.csv", rows: 11000, columns: 9, size: "4.8 MB", status: "Ready", 
    dateRange: "Jan 1, 2024 — Nov 29, 2024", dimensions: ["Product", "Location", "Customer", "Channel", "Date"] 
  },
  { 
    id: "2", name: "customer_analysis.csv", rows: 18420, columns: 12, size: "7.2 MB", status: "Ready", 
    dateRange: "Mar 1, 2023 — Aug 27, 2026", dimensions: ["Customer ID", "Segment", "LTV", "Region", "Sign Up Date"] 
  },
  { 
    id: "3", name: "regional_sales.csv", rows: 32190, columns: 8, size: "14.6 MB", status: "Ready", 
    dateRange: "Jan 1, 2025 — Aug 26, 2026", dimensions: ["Region", "State", "City", "Revenue", "Units"] 
  },
  { 
    id: "4", name: "inventory.csv", rows: 22681, columns: 6, size: "9.1 MB", status: "Processing", 
    dateRange: "Jan 1, 2026 — Aug 25, 2026", dimensions: ["SKU", "Warehouse", "Stock", "Reorder Level"] 
  }
];

const EXAMPLE_QUESTIONS = [
  "Which product generated the highest revenue?",
  "Show revenue by location",
  "What was the total revenue in March?",
  "Which channel generated the most sales?",
  "Show revenue by product and location",
  "How many units were sold in Virginia?"
];

type AnalysisState = "idle" | "analyzing" | "result" | "error" | "no_data";

interface MockResult {
  question: string;
  type: "single" | "table" | "multi";
  mainResult?: string;
  mainValue?: string;
  metrics?: { label: string; value: string }[];
  date?: string;
  nlAnswer?: string;
  intent?: Record<string, string>;
  tableData?: Record<string, string | number>[];
  tableCols?: string[];
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
        <h1 className="text-base font-bold text-white capitalize leading-none">Analyze</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Ask questions and discover verified insights from your data.</p>
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
// Processing State Component
// ────────────────────────────────────────────────────────────────────────────
function ProcessingState() {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const intervals = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2600),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  const steps = [
    { label: "Understanding question", idx: 0 },
    { label: "Building structured intent", idx: 1 },
    { label: "Analyzing dataset", idx: 2 },
    { label: "Preparing verified answer", idx: 3 },
  ];

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 relative">
        <Sparkles className="w-7 h-7 text-blue-400 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-[spin_3s_linear_infinite] border-t-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-6">Analyzing sales.csv...</h3>
      
      <div className="w-full max-w-sm space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            {step > s.idx ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : step === s.idx ? (
              <div className="w-5 h-5 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-slate-700" />
            )}
            <span className={`text-sm font-medium transition-colors ${step > s.idx ? "text-slate-300" : step === s.idx ? "text-blue-400" : "text-slate-600"}`}>
              {s.idx + 1 < 10 ? `0${s.idx + 1}` : s.idx + 1} {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Result Components
// ────────────────────────────────────────────────────────────────────────────

function IntentPanel({ intent }: { intent: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-white/5 bg-black/20 rounded-xl overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Info className="w-4 h-4 text-blue-400" /> Analysis Details
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-[#04060A]">
          {Object.entries(intent).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{k.replace('_', ' ')}</span>
              <span className="font-mono text-xs text-blue-300 bg-blue-900/20 px-2 py-1 rounded inline-block w-fit">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultTable({ data, cols }: { data: Record<string, string | number>[], cols: string[] }) {
  return (
    <div className="mt-6 border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.01]">
              {cols.map(c => (
                <th key={c} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-b border-white/[0.04] hover:bg-white/[0.03] ${i === data.length - 1 ? 'border-b-0' : ''}`}>
                {cols.map(c => (
                  <td key={c} className="px-4 py-3 text-sm text-slate-300">{row[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
        <span>{data.length} results</span>
        <span>Showing 1–{data.length}</span>
      </div>
    </div>
  );
}

function MockChart() {
  const data = [
    { label: "Drone", val: 100 },
    { label: "Camera", val: 86 },
    { label: "Laptop", val: 68 },
    { label: "Smart TV", val: 64 }
  ];
  return (
    <div className="mt-6 border border-white/10 rounded-xl p-5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-medium text-white">Revenue by Product</h4>
        <div className="flex bg-white/[0.05] rounded-lg p-0.5 border border-white/5">
          <button className="px-2 py-1 bg-white/[0.1] rounded-md shadow-sm text-white"><BarChart className="w-3.5 h-3.5" /></button>
          <button className="px-2 py-1 text-slate-500 hover:text-slate-300"><TableIcon className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="space-y-4">
        {data.map(d => (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">{d.label}</span>
              <span className="text-slate-500 font-mono">{(d.val * 2589).toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page logic
// ────────────────────────────────────────────────────────────────────────────
export default function AnalyzePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDs, setSelectedDs] = useState<Dataset | null>(null);
  const [dsOpen, setDsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<AnalysisState>("idle");
  const [resultData, setResultData] = useState<MockResult | null>(null);
  const [chartMode] = useState(true);

  const MOCK_RESULTS: Record<string, MockResult> = {
    "Which product generated the highest revenue in March?": {
      question: "Which product generated the highest revenue in March?",
      type: "single",
      mainResult: "Drone",
      mainValue: "$258,962.42",
      metrics: [{ label: "Units Sold", value: "130" }, { label: "Orders", value: "41" }],
      date: "March 2024",
      nlAnswer: "The product that generated the highest revenue in March was the Drone, with a revenue of $258,962.42.",
      intent: { operation: "group", group_by: "product", metric: "revenue", limit: "1", sort_order: "desc", filters: "date: March" }
    },
    "What was the total revenue in Virginia?": {
      question: "What was the total revenue in Virginia?",
      type: "single",
      mainResult: "$411,098.58",
      date: "All time",
      nlAnswer: "The total revenue generated in Virginia across all recorded periods is $411,098.58.",
      intent: { operation: "total", metric: "revenue", filters: "location: Virginia" }
    },
    "Show revenue by product": {
      question: "Show revenue by product",
      type: "table",
      nlAnswer: "Here is the revenue breakdown grouped by product.",
      intent: { operation: "group", group_by: "product", metric: "revenue", sort_order: "desc" },
      tableCols: ["Product", "Revenue", "Units Sold", "Orders"],
      tableData: [
        { Product: "Drone", Revenue: "$2,537,181.00", "Units Sold": "1,286", Orders: "433" },
        { Product: "Camera", Revenue: "$2,189,449.14", "Units Sold": "1,304", Orders: "421" },
        { Product: "Laptop", Revenue: "$1,749,381.14", "Units Sold": "1,411", Orders: "472" },
        { Product: "Smart TV", Revenue: "$1,629,071.19", "Units Sold": "1,433", Orders: "481" }
      ]
    },
    "Show revenue by product, location and channel": {
      question: "Show revenue by product, location and channel",
      type: "multi",
      nlAnswer: "Here is the multi-dimensional revenue breakdown by product, location, and channel.",
      intent: { operation: "group", group_by: "product, location, channel", metric: "revenue" },
      tableCols: ["Product", "Location", "Channel", "Revenue", "Units", "Orders"],
      tableData: [
        { Product: "Smart TV", Location: "Virginia", Channel: "Phone", Revenue: "$5,592.70", Units: "4", Orders: "3" },
        { Product: "Camera", Location: "Virginia", Channel: "Website", Revenue: "$4,219.45", Units: "6", Orders: "5" },
        { Product: "Drone", Location: "California", Channel: "Retail", Revenue: "$3,812.00", Units: "2", Orders: "2" },
      ]
    }
  };

  function handleAnalyze(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!selectedDs || !question.trim()) return;
    
    // Check if error state trigger
    if (question.toLowerCase().includes("error")) {
      setStatus("error");
      return;
    }
    if (question.toLowerCase().includes("no matching")) {
      setStatus("no_data");
      return;
    }

    setStatus("analyzing");
    
    setTimeout(() => {
      // Find matching mock or default to first
      const res = MOCK_RESULTS[question] || MOCK_RESULTS["Which product generated the highest revenue in March?"];
      // deep copy to avoid mutation reference issues if needed, but not strict here
      setResultData({ ...res, question: question });
      setStatus("result");
    }, 3200);
  }

  function handleChip(q: string) {
    setQuestion(q);
  }

  function reset() {
    setStatus("idle");
    setQuestion("");
    setResultData(null);
  }

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden">
      
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.05]">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]" />
        </div>
      </div>

      <Sidebar active="analyze" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 min-w-0 relative z-10 overflow-y-auto">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Header & Dataset Selector */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ask your data</h2>
              <p className="text-slate-400 text-sm mt-1.5">Select a dataset and ask questions in plain English.</p>
            </div>
            
            <div className="relative w-full sm:w-64 z-20">
              <button 
                onClick={() => setDsOpen(!dsOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-left hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  {selectedDs ? (
                    <>
                      <p className="text-sm font-medium text-slate-200 truncate">{selectedDs.name}</p>
                      <p className="text-[10px] text-slate-500">{selectedDs.rows.toLocaleString()} rows · {selectedDs.size}</p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-slate-400">Select dataset...</p>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              
              {dsOpen && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-[#0B1120] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                  {MOCK_DATASETS.filter(d => d.status === "Ready").map(ds => (
                    <button
                      key={ds.id}
                      onClick={() => { setSelectedDs(ds); setDsOpen(false); reset(); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.05] transition-colors ${selectedDs?.id === ds.id ? "bg-blue-600/10" : ""}`}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-200 truncate">{ds.name}</p>
                        <p className="text-[10px] text-slate-500">{ds.rows.toLocaleString()} rows</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dataset Info Card */}
          {selectedDs && status === "idle" && (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Rows / Cols</p>
                  <p className="text-sm font-medium text-slate-200">{selectedDs.rows.toLocaleString()} / {selectedDs.columns}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Size</p>
                  <p className="text-sm font-medium text-slate-200">{selectedDs.size}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Date Range</p>
                  <p className="text-xs font-medium text-slate-200 truncate" title={selectedDs.dateRange}>{selectedDs.dateRange}</p>
                </div>
              </div>
              <div className="hidden lg:block w-px h-10 bg-white/5 mx-2" />
              <div className="pt-3 sm:pt-0 border-t border-white/5 sm:border-0 sm:max-w-[200px]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Dimensions</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDs.dimensions.slice(0, 3).map(dim => (
                    <span key={dim} className="px-1.5 py-0.5 bg-white/[0.04] border border-white/5 text-[10px] text-slate-300 rounded">{dim}</span>
                  ))}
                  {selectedDs.dimensions.length > 3 && <span className="text-[10px] text-slate-500">+{selectedDs.dimensions.length - 3}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Empty State / Not Selected */}
          {!selectedDs && (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 flex flex-col items-center text-center mt-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a dataset to begin</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                Choose one of your uploaded datasets and start asking questions in natural language.
              </p>
              <Link href="/datasets" className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white text-sm font-medium rounded-xl transition-colors">
                Go to My Datasets
              </Link>
            </div>
          )}

          {/* IDLE QUESTION INPUT */}
          {selectedDs && status === "idle" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-1.5 transition-all focus-within:border-blue-500/50 focus-within:bg-blue-500/[0.02] focus-within:ring-4 focus-within:ring-blue-500/10">
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3">What would you like to know?</h3>
                  <form onSubmit={handleAnalyze} className="relative">
                    <textarea
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder="Ask a question about your data..."
                      className="w-full bg-transparent border-0 text-slate-200 placeholder:text-slate-600 text-lg sm:text-xl outline-none resize-none min-h-[100px] p-0 focus:ring-0"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
                    />
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Natural language</span>
                        <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Verified analysis</span>
                      </div>
                      <button 
                        type="submit"
                        disabled={!question.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:text-white/50 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_-6px_rgba(37,99,235,0.5)]"
                      >
                        Analyze <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-3">Try asking</p>
                <div className="flex flex-wrap gap-2.5">
                  {EXAMPLE_QUESTIONS.map(q => (
                    <button key={q} onClick={() => handleChip(q)} className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-slate-300 hover:text-white text-xs sm:text-sm rounded-full transition-colors text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYZING STATE */}
          {status === "analyzing" && (
            <div className="animate-in fade-in duration-300">
              <ProcessingState />
            </div>
          )}

          {/* RESULT STATE */}
          {status === "result" && resultData && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Question header */}
              <div className="flex items-start justify-between gap-4">
                <div className="bg-white/[0.04] border border-white/10 px-5 py-4 rounded-2xl flex-1">
                  <h3 className="text-lg sm:text-xl font-medium text-white">{resultData.question}</h3>
                </div>
                <button onClick={reset} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-slate-300 transition-colors" aria-label="New question">
                  <Plus className="w-5 h-5" /> <span className="hidden sm:inline text-sm font-medium">New</span>
                </button>
              </div>

              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_50px_-15px_rgba(37,99,235,0.15)]">
                <div className="absolute top-0 right-0 bg-blue-500/10 px-4 py-1.5 rounded-bl-xl border-b border-l border-blue-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">Verified Result</span>
                </div>

                {resultData.type === "single" && (
                  <div className="mt-2">
                    <p className="text-3xl sm:text-5xl font-bold text-white mb-2">{resultData.mainResult}</p>
                    {resultData.mainValue && <p className="text-xl sm:text-2xl font-medium text-blue-400 mb-6">{resultData.mainValue}</p>}
                    
                    {resultData.metrics && (
                      <div className="flex flex-wrap gap-6 border-t border-white/10 pt-6 mt-2">
                        {resultData.metrics.map(m => (
                          <div key={m.label}>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">{m.label}</p>
                            <p className="text-lg font-semibold text-slate-200">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(resultData.type === "table" || resultData.type === "multi") && (
                  <div className="mt-2">
                    {chartMode && resultData.type === "table" ? <MockChart /> : null}
                    <ResultTable data={resultData.tableData || []} cols={resultData.tableCols || []} />
                  </div>
                )}

                <div className="border-t border-white/10 pt-5 mt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> {selectedDs?.name}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Just now</span>
                    {resultData.date && <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> {resultData.date}</span>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-lg text-slate-300 text-sm transition-colors">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-lg text-slate-300 text-sm transition-colors">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>
              </div>

              {/* NL Answer */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 sm:p-8">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Answer</h4>
                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">{resultData.nlAnswer}</p>
              </div>

              {/* Intent */}
              {resultData.intent && <IntentPanel intent={resultData.intent} />}

            </div>
          )}

          {/* ERROR STATES */}
          {status === "error" && (
            <div className="bg-red-500/[0.03] border border-red-500/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Unable to analyze this question</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8">The selected dataset is not currently available for analysis or encountered an error.</p>
              <div className="flex gap-4">
                <button onClick={reset} className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium rounded-xl">Choose Another Dataset</button>
                <button onClick={() => setStatus("idle")} className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_-6px_rgba(220,38,38,0.5)]">Try Again</button>
              </div>
            </div>
          )}

          {status === "no_data" && (
            <div className="bg-amber-500/[0.03] border border-amber-500/20 rounded-2xl p-8 sm:p-12 flex flex-col items-center text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-5">
                <Filter className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No matching data found</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-8">No records matched the selected filters or question criteria.</p>
              <button onClick={() => setStatus("idle")} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_-6px_rgba(217,119,6,0.5)]">Ask Another Question</button>
            </div>
          )}

          {/* Security & History Footer */}
          {selectedDs && status !== "analyzing" && (
            <div className="mt-12 space-y-8 animate-in fade-in">
              <div className="border-t border-white/5 pt-8">
                <h4 className="text-sm font-semibold text-white mb-4">Recent Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EXAMPLE_QUESTIONS.slice(0, 3).map((q, i) => (
                    <button key={i} onClick={() => { setQuestion(q); handleAnalyze(); }} className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl text-left transition-colors group">
                      <p className="text-sm text-slate-300 group-hover:text-white mb-3 line-clamp-2">{q}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><Database className="w-3 h-3" /> sales.csv</span>
                        <span className="flex items-center gap-1 text-emerald-500/70"><ShieldCheck className="w-3 h-3" /> Verified</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Verified and private</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Results are generated from your selected dataset and are only available within your account.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Private Dataset", "Session Protected", "Verified Analytics"].map((badge) => (
                    <span key={badge} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-full whitespace-nowrap">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
