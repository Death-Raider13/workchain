export default function WalletDashboard() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          On-chain balance
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>$1,240</span>
          <span style={{ fontSize: '1.25rem', color: 'var(--secondary-text)', fontWeight: 500 }}>USDC</span>
        </div>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>
          0x9e1c...f33d &bull; Monad Testnet
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>In escrow</p>
          <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>$350</span>
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>Released</p>
          <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-green)' }}>$890</span>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--secondary-text)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Recent Activity
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Activity 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '0.25rem' }}>Milestone 2 released</p>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>Smart Contract Audit &bull; 2h ago</p>
            </div>
            <span style={{ color: 'var(--accent-green)', fontWeight: 500 }}>+$200</span>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%' }}></div>

          {/* Activity 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '0.25rem' }}>Escrow locked</p>
                <p style={{ color: 'var(--secondary-text)', fontSize: '0.875rem' }}>React Dashboard job &bull; 1d ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1rem', color: 'var(--secondary-text)' }}>&darr;</span>
              </div>
              <span style={{ color: 'var(--accent-red)', fontWeight: 500 }}>-$600</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
