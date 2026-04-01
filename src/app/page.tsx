"use client";

import { useState } from 'react';

export default function ContractsDashboard() {
  // Mock state for the MVP
  const [milestonesCompleted, setMilestonesCompleted] = useState(2);
  const totalMilestones = 3;
  
  const milestones = [
    { id: 1, title: 'Initial codebase review', amount: 150 },
    { id: 2, title: 'Vulnerability report', amount: 200 },
    { id: 3, title: 'Final audit + sign-off', amount: 150 },
  ];

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedAmount = milestones.slice(0, milestonesCompleted).reduce((sum, m) => sum + m.amount, 0);
  const percentage = Math.round((releasedAmount / totalAmount) * 100);

  const handleRelease = () => {
    if (milestonesCompleted < totalMilestones) {
      setMilestonesCompleted(prev => prev + 1);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div className="card" style={{ border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h2 className="text-h1" style={{ fontSize: '1.25rem' }}>Smart Contract Audit</h2>
          <div style={{ backgroundColor: '#E0F2FE', color: '#047857', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, background: '#D1FAE5' }}>
            Active
          </div>
        </div>
        
        <p className="text-secondary" style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
          Employer: 0x4f2a...b91c &bull; USDC
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {milestones.map((milestone, index) => {
            const isCompleted = index < milestonesCompleted;
            return (
              <div key={milestone.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isCompleted ? (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border-color)' }}></div>
                  )}
                  <span style={{ 
                    fontSize: '1rem', 
                    color: isCompleted ? 'var(--secondary-text)' : 'var(--primary-text)',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {milestone.title}
                  </span>
                </div>
                <span style={{ fontWeight: 500 }}>${milestone.amount}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <span>Escrow released</span>
            <span>{percentage}% &bull; ${releasedAmount} of ${totalAmount}</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--accent-green)', transition: 'width 0.5s ease-in-out' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            className="btn-primary" 
            style={{ flex: 1, cursor: milestonesCompleted >= totalMilestones ? 'not-allowed' : 'pointer', opacity: milestonesCompleted >= totalMilestones ? 0.5 : 1 }}
            onClick={handleRelease}
            disabled={milestonesCompleted >= totalMilestones}
          >
            Release milestone
          </button>
          <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
            Dispute
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div>
          <span>Recorded on Monad &bull; Tx 0x7c3d...a2f1</span>
        </div>
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
