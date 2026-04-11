"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setRole(session.user.user_metadata?.role || 'worker');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setRole(session.user.user_metadata?.role || 'worker');
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (pathname === '/login' || pathname === '/signup') return null;

  // --- HACKATHON DEMO MODE: All tabs always visible ---
  const tabs = [
    { name: 'Home', href: '/' },
    { name: 'Service Ledger', href: '/jobs' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Profile', href: '/profile/0x7e1b...d91c' },
    { name: 'Admin', href: '/admin' },
  ];


  return (
    <div className="mb-10">
      <div className="flex justify-between items-center bg-background-surface/30 p-2 rounded-xl border border-border-default/50">
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href ||
              (tab.href === '/dashboard' && (pathname === '/employer/dashboard' || pathname === '/worker/dashboard'));
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-5 py-2.5 text-sm font-semibold transition-all rounded-lg ${isActive
                  ? 'bg-accent-monad text-white shadow-lg shadow-accent-monad/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/50'
                  }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-4 items-center pr-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-accent-monad font-bold animate-pulse">Network Status</span>
              <span className="text-xs font-mono text-text-primary">
                monad_mainnet_beta
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
