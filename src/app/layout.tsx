import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'WorkChain',
  description: 'WorkChain MVP on Monad Testnet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-green)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid #000', borderRadius: '50%' }}></div>
              </div>
              <span className="text-h1" style={{ fontSize: '1.25rem' }}>WorkChain on Monad</span>
            </div>
            <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600 }}>
              Testnet
            </div>
          </header>
          
          <Navigation />
          
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
