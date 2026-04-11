"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getJob, getJobMilestones, getEscrowProgress, submitVerification } from '@/lib/api';
import { MockJob, MockMilestone } from '@/lib/mock-proto';

export default function JobDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<MockJob | null>(null);
  const [milestones, setMilestones] = useState<MockMilestone[]>([]);
  const [progress, setProgress] = useState(0);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const jobData = await getJob(id);
      if (jobData) {
        setJob(jobData);
        setMilestones(jobData.milestones);
        const prog = await getEscrowProgress(id);
        setProgress(prog.progress);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Auditing Smart Contract...</p>
    </div>
  );
  
  if (!job) return (
    <div className="max-w-xl mx-auto py-24 text-center space-y-6">
      <div className="text-6xl">🔒</div>
      <h2 className="text-2xl font-black uppercase text-white">Record Not Found</h2>
      <p className="text-text-secondary text-sm">This contract index does not exist on the current network fragment.</p>
      <Link href="/jobs" className="btn-secondary inline-block py-2 px-8">Return to Ledger</Link>
    </div>
  );

  const totalReleased = milestones
    .filter(m => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);

  // --- Handlers for Demo Interaction ---

  const handleRelease = async (milestoneId: string) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate tx
    
    setMilestones(prev => prev.map(m => 
      m.id === milestoneId ? { ...m, status: 'released' } : m
    ));
    
    // Recalculate progress visually
    const newReleased = totalReleased + (milestones.find(m => m.id === milestoneId)?.amount || 0);
    setProgress((newReleased / job.total_staked) * 100);
    
    setIsSubmitting(false);
    alert('Settlement Finalized. 500 MON has been dispatched to the provider.');
  };

  const handleVerifySubmission = async () => {
    if (!proofUrl) return;
    setIsSubmitting(true);
    await submitVerification({ milestone_id: selectedMilestoneId, data: proofUrl });
    
    setMilestones(prev => prev.map(m => 
      m.id === selectedMilestoneId ? { ...m, status: 'verified' } : m
    ));
    
    setIsSubmitting(false);
    setShowVerifyModal(false);
    setProofUrl('');
    alert('Verification Layer Received Proof. Audit in progress.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Link href="/jobs" className="text-accent-monad hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Global Ledger</span>
            </Link>
            <span className={`badge ${
              job.status === 'active' ? 'badge-active' : 
              job.status === 'disputed' ? 'badge-disputed' : 
              job.status === 'completed' ? 'badge-complete' : 'badge-secondary'
            } text-[10px]`}>
              Protocol {job.status}
            </span>
            <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 bg-background-elevated rounded">MOD: monad-mv-0.1</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-text-secondary uppercase tracking-widest">
            <span className="bg-background-surface px-2 py-1 rounded">Job ID: {job.id}</span>
            <span className="bg-background-surface px-2 py-1 rounded">Vault: {job.escrow_address}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button className="btn-secondary flex-1 md:flex-none py-3 px-8 text-[11px] uppercase tracking-widest">Raise Dispute</button>
          <button className="btn-primary flex-1 md:flex-none py-3 px-10 text-[11px] uppercase tracking-widest shadow-xl shadow-accent-monad/20">Full Release</button>
        </div>
      </div>

      {/* Contract Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card relative overflow-hidden bg-gradient-to-br from-background-surface to-background-elevated/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💰</div>
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Escrow Liquidity</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white">{job.total_staked.toLocaleString()} <span className="text-sm font-bold text-text-secondary">MON</span></h2>
            <p className="text-xs text-status-success font-mono uppercase tracking-tighter flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse"></span>
              Secured on Chain
            </p>
          </div>
        </div>

        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">🚀</div>
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Total Settled</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-accent-monad">{totalReleased.toLocaleString()} <span className="text-sm font-bold text-text-secondary">MON</span></h2>
            <p className="text-xs text-text-secondary font-mono uppercase tracking-tighter">
              {progress.toFixed(1)}% Distributed
            </p>
          </div>
        </div>

        <div className="card relative overflow-hidden">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black mb-4">Execution Health</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white">Agreement Progress</span>
              <span className="text-xs font-mono text-accent-monad">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-background-elevated h-2 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div className="bg-accent-monad h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_var(--accent-monad-glow)]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 ml-1 mb-2">
            <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
            <h3 className="text-xl font-black tracking-tight uppercase text-white">Execution Roadmap</h3>
          </div>

          <div className="space-y-4">
            {milestones.sort((a,b) => a.order - b.order).map((m, idx) => (
              <div key={m.id} className={`card group transition-all duration-300 ${
                m.status === 'released' ? 'bg-accent-monad/5 border-accent-monad/20' : 
                m.status === 'verified' ? 'bg-status-success/5 border-status-success/20' : ''
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex gap-6 items-center flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border transition-all ${
                      m.status === 'released' ? 'bg-accent-monad border-accent-monad text-white scale-110 shadow-lg' :
                      m.status === 'verified' ? 'bg-status-success border-status-success text-white' :
                      'bg-background-elevated border-border-default text-text-secondary'
                    }`}>
                      {m.status === 'released' ? '✓' : idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-lg font-bold transition-colors ${m.status === 'released' ? 'text-white' : ''}`}>{m.description}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-accent-monad font-mono">{m.amount.toLocaleString()} MON</span>
                        <span className="w-1 h-1 bg-border-default rounded-full"></span>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                          m.status === 'released' ? 'text-status-success' : 
                          m.status === 'working' ? 'text-accent-monad animate-pulse' :
                          m.status === 'verified' ? 'text-status-success' : 'text-text-muted'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    {m.status === 'pending' && (
                       <button 
                        onClick={() => { setSelectedMilestoneId(m.id); setShowVerifyModal(true); }}
                        className="btn-secondary flex-1 md:flex-none text-[10px] uppercase tracking-widest py-2.5 px-6 border-accent-monad/30 hover:bg-accent-monad hover:text-white transition-all"
                       >
                         Submit Proof
                       </button>
                    )}
                    {m.status === 'working' && (
                       <div className="flex items-center gap-2 text-accent-monad text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-accent-monad/10 rounded-lg">
                         <span className="w-1.5 h-1.5 bg-accent-monad rounded-full animate-ping"></span>
                         Audit in Progress
                       </div>
                    )}
                    {(m.status === 'verified' || m.status === 'working') && (
                       <button 
                         onClick={() => handleRelease(m.id)}
                         disabled={isSubmitting}
                         className="btn-primary flex-1 md:flex-none text-[10px] uppercase tracking-widest py-2.5 px-8 shadow-lg shadow-accent-monad/20"
                       >
                         {isSubmitting ? 'Transacting...' : 'Disburse Funds'}
                       </button>
                    )}
                    {m.status === 'released' && (
                       <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-status-success px-4 py-2 border border-status-success/30 rounded-lg bg-status-success/5">
                         ✓ Settlement Complete
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
           <div className="card space-y-6 bg-background-elevated/20 border-dashed">
              <h4 className="text-sm font-black uppercase tracking-widest border-b border-border-default pb-3">Protocol Identity</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-text-secondary uppercase font-bold">Issuer Reputation</span>
                  <span className="text-xs text-white font-black">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-text-secondary uppercase font-bold">Protocol Latency</span>
                  <span className="text-xs text-status-success font-mono">14ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-text-secondary uppercase font-bold">Network Fragment</span>
                  <span className="text-xs text-accent-monad font-mono">MONAD-BETA</span>
                </div>
              </div>
              <div className="pt-2">
                <button className="btn-secondary w-full py-2.5 text-[9px] uppercase tracking-widest opacity-50 cursor-not-allowed">Audit Counterparty Identity</button>
              </div>
           </div>

           <div className="card space-y-4 border-accent-monad/10">
              <h4 className="text-sm font-black uppercase tracking-widest">Network Alert</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Verification audits are currently being decentralized across 3 independent validation layers. Payouts are instant once consensus is achieved.
              </p>
           </div>
        </div>
      </div>

      {/* Verification Modal (Simulated) */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-background-primary/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="card w-full max-w-lg space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-accent-monad/30 animate-scale-in">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-accent-monad/20 rounded-2xl flex items-center justify-center text-2xl mb-4">🔗</div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Submit External Proof</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Connect your external contribution (GitHub Commit, IPFS CID, or public evidence URL) to the Monad Validation Layer for automated audit.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Evidence Resource URL</label>
                <input 
                  type="text" 
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/monad-dev/bridge-audit/pull/14"
                  className="input-field text-sm font-mono"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-background-elevated/40 rounded-xl border border-white/5">
                <div className="w-2 h-2 bg-accent-monad rounded-full animate-ping"></div>
                <p className="text-[10px] text-text-secondary uppercase font-bold">Validator Node: monad-edge-verifier-12</p>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="btn-secondary flex-1 py-3 text-[10px] font-black uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifySubmission}
                disabled={isSubmitting || !proofUrl}
                className="btn-primary flex-1 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent-monad/30"
              >
                {isSubmitting ? 'Broadcasting...' : 'Signal Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
