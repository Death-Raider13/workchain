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

  const dashboardHref = role === 'employer'
    ? '/employer/dashboard'
    : role === 'worker'
      ? '/worker/dashboard'
      : '/';

  const tabs = [
    { name: 'Home', href: '/' },
    { name: 'Public Ledger', href: '/jobs' },
  ];

  if (user) {
    tabs.push({ name: 'Dashboard', href: dashboardHref });
    tabs.push({ name: 'Wallet', href: '/wallet' });
  }

  if (role === 'admin') {
    tabs.push({ name: 'Admin', href: '/admin' });
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center bg-background-surface/30 p-2 rounded-xl border border-border-default/50">
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
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
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Authorized</span>
                <span className="text-xs font-mono text-text-primary">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary text-[10px] uppercase tracking-widest py-2 px-4"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/signup" className="btn-primary text-[11px] uppercase tracking-widest py-2 px-6">
                Join Network
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
