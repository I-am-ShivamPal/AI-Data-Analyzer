import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Database, 
  CloudUpload, 
  MessageCircle, 
  BadgeCheck, 
  ShieldCheck, 
  Filter, 
  Layers, 
  Lock, 
  ArrowRight, 
  Send, 
  User, 
  Check, 
  Menu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>
        {/* Very faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 glass-card border-x-0 border-t-0 border-b-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-bold tracking-tight text-white">AI DATA ANALYZER</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="#security" className="hover:text-white transition-colors">Security</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5">
                Login
              </button>
              <button className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
                Get Started
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button className="text-slate-300 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-16">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-8">
            <Database className="w-3.5 h-3.5" />
            AI-Powered Data Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Ask your data. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Get intelligent answers.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Upload your data, ask questions in plain English, and turn complex datasets into verified insights.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group">
              Start Analyzing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 glass-card hover:bg-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center">
              See How It Works
            </button>
          </div>
        </section>

        {/* PRODUCT MOCKUP */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-32">
          {/* Background decorative visual */}
          <div className="absolute inset-0 top-10 -z-10 flex justify-center opacity-30">
            <div className="w-[800px] h-[400px] flex items-end justify-center gap-2">
              {[30, 50, 40, 70, 45, 80, 60, 90, 55, 65, 40, 75].map((height, i) => (
                <div key={i} className="w-12 bg-gradient-to-t from-blue-600/50 to-transparent rounded-t-sm" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>

          <div className="glow-blue rounded-2xl p-[1px] bg-gradient-to-b from-white/20 to-white/5">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[500px] md:h-[600px]">
              
              {/* Mockup Header */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">sales.csv</span>
                    <span className="text-xs text-slate-500 ml-1">11,000 Rows</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/20">Ready</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex-1 p-4 sm:p-8 bg-[#0a0f1c] flex flex-col relative overflow-hidden">
                {/* Metrics Chips */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500/20 rounded-md">
                      <Layers className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Dataset</div>
                      <div className="text-sm font-medium text-slate-200">sales.csv</div>
                    </div>
                  </div>
                  <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-500/20 rounded-md">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Units Sold</div>
                      <div className="text-sm font-medium text-slate-200">130</div>
                    </div>
                  </div>
                  <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="p-1.5 bg-purple-500/20 rounded-md">
                      <Filter className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Orders</div>
                      <div className="text-sm font-medium text-slate-200">41</div>
                    </div>
                  </div>
                </div>

                {/* Main Result Card */}
                <div className="max-w-lg mt-auto mb-6">
                  <div className="glass-card rounded-xl p-6 border border-blue-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-blue-400 text-sm font-medium mb-1">Top Product</div>
                        <div className="text-3xl font-bold text-white">Drone</div>
                      </div>
                      <BadgeCheck className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-slate-400 text-sm mb-1">Revenue</div>
                      <div className="text-2xl font-semibold text-emerald-400">$258,962.42</div>
                    </div>
                  </div>
                </div>

                {/* Question Input */}
                <div className="mt-auto">
                  <div className="glass-card rounded-xl p-2 flex items-center gap-3 border border-white/15 shadow-lg shadow-black/50">
                    <div className="flex-1 px-4 text-slate-300 py-2">
                      Which product generated the highest revenue in March?
                    </div>
                    <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors flex-shrink-0">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">From raw data to verified insight in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute -right-4 -top-8 text-8xl font-black text-white/5 pointer-events-none transition-transform group-hover:scale-110">01</div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <CloudUpload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upload</h3>
              <p className="text-slate-400">Upload your CSV dataset.</p>
            </div>

            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute -right-4 -top-8 text-8xl font-black text-white/5 pointer-events-none transition-transform group-hover:scale-110">02</div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ask</h3>
              <p className="text-slate-400">Ask questions using natural language.</p>
            </div>

            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute -right-4 -top-8 text-8xl font-black text-white/5 pointer-events-none transition-transform group-hover:scale-110">03</div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <BadgeCheck className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Understand</h3>
              <p className="text-slate-400">Receive verified analytical results.</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Natural Language Analysis",
                desc: "Ask questions without writing SQL."
              },
              {
                icon: BadgeCheck,
                title: "Verified Analytics",
                desc: "Calculations are performed by the deterministic analysis engine."
              },
              {
                icon: Filter,
                title: "Smart Filtering",
                desc: "Analyze by location, date, channel and other dimensions."
              },
              {
                icon: Layers,
                title: "Multi-Dimensional Analysis",
                desc: "Group and compare multiple dimensions."
              },
              {
                icon: Database,
                title: "Large Dataset Support",
                desc: "Support datasets up to 1 GB."
              },
              {
                icon: Lock,
                title: "Secure Sessions",
                desc: "Authenticated, session-based access."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-xl hover:bg-slate-800/80 hover:border-white/10 transition-colors flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-slate-600">0{i + 1}</div>
                  <feature.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm mt-auto">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-blue-500/20 overflow-hidden relative">
            <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="flex justify-center order-2 lg:order-1">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                  <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 border border-white/5 rounded-full"></div>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] relative z-10">
                    <ShieldCheck className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Security</h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Your data and access remain isolated through controlled, session-based access.
                </p>
                <div className="space-y-4">
                  {[
                    "Session-based authentication",
                    "Role-based access",
                    "Private datasets",
                    "User-level dataset isolation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          <div className="py-16 md:py-24 rounded-3xl relative overflow-hidden bg-slate-900 border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_50%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Turn your data into answers.
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                Start analyzing your datasets instantly with AI DATA ANALYZER.
              </p>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-white">AI DATA ANALYZER</span>
              </div>
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} AI DATA ANALYZER. <br />All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold mb-1">Product</h4>
              <Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>
              <Link href="#security" className="text-sm text-slate-400 hover:text-white transition-colors">Security</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Documentation</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold mb-1">Authentication</h4>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
