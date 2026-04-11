"use client";

import { useState, useEffect } from 'react';
import { MOCK_PROTO } from '@/lib/mock-proto';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1200)); // Simulate global cluster audit
      setStats(MOCK_PROTO.getStats());
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Establishing Governance Connection...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="badge badge-active text-[10px]">Governance Root</span>
            <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Protocol-ID: WCH-ADMIN-MAIN</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Network Authority</h1>
          <p className="text-text-secondary text-sm font-medium">Global observability into Monad WorkChain liquidity, settlement velocity, and node consensus.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-status-success/10 border border-status-success/20 rounded-xl">
            <div className="w-2 h-2 bg-status-success rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-status-success">Fragment Healthy</span>
          </div>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30 border-accent-monad/20">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Protocol Total TVL</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white">${stats.totalTVL.toLocaleString()}</h2>
            <p className="text-[10px] text-accent-monad font-mono tracking-widest uppercase italic">Locked in 1,240 Vaults</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Settlement Velocity</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-status-success">1.4s</h2>
            <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Avg Monad Finality</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Dispute Rate</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white">0.4%</h2>
            <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Network-wide audits</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Nodes Online</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white">4,812</h2>
            <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Global Validators</p>
          </div>
        </div>
      </div>

      {/* Observability Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-accent-monad rounded-full"></div>
            <h3 className="text-2xl font-black tracking-tight uppercase text-white">Consensus Health Monitor</h3>
          </div>
          
          <div className="card h-64 flex items-end justify-between p-10 bg-background-elevated/20 border-dashed">
            {/* Simple CSS Chart Mock */}
            {[40, 60, 45, 90, 85, 40, 55, 95, 80, 70, 85, 100].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div 
                  className="w-4 bg-accent-monad/40 rounded-t-sm group-hover:bg-accent-monad group-hover:shadow-[0_0_15px_var(--accent-monad-glow)] transition-all duration-500" 
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[8px] font-mono text-text-muted rotate-45 md:rotate-0">4/{15+i}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-background-surface/50 border-white/5 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-3">Protocol Revenue (7D)</h4>
               <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black text-white">₦12.4M</h2>
                <span className="text-[10px] font-bold text-status-success mb-2">+14.2%</span>
               </div>
               <div className="bg-background-elevated h-1 w-full rounded-full overflow-hidden">
                <div className="bg-accent-monad h-full w-[85%]"></div>
               </div>
            </div>
            <div className="card bg-background-surface/50 border-white/5 space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-3">Node Rewards Distributed</h4>
               <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black text-white">450.2K MON</h2>
                <span className="text-[10px] font-bold text-text-secondary mb-2">Steady</span>
               </div>
               <div className="bg-background-elevated h-1 w-full rounded-full overflow-hidden">
                <div className="bg-status-success h-full w-[95%]"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black tracking-tight uppercase text-white">Security Layer</h3>
          </div>
          
          <div className="space-y-4">
            <div className="card space-y-4 group">
               <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-text-secondary">Validation Score</span>
                <span className="text-sm font-black text-status-success">99.98%</span>
               </div>
               <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-text-secondary">Active Breaches</span>
                <span className="text-sm font-black text-white">0</span>
               </div>
               <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-text-secondary">Audit Backlog</span>
                <span className="text-sm font-black text-accent-monad">14 Contracts</span>
               </div>
            </div>

            <div className="card bg-accent-monad/5 border-dashed border-accent-monad/30 p-8 space-y-4">
              <p className="text-[10px] font-black uppercase text-accent-monad tracking-[0.2em]">Administrative Override</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Emergency protocol pause is currently <span className="text-status-success font-bold underline">DEACTIVATED</span>. Multi-sig consensus required for shard maintenance.
              </p>
              <button className="btn-secondary w-full py-3 text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed">Initialize Pause</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
