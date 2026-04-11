"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendError, setResendError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('loading');
    setResendError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      setResendStatus('success');
    } catch (err: any) {
      setResendStatus('error');
      setResendError(err.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent-monad rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-monad/20">
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Access WorkChain</h1>
          <p className="text-text-secondary text-sm">Institutional labor escrow and settlement platform</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-status-danger/10 border border-status-danger/20 text-status-danger px-4 py-3 mb-6 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col gap-3">
              <span>{error}</span>
              {error.toLowerCase().includes('email not confirmed') && (
                <div className="pt-3 border-t border-status-danger/20">
                  <button 
                    onClick={handleResend}
                    disabled={resendStatus === 'loading'}
                    className="text-white bg-status-danger/20 hover:bg-status-danger/30 transition-colors px-4 py-2 rounded text-[10px] uppercase font-bold tracking-widest w-full"
                  >
                    {resendStatus === 'loading' ? 'Sending...' : 'Resend Verification Link'}
                  </button>
                  {resendStatus === 'success' && <p className="text-status-success text-[10px] mt-2">Verification email sent successfully!</p>}
                  {resendStatus === 'error' && <p className="text-status-danger text-[10px] mt-2">{resendError}</p>}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Network Identity (Email)</label>
              <input
                type="email"
                className="input-base w-full font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@organization.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Access Key (Password)</label>
              <input
                type="password"
                className="input-base w-full font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full text-xs uppercase tracking-widest py-3.5 shadow-lg shadow-accent-monad/20 mt-4"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-border-default flex-1"></div>
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">OR</span>
              <div className="h-px bg-border-default flex-1"></div>
            </div>
            <Link 
              href="/dashboard"
              className="btn-secondary w-full text-xs uppercase tracking-widest py-3.5 text-center flex items-center justify-center gap-2 hover:border-accent-monad transition-all"
            >
              <span className="w-2 h-2 bg-accent-monad rounded-full animate-pulse"></span>
              Direct Protocol Access
            </Link>
          </form>


          <div className="mt-8 pt-6 border-t border-border-default/50 text-center">
            <p className="text-sm text-text-secondary">
              <Link href="/dashboard" className="text-accent-monad hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">Return to Protocol Console</Link>
            </p>
          </div>

        </div>

        <div className="text-center">
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-mono">Secured by Monad Protocol</p>
        </div>
      </div>
    </div>
  );
}
