"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardSelector() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'employer',
      title: 'Issuer Console',
      subtitle: 'Capital Issuer',
      icon: '🏢',
      href: '/employer/dashboard',
      description: 'Manage on-chain capital allocation, deploy escrow contracts, and oversee service execution.',
      stats: [
        { label: 'TVL', value: '12.5 MON' },
        { label: 'Active', value: '3' },
        { label: 'Disputes', value: '0' },
      ],
      gradient: 'from-accent-monad/10 to-purple-900/10',
      borderColor: 'border-accent-monad/30',
    },
    {
      id: 'worker',
      title: 'Provider Console',
      subtitle: 'Service Provider',
      icon: '⚡',
      href: '/worker/dashboard',
      description: 'Track active contracts, manage deliverables, and monitor your on-chain reputation score.',
      stats: [
        { label: 'Earnings', value: '8.2 MON' },
        { label: 'Pipeline', value: '2' },
        { label: 'Score', value: '98' },
      ],
      gradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-monad/10 border border-accent-monad/20">
          <div className="w-2 h-2 bg-accent-monad rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-monad">Hackathon Demo Mode</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
          Select <span className="text-accent-monad">Workspace</span>
        </h1>
        <p className="text-text-secondary text-sm max-w-lg mx-auto">
          Choose your operational role to access the specialized dashboard. Switch between roles at any time.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={role.href}
            onMouseEnter={() => setHoveredRole(role.id)}
            onMouseLeave={() => setHoveredRole(null)}
            className={`card group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              hoveredRole === role.id ? role.borderColor : ''
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className="relative z-10 p-8 space-y-6">
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="badge badge-active text-[9px]">{role.subtitle}</span>
                <span className="text-3xl">{role.icon}</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-accent-monad transition-colors">
                  {role.title}
                </h2>
                <p className="text-text-secondary text-xs mt-2 leading-relaxed">{role.description}</p>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-default/50">
                {role.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-2">
                <div className="btn-secondary w-full py-3 text-[10px] uppercase tracking-widest text-center group-hover:bg-accent-monad group-hover:text-white group-hover:border-accent-monad transition-all">
                  Enter Console <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin Quick Access */}
      <div className="mt-12 text-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-background-surface/50 border border-border-default/50 hover:border-accent-monad/30 transition-all group"
        >
          <span className="text-lg">🛡️</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">
            Admin Arbitration Console
          </span>
          <span className="text-text-muted group-hover:text-accent-monad transition-colors">→</span>
        </Link>
      </div>
    </div>
  );
}
