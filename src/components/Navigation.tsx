"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const tabs = [
    { name: 'My Contracts', href: '/' },
    { name: 'Job Board', href: '/jobs' },
    { name: 'Wallet', href: '/wallet' },
  ];

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link 
            key={tab.name} 
            href={tab.href}
            style={{
              padding: '0.75rem 0.5rem',
              color: isActive ? 'var(--primary-text)' : 'var(--secondary-text)',
              borderBottom: isActive ? '3px solid var(--primary-text)' : '3px solid transparent',
              fontWeight: isActive ? 600 : 400,
              flex: 1,
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'color 0.2s, border-color 0.2s'
            }}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
