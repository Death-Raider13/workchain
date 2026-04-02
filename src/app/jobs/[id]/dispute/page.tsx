"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

import { RoleGate } from '@/components/RoleGate';

export default function DisputeWorkspace() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userAddress, setUserAddress] = useState('0x7e1b...'); // Placeholder
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchDisputeData = async () => {
    setLoading(true);
    const { data: jobData } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (jobData) setJob(jobData);

    const { data: messageData } = await supabase
      .from('dispute_messages')
      .select('*')
      .eq('job_id', id)
      .order('created_at', { ascending: true });
    
    if (messageData) setMessages(messageData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDisputeData();

    const channel = supabase
      .channel(`dispute-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dispute_messages', filter: `job_id=eq.${id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('dispute_messages')
      .insert({
        job_id: id,
        sender_address: userAddress,
        message: newMessage
      });

    if (!error) setNewMessage('');
  };

  if (loading) return <div className="flex flex-col items-center justify-center py-24">Loading Workspace...</div>;

  return (
    <RoleGate allowedRoles={['employer', 'worker', 'admin']}>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
        {/* Dispute Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-default pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-status-warning uppercase tracking-widest">
              <span className="w-2 h-2 bg-status-warning rounded-full animate-pulse"></span>
              Active Arbitration Case
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Dispute: {job?.title}</h1>
            <p className="text-text-secondary text-xs font-mono uppercase tracking-widest">Case ID: {id?.slice(0, 8)} • Monad Network Escrow Protected</p>
          </div>
          <Link href={`/jobs/${id}`} className="btn-secondary py-2 px-6 text-[10px] uppercase tracking-widest">View Contract</Link>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Section */}
        <div className="lg:col-span-2 card p-0 flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-border-default bg-background-elevated/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Official Arbitration Channel</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => {
              const isMe = msg.sender_address === userAddress;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    isMe ? 'bg-accent-monad text-white rounded-tr-none shadow-lg shadow-accent-monad/10' 
                         : 'bg-background-elevated border border-border-default rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[9px] font-mono text-text-muted mt-2 uppercase tracking-tighter">
                    {msg.sender_address.slice(0, 6)}...{msg.sender_address.slice(-4)} • {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-border-default bg-background-elevated/30 flex gap-3">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter evidence or statement..."
              className="input-base flex-1 text-sm h-12"
            />
            <button type="submit" className="btn-primary px-8 text-xs uppercase tracking-widest h-12 font-black">SEND</button>
          </form>
        </div>

        {/* Evidence & Status Section */}
        <div className="space-y-6">
          <div className="card space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Evidence Repository</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border-default bg-background-elevated/50 text-center space-y-4">
                <div className="text-2xl">📁</div>
                <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest">No evidence uploaded yet</p>
                <button className="btn-secondary w-full py-2 text-[9px] uppercase tracking-widest">Upload SHA-256 Proof</button>
              </div>
            </div>
          </div>

          <div className="card space-y-6 bg-status-warning/5 border-status-warning/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-status-warning">Case Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary uppercase font-bold tracking-tighter">Staked Capital</span>
                <span className="text-white font-mono font-bold">{job?.total_staked} MON</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary uppercase font-bold tracking-tighter">Arbitrator Presence</span>
                <span className="text-status-success uppercase font-bold">NODE_CONNECT_OK</span>
              </div>
              <div className="pt-4 border-t border-border-default">
                <p className="text-[10px] text-text-secondary leading-relaxed uppercase tracking-tighter font-medium">
                  Arbitration is performed by the decentralized WorkChain Node network. Final verdict will be signed on-chain by the arbitrator role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RoleGate>
  );
}
