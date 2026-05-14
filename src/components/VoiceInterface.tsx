'use client';

import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { PushToTalkButton } from './PushToTalkButton';
import { useCompartmentStore } from '@/store/compartment-store';
import { Message } from '@/lib/mock-data';
import { isDemoMode } from '@/lib/demo';

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={clsx('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
        {!isUser && <span className="text-electric-400">WARROOM</span>}
        <span>{time}</span>
        {isUser && <span className="text-amber-500">YOU</span>}
      </div>
      <div
        className={clsx(
          'max-w-[85%] px-4 py-3 text-sm font-sans leading-relaxed rounded-sm',
          isUser
            ? 'bg-charcoal-700 border border-charcoal-600 text-slate-200 text-right'
            : 'bg-navy-800 border border-electric-500/20 text-slate-100',
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-electric-400" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-electric-400">Strategic Advisor</span>
          </div>
        )}
        <p>{message.content}</p>
      </div>
    </div>
  );
}

export function VoiceInterface({ compartmentId }: { compartmentId: string }) {
  const { messages } = useCompartmentStore();
  const compartmentMessages = messages[compartmentId] ?? [];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [compartmentMessages]);

  return (
    <div className="flex flex-col h-full">
      {/* panel header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-tactical-green animate-pulse-slow" />
          <span className="tac-header">Voice Interface</span>
        </div>
        {isDemoMode && (
          <span className="text-[9px] font-mono text-amber-500/70 uppercase tracking-wider">Demo Transcript</span>
        )}
      </div>

      {/* conversation timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {compartmentMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-slate-600 text-xs font-mono uppercase tracking-widest mb-2">No conversations yet</p>
            <p className="text-slate-700 text-xs font-sans">Press the button below to start talking</p>
          </div>
        )}
        {compartmentMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* PTT zone */}
      <div className="border-t border-charcoal-700 px-4 py-6 shrink-0 bg-navy-950/40">
        <PushToTalkButton />

        {/* text fallback */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Or type here..."
              className="w-full bg-charcoal-800 border border-charcoal-600 rounded-sm px-3 py-2
                text-xs font-mono text-slate-300 placeholder-slate-600
                focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
