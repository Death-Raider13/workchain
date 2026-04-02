"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface JobListing {
  id: string;
  title: string;
  employer_address: string;
  total_staked: number;
  status: string;
  created_at: string;
}

export default function JobBoard() {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<JobListing[]>([]);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching listings:', error);
    else setListings(data || []);
  };

  useEffect(() => {
    fetchListings();
    
    const channel = supabase
      .channel('job-board-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchListings)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { error } = await supabase
        .from('jobs')
        .insert({
          title,
          total_staked: Number(budget),
          employer_address: user.user_metadata?.wallet_address || '0x7e1b...d91c',
          worker_address: '0x0000000000000000000000000000000000000000', // Open listing
          status: 'active'
        });

      if (error) throw error;
      
      setTitle('');
      setBudget('');
      alert('Job posted successfully to the decentralized network!');
    } catch (err: any) {
      alert(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Post Section */}
      <div className="card space-y-8 bg-gradient-to-br from-background-surface to-background-elevated/30">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-monad">Institutional Marketplace</p>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Broadcast Requirement</h2>
        </div>
        
        <form onSubmit={handlePost} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Service Designation</label>
              <input 
                type="text" 
                placeholder="e.g. Protocol Security Audit" 
                className="input-field text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Allocated (MON)</label>
              <input 
                type="number" 
                placeholder="500" 
                className="input-field text-sm font-mono"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary py-3 text-[10px] uppercase tracking-widest shadow-lg shadow-accent-monad/20"
            >
              {loading ? 'Transmitting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* Open Listings */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 border-b border-border-default pb-4">
          <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight uppercase">Open Network Listings</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {listings.length === 0 ? (
            <div className="py-20 text-center opacity-50 font-mono text-[10px] uppercase tracking-[0.2em]">
              Scanning for available contracts...
            </div>
          ) : (
            listings.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="card group hover:border-accent-monad/30 transition-all flex items-center justify-between py-6 px-8 bg-background-surface/50">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-background-elevated border border-border-default flex items-center justify-center font-bold text-text-secondary group-hover:bg-accent-monad group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">
                      {job.title.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-accent-monad transition-colors">{job.title}</h4>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">
                        Issuer: {job.employer_address.slice(0, 8)}... &bull; {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{job.total_staked} <span className="text-[10px] font-medium text-text-secondary">MON</span></p>
                    <span className="badge badge-active text-[9px] uppercase tracking-widest">Available</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
