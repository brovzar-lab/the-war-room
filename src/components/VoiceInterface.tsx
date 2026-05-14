'use client';

import { useEffect, useRef } from 'react';
import { PushToTalkButton } from './PushToTalkButton';
import { useCompartmentStore } from '@/store/compartment-store';
import { Message } from '@/lib/mock-data';
import { isDemoMode } from '@/lib/demo';

function TimelineEntry({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex gap-4 py-4 border-b border-brief-border/50 last:border-0">
      {/* timestamp column */}
      <div className="w-12 shrink-0 pt-0.5">
        <span className="font-mono text-[10px] text-brief-muted">{time}</span>
      </div>

      {/* content column */}
      <div className="flex-1 min-w-0">
        <div className="mb-1.5">
          {isUser ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-accent">You</span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-muted">War Room</span>
          )}
        </div>
        {isUser ? (
          <p className="font-sans text-sm text-brief-muted leading-relaxed">
            {message.content}
          </p>
        ) : (
          <p className="font-serif text-base text-brief-text leading-[1.7]">
            {message.content}
          </p>
        )}
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
    <div className="flex flex-col h-full bg-brief-bg">
      {/* panel header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-brief-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brief-new animate-pulse-slow" />
          <span className="brief-section-label">Voice Briefing</span>
        </div>
        {isDemoMode && (
          <span className="font-mono text-[9px] text-brief-accent/70 uppercase tracking-wider">
            Demo Transcript
          </span>
        )}
      </div>

      {/* conversation timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
        {compartmentMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-brief-muted mb-2">
              No briefings yet
            </p>
            <p className="font-sans text-xs text-brief-muted/60">
              Hold the button below to begin voice briefing
            </p>
          </div>
        )}
        {compartmentMessages.map((message) => (
          <TimelineEntry key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* PTT zone */}
      <div className="border-t border-brief-border px-5 py-5 shrink-0 bg-brief-surface">
        <PushToTalkButton />
      </div>
    </div>
  );
}
