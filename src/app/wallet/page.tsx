"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthGuard } from '@/components/AuthGuard';

interface Transaction {
  id: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  currency: string;
  related_job: string;
  status: string;
  timestamp: string;
}

export default function Wallet() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState({ mon: 1450.50, locked: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch Job Stats for Locked Balance
      const { data: jobs } = await supabase
        .from('jobs')
        .select(`*, milestones(*)`)
        .eq('employer_address', '0x7e1b...'); // Mock address

      const locked = jobs?.reduce((sum, job) => {
        const unreleased = job.milestones
          .filter((m: any) => m.status !== 'released')
          .reduce((s: number, m: any) => s + Number(m.amount), 0);
        return sum + unreleased;
      }, 0) || 0;

      setBalance(prev => ({ ...prev, locked }));

      // 2. Fetch Transactions (from released milestones)
      const { data: milestones } = await supabase
        .from('milestones')
        .select(`*, jobs(title, employer_address, worker_address)`)
        .eq('status', 'released');

      const txs: Transaction[] = milestones?.map((m: any) => ({
        id: `tx-${m.id.slice(0, 8)}`,
        type: m.jobs.worker_address === '0x7e1b...' ? 'Inflow' : 'Outflow',
        amount: m.amount,
        currency: 'MON',
        related_job: m.jobs.title,
        status: 'Finalized',
        timestamp: new Date(m.created_at).toLocaleDateString()
      })) || [];

      setTransactions(txs);
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  if (loading) return <div className="flex flex-col items-center justify-center py-24 space-y-4">
    <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Auditing Assets...</p>
  </div>;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Wallet Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border-default pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent-monad rounded-full animate-pulse shadow-[0_0_10px_var(--accent-monad-glow)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Monad Mainnet Asset Ledger</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase tracking-tighter">Institutional Wallet</h1>
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest bg-background-elevated px-3 py-1 rounded w-fit">0x7e1b...d91c</p>
        </div>
        
        <div className="flex gap-4">
          <button className="btn-secondary py-2.5 px-6 text-[11px] uppercase tracking-widest">Withdraw</button>
          <button className="btn-primary py-2.5 px-8 text-[11px] uppercase tracking-widest shadow-lg shadow-accent-monad/20">Deposit MON</button>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-background-surface to-background-elevated/30">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Available Liquidity</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-accent-monad">{balance.mon.toFixed(2)} <span className="text-sm font-medium text-text-secondary">MON</span></h2>
            <p className="text-xs text-text-secondary font-mono tracking-tighter">≈ ${ (balance.mon * 2.5).toLocaleString() } USD</p>
          </div>
        </div>
        <div className="card">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-4">Locked in Escrow</p>
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-white">{balance.locked.toFixed(2)} <span className="text-sm font-medium text-text-secondary">MON</span></h2>
            <p className="text-xs text-text-secondary font-mono">Distributed across {transactions.length} active settlements</p>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-accent-monad rounded-full"></div>
          <h3 className="text-xl font-bold tracking-tight">Recent Financial Activity</h3>
        </div>
        
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-elevated/20 border-b border-border-default/50">
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Transaction Type</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Related Asset</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Fidelity Amount</th>
                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/30">
              {transactions.map(tx => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-8">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                      tx.type === 'Inflow' ? 'text-status-success' : 'text-status-danger'
                    }`}>
                      {tx.type} Settlement
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <p className="text-sm font-bold text-white mb-0.5">{tx.related_job}</p>
                    <p className="text-[10px] font-mono text-text-secondary uppercase">{tx.id}</p>
                  </td>
                  <td className="py-5 px-8 font-mono text-sm font-bold">
                    <span className={tx.type === 'Inflow' ? 'text-status-success' : 'text-text-primary'}>
                      {tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toFixed(2)} {tx.currency}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right text-xs text-text-secondary font-mono">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}
