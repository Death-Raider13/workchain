"use client";

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: Redirect to dashboard instantly for demo purposes or handle realistic supabase login
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', animation: 'fadeIn 0.3s ease' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', border: '1px solid var(--border-color)', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-green)', borderRadius: '12px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', border: '3px solid #000', borderRadius: '50%' }}></div>
          </div>
          <h1 className="text-h1" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Login to WorkChain</h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>Secure escrow for the future of work</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>Email</label>
            <input 
              type="email" 
              className="input-base" 
              style={{ backgroundColor: '#111111', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>Password</label>
            <input 
              type="password" 
              className="input-base" 
              style={{ backgroundColor: '#111111', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
            Sign In ->
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
          Don't have an account? <span style={{ color: 'var(--accent-green)', cursor: 'pointer', fontWeight: 500 }}>Sign up</span>
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
