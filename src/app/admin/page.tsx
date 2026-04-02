"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import { RoleGate } from '@/components/RoleGate';

export default function AdminDashboard() {
  const [currency, setCurrency] = useState<'MON' | 'NGN'>('MON');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeDisputes: 0,
    totalVolume: 0,
    avgCompletion: '94%'
  });
  const [disputedJobs, setDisputedJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      
      const { data: allJobs, error } = await supabase
        .from('jobs')
        .select('*, milestones(*)');

      if (allJobs) {
        setStats(prev => ({
          ...prev,
          totalJobs: allJobs.length,
          activeDisputes: allJobs.filter(j => j.status === 'disputed').length,
          totalVolume: allJobs.reduce((sum, j) => sum + Number(j.total_staked), 0)
        }));
        setDisputedJobs(allJobs.filter(j => j.status === 'disputed'));
      }
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Opening Secure Archive...</p>
    </div>
  );

  return (
    <RoleGate allowedRoles={['admin']}>
      <div className="space-y-10 animate-fade-in pb-20">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge badge-disputed text-[10px]">Network Arbitrator</span>
              <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Access level: 0 (Root)</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase tracking-tighter">Arbitration Console</h1>
            <p className="text-text-secondary text-sm font-medium">Oversee network health and resolve institutional service disputes</p>
          </div>
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
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Total Network Volume</p>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white">
                {currency === 'MON' 
                  ? `${stats.totalVolume.toLocaleString()} MON` 
                  : `₦${(stats.totalVolume * 2500).toLocaleString()}`}
              </h2>
              <p className="text-[10px] text-accent-monad font-mono uppercase tracking-widest leading-loose">Across {stats.totalJobs} Records</p>
            </div>
          </div>
        <div className="card border-status-warning/20 bg-status-warning/5">
          <p className="text-[10px] text-status-warning uppercase tracking-[0.2em] font-bold mb-4">Active Disputes</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">{stats.activeDisputes}</h2>
            <p className="text-[10px] text-status-warning font-mono uppercase tracking-widest leading-loose">Requires Arbitration</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Settlement Efficiency</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">{stats.avgCompletion}</h2>
            <p className="text-[10px] text-status-success font-mono uppercase tracking-widest leading-loose">Platform Average</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Node Health</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-status-success rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase">Consensus Reached</span>
            </div>
            <div className="w-full bg-background-elevated h-1 rounded-full overflow-hidden">
              <div className="bg-status-success h-full" style={{ width: '99%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Disputes Ledger */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-status-warning rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight uppercase">Dispute Ledger</h3>
        </div>

        {disputedJobs.length === 0 ? (
          <div className="card text-center py-24 border-dashed border-border-default">
            <h4 className="text-lg font-bold">Network state is healthy</h4>
            <p className="text-text-secondary text-sm">No active disputes requiring arbitration at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {disputedJobs.map((job) => (
              <div key={job.id} className="card group hover:border-status-warning transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-disputed text-[9px]">Awaiting Verdict</span>
                      <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">TX: {job.id.slice(0, 8)}</span>
                    </div>
                    <h4 className="text-lg font-bold">{job.title}</h4>
                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                      <p className="text-text-secondary">Issuer: <span className="text-white">{job.employer_address.slice(0, 10)}...</span></p>
                      <p className="text-text-secondary">Provider: <span className="text-white">{job.worker_address.slice(0, 10)}...</span></p>
                      <p className="text-accent-monad font-bold">{job.total_staked} MON</p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link href={`/jobs/${job.id}/dispute`} className="btn-secondary py-2.5 px-6 text-[10px] uppercase tracking-widest hover:border-status-warning transition-all">
                      Open Arb Case
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </RoleGate>
  );
}
