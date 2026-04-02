"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: ('employer' | 'worker' | 'admin')[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const role = session.user.user_metadata?.role || 'worker';
      
      if (!allowedRoles.includes(role)) {
        // Redirect to their own dashboard if they have the wrong role
        if (role === 'employer') router.push('/employer/dashboard');
        else if (role === 'worker') router.push('/worker/dashboard');
        else if (role === 'admin') router.push('/admin');
        else router.push('/');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAccess();
  }, [allowedRoles, router]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-8 h-8 border-2 border-accent-monad/20 border-t-accent-monad rounded-full animate-spin"></div>
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Verifying Authorization...</p>
    </div>
  );

  return authorized ? <>{children}</> : null;
}
