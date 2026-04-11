// src/lib/api.ts
// ============================================================
// Centralized API client for the NOMO-WORKCHAIN backend.
// Falls back to mock data when the backend is unreachable
// (e.g., during hackathon demo without live backend).
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Generic fetch wrapper with timeout + mock fallback ───────────

async function apiFetch<T>(path: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[API] ${path} returned ${res.status}, using fallback`);
      return fallback;
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] ${path} unreachable, using mock fallback`, err);
    return fallback;
  }
}


// ── Contract Endpoints ── /contracts/* ────────────────────────────

export interface JobData {
  job_id: number;
  employer: string;
  worker: string;
  title: string;
  total_escrowed: string;
  total_released: string;
  status: number;
  milestone_count: number;
  escrow_progress: number;
}

export interface MilestoneData {
  index: number;
  description: string;
  amount_wei: string;
  amount_mon: number;
  released: boolean;
  verified: boolean;
}

export interface AddressJobsData {
  address: string;
  employer_job_ids: number[];
  worker_job_ids: number[];
  total: number;
}

export interface WorkerProfileData {
  address: string;
  total_jobs: number;
  completed_jobs: number;
  total_earned_mon: number;
  average_rating: number | null;
  rating_count: number;
  completed_job_ids: number[];
}


export async function getJob(jobId: number): Promise<JobData | null> {
  return apiFetch(`/contracts/jobs/${jobId}`, null);
}

export async function getJobMilestones(jobId: number): Promise<{ job_id: number; milestones: MilestoneData[] }> {
  return apiFetch(`/contracts/jobs/${jobId}/milestones`, { job_id: jobId, milestones: [] });
}

export async function getEscrowProgress(jobId: number): Promise<{ job_id: number; progress: number }> {
  return apiFetch(`/contracts/jobs/${jobId}/progress`, { job_id: jobId, progress: 0 });
}

export async function getJobsForAddress(address: string): Promise<AddressJobsData> {
  return apiFetch(`/contracts/address/${address}/jobs`, {
    address,
    employer_job_ids: [],
    worker_job_ids: [],
    total: 0,
  });
}

export async function getWorkerProfile(address: string): Promise<WorkerProfileData> {
  return apiFetch(`/contracts/address/${address}/profile`, {
    address,
    total_jobs: 0,
    completed_jobs: 0,
    total_earned_mon: 0,
    average_rating: null,
    rating_count: 0,
    completed_job_ids: [],
  });
}


// ── Verification Endpoints ── /verify/* ──────────────────────────

export interface VerifyRequest {
  milestone_id: number;
  proof_type: 'github' | 'file' | 'link' | 'manual';
  data: string;
}

export interface VerifyResponse {
  status: string;
  message: string;
  milestone_id: number;
}

export async function submitVerification(data: VerifyRequest): Promise<VerifyResponse> {
  return apiFetch('/verify/', { status: 'queued', message: 'Mock: verification queued', milestone_id: data.milestone_id }, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getVerificationStatus(milestoneId: number): Promise<{ status: string; message: string }> {
  return apiFetch(`/verify/${milestoneId}`, { status: 'pending', message: 'Awaiting verification' });
}


// ── Milestone Proposals Endpoints ── /milestones/* ───────────────

export async function getMilestoneProposals(jobId: number) {
  return apiFetch(`/milestones/job/${jobId}`, { job_id: jobId, proposals: [] });
}

export async function getProposalStats() {
  return apiFetch('/milestones/stats/total', { total: 0, by_status: {} });
}


// ── Health Check ─────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
