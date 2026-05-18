'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { PushToTalkButton } from './PushToTalkButton';
import { api, normalizeMessage } from '@/lib/api';
import type { Message } from '@/lib/mock-data';

// Strip raw markdown symbols so responses always read as clean prose
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')        // ## headings → plain text
    .replace(/\*\*(.+?)\*\*/g, '$1')    // **bold** → plain
    .replace(/\*(.+?)\*/g, '$1')        // *italic* → plain
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1') // `code` → plain
    .replace(/^[-*+]\s+/gm, '')         // - bullet → remove marker
    .replace(/^\d+\.\s+/gm, '')         // 1. list → remove marker
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) → text
    .replace(/^>\s+/gm, '')             // > blockquote → remove marker
    .replace(/_{1,2}(.+?)_{1,2}/g, '$1') // _italic_ → plain
    .replace(/\n{3,}/g, '\n\n')         // 3+ newlines → 2
    .trim();
}

function TimelineEntry({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const displayContent = isUser ? message.content : stripMarkdown(message.content);
  // Split on double newlines to render paragraphs
  const paragraphs = displayContent.split(/\n\n+/).filter(Boolean);

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
          <div className="space-y-3">
            {paragraphs.map((para, i) => (
              <p key={i} className="font-serif text-base text-brief-text leading-[1.7]">{para}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function VoiceInterface({ compartmentId }: { compartmentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [typedMessage, setTypedMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
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

  const handleSendTyped = useCallback(async () => {
    const text = typedMessage.trim();
    if (!text || isSending) return;
    setTypedMessage('');
    setIsSending(true);
    try {
      await handleTranscript(text);
    } finally {
      setIsSending(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedMessage, isSending]);

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
      convId = started.conversation_id;
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
      <div className="border-t border-brief-border px-5 py-4 shrink-0 bg-brief-surface space-y-3">
        <PushToTalkButton onTranscript={handleTranscript} />
        {/* Text input alternative */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendTyped(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Or type a message…"
            disabled={isSending}
            className="flex-1 bg-brief-bg border border-brief-border text-brief-text font-mono text-[11px] px-3 py-2 outline-none focus:border-brief-accent placeholder:text-brief-muted/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!typedMessage.trim() || isSending}
            className="px-3 py-2 border border-brief-accent/40 text-brief-accent hover:bg-brief-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
