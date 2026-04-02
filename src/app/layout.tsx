import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'WorkChain | Institutional Labor Escrow',
  description: 'On-chain labor escrow for the future of work on Monad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background-primary text-text-primary selection:bg-accent-monad/30 min-h-screen">
        <header className="glass-nav sticky top-0 z-50 py-4 mb-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-accent-monad rounded-lg flex items-center justify-center shadow-lg shadow-accent-monad/20 transition-transform group-hover:scale-105">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">WorkChain</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-background-elevated/50 border border-border-default rounded-full px-3 py-1 items-center gap-2">
                <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">Monad Testnet</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Navigation />
          <main className="animate-fade-in">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
