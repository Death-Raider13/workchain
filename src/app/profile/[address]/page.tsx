"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface JobRecord {
  id: string;
  title: string;
  employer_address: string;
  status: 'active' | 'completed' | 'disputed';
  total_staked: number;
}

interface Profile {
  address: string;
  total_completed: number;
  average_rating: number;
  jobs: JobRecord[];
}

export default function WorkerProfile() {
  const { address } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('worker_address', address);

      if (error) {
        console.error('Error fetching profile jobs:', error);
      } else {
        const completed = jobs?.filter(j => j.status === 'completed') || [];
        setProfile({
          address: address as string,
          total_completed: completed.length,
          average_rating: 4.9, // Mock rating as we don't have a ratings table yet
          jobs: jobs || []
        });
      }
      setLoading(false);
    };

    if (address) fetchProfile();
  }, [address]);

  if (loading) return <div className="flex flex-col items-center justify-center py-24 space-y-4">
    <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Querying Network Identity...</p>
  </div>;
  
  if (!profile) return <div className="card text-center py-24">Profile metadata not found on-chain.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 border-b border-border-default pb-10">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 bg-gradient-to-br from-accent-monad to-background-elevated rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-accent-monad/10 border border-white/10">
            👤
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">Network Identity</h1>
              <span className="badge badge-complete text-[10px]">Verified Oracle</span>
            </div>
            <p className="font-mono text-sm text-text-secondary">{profile.address}</p>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Trust Score</span>
                <span className="text-lg font-bold text-status-success">98.4%</span>
              </div>
              <div className="w-px h-8 bg-border-default"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Escrow Volume</span>
                <span className="text-lg font-bold text-white">42,500 <span className="text-xs">MON</span></span>
              </div>
            </div>
          </div>
        </div>
        <button className="btn-secondary py-2.5 px-8 text-[11px] uppercase tracking-widest">Export Proof</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="card space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-4 bg-accent-monad rounded-full"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Labor Fidelity Metrics</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">On-Time Delivery</span>
                <span className="text-white">100%</span>
              </div>
              <div className="w-full h-1.5 bg-background-elevated rounded-full overflow-hidden">
                <div className="h-full bg-status-success w-full shadow-[0_0_8px_rgba(29,158,117,0.4)]"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">Release Without Dispute</span>
                <span className="text-white">92.5%</span>
              </div>
              <div className="w-full h-1.5 bg-background-elevated rounded-full overflow-hidden">
                <div className="h-full bg-accent-monad w-[92.5%] shadow-[0_0_8px_rgba(108,71,255,0.4)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Card */}
        <div className="card space-y-6 bg-gradient-to-br from-background-surface to-background-elevated/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-4 bg-status-warning rounded-full shadow-[0_0_8px_rgba(239,159,39,0.4)]"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Network Reputation</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-white">{profile.average_rating}</span>
            <span className="text-text-secondary font-bold">/ 5.0</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Derived from {profile.total_completed} institutional-grade deployments over the last 12 months.
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight">On-Chain Interaction History</h3>
        </div>
        
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-elevated/20 border-b border-border-default/50">
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Contract Title</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Counterparty</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary text-center">Status</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/30">
              {profile.jobs.map((h) => (
                <tr key={h.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-8">
                    <Link href={`/jobs/${h.id}`} className="text-sm font-bold text-white hover:text-accent-monad transition-colors">
                      {h.title}
                    </Link>
                  </td>
                  <td className="py-5 px-8">
                    <p className="text-xs font-mono text-text-secondary">{h.employer_address}</p>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span className={`badge text-[10px] ${
                      h.status === 'active' ? 'badge-active' : 
                      h.status === 'completed' ? 'badge-complete' : 'badge-disputed'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right font-medium">
                    <span className="text-status-success font-bold">★ 5.0</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
