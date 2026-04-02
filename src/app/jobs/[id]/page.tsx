"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useBlockchain } from '@/hooks/useBlockchain';

interface Milestone {
  id: string;
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
  status: 'active' | 'completed' | 'disputed';
  total_staked: number;
  milestones: Milestone[];
}

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { releaseMilestone, raiseDispute, loading: txLoading, error: blockchainError } = useBlockchain();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');

  const fetchJob = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserAddress('0x7e1b...'); // Placeholder for user's wallet
    }

    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        milestones (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();

    const channel = supabase
      .channel(`job-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones', filter: `job_id=eq.${id}` }, fetchJob)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs', filter: `id=eq.${id}` }, fetchJob)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) return <div className="flex flex-col items-center justify-center py-24 space-y-4">
    <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Syncing Contract...</p>
  </div>;
  
  if (!job) return <div className="card text-center py-24">Contract Record Not Found.</div>;

  const userRole = userAddress?.toLowerCase() === job.employer_address.toLowerCase() ? 'employer' : 'worker';
  const totalReleased = job.milestones.filter(m => m.status === 'released').reduce((sum, m) => sum + Number(m.amount), 0);
  const progress = (totalReleased / job.total_staked) * 100;

  const handleRelease = async (milestoneId: string, index: number) => {
    const success = await releaseMilestone(1, index); // Using mock escrowId 1 for now
    if (success) {
      const { error } = await supabase
        .from('milestones')
        .update({ status: 'released' })
        .eq('id', milestoneId);
      
      if (error) console.error('Supabase update failed:', error);
      fetchJob();
    } else {
      alert(blockchainError || 'Transaction failed');
    }
  };

  const handleDispute = async () => {
    const success = await raiseDispute(1); // Using mock escrowId 1
    if (success) {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'disputed' })
        .eq('id', id);
      
      if (error) console.error('Supabase update failed:', error);
      fetchJob();
      alert('Network Dispute Initialized. Funds are now locked until governance arbitration.');
    } else {
      alert(blockchainError || 'Dispute initialization failed');
    }
  };

  const handleSubmitVerification = async () => {
    if (!proofUrl || !selectedMilestone) return;
    
    setLoading(true);
    try {
      // 1. Save locally to Supabase
      const { error: vError } = await supabase
        .from('verifications')
        .insert({
          job_id: job.id,
          milestone_id: selectedMilestone,
          proof_type: 'github',
          proof_url: proofUrl,
          status: 'pending'
        });

      if (vError) throw vError;

      // 2. Call Python Backend /verify (Mocked call)
      console.log('Calling Python backend verify service for:', proofUrl);
      
      // Update milestone status to 'working' or similar if needed
      await supabase
        .from('milestones')
        .update({ status: 'working' })
        .eq('id', selectedMilestone);

      setShowVerifyModal(false);
      setProofUrl('');
      fetchJob();
      alert('Verification submission recorded. Background service is processing proof...');
    } catch (err: any) {
      alert('Submission failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-default pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-accent-monad hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Ledger</span>
            </Link>
            <span className={`badge ${
              job.status === 'active' ? 'badge-active' : 
              job.status === 'disputed' ? 'badge-disputed' : 'badge-complete'
            } text-[10px]`}>
              On-Chain {job.status}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase tracking-tighter">{job.title}</h1>
          <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
            <span className="uppercase tracking-widest">Job ID: {job.id.slice(0, 8)}</span>
            <span className="w-1 h-1 bg-border-default rounded-full"></span>
            <span className="text-accent-monad">Escrow: {job.escrow_address || 'Pending Deployment'}</span>
          </div>
        </div>
        
        {userRole === 'employer' && job.status === 'active' && (
          <div className="flex gap-4">
            <button 
              onClick={handleDispute}
              disabled={txLoading}
              className="btn-secondary py-2.5 px-6 text-[11px] uppercase tracking-widest"
            >
              {txLoading ? 'Processing...' : 'Raise Dispute'}
            </button>
            <button className="btn-primary py-2.5 px-8 text-[11px] uppercase tracking-widest shadow-lg shadow-accent-monad/20">Release Full Balance</button>
          </div>
        )}
      </div>

      {/* Escrow Analytics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Escrowed Balance</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">{job.total_staked} <span className="text-sm font-medium text-text-secondary">MON</span></h2>
            <p className="text-xs text-status-success font-mono">Secured on Monad L1</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Released to Worker</p>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-accent-monad">{totalReleased} <span className="text-sm font-medium text-text-secondary">MON</span></h2>
            <p className="text-xs text-text-secondary font-mono">{progress.toFixed(1)}% Distributed</p>
          </div>
        </div>
        <div className="card border-accent-monad/20">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Network Protocol</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-accent-monad rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase">Escrow Vault Active</span>
            </div>
            <div className="w-full bg-background-elevated h-1 rounded-full overflow-hidden">
              <div className="bg-accent-monad h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Flow */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
            <h3 className="text-xl font-bold tracking-tight uppercase">Execution Roadmap</h3>
          </div>
        </div>

        <div className="space-y-4">
          {job.milestones?.sort((a, b) => (a as any).order_index - (b as any).order_index).map((milestone, idx) => (
            <div key={milestone.id} className={`card group relative overflow-hidden transition-all ${
              milestone.status === 'released' ? 'border-accent-monad/30 bg-accent-monad/5' : ''
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-6 items-center flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border transition-colors ${
                    milestone.status === 'released' 
                      ? 'bg-accent-monad border-accent-monad text-white shadow-lg shadow-accent-monad/20' 
                      : 'bg-background-elevated border-border-default text-text-secondary'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold">{milestone.description}</h4>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-mono text-accent-monad font-bold">{milestone.amount} MON</p>
                      <span className="w-1 h-1 bg-border-default rounded-full"></span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        milestone.status === 'released' ? 'text-status-success' : 'text-text-secondary'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {userRole === 'employer' && milestone.status !== 'released' && (
                    <button 
                      onClick={() => handleRelease(milestone.id, idx)}
                      disabled={txLoading}
                      className="btn-primary flex-1 md:flex-none text-[10px] uppercase tracking-widest py-2.5 px-6 shadow-lg shadow-accent-monad/20"
                    >
                      {txLoading ? 'Settling...' : 'Release Funds'}
                    </button>
                  )}
                  
                  {userRole === 'worker' && milestone.status === 'pending' && (
                    <button 
                      onClick={() => { setSelectedMilestone(milestone.id); setShowVerifyModal(true); }}
                      className="btn-secondary flex-1 md:flex-none text-[10px] uppercase tracking-widest py-2.5 px-6 hover:border-accent-monad transition-all"
                    >
                      Submit Proof
                    </button>
                  )}

                  {milestone.status === 'released' && (
                    <div className="flex items-center gap-2 text-status-success font-bold text-[10px] uppercase tracking-widest">
                      <span>✓ Settlement Success</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md space-y-6 shadow-2xl shadow-black animate-fade-in-scale">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Submit Verification</h3>
              <p className="text-xs text-text-secondary">Provide a link to your proof of work (GitHub PR, file, or documentation). Our background service will verify this content on-chain.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Proof URL / Resource Link</label>
              <input 
                type="text" 
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="input-base text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setShowVerifyModal(false)} className="btn-secondary flex-1 text-xs uppercase tracking-widest">Cancel</button>
              <button 
                onClick={handleSubmitVerification}
                className="btn-primary flex-1 text-xs uppercase tracking-widest shadow-lg shadow-accent-monad/20"
              >
                Submit for Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reputation Section */}
      {job.status === 'completed' && (
        <div className="pt-10 border-t border-border-default">
          <div className="card bg-background-elevated/20 flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-12 border-dashed">
            <div className="space-y-4 text-center md:text-left max-w-md">
              <h3 className="text-2xl font-bold tracking-tight uppercase">Network Reputation Audit</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Counterparty delivery finalized. Provide a quantitative assessment to update the global Labor Fidelity scores on Monad.
              </p>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} className="w-12 h-12 rounded-xl bg-background-elevated border border-border-default flex items-center justify-center text-xl hover:border-accent-monad transition-all hover:-translate-y-1 cursor-pointer">
                  ⭐
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
