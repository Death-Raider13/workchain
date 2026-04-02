"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useBlockchain } from '@/hooks/useBlockchain';

interface MilestoneInput {
  description: string;
  amount: number;
}

export default function CreateJob() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { createEscrow, error: blockchainError } = useBlockchain();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workerAddress: '',
    milestones: [{ description: '', amount: 0 }] as MilestoneInput[]
  });

  const addMilestone = () => {
    if (formData.milestones.length < 20) {
      setFormData({
        ...formData,
        milestones: [...formData.milestones, { description: '', amount: 0 }]
      });
    }
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length > 1) {
      const newMilestones = [...formData.milestones];
      newMilestones.splice(index, 1);
      setFormData({ ...formData, milestones: newMilestones });
    }
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setFormData({ ...formData, milestones: newMilestones });
  };

  const totalAmount = formData.milestones.reduce((sum, m) => sum + Number(m.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Deploy to Blockchain
      const receipt = await createEscrow(
        formData.workerAddress,
        totalAmount.toString(),
        formData.milestones.map(m => m.description),
        formData.milestones.map(m => m.amount.toString())
      );

      if (!receipt) throw new Error(blockchainError || 'Blockchain transaction failed');

      // 2. Save to Supabase
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          description: formData.description,
          employer_address: user.user_metadata?.wallet_address || '0x7e1b...',
          worker_address: formData.workerAddress,
          escrow_address: receipt.contractAddress || '0x...', // Get from event if not direct
          total_staked: totalAmount,
          status: 'active'
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // 3. Save Milestones
      const milestonesToInsert = formData.milestones.map((m, index) => ({
        job_id: job.id,
        description: m.description,
        amount: m.amount,
        status: 'pending',
        order_index: index
      }));

      const { error: msError } = await supabase
        .from('milestones')
        .insert(milestonesToInsert);

      if (msError) throw msError;

      router.push('/');
    } catch (err: any) {
      console.error('Submission failed:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="border-b border-border-default pb-10 space-y-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-accent-monad hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Ledger</span>
          </Link>
          <span className="badge badge-active text-[10px]">Step {step} of 2</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          {step === 1 ? 'Initialize Escrow Contract' : 'Execution Roadmap'}
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
          {step === 1 
            ? 'Deploy a secure, milestone-based escrow contract on the Monad network. Funds will be locked until delivery.'
            : 'Define the deliverables and financial allocations for this contract.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Step 1: Core Details */}
            <div className="card space-y-8 bg-gradient-to-br from-background-surface to-background-elevated/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-monad flex items-center justify-center font-bold text-white shadow-lg shadow-accent-monad/20">1</div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Protocol Metadata</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Contract Designation</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Q2 Protocol Audit / Frontend Implementation"
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Counterparty Address (Worker)</label>
                    <input 
                      type="text" 
                      value={formData.workerAddress}
                      onChange={(e) => setFormData({ ...formData, workerAddress: e.target.value })}
                      placeholder="0x..."
                      className="input-field font-mono text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Settlement Asset</label>
                    <div className="relative group">
                      <select className="input-field text-sm appearance-none cursor-pointer">
                        <option>MON (Monad Native)</option>
                        <option>USDT</option>
                        <option>USDC</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary group-hover:text-accent-monad transition-colors">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn-primary py-3 px-10 text-[11px] uppercase tracking-widest shadow-lg shadow-accent-monad/20"
              >
                Next: Execution Plan
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Step 2: Milestones */}
            <div className="card space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-background-elevated border border-border-default flex items-center justify-center font-bold text-text-secondary">2</div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">Execution Roadmap</h3>
                </div>
                <button 
                  type="button"
                  onClick={addMilestone}
                  className="text-[10px] font-bold text-accent-monad hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform">+</span>
                  Add Requirement
                </button>
              </div>

              <div className="space-y-4">
                {formData.milestones.map((m, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <div className="flex-1 space-y-4 p-6 bg-background-elevated/20 border border-border-default/50 rounded-2xl hover:border-accent-monad/30 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1">Objective</label>
                          <input 
                            type="text" 
                            value={m.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                            placeholder="Define the deliverable..."
                            className="bg-transparent border-none p-0 focus:ring-0 text-white font-semibold placeholder:text-text-secondary/50 w-full"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-text-secondary uppercase font-bold tracking-widest ml-1 text-right">Allocation</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              value={m.amount}
                              onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                              className="bg-transparent border-none p-0 focus:ring-0 text-accent-monad font-mono font-bold w-full text-right"
                              required
                            />
                            <span className="text-[10px] font-bold text-text-secondary">MON</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {formData.milestones.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="mt-6 p-2 text-text-secondary hover:text-status-danger transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-border-default mt-10 p-4">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Total Committed Volume</p>
                <p className="text-3xl font-extrabold text-white">{totalAmount.toFixed(2)} <span className="text-sm font-medium text-text-secondary">MON</span></p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="btn-secondary py-4 px-8 text-xs uppercase tracking-widest flex-1 md:flex-none"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-4 px-12 text-xs uppercase tracking-[0.2em] shadow-2xl shadow-accent-monad/30 flex-1 md:flex-none"
                >
                  {loading ? 'Initializing...' : 'Deploy Smart Contract'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
