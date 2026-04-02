"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Milestone {
  id: string;
  job_id: string;
  description: string;
  amount: number;
  status: 'pending' | 'working' | 'released';
}

interface Job {
  id: string;
  title: string;
  description: string;
  employer_address: string;
  worker_address: string;
  escrow_address: string;
  total_staked: number;
  status: 'active' | 'completed' | 'disputed';
  created_at: string;
  milestones: Milestone[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'employer' | 'worker'>('employer');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Placeholder for current user's wallet address
      const userAddress = '0x7e1b...';

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          milestones (*)
        `);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchJobs)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, fetchJobs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredJobs = jobs.filter(job => 
    activeTab === 'employer' 
      ? job.employer_address.toLowerCase().includes('0x7e1b')
      : job.worker_address.toLowerCase().includes('0x7e1b')
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-sm font-mono uppercase tracking-widest animate-pulse">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border-default pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent-monad rounded-full animate-pulse shadow-[0_0_10px_var(--accent-monad)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Monad Mainnet • Node-Alpha-01</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white uppercase">Contract Ledger</h1>
          <p className="text-text-secondary text-sm max-w-md font-medium leading-relaxed">
            Manage institutional escrow contracts and milestone settlements on the Monad network.
          </p>
        </div>
        
        <div className="flex gap-10">
          <div className="text-right space-y-1">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Volume Locked</p>
            <p className="text-3xl font-extrabold text-accent-monad">
              {jobs.reduce((sum, job) => sum + Number(job.total_staked), 0).toFixed(2)} 
              <span className="text-sm font-medium ml-1">MON</span>
            </p>
          </div>
          <div className="text-right space-y-1 border-l border-border-default pl-10">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Active Records</p>
            <p className="text-3xl font-extrabold text-white">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & New Contract */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-background-surface/50 p-1 rounded-xl border border-border-default/50 w-full md:w-fit">
          <button 
            onClick={() => setActiveTab('employer')}
            className={`flex-1 md:flex-none px-8 py-2.5 text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-3 ${
              activeTab === 'employer' 
                ? 'bg-accent-monad text-white shadow-lg shadow-accent-monad/25 ring-2 ring-accent-monad/40' 
                : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'employer' ? 'bg-white animate-pulse' : 'bg-text-muted'}`}></span>
            Issuer View
          </button>
          <button 
            onClick={() => setActiveTab('worker')}
            className={`flex-1 md:flex-none px-8 py-2.5 text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-3 ${
              activeTab === 'worker' 
                ? 'bg-accent-monad text-white shadow-lg shadow-accent-monad/25 ring-2 ring-accent-monad/40' 
                : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'worker' ? 'bg-white animate-pulse' : 'bg-text-muted'}`}></span>
            Service Provider
          </button>
        </div>

        {activeTab === 'employer' && (
          <Link href="/jobs/create" className="btn-primary py-2.5 px-8 text-[11px] uppercase tracking-widest w-full md:w-auto shadow-xl shadow-accent-monad/20">
            Initialize New Contract
          </Link>
        )}
      </div>

      {/* Contract Grid */}
      {filteredJobs.length === 0 ? (
        <div className="card py-32 flex flex-col items-center justify-center space-y-6 border-dashed opacity-60">
          <div className="w-16 h-16 rounded-2xl bg-background-elevated flex items-center justify-center text-2xl grayscale">📂</div>
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-white">No Record Identified</p>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-[0.2em]">Deploy a contract to begin network settlement</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="card h-full flex flex-col group relative overflow-hidden bg-gradient-to-br from-background-surface to-background-surface/50 border-border-default/50 hover:border-accent-monad/40 transition-all duration-500">
                <div className="absolute top-0 right-0 p-4">
                  <span className={`badge ${
                    job.status === 'active' ? 'badge-active' : 
                    job.status === 'completed' ? 'badge-complete' : 'badge-disputed'
                  } text-[9px] font-black`}>
                    {job.status}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[10px] text-accent-monad font-bold uppercase tracking-[0.2em] mb-1">TX-REF: {job.id.slice(0, 8)}</p>
                  <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-accent-monad transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-2 pt-2 border-t border-border-default/30">
                    <div className="w-5 h-5 rounded-full bg-background-elevated border border-border-default flex items-center justify-center text-[10px]">👤</div>
                    <p className="text-xs text-text-secondary font-mono truncate max-w-[120px]">
                      {activeTab === 'employer' ? job.worker_address : job.employer_address}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border-default/30 space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">Escrow Volume</p>
                      <p className="text-xl font-black text-white">{job.total_staked} <span className="text-[10px] text-text-secondary font-medium">MON</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mb-1">Execution</p>
                      <p className="text-xs font-mono font-bold text-accent-monad">
                        {job.milestones.filter((m: any) => m.status === 'released').length}/{job.milestones.length} PASSED
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-background-elevated h-1.5 rounded-full overflow-hidden border border-border-default/50">
                    <div 
                      className="bg-accent-monad h-full transition-all duration-1000 shadow-[0_0_10px_rgba(108,71,255,0.4)]"
                      style={{ width: `${(job.milestones.filter((m: any) => m.status === 'released').length / job.milestones.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
