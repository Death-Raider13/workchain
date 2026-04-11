"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useBlockchain } from '@/hooks/useBlockchain';
import Link from 'next/link';
import { checkBackendHealth, getJobsForAddress, getJob, getWorkerProfile } from '@/lib/api';

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
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock');

  // Mock data — used as fallback
  const MOCK_JOBS = [
    {
      id: 'demo-worker-001',
      title: 'Monad DEX Interface Build',
      status: 'active',
      total_staked: 4.2,
      employer_address: '0x3c8a...b5e2',
      milestones: [{ id: 1, title: 'UI Design' }, { id: 2, title: 'Integration' }, { id: 3, title: 'Testing' }],
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-worker-002',
      title: 'NFT Marketplace Smart Contract',
      status: 'active',
      total_staked: 4.0,
      employer_address: '0x7f2e...c1d9',
      milestones: [{ id: 1, title: 'Contract' }, { id: 2, title: 'Audit' }],
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-worker-003',
      title: 'Token Vesting Dashboard',
      status: 'completed',
      total_staked: 3.8,
      employer_address: '0x5d4b...e7a3',
      milestones: [{ id: 1, title: 'Design' }, { id: 2, title: 'Build' }],
      created_at: new Date().toISOString(),
    },
  ];
  const MOCK_STATS = { totalEarned: 8.2, activeJobs: 2, reputation: 98, completionRate: '96%' };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const backendUp = await checkBackendHealth();

      if (backendUp) {
        try {
          const demoAddress = '0x0000000000000000000000000000000000000001';
          const addressData = await getJobsForAddress(demoAddress);
          const profile = await getWorkerProfile(demoAddress);

          if (addressData.total > 0) {
            const jobDetails = await Promise.all(
              addressData.worker_job_ids.map(id => getJob(id))
            );
            const validJobs = jobDetails.filter(Boolean).map((j: any) => ({
              id: String(j.job_id),
              title: j.title || `Job #${j.job_id}`,
              status: j.status === 0 ? 'active' : j.status === 1 ? 'completed' : 'disputed',
              total_staked: parseFloat(j.total_escrowed) / 1e18,
              employer_address: j.employer,
              milestones: [],
              created_at: new Date().toISOString(),
            }));
            setJobs(validJobs);
            setStats({
              totalEarned: profile.total_earned_mon,
              activeJobs: validJobs.filter(j => j.status === 'active').length,
              reputation: profile.average_rating ? Math.round(profile.average_rating * 20) : 98,
              completionRate: profile.total_jobs > 0
                ? `${Math.round((profile.completed_jobs / profile.total_jobs) * 100)}%`
                : '100%',
            });
            setDataSource('live');
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('[Worker] Backend fetch failed, using mock', e);
        }
      }

      // Fallback to mock
      setJobs(MOCK_JOBS);
      setStats(MOCK_STATS);
      setDataSource('mock');
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Syncing Provider Ledger...</p>
    </div>
  );


  return (
    <RoleGate allowedRoles={['worker']}>
      <div className="space-y-10 animate-fade-in pb-20">
        {/* Worker Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge badge-active text-[10px]">Active Provider</span>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Node: monad-mainnet-beta</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase tracking-tighter">Provider Console</h1>
            <p className="text-text-secondary text-sm font-medium">Manage your delivery pipeline and on-chain earnings</p>
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
            <Link href="/jobs" className="btn-primary py-2.5 px-8 text-[11px] uppercase tracking-widest shadow-lg shadow-accent-monad/20">Find Contracts</Link>
          </div>
        </div>

        {/* Financial Tickers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Net Earnings</p>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white">
                {currency === 'MON' 
                  ? `${stats.totalEarned} MON` 
                  : `₦${(stats.totalEarned * 2500).toLocaleString()}`}
              </h2>
              <p className="text-[10px] text-text-muted font-mono">
                {currency === 'MON' 
                  ? `≈ ₦${(stats.totalEarned * 2500).toLocaleString()}` 
                  : `≈ ${stats.totalEarned} MON`}
              </p>
            </div>
          </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Active Pipeline</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-accent-monad">{stats.activeJobs}</h2>
            <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Verified Contracts</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Network Reputation</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">{stats.reputation}<span className="text-sm text-text-muted">/100</span></h2>
            <p className="text-[10px] text-status-success font-mono uppercase tracking-widest">Tier: Elite Provider</p>
          </div>
        </div>
        <div className="card border-accent-monad/20">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Labor Fidelity</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase">Health Score</span>
              <span className="text-[10px] font-mono text-accent-monad">{stats.completionRate}</span>
            </div>
            <div className="w-full bg-background-elevated h-1 rounded-full overflow-hidden">
              <div className="bg-accent-monad h-full" style={{ width: stats.completionRate }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Ledger */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight uppercase">Service Ledger</h3>
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center py-24 border-dashed border-border-default bg-background-elevated/5">
            <div className="w-16 h-16 bg-background-elevated rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner">📄</div>
            <h4 className="text-lg font-bold mb-2">No active service contracts</h4>
            <p className="text-text-secondary text-sm mb-8">Browse the global job board to initialize your provider identity.</p>
            <Link href="/jobs" className="btn-secondary py-2.5 px-8 text-[11px] uppercase tracking-widest group">
              Browse Board <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="card group hover:border-accent-monad transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${job.status === 'active' ? 'badge-active' : 'badge-complete'} text-[9px]`}>{job.status}</span>
                      <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">ID: {job.id.slice(0, 8)}</span>
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-accent-monad transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-4 text-xs">
                      <p className="text-accent-monad font-bold">{job.total_staked} MON</p>
                      <span className="w-1.5 h-1.5 bg-border-default rounded-full"></span>
                      <p className="text-text-secondary">Milestones: {job.milestones?.length || 0}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <button className="btn-secondary w-full py-2.5 px-6 text-[10px] uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all">
                      View Protocol Details
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
