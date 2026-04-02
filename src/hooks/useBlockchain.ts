// src/hooks/useBlockchain.ts

import { useState } from 'react';
import { ethers } from 'ethers';
import { WORKCHAIN_ADRESS, WORKCHAIN_ABI } from '@/lib/contracts';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useBlockchain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEscrow = async (
    worker: string, 
    totalAmount: string, 
    milestoneDescriptions: string[], 
    milestoneAmounts: string[]
  ) => {
    setLoading(true);
    setError(null);

    // Mock Mode Check
    if (!window.ethereum || process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === 'true') {
      console.log('Blockchain Mock Mode: Simulating transaction...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return {
        hash: '0x' + Math.random().toString(16).slice(2, 42),
        contractAddress: '0x' + Math.random().toString(16).slice(2, 42),
        status: 1
      };
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      if (!WORKCHAIN_ADRESS) throw new Error('Contract address not configured');
      
      const contract = new ethers.Contract(WORKCHAIN_ADRESS, WORKCHAIN_ABI, signer);

      const tx = await contract.createEscrow(
        worker,
        ethers.parseEther(totalAmount),
        milestoneDescriptions,
        milestoneAmounts.map(a => ethers.parseEther(a)),
        { value: ethers.parseEther(totalAmount) }
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      console.error('Blockchain error:', err);
      setError(err.message || 'Blockchain transaction failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const releaseMilestone = async (escrowId: number, milestoneId: number) => {
    setLoading(true);

    if (!window.ethereum || process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === 'true') {
      console.log('Blockchain Mock Mode: Simulating release...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(WORKCHAIN_ADRESS, WORKCHAIN_ABI, signer);

      const tx = await contract.releaseMilestone(escrowId, milestoneId);
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const raiseDispute = async (escrowId: number) => {
    setLoading(true);

    if (!window.ethereum || process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === 'true') {
      console.log('Blockchain Mock Mode: Simulating dispute...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(WORKCHAIN_ADRESS, WORKCHAIN_ABI, signer);

      const tx = await contract.raiseDispute(escrowId);
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEscrow,
    releaseMilestone,
    raiseDispute,
    loading,
    error
  };
}
