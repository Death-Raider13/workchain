"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    // --- HACKATHON DEMO MODE: Mock data instead of auth-dependent fetch ---
    const mockJobs = [
      {
        id: 'demo-employer-001',
        title: 'Cross-Chain Bridge Audit',
        status: 'active',
        total_staked: 5.0,
        worker_address: '0x9a2f...d4e1',
        milestones: [{ id: 1, title: 'Phase 1' }, { id: 2, title: 'Phase 2' }],
        created_at: new Date().toISOString(),
      },
      {
        id: 'demo-employer-002',
        title: 'DeFi Protocol Frontend',
        status: 'active',
        total_staked: 3.5,
        worker_address: '0x4b7c...a3f8',
        milestones: [{ id: 1, title: 'Design' }],
        created_at: new Date().toISOString(),
      },
      {
        id: 'demo-employer-003',
        title: 'Smart Contract Security Review',
        status: 'completed',
        total_staked: 4.0,
        worker_address: '0x1e8d...c7b2',
        milestones: [{ id: 1, title: 'Review' }, { id: 2, title: 'Report' }],
        created_at: new Date().toISOString(),
      },
    ];

    setJobs(mockJobs);
    setStats({
      totalStaked: 12.5,
      activeContracts: 2,
      releasedFunds: 4.0,
      disputedFunds: 0,
    });
    setLoading(false);

    // --- ORIGINAL (re-enable after hackathon) ---
    // const fetchEmployerData = async () => {
    //   setLoading(true);
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) return;
    //   const { data: employerJobs } = await supabase
    //     .from('jobs')
    //     .select('*, milestones (*)')
    //     .eq('employer_address', '0x7e1b...')
    //     .order('created_at', { ascending: false });
    //   if (employerJobs) { ... }
    //   setLoading(false);
    // };
    // fetchEmployerData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Syncing Institutional Ledger...</p>
    </div>
  );


  return (
    <RoleGate allowedRoles={['employer']}>
      <div className="space-y-10 animate-fade-in pb-20">
        {/* Employer Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge badge-complete text-[10px]">Capital Issuer</span>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Node: monad-mainnet-beta</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase tracking-tighter">Issuer Console</h1>
            <p className="text-text-secondary text-sm font-medium">Manage on-chain capital allocation and service execution</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-background-surface p-1 rounded-lg border border-border-default h-10">
              <button 
                onClick={() => setCurrency('MON')}
                className={`px-4 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${currency === 'MON' ? 'bg-accent-monad text-white shadow-lg' : 'text-text-secondary'}`}
              >
                MON
              </button>
              <button 
                onClick={() => setCurrency('NGN')}
                className={`px-4 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${currency === 'NGN' ? 'bg-accent-monad text-white shadow-lg' : 'text-text-secondary'}`}
              >
                NGN
              </button>
            </div>
            <Link href="/jobs/create" className="btn-primary py-2.5 px-8 text-[11px] uppercase tracking-widest shadow-lg shadow-accent-monad/20">Initialize Contract</Link>
          </div>
        </div>

        {/* Capital Allocation Tickers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Total Value Locked (TVL)</p>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white">
                {currency === 'MON' 
                  ? `${stats.totalStaked} MON` 
                  : `₦${(stats.totalStaked * 2500).toLocaleString()}`}
              </h2>
              <p className="text-[10px] text-accent-monad font-mono tracking-widest uppercase">
                {currency === 'MON' ? 'Institutional Escrow' : `≈ ${stats.totalStaked} MON`}
              </p>
            </div>
          </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Active Deployments</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-status-success">{stats.activeContracts}</h2>
            <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Live Contracts</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">In Dispute</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-status-warning">{stats.disputedFunds} <span className="text-sm font-medium text-text-secondary">MON</span></h2>
            <p className="text-[10px] text-status-warning font-mono uppercase tracking-widest">Awaiting Arbitration</p>
          </div>
        </div>
        <div className="card border-accent-monad/20">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Regional Exposure</p>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{(stats.totalStaked * 2500).toLocaleString()} <span className="text-[10px] font-medium text-text-secondary">NGN</span></h2>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Rate: 2,500 NGN/MON</p>
          </div>
        </div>
      </div>

      {/* Active Contracts Ledger */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight uppercase">Capital Management Ledger</h3>
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center py-24 border-dashed border-border-default bg-background-elevated/5">
            <div className="w-16 h-16 bg-background-elevated rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">🏦</div>
            <h4 className="text-lg font-bold mb-2">No active capital deployments</h4>
            <p className="text-text-secondary text-sm mb-8">Deploy your first institutional escrow contract to start recruiting providers.</p>
            <Link href="/jobs/create" className="btn-secondary py-2.5 px-8 text-[11px] uppercase tracking-widest group">
              Initialize Contract <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card group hover:border-accent-monad transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${job.status === 'active' ? 'badge-active' : job.status === 'disputed' ? 'badge-disputed' : 'badge-complete'} text-[9px]`}>{job.status}</span>
                      <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">ID: {job.id.slice(0, 8)}</span>
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-accent-monad transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-4 text-xs">
                      <p className="text-white font-bold">{job.total_staked} MON</p>
                      <span className="w-1.5 h-1.5 bg-border-default rounded-full"></span>
                      <p className="text-text-secondary">Provider: {job.worker_address.slice(0, 8)}...{job.worker_address.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <button className="btn-secondary w-full py-2.5 px-6 text-[10px] uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all">
                      Manage Escrow
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </RoleGate>
  );
}
