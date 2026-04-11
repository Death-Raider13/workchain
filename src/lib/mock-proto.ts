// src/lib/mock-proto.ts
// ============================================================
// The "Virtual Protocol Brain"
// Centrally manages all simulated data for the Hackathon Demo.
// Ensures consistency across Dashboards, Jobs, and Wallet.
// ============================================================

export interface MockMilestone {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'working' | 'released' | 'verified';
  order: number;
}

export interface MockJob {
  id: string;
  title: string;
  category: 'DeFi' | 'Infrastructure' | 'Frontend' | 'Security' | 'NFT';
  description: string;
  employer_address: string;
  worker_address: string;
  escrow_address: string;
  status: 'active' | 'completed' | 'disputed' | 'open';
  total_staked: number;
  milestones: MockMilestone[];
  created_at: string;
  tags: string[];
}

export interface MockTransaction {
  id: string;
  type: 'Inflow' | 'Outflow' | 'Escrow Lock' | 'Fee';
  amount: number;
  currency: 'MON' | 'NGN';
  related_job: string;
  status: 'Finalized' | 'Pending' | 'Canceled';
  timestamp: string;
  hash: string;
}

const MOCK_JOBS: MockJob[] = [
  {
    id: '0xc1...a3e4',
    title: 'Monad Bridge Security Audit',
    category: 'Security',
    description: 'High-fidelity security audit of the Monad cross-chain bridge implementation. Focus on withdrawal logic and validator slashing.',
    employer_address: '0x1c9e...d4b2',
    worker_address: '0x7e1b...d91c', // Current User (Demo Account)
    escrow_address: '0x88ea...f002',
    status: 'active',
    total_staked: 2500,
    tags: ['Solidity', 'Audit', 'Monad'],
    created_at: '2024-04-10T10:00:00Z',
    milestones: [
      { id: 'm1', description: 'Internal Review', amount: 500, status: 'released', order: 1 },
      { id: 'm2', description: 'Vulnerability Analysis', amount: 1000, status: 'working', order: 2 },
      { id: 'm3', description: 'Final Report', amount: 1000, status: 'pending', order: 3 },
    ]
  },
  {
    id: '0xf2...b9d1',
    title: 'DEX Liquidity Dashboard Build',
    category: 'DeFi',
    description: 'Build a Next.js dashboard for real-time visualization of Monad DEX liquidity pools and trading volume.',
    employer_address: '0x3a4c...d7e8',
    worker_address: '0x7e1b...d91c', // Current User
    escrow_address: '0x99bc...a112',
    status: 'completed',
    total_staked: 1250,
    tags: ['Next.js', 'Web3', 'Tailwind'],
    created_at: '2024-03-25T14:30:00Z',
    milestones: [
      { id: 'm4', description: 'UI Mockups', amount: 250, status: 'released', order: 1 },
      { id: 'm5', description: 'API Integration', amount: 500, status: 'released', order: 2 },
      { id: 'm6', description: 'Deployment', amount: 500, status: 'released', order: 3 },
    ]
  },
  {
    id: '0xa4...e112',
    title: 'NFT Creator Launchpad',
    category: 'NFT',
    description: 'Create a no-code launchpad for creators to deploy NFT collections on Monad with support for dynamic metadata.',
    employer_address: '0x5d4b...e7a3',
    worker_address: '0x0000...0000', // Open
    escrow_address: '0xbb11...c223',
    status: 'open',
    total_staked: 3500,
    tags: ['React', 'Solidity', 'NFTs'],
    created_at: '2024-04-11T09:15:00Z',
    milestones: [
      { id: 'm7', description: 'Smart Contracts', amount: 1500, status: 'pending', order: 1 },
      { id: 'm8', description: 'Frontend Interface', amount: 1000, status: 'pending', order: 2 },
      { id: 'm9', description: 'Audit Support', amount: 1000, status: 'pending', order: 3 },
    ]
  },
  {
    id: '0xbb...c8d9',
    title: 'Lending Protocol Smart Contracts',
    category: 'DeFi',
    description: 'Implementing the core lending and borrowing engine for a new decentralized finance protocol on Monad.',
    employer_address: '0x7e1b...d91c', // Current User as Employer
    worker_address: '0x4b7c...a3f8',
    escrow_address: '0xcc22...d334',
    status: 'active',
    total_staked: 5000,
    tags: ['DeFi', 'Solidity', 'Architecture'],
    created_at: '2024-04-05T11:20:00Z',
    milestones: [
      { id: 'm10', description: 'Interest Rate Models', amount: 1000, status: 'released', order: 1 },
      { id: 'm11', description: 'Collateral Logic', amount: 2000, status: 'working', order: 2 },
      { id: 'm12', description: 'Liquidation Engine', amount: 2000, status: 'pending', order: 3 },
    ]
  },
  {
    id: '0xdd...e445',
    title: 'Monad Explorer Redesign',
    category: 'Infrastructure',
    description: 'Full UX/UI redesign for the Monad ecosystem block explorer. Focused on better data visualization for validators.',
    employer_address: '0x9a2f...d4e1',
    worker_address: '0x7e1b...d91c',
    escrow_address: '0xdd33...e445',
    status: 'disputed',
    total_staked: 2200,
    tags: ['Design', 'UI/UX', 'Figma'],
    created_at: '2024-04-01T15:00:00Z',
    milestones: [
      { id: 'm13', description: 'User Research', amount: 500, status: 'released', order: 1 },
      { id: 'm14', description: 'High-Fi Mockups', amount: 1700, status: 'working', order: 2 },
    ]
  }
];

const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 'TX-118274',
    type: 'Inflow',
    amount: 500,
    currency: 'MON',
    related_job: 'Monad Bridge Security Audit',
    status: 'Finalized',
    timestamp: '2024-04-10',
    hash: '0x7a2...b4e2'
  },
  {
    id: 'TX-118222',
    type: 'Inflow',
    amount: 1250,
    currency: 'MON',
    related_job: 'DEX Liquidity Dashboard Build',
    status: 'Finalized',
    timestamp: '2024-04-05',
    hash: '0x8b3...c5f3'
  },
  {
    id: 'TX-117992',
    type: 'Outflow',
    amount: 1000,
    currency: 'MON',
    related_job: 'Lending Protocol Smart Contracts',
    status: 'Finalized',
    timestamp: '2024-04-06',
    hash: '0x9c4...d6g4'
  },
  {
    id: 'TX-117551',
    type: 'Escrow Lock',
    amount: 5000,
    currency: 'MON',
    related_job: 'Lending Protocol Smart Contracts',
    status: 'Finalized',
    timestamp: '2024-04-05',
    hash: '0xad5...e7h5'
  }
];

export const MOCK_PROTO = {
  getJobs: () => MOCK_JOBS,
  getJobById: (id: string) => MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0],
  getTransactions: () => MOCK_TRANSACTIONS,
  getStats: () => ({
    totalTVL: 124500,
    activeContracts: MOCK_JOBS.length,
    totalPayouts: 45200,
    securityScore: 98,
    marketRate: 2500, // NGN per MON
  }),
  getProfile: (address: string) => ({
    address,
    reputation: 98,
    completionRate: '96%',
    skills: ['Solidity', 'React', 'Next.js', 'Rust', 'EVM Auditing'],
    completedJobs: 12,
    totalEarned: 8450,
    tier: 'Elite Provider',
    verified: true,
  })
};
