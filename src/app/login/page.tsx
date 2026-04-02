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
            <div className="bg-status-danger/10 border border-status-danger/20 text-status-danger px-4 py-3 mb-6 rounded-lg text-xs font-bold uppercase tracking-wider">
              {error}
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
          </form>

          <div className="mt-8 pt-6 border-t border-border-default/50 text-center">
            <p className="text-sm text-text-secondary">
              New to the network? <Link href="/signup" className="text-accent-monad hover:text-white transition-colors font-bold">Register organization</Link>
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
