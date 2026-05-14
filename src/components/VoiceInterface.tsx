'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PushToTalkButton } from './PushToTalkButton';
import { api, normalizeMessage } from '@/lib/api';
import type { Message } from '@/lib/mock-data';

function TimelineEntry({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex gap-4 py-4 border-b border-brief-border/50 last:border-0">
      <div className="w-12 shrink-0 pt-0.5">
        <span className="font-mono text-[10px] text-brief-muted">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1.5">
          {isUser ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-accent">You</span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-muted">War Room</span>
          )}
        </div>
        {isUser ? (
          <p className="font-sans text-sm text-brief-muted leading-relaxed">{message.content}</p>
        ) : (
          <p className="font-serif text-base text-brief-text leading-[1.7]">{message.content}</p>
        )}
      </div>
    </div>
  );
}

export function VoiceInterface({ compartmentId }: { compartmentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load latest conversation history on mount / compartment change
  useEffect(() => {
    let cancelled = false;
    setIsLoadingHistory(true);
    setMessages([]);
    setConversationId(null);

    (async () => {
      try {
        const conversations = await api.getConversations(compartmentId);
        if (cancelled || conversations.length === 0) return;

        const latest = conversations[0];
        setConversationId(latest.id);

        const detail = await api.getConversation(latest.id);
        if (!cancelled) {
          setMessages(detail.messages.map(normalizeMessage));
        }
      } catch {
        // No history yet — that is fine
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    })();

    return () => { cancelled = true; };
  }, [compartmentId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTranscript = useCallback(async (text: string): Promise<void> => {
    const userMsg: Message = {
      id: `local-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    let convId = conversationId;
    if (!convId) {
      const started = await api.startConversation(compartmentId);
      convId = started.id;
      setConversationId(convId);
    }

    const result = await api.sendVoiceMessage(compartmentId, {
      conversation_id: convId,
      message: text,
    });

    const aiMsg: Message = {
      id: `local-ai-${Date.now()}`,
      role: 'assistant',
      content: result.response,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMsg]);
  }, [compartmentId, conversationId]);

  return (
    <div className="flex flex-col h-full bg-brief-bg">
      {/* panel header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-brief-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brief-new animate-pulse-slow" />
          <span className="brief-section-label">Voice Briefing</span>
        </div>
      </div>

      {/* conversation timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
        {!isLoadingHistory && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-brief-muted mb-2">
              No briefings yet
            </p>
            <p className="font-sans text-xs text-brief-muted/60">
              Hold the button below to begin voice briefing
            </p>
          </div>
        )}
        {messages.map((message) => (
          <TimelineEntry key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* PTT zone */}
      <div className="border-t border-brief-border px-5 py-5 shrink-0 bg-brief-surface">
        <PushToTalkButton onTranscript={handleTranscript} />
      </div>
    </div>
  );
}
