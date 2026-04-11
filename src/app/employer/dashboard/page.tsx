"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobsForAddress, checkBackendHealth } from '@/lib/api';
import { MOCK_PROTO } from '@/lib/mock-proto';
import { RoleGate } from '@/components/RoleGate';

export default function EmployerDashboard() {
  const [currency, setCurrency] = useState<'MON' | 'NGN'>('MON');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaked: 0,
    activeContracts: 0,
    releasedFunds: 0,
    disputedFunds: 0
  });
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Demo address used for mock aggregation
      const demoAddress = '0x1c9e...d4b2'; 
      const res = await getJobsForAddress(demoAddress);
      
      const employerJobs = res.jobs.filter((j: any) => j.employer_address === demoAddress || j.id === '0xbb...c8d9');
      setJobs(employerJobs);

      const staked = employerJobs.reduce((s: number, j: any) => s + j.total_staked, 0);
      const active = employerJobs.filter((j: any) => j.status === 'active').length;
      const disputed = employerJobs.filter((j: any) => j.status === 'disputed').reduce((s: number, j: any) => s + j.total_staked, 0);

      setStats({
        totalStaked: staked,
        activeContracts: active,
        releasedFunds: 4500, // Historical
        disputedFunds: disputed
      });
      
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Issuer Portfolio...</p>
    </div>
  );

  return (
    <RoleGate allowedRoles={['employer']}>
      <div className="space-y-10 animate-fade-in pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge badge-complete text-[10px]">Capital Issuer</span>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Shard: monad-mv-beta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Issuer Console</h1>
            <p className="text-text-secondary text-sm font-medium">Coordinate on-chain capital allocation and service execution roadmap.</p>
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
            <Link href="/jobs/create" className="btn-primary py-3 px-8 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-accent-monad/20">Initialize Contract</Link>
          </div>
        </div>

        {/* Tickers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30 border-accent-monad/30 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Capital Locked (TVL)</p>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white">
                {currency === 'MON' 
                  ? `${stats.totalStaked.toLocaleString()} ` 
                  : `₦${(stats.totalStaked * 2500).toLocaleString()} `}
                <span className="text-sm font-bold text-text-secondary">{currency}</span>
              </h2>
              <p className="text-[10px] text-accent-monad font-mono tracking-widest uppercase">Secured Escrow Vaults</p>
            </div>
          </div>
          <div className="card border-border-default/50">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Active Deployments</p>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-status-success">{stats.activeContracts}</h2>
              <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Live Mainnet Contracts</p>
            </div>
          </div>
          <div className="card border-status-warning/20">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Disputed Capital</p>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-status-warning">{stats.disputedFunds} <span className="text-sm font-bold text-text-secondary">MON</span></h2>
              <p className="text-[10px] text-status-warning font-mono uppercase tracking-widest animate-pulse">Awaiting Governance</p>
            </div>
          </div>
          <div className="card border-accent-monad/10">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Protocol Fees Saved</p>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white">412.0 <span className="text-[10px] font-bold text-text-secondary text-sm">MON</span></h2>
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Network Incentive Tier 3</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-border-default pb-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-accent-monad rounded-full"></div>
              <h3 className="text-2xl font-black tracking-tight uppercase text-white">Active Capital Ledger</h3>
            </div>
            <Link href="/jobs" className="text-[10px] font-black uppercase tracking-widest text-accent-monad hover:text-white transition-colors">Expand All Listings →</Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="group relative">
                <div className="card bg-background-surface/40 hover:bg-background-elevated/40 border-border-default group-hover:border-accent-monad/40 transition-all duration-300 py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="w-14 h-14 rounded-2xl bg-background-elevated flex items-center justify-center font-black text-xs group-hover:bg-accent-monad group-hover:text-white transition-all shadow-inner">
                      {job.category.slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className={`badge ${job.status === 'active' ? 'badge-active' : job.status === 'disputed' ? 'badge-disputed' : 'badge-complete'} text-[9px]`}>{job.status}</span>
                         <span className="text-[10px] font-mono text-text-muted">ID: {job.id.slice(0, 12)}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-accent-monad transition-colors">{job.title}</h4>
                      <p className="text-xs text-text-secondary font-medium">Provider: {job.worker_address}</p>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end w-full md:w-auto gap-4 md:gap-1">
                    <p className="text-2xl font-black text-white">{job.total_staked} <span className="text-[10px] text-text-secondary">MON</span></p>
                    <div className="btn-secondary py-2 px-6 text-[9px] uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all">Audit Vault</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
