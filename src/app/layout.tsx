import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'WorkChain | Institutional Labor Escrow',
  description: 'On-chain labor escrow for the future of work on Monad',
  icons: {
    icon: [
      { url: '/logo.jpeg' },
      { url: '/ogo.jpeg', sizes: '32x32' }
    ],
    apple: [
      { url: '/logo.jpeg' }
    ],
    shortcut: ['/logo.jpeg'],
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
      </head>
      <body className="antialiased bg-background-primary text-text-primary selection:bg-accent-monad/30 min-h-screen">

        <header className="glass-nav sticky top-0 z-50 py-4 mb-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                <img src="/logo.jpeg" alt="WorkChain Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">WORK<span className="text-accent-monad">CHAIN</span></span>
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] mt-1 ml-0.5">Protocol Fragment</span>
              </div>
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
