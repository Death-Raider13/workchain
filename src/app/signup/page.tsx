"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      // If Supabase is configured to require email confirmation, they won't have a session yet
      if (data?.user && !data.session) {
        setSubmitted(true);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
        <div className="w-full max-w-[440px] space-y-8 text-center">
          <div className="w-16 h-16 bg-background-elevated border border-accent-monad/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent-monad/10">
            <span className="text-3xl animate-pulse">✉️</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Identity Verification</h1>
          <div className="card space-y-6 py-10">
            <p className="text-text-secondary text-sm leading-relaxed">
              An institutional verification link has been dispatched to <span className="text-white font-mono font-bold bg-background-elevated px-2 py-0.5 rounded">{email}</span>.
            </p>
            <div className="bg-accent-monad/5 border border-accent-monad/20 p-4 rounded-xl">
              <p className="text-[10px] text-accent-monad font-bold uppercase tracking-widest leading-loose">
                Please authorize the request within your mail client to finalize organization deployment on the Monad network.
              </p>
            </div>
            <div className="pt-6 border-t border-border-default/50">
              <Link href="/login" className="btn-secondary w-full py-3 text-[10px] uppercase tracking-widest">
                Return to Portal
              </Link>
            </div>
          </div>
          <p className="text-[10px] text-text-secondary font-mono uppercase tracking-[0.2em]">Audit Log: MAIL_DISPATCH_SUCCESS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent-monad rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-monad/20">
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Organization</h1>
          <p className="text-text-secondary text-sm">Register your institutional identity on the Monad network</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-status-danger/10 border border-status-danger/20 text-status-danger px-4 py-3 mb-6 rounded-lg text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Admin Email Address</label>
              <input
                type="email"
                className="input-base w-full font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organization.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Initialize Password</label>
              <input
                type="password"
                className="input-base w-full font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure access key"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full text-xs uppercase tracking-widest py-3.5 shadow-lg shadow-accent-monad/20 mt-4"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Deploy Identity'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-default/50 text-center">
            <p className="text-sm text-text-secondary">
              Already registered? <Link href="/login" className="text-accent-monad hover:text-white transition-colors font-bold">Sign in to organization</Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-mono">Monad Governance Compliant</p>
        </div>
      </div>
    </div>
  );
}
