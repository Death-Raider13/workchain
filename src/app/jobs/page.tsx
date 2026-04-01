"use client";

import { useState } from 'react';

export default function JobBoard() {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');

  const listings = [
    { id: 1, initials: 'AO', bg: '#064E3B', color: '#34D399', title: 'Logo + brand identity', author: 'Adaeze O.', location: 'Lagos', milestones: 2, budget: 180 },
    { id: 2, initials: 'KM', bg: '#4C1D95', color: '#D8B4FE', title: 'Python data scraper', author: 'Kunle M.', location: 'Ibadan', milestones: 3, budget: 300 },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Post a job
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Job title (e.g. UI designer for landing page...)" 
            className="input-base"
            style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <input 
              type="text" 
              placeholder="Budget (USDC)" 
              className="input-base"
              style={{ fontSize: '1.125rem' }}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Post</button>
          </div>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Open Listings
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {listings.map(job => (
            <div key={job.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: job.bg, 
                  color: job.color,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {job.initials}
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{job.title}</p>
                  <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>
                    {job.author} &bull; {job.location} &bull; {job.milestones} milestones
                  </p>
                </div>
              </div>
              <span style={{ color: 'var(--accent-green)', fontWeight: 500 }}>${job.budget}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
