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
  Download,
  CheckCircle2,
  UserPlus,
  UserMinus,
  Shield,
  Smartphone,
  Monitor,
  Apple
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Types & Mock Data
// ────────────────────────────────────────────────────────────────────────────

type UserRole = "Normal User" | "Administrator";
type UserStatus = "Active" | "Suspended" | "Inactive";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  datasets: number;
  analyses: number;
  lastActive: string;
  created: string;
  phone?: string;
}

const MOCK_USERS: UserRecord[] = [
  { id: "1", name: "Shivam Pal", email: "shivam@example.com", role: "Normal User", status: "Active", datasets: 6, analyses: 42, lastActive: "Just now", created: "Aug 2026", phone: "+91 XXXXX XXXXX" },
  { id: "2", name: "Aarav Mehta", email: "aarav@example.com", role: "Normal User", status: "Active", datasets: 12, analyses: 87, lastActive: "5 min ago", created: "Jul 2026", phone: "+91 XXXXX XXXXX" },
  { id: "3", name: "Priya Sharma", email: "priya@example.com", role: "Normal User", status: "Active", datasets: 4, analyses: 31, lastActive: "12 min ago", created: "Jun 2026", phone: "+91 XXXXX XXXXX" },
  { id: "4", name: "Rahul Kumar", email: "rahul@example.com", role: "Normal User", status: "Suspended", datasets: 2, analyses: 14, lastActive: "2 days ago", created: "May 2026", phone: "+91 XXXXX XXXXX" },
  { id: "5", name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active", datasets: 0, analyses: 0, lastActive: "Just now", created: "Jan 2026", phone: "+91 XXXXX XXXXX" },
  { id: "6", name: "Neha Singh", email: "neha@example.com", role: "Normal User", status: "Inactive", datasets: 1, analyses: 5, lastActive: "3 weeks ago", created: "Apr 2026", phone: "+91 XXXXX XXXXX" },
  { id: "7", name: "Vikram Patel", email: "vikram@example.com", role: "Normal User", status: "Active", datasets: 8, analyses: 56, lastActive: "1 hour ago", created: "Jul 2026", phone: "+91 XXXXX XXXXX" },
  { id: "8", name: "Anjali Desai", email: "anjali@example.com", role: "Normal User", status: "Active", datasets: 3, analyses: 19, lastActive: "3 hours ago", created: "Aug 2026", phone: "+91 XXXXX XXXXX" },
  { id: "9", name: "Rohit Verma", email: "rohit@example.com", role: "Normal User", status: "Suspended", datasets: 5, analyses: 28, lastActive: "1 week ago", created: "Mar 2026", phone: "+91 XXXXX XXXXX" },
  { id: "10", name: "Sanjay Gupta", email: "sanjay@example.com", role: "Normal User", status: "Active", datasets: 7, analyses: 33, lastActive: "4 hours ago", created: "Jun 2026", phone: "+91 XXXXX XXXXX" },
  { id: "11", name: "Pooja Reddy", email: "pooja@example.com", role: "Normal User", status: "Inactive", datasets: 2, analyses: 8, lastActive: "1 month ago", created: "Feb 2026", phone: "+91 XXXXX XXXXX" },
  { id: "12", name: "Karan Johar", email: "karan@example.com", role: "Normal User", status: "Active", datasets: 15, analyses: 102, lastActive: "10 min ago", created: "Jan 2026", phone: "+91 XXXXX XXXXX" }
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
          All Systems Operational
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
// Main Admin Users Page
// ────────────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Forms
  const [deleteConfirm, setDeleteConfirm] = useState("");
  
  // Menus
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Derived state
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  // Actions
  const openModal = (user: UserRecord, type: "details" | "activity" | "sessions" | "suspend" | "delete") => {
    setSelectedUser(user);
    setActionMenuOpen(null);
    if (type === "details") setDetailsModal(true);
    if (type === "activity") setActivityModal(true);
    if (type === "sessions") setSessionsModal(true);
    if (type === "suspend") setSuspendModal(true);
    if (type === "delete") setDeleteModal(true);
  };

  const handleSuspend = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: "Suspended" } : u));
    }
    setSuspendModal(false);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    }
    setDeleteModal(false);
    setDeleteConfirm("");
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRoleFilter("All");
    setDeviceFilter("All");
    setDateFilter("All Time");
    setCurrentPage(1);
  };

  return (
    <div className="h-screen bg-[#070B14] text-slate-50 flex overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[100px]" />
      </div>

      <AdminSidebar active="users" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-full overflow-hidden">
        <AdminTopBar pageTitle="Users" subtitle="Manage registered accounts and access status." setMobileOpen={setMobileOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* User Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {[
                { label: "TOTAL USERS", value: "1,248", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "ACTIVE USERS", value: "1,176", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "NEW THIS MONTH", value: "84", icon: UserPlus, color: "text-cyan-400", bg: "bg-cyan-500/10", trend: "+12%" },
                { label: "SUSPENDED", value: "21", icon: UserMinus, color: "text-red-400", bg: "bg-red-500/10" },
                { label: "ADMINS", value: "3", icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/10" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.03] transition-colors overflow-hidden group">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                      <stat.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  {stat.trend && <p className="text-xs text-emerald-400">{stat.trend}</p>}
                </div>
              ))}
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
                    placeholder="Search users by name or email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0B1120] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-sm font-medium text-slate-300 transition-all flex-shrink-0">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Export
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400 mr-1">Filters:</span>
                </div>
                
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                  <option value="All">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                  <option value="All">Role: All</option>
                  <option value="Normal User">Normal User</option>
                  <option value="Administrator">Administrator</option>
                </select>

                <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                  <option value="All">Device: All</option>
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                </select>

                <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-[#0B1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer">
                  <option value="All Time">Date: All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>

                {(search || statusFilter !== "All" || roleFilter !== "All" || deviceFilter !== "All" || dateFilter !== "All Time") && (
                  <button onClick={handleClearFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 transition-colors ml-auto">
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            {filteredUsers.length === 0 ? (
              // Empty State
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">No users found</h3>
                <p className="text-sm text-slate-400 mb-6">Try adjusting your search or filters.</p>
                <button onClick={handleClearFilters} className="px-5 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
                  Clear Filters
                </button>
              </div>
            ) : (
              // User Table & Mobile Cards
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
                {/* Desktop/Tablet Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                      <tr>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Datasets</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Analyses</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Last Active</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Created</th>
                        <th className="px-5 py-4 font-semibold text-[11px] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-400 font-medium text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${user.role === 'Administrator' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              user.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>
                              {user.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                              {user.status === 'Suspended' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                              {user.status === 'Inactive' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                              {user.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400">{user.datasets === 0 ? "—" : user.datasets}</td>
                          <td className="px-5 py-3.5 text-slate-400">{user.analyses === 0 ? "—" : user.analyses}</td>
                          <td className="px-5 py-3.5 text-slate-500">{user.lastActive}</td>
                          <td className="px-5 py-3.5 text-slate-500">{user.created}</td>
                          <td className="px-5 py-3.5 text-right relative">
                            <button 
                              onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {actionMenuOpen === user.id && (
                              <div className="absolute right-8 top-10 mt-1 w-40 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                                <button onClick={() => openModal(user, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left">View User</button>
                                <button onClick={() => openModal(user, "sessions")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left">View Sessions</button>
                                <button onClick={() => openModal(user, "activity")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left">View Activity</button>
                                <div className="border-t border-white/[0.06]" />
                                <button onClick={() => openModal(user, "suspend")} className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors text-left">Suspend User</button>
                                <button onClick={() => openModal(user, "delete")} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left">Delete User</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-white/[0.06]">
                  {paginatedUsers.map(user => (
                    <div key={user.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-400 font-medium text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenuOpen === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 text-left">
                              <button onClick={() => openModal(user, "details")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View User</button>
                              <button onClick={() => openModal(user, "sessions")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Sessions</button>
                              <button onClick={() => openModal(user, "activity")} className="w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05] text-left">View Activity</button>
                              <div className="border-t border-white/[0.06]" />
                              <button onClick={() => openModal(user, "suspend")} className="w-full px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 text-left">Suspend User</button>
                              <button onClick={() => openModal(user, "delete")} className="w-full px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 text-left">Delete User</button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${user.role === 'Administrator' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          user.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {user.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          {user.status === 'Suspended' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                          {user.status === 'Inactive' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                          {user.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-white/[0.04]">
                        <span>Datasets: {user.datasets}</span>
                        <span>Active: {user.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing: <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of {filteredUsers.length} users
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

            {/* Admin Security Banner */}
            <div className="mt-8 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-cyan-100 mb-1">Protected Administrative Data</h4>
                <p className="text-xs text-cyan-500/70 leading-relaxed max-w-2xl">
                  User management is restricted to authorized administrators and is fully isolated from normal user workspaces.
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

      {/* User Details Modal */}
      <Modal open={detailsModal} onClose={() => setDetailsModal(false)} title="User Details" maxWidth="max-w-xl">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-xl">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-none mb-1">{selectedUser.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{selectedUser.role}</span>
                  <span className="text-slate-600">·</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${selectedUser.status === 'Active' ? 'text-emerald-400' : selectedUser.status === 'Suspended' ? 'text-red-400' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === 'Active' ? 'bg-emerald-400' : selectedUser.status === 'Suspended' ? 'bg-red-400' : 'bg-slate-400'}`} />
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Account</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm text-slate-200">{selectedUser.name}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-slate-200">{selectedUser.email}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm text-slate-200">{selectedUser.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Account Information</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Role</p>
                  <p className="text-sm text-slate-200">{selectedUser.role}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm text-slate-200">{selectedUser.created}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Last Active</p>
                  <p className="text-sm text-slate-200">{selectedUser.lastActive}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Activity</p>
                <div className="flex gap-4">
                  <div className="flex-1 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-medium">Datasets</p>
                    <p className="text-2xl font-bold text-white">{selectedUser.datasets}</p>
                  </div>
                  <div className="flex-1 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                    <p className="text-[10px] text-indigo-400 uppercase tracking-wider mb-1 font-medium">Analyses</p>
                    <p className="text-2xl font-bold text-white">{selectedUser.analyses}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Security</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Email Verified
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Session Active
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-end gap-3">
              <button onClick={() => setDetailsModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* User Activity Modal */}
      <Modal open={activityModal} onClose={() => setActivityModal(false)} title="User Activity" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="relative border-l border-white/[0.1] ml-3 space-y-6 pb-2">
            {[
              { text: "Logged in", time: "2 minutes ago", icon: User, color: "text-blue-400", bg: "bg-blue-500/20" },
              { text: "Uploaded sales.csv", time: "10 minutes ago", icon: Database, color: "text-indigo-400", bg: "bg-indigo-500/20" },
              { text: "Completed analysis", time: "18 minutes ago", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/20" },
              { text: "Viewed dataset", time: "25 minutes ago", icon: Search, color: "text-slate-300", bg: "bg-white/10" },
              { text: "Logged out", time: "Yesterday", icon: LogOut, color: "text-slate-400", bg: "bg-white/5" },
            ].map((ev, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border border-[#0B1120] ${ev.bg}`}>
                  <ev.icon className={`w-3 h-3 ${ev.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{ev.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex justify-end">
            <button onClick={() => setActivityModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
          </div>
        </div>
      </Modal>

      {/* User Sessions Modal */}
      <Modal open={sessionsModal} onClose={() => setSessionsModal(false)} title="User Sessions" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
            <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400 mt-0.5">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">Windows Laptop</h4>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-medium rounded-full uppercase tracking-wider">Current Session</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Chrome</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="p-2.5 bg-white/[0.05] rounded-lg text-slate-400 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Android</h4>
              <p className="text-xs text-slate-400 mt-1">Chrome Mobile · 2 hours ago</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] opacity-75">
            <div className="p-2.5 bg-white/[0.05] rounded-lg text-slate-500 mt-0.5">
              <Apple className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-300">MacBook</h4>
              <p className="text-xs text-slate-500 mt-1">Safari · 2 days ago</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500">Inactive</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/[0.06] flex justify-between items-center">
            <button className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
              Sign Out Session
            </button>
            <button onClick={() => setSessionsModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Close</button>
          </div>
        </div>
      </Modal>

      {/* Suspend Confirmation Modal */}
      <Modal open={suspendModal} onClose={() => setSuspendModal(false)} title="Suspend this user?">
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80">The user will no longer be able to access their account until reactivated.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Reason for suspension (Optional)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none" 
              placeholder="e.g. Violation of TOS" 
            />
          </div>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-2">
            <button onClick={() => setSuspendModal(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button 
              onClick={handleSuspend}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 text-sm font-semibold rounded-xl transition-all"
            >
              Suspend User
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete this user?">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">This permanently removes the user account and associated data. This action cannot be undone.</p>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm text-slate-300 mb-1.5">To confirm, type <span className="font-mono font-bold text-white bg-white/10 px-1 rounded">DELETE</span></label>
            <input 
              type="text" 
              value={deleteConfirm} 
              onChange={e => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#070B14] border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-red-500/50 outline-none font-mono" 
              placeholder="DELETE" 
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06] mt-4">
            <button onClick={() => { setDeleteModal(false); setDeleteConfirm("") }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button 
              disabled={deleteConfirm !== "DELETE"} 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
