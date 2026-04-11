"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  // --- HACKATHON DEMO MODE: Disabled role-based redirect ---
  // const router = useRouter();
  // const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (session?.user) {
  //       const role = session.user.user_metadata?.role || 'worker';
  //       if (role === 'employer') router.push('/employer/dashboard');
  //       else if (role === 'worker') router.push('/worker/dashboard');
  //       else if (role === 'admin') router.push('/admin');
  //     } else {
  //       setLoading(false);
  //     }
  //   };
  //   checkUser();
  // }, [router]);
  //
  // if (loading) return (
  //   <div className="flex flex-col items-center justify-center py-24 space-y-4">
  //     <div className="w-10 h-10 border-4 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
  //     <p className="text-text-secondary text-sm font-mono uppercase tracking-widest animate-pulse">Initializing Protocol...</p>
  //   </div>
  // );


  return (
    <div className="max-w-6xl mx-auto py-20 px-4 animate-fade-in">
      <div className="text-center space-y-8 mb-24">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-monad/10 border border-accent-monad/20 mb-6">
          <div className="w-2 h-2 bg-accent-monad rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-monad">Institutional Escrow Protocol • Monad L1</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
          Work<span className="text-accent-monad">Chain</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Decentralized Service Level Agreements (dSLA) with automated milestone settlement and audited proof-of-work on the Monad network.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
          <Link href="/dashboard" className="btn-primary py-4 px-12 text-sm uppercase tracking-widest shadow-2xl shadow-accent-monad/30 w-full md:w-auto font-black h-16 flex items-center">
            Initialize Console
          </Link>

          <Link href="/jobs" className="btn-secondary py-4 px-12 text-sm uppercase tracking-widest hover:border-accent-monad transition-all w-full md:w-auto h-16 flex items-center">
            Browse Public Ledger
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-10 space-y-6 bg-gradient-to-br from-background-surface to-background-elevated/30">
          <div className="w-14 h-14 bg-accent-monad rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-accent-monad/20">🏦</div>
          <h3 className="text-2xl font-bold uppercase tracking-tight">Institutional Escrow</h3>
          <p className="text-text-secondary text-sm leading-relaxed">Secure capital in smart contract vaults. Funds are only released upon automated audit or mutual authorization.</p>
        </div>
        <div className="card p-10 space-y-6">
          <div className="w-14 h-14 bg-background-elevated border border-border-default rounded-2xl flex items-center justify-center text-2xl">⚡</div>
          <h3 className="text-2xl font-bold uppercase tracking-tight">Rapid Settlement</h3>
          <p className="text-text-secondary text-sm leading-relaxed">Leverage Monad&apos;s parallel execution for instant milestone payouts and sub-second confirmation times.</p>
        </div>
        <div className="card p-10 space-y-6">
          <div className="w-14 h-14 bg-background-elevated border border-border-default rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
          <h3 className="text-2xl font-bold uppercase tracking-tight">Audited Proofs</h3>
          <p className="text-text-secondary text-sm leading-relaxed">Every delivery is crypographically hashed and verified by our distributed audit network before funds are dispersed.</p>
        </div>
      </div>

      <div className="mt-32 pt-20 border-t border-border-default text-center">
        <p className="text-[10px] text-text-muted font-mono uppercase tracking-[0.4em]">Powered by Monad Network • Audited by WorkChain Core</p>
      </div>
    </div>
  );
}
