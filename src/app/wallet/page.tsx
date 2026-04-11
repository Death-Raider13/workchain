"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PROTO, MockTransaction } from '@/lib/mock-proto';
import { AuthGuard } from '@/components/AuthGuard';

export default function Wallet() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MON' | 'NGN'>('MON');
  const [balance, setBalance] = useState({ mon: 5450.50, locked: 12500.00 });
  const [transactions, setTransactions] = useState<MockTransaction[]>([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000)); // Simulate ledger sync
      
      const stats = MOCK_PROTO.getStats();
      const txs = MOCK_PROTO.getTransactions();
      
      setTransactions(txs);
      setBalance({
        mon: 5450.50, // Available
        locked: stats.totalTVL / 10 // Mock portion locked by current user
      });
      
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  const rate = 2500; // NGN per MON

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest animate-pulse">Auditing Institutional Assets...</p>
    </div>
  );

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
        {/* Wallet Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border-default pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-status-success rounded-full animate-pulse shadow-[0_0_15px_rgba(0,196,140,0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Monad Mainnet-Beta Protocol Ledger</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Institutional Wallet</h1>
            <div className="flex items-center gap-4">
              <p className="font-mono text-[11px] text-accent-monad uppercase tracking-widest bg-accent-monad/5 border border-accent-monad/20 px-4 py-1.5 rounded-lg flex items-center gap-2">
                <span className="opacity-50">ADDR:</span> 0x7e1b...d91c
              </p>
              <div className="flex bg-background-surface p-1 rounded-lg border border-white/5 h-9">
                <button onClick={() => setCurrency('MON')} className={`px-4 text-[9px] font-black rounded ${currency === 'MON' ? 'bg-accent-monad text-white' : 'text-text-secondary'}`}>MON</button>
                <button onClick={() => setCurrency('NGN')} className={`px-4 text-[9px] font-black rounded ${currency === 'NGN' ? 'bg-accent-monad text-white' : 'text-text-secondary'}`}>NGN</button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="btn-secondary flex-1 md:flex-none py-3 px-8 text-[11px] font-black uppercase tracking-widest border-white/10 hover:border-accent-monad transition-all">Withdraw</button>
            <button className="btn-primary flex-1 md:flex-none py-3 px-10 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-accent-monad/20">Deposit MON</button>
          </div>
        </div>

        {/* Assets Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card relative overflow-hidden bg-gradient-to-br from-background-surface to-background-elevated/40 border-accent-monad/20 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black italic">LIQUID</div>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black mb-6">Available Liquidity</p>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {currency === 'MON' 
                  ? balance.mon.toLocaleString() 
                  : (balance.mon * rate).toLocaleString()} 
                <span className="text-xl font-bold text-text-secondary ml-2">{currency}</span>
              </h2>
              <p className="text-xs text-accent-monad font-mono tracking-widest uppercase">
                {currency === 'MON' ? `≈ ₦${(balance.mon * rate).toLocaleString()}` : `≈ ${balance.mon.toLocaleString()} MON`}
              </p>
            </div>
          </div>

          <div className="card relative overflow-hidden bg-background-elevated/20 border-dashed border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black italic">LOCKED</div>
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black mb-6">Locked in Active Escrow</p>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white tracking-tighter opacity-80">
                {currency === 'MON' 
                  ? balance.locked.toLocaleString() 
                  : (balance.locked * rate).toLocaleString()} 
                <span className="text-xl font-bold text-text-secondary ml-2">{currency}</span>
              </h2>
              <p className="text-xs text-text-secondary font-mono tracking-widest uppercase">
                Securing 4 Active Protocol Agreements
              </p>
            </div>
          </div>
        </div>

        {/* Activity Ledger */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-accent-monad rounded-full"></div>
              <h3 className="text-2xl font-black tracking-tight uppercase text-white">Consensus Transaction Audit</h3>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">{transactions.length} Records Verified</span>
          </div>
          
          <div className="card p-0 overflow-hidden border-border-default shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background-elevated/10 border-b border-border-default">
                    <th className="py-6 px-10 text-[10px] uppercase tracking-[0.2em] font-black text-text-secondary">Signature & Type</th>
                    <th className="py-6 px-10 text-[10px] uppercase tracking-[0.2em] font-black text-text-secondary">Execution Context</th>
                    <th className="py-6 px-10 text-[10px] uppercase tracking-[0.2em] font-black text-text-secondary">Fidelity Amount</th>
                    <th className="py-6 px-10 text-[10px] uppercase tracking-[0.2em] font-black text-text-secondary text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="group hover:bg-accent-monad/[0.03] transition-colors cursor-pointer">
                      <td className="py-8 px-10">
                        <div className="space-y-2">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                            tx.type === 'Inflow' ? 'border-status-success/30 text-status-success bg-status-success/5' : 
                            tx.type === 'Outflow' ? 'border-status-danger/30 text-status-danger bg-status-danger/5' : 
                            'border-accent-monad/30 text-accent-monad bg-accent-monad/5'
                          }`}>
                            {tx.type} Settlement
                          </span>
                          <p className="text-[10px] font-mono text-text-muted uppercase group-hover:text-accent-monad transition-colors">{tx.hash}</p>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <p className="text-sm font-black text-white mb-1 group-hover:text-accent-monad transition-colors">{tx.related_job}</p>
                        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{tx.id}</p>
                      </td>
                      <td className="py-8 px-10">
                        <p className={`text-xl font-black ${
                          tx.type === 'Inflow' ? 'text-status-success' : 'text-white/80'
                        }`}>
                          {tx.type === 'Inflow' ? '+' : '-'}{currency === 'MON' ? tx.amount.toLocaleString() : (tx.amount * rate).toLocaleString()} 
                          <span className="text-[10px] font-black ml-1 opacity-50">{currency}</span>
                        </p>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <p className="text-[11px] text-text-secondary font-mono tracking-tighter">{tx.timestamp}</p>
                        <span className="text-[8px] font-black text-status-success uppercase bg-status-success/10 px-2 py-0.5 rounded">Finalized</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.2em]">Searching for block records...</p>
              </div>
            )}
          </div>
        </div>

        {/* Claimable Rewards (Bonus Demo Feature) */}
        <div className="card bg-accent-monad/5 border border-accent-monad/20 flex flex-col md:flex-row items-center justify-between gap-8 p-12 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-7xl font-black rotate-12 group-hover:rotate-0 transition-transform duration-1000">REWARDS</div>
           <div className="space-y-4 max-w-lg text-center md:text-left relative z-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Stake-for-Reputation Rewards</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your labor fidelity score of 98/100 has generated incentive yield. Claim your participation rewards to increase your protocol authority.
              </p>
           </div>
           <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-accent-monad tracking-[0.2em] mb-1">Accumulated Yield</p>
                <p className="text-3xl font-black text-white">12.45 MON</p>
              </div>
              <button className="btn-primary py-3 px-10 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-accent-monad/50">Claim Rewards</button>
           </div>
        </div>
      </div>
    </AuthGuard>
  );
}
