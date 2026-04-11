"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PROTO, MockJob } from '@/lib/mock-proto';

export default function JobBoard() {
  const [filter, setFilter] = useState<'All' | 'DeFi' | 'Security' | 'NFT' | 'Infrastructure'>('All');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<MockJob[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800)); // Simulate chain sync
      const allJobs = MOCK_PROTO.getJobs();
      setListings(allJobs);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filteredListings = filter === 'All' 
    ? listings 
    : listings.filter(j => j.category === filter);

  const stats = MOCK_PROTO.getStats();

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Search & Statistics Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex bg-background-surface p-1 rounded-xl border border-border-default shadow-inner">
          {['All', 'DeFi', 'Security', 'NFT', 'Infrastructure'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                filter === cat ? 'bg-accent-monad text-white shadow-lg shadow-accent-monad/20' : 'text-text-secondary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-8 px-6 py-2 bg-background-surface/30 rounded-full border border-border-default/50 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter text-text-secondary font-bold">Network TVL</p>
            <p className="text-sm font-black text-white">$ {stats.totalTVL.toLocaleString()}</p>
          </div>
          <div className="h-6 w-px bg-border-default"></div>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter text-text-secondary font-bold">Active Nodes</p>
            <p className="text-sm font-black text-accent-monad">124</p>
          </div>
          <div className="h-6 w-px bg-border-default"></div>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter text-text-secondary font-bold">Fidelity Rate</p>
            <p className="text-sm font-black text-status-success">{stats.securityScore}%</p>
          </div>
        </div>
      </div>

      {/* Broadcaster Section (Header) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-monad/20 via-background-surface to-background-elevated/40 border border-border-default p-10 group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-monad/10 rounded-full blur-3xl group-hover:bg-accent-monad/20 transition-all duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="badge badge-active text-[10px]">L1 Marketplace</span>
              <span className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Monad Testnet Beta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Initialize Your <span className="text-accent-monad">On-Chain</span> Agreement
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              Broadcast your development requirements to a global network of verified providers. 
              Secure capital in smart escrow and release funds only upon milestone verification.
            </p>
          </div>
          <Link href="/jobs/create" className="btn-primary py-4 px-10 text-[12px] uppercase tracking-widest shadow-2xl shadow-accent-monad/30 whitespace-nowrap">
            Initialize Contract
          </Link>
        </div>
      </div>

      {/* Main Jobs Ledger */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-accent-monad rounded-full shadow-[0_0_15px_var(--accent-monad-glow)]"></div>
            <h3 className="text-2xl font-black tracking-tight uppercase text-white">Execution Ledger</h3>
          </div>
          <p className="text-[10px] font-mono text-text-secondary uppercase">Scanning {filteredListings.length} Active Contracts</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card h-24 animate-pulse bg-background-surface/50 border-dashed"></div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="card text-center py-20 border-dashed bg-transparent shadow-none">
            <p className="text-text-secondary font-mono text-[10px] uppercase tracking-widest">No listings found in category "{filter}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredListings.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="group relative">
                <div className="card bg-background-surface/40 hover:bg-background-elevated/40 border-border-default hover:border-accent-monad/50 transition-all duration-300 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all ${
                      job.category === 'Security' ? 'bg-status-danger/10 border-status-danger/20 text-status-danger' :
                      job.category === 'DeFi' ? 'bg-accent-monad/10 border-accent-monad/20 text-accent-monad' :
                      job.category === 'NFT' ? 'bg-status-success/10 border-status-success/20 text-status-success' :
                      'bg-text-secondary/10 border-text-secondary/20 text-text-secondary'
                    }`}>
                      {job.category.slice(0, 3)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                          job.status === 'open' ? 'border-status-success/30 text-status-success bg-status-success/5' :
                          job.status === 'completed' ? 'border-text-secondary/30 text-text-secondary' :
                          job.status === 'disputed' ? 'border-status-danger/30 text-status-danger bg-status-danger/5' :
                          'border-accent-monad/30 text-accent-monad bg-accent-monad/5'
                        }`}>
                          {job.status}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">ID: {job.id.slice(0, 10)}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-accent-monad transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase truncate max-w-[150px]">
                          ISS: {job.employer_address}
                        </p>
                        <span className="w-1 h-1 bg-border-default rounded-full"></span>
                        <div className="flex gap-2">
                          {job.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] text-text-muted bg-background-elevated px-2 py-0.5 rounded">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1">
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{job.total_staked.toLocaleString()} <span className="text-[10px] text-text-secondary">MON</span></p>
                      <p className="text-[10px] text-text-muted font-mono uppercase">Liquidity Locked</p>
                    </div>
                    <div className="btn-secondary py-2 px-6 text-[9px] uppercase tracking-widest group-hover:bg-accent-monad group-hover:text-white transition-all">
                      Audit Protocol
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
