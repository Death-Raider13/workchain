"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MOCK_PROTO } from '@/lib/mock-proto';
import Link from 'next/link';

export default function ProfilePage() {
  const { address } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setProfile(MOCK_PROTO.getProfile(address as string));
      setLoading(false);
    };
    fetchData();
  }, [address]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning Global Identity Index...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
       {/* Header / Banner */}
       <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-r from-accent-monad/40 via-background-elevated to-background-surface border border-white/5">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
       </div>

       <div className="-mt-20 px-4 md:px-10 relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-background-surface/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full md:w-auto">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-background-elevated border-4 border-background-primary shadow-2xl flex items-center justify-center overflow-hidden group shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-accent-monad to-background-surface flex items-center justify-center text-4xl md:text-5xl font-black text-white group-hover:scale-110 transition-transform duration-700">
                  {profile.address.slice(2, 4).toUpperCase()}
                </div>
              </div>
              <div className="pb-2 space-y-3 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">{profile.tier}</h1>
                  {profile.verified && (
                    <span className="badge badge-active text-[10px] py-1 px-3">Protocol Verified</span>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <p className="font-mono text-sm text-text-secondary">{profile.address.slice(0, 6)}...{profile.address.slice(-4)}</p>
                  <button className="text-[10px] text-accent-monad font-bold hover:text-white transition-colors uppercase tracking-widest">Copy Identifier</button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto justify-center">
              <button className="btn-secondary flex-1 md:flex-none py-3 px-8 text-[11px] font-black uppercase tracking-widest">Connect ID</button>
              <button className="btn-primary flex-1 md:flex-none py-3 px-10 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-accent-monad/20">Init Agreement</button>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Col: Credentials */}
            <div className="space-y-8">
               <div className="card space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/5 pb-4">On-Chain Reputation</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-text-secondary">Fidelity Score</p>
                      <p className="text-2xl font-black text-white">{profile.reputation}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-text-secondary">Jobs Completed</p>
                      <p className="text-2xl font-black text-white">{profile.completedJobs}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-text-secondary">Completion</p>
                      <p className="text-2xl font-black text-status-success">{profile.completionRate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-text-secondary">Total Realized</p>
                      <p className="text-2xl font-black text-accent-monad">{profile.totalEarned.toLocaleString()}</p>
                    </div>
                 </div>
               </div>

               <div className="card space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-white/5 pb-4">Verified Skills</h3>
                 <div className="flex flex-wrap gap-2">
                   {profile.skills.map((s: string) => (
                     <span key={s} className="px-3 py-1.5 bg-background-elevated border border-white/5 rounded-lg text-[10px] font-bold text-text-primary uppercase tracking-widest hover:border-accent-monad transition-all cursor-default">
                       {s}
                     </span>
                   ))}
                 </div>
               </div>
            </div>

            {/* Right Col: Performance & History */}
            <div className="lg:col-span-2 space-y-8">
               <div className="card space-y-6 bg-gradient-to-br from-background-surface to-background-elevated/30">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Execution History</h3>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-6 bg-background-primary/40 rounded-2xl border border-white/5 group hover:border-accent-monad/30 transition-all">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-accent-monad uppercase tracking-widest">Contract Fragment #110{i}</p>
                          <h4 className="text-lg font-bold text-white group-hover:text-accent-monad transition-colors">Protocol Refactor: Validator Node Logic</h4>
                          <p className="text-xs text-text-secondary">Jan 2024 • Secured by 4,500 MON Escrow</p>
                        </div>
                        <div className="text-right">
                          <span className="badge badge-complete text-[9px]">Verified Settlement</span>
                          <p className="text-sm font-mono mt-2 text-text-muted">★★★★★</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-white transition-colors">Load Full Ledger</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Identity Verification</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-primary">GitHub Profile</span>
                        <span className="text-status-success font-bold">✓ Linked</span>
                      </div>
                      <div className="flex justify-between items-center text-xs opacity-50">
                        <span className="text-text-primary">LinkedIn Professional</span>
                        <span className="text-text-muted">Not Linked</span>
                      </div>
                    </div>
                  </div>
                  <div className="card space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Network Status</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-status-success rounded-full animate-pulse shadow-[0_0_10px_var(--status-success-glow)]"></div>
                      <span className="text-sm font-black text-white uppercase italic">Active on Monad</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
}
