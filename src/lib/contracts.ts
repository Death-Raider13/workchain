// src/lib/contracts.ts

export const WORKCHAIN_ADRESS = process.env.NEXT_PUBLIC_WORKCHAIN_ADDRESS || '0x...';
export const REGISTRY_ADRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || '0x...';

export const WORKCHAIN_ABI = [
  // Simplified ABI for Escrow + Milestones
  "function createEscrow(address worker, uint256 totalAmount, string[] milestoneDescriptions, uint256[] milestoneAmounts) external payable returns (uint256)",
  "function releaseMilestone(uint256 escrowId, uint256 milestoneId) external",
  "function raiseDispute(uint256 escrowId) external",
  "event EscrowCreated(uint256 indexed escrowId, address indexed employer, address indexed worker, uint256 amount)",
  "event MilestoneReleased(uint256 indexed escrowId, uint256 indexed milestoneId)"
] as const;

export const REGISTRY_ABI = [
  "function recordVerification(address worker, bytes32 proofHash, string proofUrl) external",
  "event VerificationRecorded(address indexed worker, bytes32 proofHash)"
] as const;
