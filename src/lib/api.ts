// src/lib/api.ts
// ============================================================
// Updated for "Hackathon Demo Mode"
// Points to the Virtual Protocol Brain (mock-proto.ts)
// ============================================================

import { MOCK_PROTO, MockJob, MockTransaction } from './mock-proto';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Contract Endpoints ──

export async function getJob(jobId: any): Promise<any | null> {
  await delay(800);
  return MOCK_PROTO.getJobById(String(jobId));
}

export async function getJobMilestones(jobId: any): Promise<any> {
  await delay(500);
  const job = MOCK_PROTO.getJobById(String(jobId));
  return { job_id: jobId, milestones: job?.milestones || [] };
}

export async function getEscrowProgress(jobId: any): Promise<{ job_id: any; progress: number }> {
  const job = MOCK_PROTO.getJobById(String(jobId));
  if (!job) return { job_id: jobId, progress: 0 };
  
  const total = job.total_staked;
  const released = job.milestones
    .filter(m => m.status === 'released')
    .reduce((s, m) => s + m.amount, 0);
  
  return { job_id: jobId, progress: (released / total) * 100 };
}

export async function getJobsForAddress(address: string): Promise<any> {
  await delay(600);
  const jobs = MOCK_PROTO.getJobs().filter(j => 
    j.employer_address === address || j.worker_address === address
  );
  
  return {
    address,
    employer_job_ids: jobs.filter(j => j.employer_address === address).map(j => j.id),
    worker_job_ids: jobs.filter(j => j.worker_address === address).map(j => j.id),
    total: jobs.length,
    jobs // Including the actual job objects for easier UI binding
  };
}

export async function getWorkerProfile(address: string): Promise<any> {
  await delay(700);
  return MOCK_PROTO.getProfile(address);
}


// ── Verification Endpoints ──

export async function submitVerification(data: any): Promise<any> {
  await delay(1500);
  return { status: 'queued', message: 'Proof submitted to Monad Validation Layer', milestone_id: data.milestone_id };
}

export async function getVerificationStatus(milestoneId: any): Promise<{ status: string; message: string }> {
  return { status: 'pending', message: 'Awaiting decentralized consensus...' };
}


// ── Milestone Proposals ──

export async function getMilestoneProposals(jobId: any) {
  return { job_id: jobId, proposals: [] };
}

export async function getProposalStats() {
  const stats = MOCK_PROTO.getStats();
  return { 
    total: stats.activeContracts, 
    by_status: { active: 3, open: 1, disputed: 1 } 
  };
}


// ── Health Check ──

export async function checkBackendHealth(): Promise<boolean> {
  // In Demo Mode, the "Backend" (Mock Protocol) is always healthy
  return true;
}
