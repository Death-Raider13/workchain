"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobsForAddress, getWorkerProfile } from '@/lib/api';
import { MOCK_PROTO } from '@/lib/mock-proto';
import { RoleGate } from '@/components/RoleGate';

export default function WorkerDashboard() {
  const [currency, setCurrency] = useState<'MON' | 'NGN'>('MON');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    activeJobs: 0,
    reputation: 98,
    completionRate: '100%'
  });
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Demo Provider Address
      const demoAddress = '0x7e1b...d91c';
      const res = await getJobsForAddress(demoAddress);
      
      const workerJobs = res.jobs.filter((j: any) => j.worker_address === demoAddress);
      setJobs(workerJobs);

      const profile = await getWorkerProfile(demoAddress);
      
      setStats({
        totalEarned: profile.totalEarned,
        activeJobs: workerJobs.filter((j:any) => j.status === 'active').length,
        reputation: profile.reputation,
        completionRate: profile.completionRate
      });
      
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Fetching Provider Ledger...</p>
    </div>
  );

  return (
    <RoleGate allowedRoles={['worker']}>
      <div className="space-y-10 animate-fade-in pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge badge-active text-[10px]">Active Provider</span>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Shard: monad-mv-beta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Provider Console</h1>
            <p className="text-text-secondary text-sm font-medium">Engineer your delivery pipeline and visualize on-chain labor fidelity.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-background-surface p-1 rounded-xl border border-border-default h-12 shadow-inner">
              <button 
                onClick={() => setCurrency('MON')}
                className={`px-6 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${currency === 'MON' ? 'bg-accent-monad text-white shadow-lg' : 'text-text-secondary'}`}
              >
                MON
              </button>
              <button 
                onClick={() => setCurrency('NGN')}
                className={`px-6 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${currency === 'NGN' ? 'bg-accent-monad text-white shadow-lg' : 'text-text-secondary'}`}
              >
                NGN
              </button>
            </div>
            <Link href="/jobs" className="btn-primary py-3 px-8 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-accent-monad/20">Find Contracts</Link>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30 border-accent-monad/30 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Total Realized Revenue</p>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white">
                {currency === 'MON' 
                  ? `${stats.totalEarned.toLocaleString()} ` 
                  : `₦${(stats.totalEarned * 2500).toLocaleString()} `}
                <span className="text-sm font-bold text-text-secondary">{currency}</span>
              </h2>
              <p className="text-[10px] text-accent-monad font-mono tracking-widest uppercase truncate">Verified Settlements</p>
            </div>
          </div>
          <div className="card">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Active Pipeline</p>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-accent-monad">{stats.activeJobs}</h2>
              <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Ongoing Deliveries</p>
            </div>
          </div>
          <div className="card">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Network Reputation</p>
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <h2 className="text-4xl font-black text-white">{stats.reputation}</h2>
                <span className="text-xs text-text-muted mb-1">/100</span>
              </div>
              <p className="text-[10px] text-status-success font-mono uppercase tracking-widest">Tier: Elite Provider</p>
            </div>
          </div>
          <div className="card border-accent-monad/20">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Labor Fidelity Score</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white">Health</span>
                <span className="text-[10px] font-mono text-accent-monad">{stats.completionRate}</span>
              </div>
              <div className="w-full bg-background-elevated h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-accent-monad h-full shadow-[0_0_10px_var(--accent-monad-glow)]" style={{ width: stats.completionRate }}></div>
              </div>
              <p className="text-[9px] text-text-muted uppercase text-center font-bold">Consensus Verified</p>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-border-default pb-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-accent-monad rounded-full"></div>
              <h3 className="text-2xl font-black tracking-tight uppercase text-white">Service Delivery Pipeline</h3>
            </div>
            <Link href="/wallet" className="text-[10px] font-black uppercase tracking-widest text-accent-monad hover:text-white transition-colors">Check Capital Inflows →</Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.length === 0 ? (
               <div className="card py-20 text-center border-dashed bg-transparent shadow-none opacity-50">
                <p className="text-text-secondary font-mono text-[10px] uppercase tracking-widest">No active service contracts initialized.</p>
               </div>
            ) : (
              jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="group relative">
                  <div className="card bg-background-surface/40 hover:bg-background-elevated/40 border-border-default group-hover:border-accent-monad/40 transition-all duration-300 py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="w-14 h-14 rounded-2xl bg-background-elevated flex items-center justify-center font-black text-xs uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all shadow-inner">
                        {job.category.slice(0, 2)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <span className={`badge ${job.status === 'active' ? 'badge-active' : job.status === 'disputed' ? 'badge-disputed' : 'badge-complete'} text-[9px]`}>{job.status}</span>
                           <span className="text-[10px] font-mono text-text-muted">ID: {job.id.slice(0, 12)}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white group-hover:text-accent-monad transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span className="font-black text-accent-monad">{job.total_staked} MON Locked</span>
                          <span className="w-1 h-1 bg-border-default rounded-full"></span>
                          <span>Issuer: {job.employer_address.slice(0,10)}...</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end w-full md:w-auto gap-4 md:gap-1">
                       <button className="btn-secondary w-full md:w-auto py-2.5 px-8 text-[9px] font-black uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all">Submit Verification Proof</button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
