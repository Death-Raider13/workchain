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
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendError, setResendError] = useState<string | null>(null);
  const router = useRouter();

  const [role, setRole] = useState<'employer' | 'worker'>('worker');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: email.split('@')[0], // Placeholder
          }
        }
      });

      if (error) throw error;
      
      // If Supabase is configured to require email confirmation, they won't have a session yet
      if (data?.user && !data.session) {
        setSubmitted(true);
      } else {
        router.push(role === 'employer' ? '/employer/dashboard' : '/worker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
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
                Please authorize the request within your mail client to finalize organization deployment as a <span className="text-white underline">{role.toUpperCase()}</span> on the Monad network.
              </p>
            </div>
            <div className="pt-6 border-t border-border-default/50 space-y-3">
              <button 
                onClick={handleResend}
                disabled={resendStatus === 'loading' || resendStatus === 'success'}
                className="btn-primary w-full py-3 text-[10px] uppercase tracking-widest shadow-lg shadow-accent-monad/20"
              >
                {resendStatus === 'loading' ? 'Sending...' : resendStatus === 'success' ? 'Email Sent!' : 'Resend Link'}
              </button>
              {resendStatus === 'error' && <p className="text-status-danger text-[10px] text-center">{resendError}</p>}
              <Link href="/login" className="btn-secondary w-full py-3 text-[10px] uppercase tracking-widest block text-center">
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
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Initialize Protocol</h1>
          <p className="text-text-secondary text-sm">Deploy your institutional identity on the Monad network</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-status-danger/10 border border-status-danger/20 text-status-danger px-4 py-3 mb-6 rounded-lg text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="mb-10">
            <label className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-text-secondary ml-1 mb-4 block">Select Operational Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setRole('employer')}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all ${
                  role === 'employer' 
                    ? 'bg-accent-monad/10 border-accent-monad shadow-lg shadow-accent-monad/10' 
                    : 'bg-background-elevated border-border-default hover:border-text-secondary'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-background-surface flex items-center justify-center text-xl shadow-inner">🏢</div>
                <div className="text-center">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${role === 'employer' ? 'text-white' : 'text-text-secondary'}`}>Organization</p>
                  <p className="text-[9px] text-text-muted mt-0.5 uppercase tracking-tighter">Pool Liquidity</p>
                </div>
              </button>
              <button 
                type="button"
                onClick={() => setRole('worker')}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all ${
                  role === 'worker' 
                    ? 'bg-accent-monad/10 border-accent-monad shadow-lg shadow-accent-monad/10' 
                    : 'bg-background-elevated border-border-default hover:border-text-secondary'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-background-surface flex items-center justify-center text-xl shadow-inner">⚡</div>
                <div className="text-center">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${role === 'worker' ? 'text-white' : 'text-text-secondary'}`}>Developer</p>
                  <p className="text-[9px] text-text-muted mt-0.5 uppercase tracking-tighter">Deliver Proof</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Administrative Email</label>
              <input
                type="email"
                className="input-base w-full font-mono text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organization.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary ml-1">Secure Access Key</label>
              <input
                type="password"
                className="input-base w-full font-mono text-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full text-[11px] font-black uppercase tracking-widest py-4 shadow-lg shadow-accent-monad/20 mt-4 h-14"
              disabled={loading}
            >
              {loading ? 'DEPLOYING...' : `AUTHORIZE ${role === 'employer' ? 'ISSUER' : 'PROVIDER'} IDENTITY`}
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
