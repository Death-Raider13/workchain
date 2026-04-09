"use client";

// ============================================================
// HACKATHON DEMO MODE — Authentication bypassed.
// Original auth logic is preserved below as comments.
// To re-enable, uncomment the original code and remove the
// passthrough return below.
// ============================================================

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // --- HACKATHON: Bypass all auth checks ---
  return <>{children}</>;

  // --- ORIGINAL IMPLEMENTATION (re-enable after hackathon) ---
  // const router = useRouter();
  // const [loading, setLoading] = useState(true);
  // const [authenticated, setAuthenticated] = useState(false);
  //
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       router.push('/login');
  //       return;
  //     }
  //     setAuthenticated(true);
  //     setLoading(false);
  //   };
  //   checkAuth();
  // }, [router]);
  //
  // if (loading) return (
  //   <div className="flex flex-col items-center justify-center py-24 space-y-4">
  //     <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
  //     <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Verifying Identity...</p>
  //   </div>
  // );
  //
  // return authenticated ? <>{children}</> : null;
}
