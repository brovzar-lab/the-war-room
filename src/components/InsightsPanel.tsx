'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Lightbulb, CheckSquare, HelpCircle, Save, RefreshCw, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import type { Compartment } from '@/lib/mock-data';
import toast from 'react-hot-toast';

function ActionItem({ text, done, priority }: { text: string; done: boolean; priority: string }) {
  const [checked, setChecked] = useState(done);
  return (
    <div
      className="flex items-start gap-2.5 py-2 border-b border-brief-border/50 last:border-0 cursor-pointer group"
      onClick={() => setChecked(!checked)}
    >
      <div
        className={clsx(
          'mt-0.5 w-3.5 h-3.5 border shrink-0 flex items-center justify-center transition-all',
          checked
            ? 'bg-brief-new/20 border-brief-new'
            : 'border-brief-border group-hover:border-brief-accent',
        )}
      >
        {checked && <div className="w-1.5 h-1.5 bg-brief-new" />}
      </div>
      <span
        className={clsx(
          'text-[11px] font-sans leading-relaxed flex-1',
          checked ? 'text-brief-muted line-through' : 'text-brief-text/80',
        )}
      >
        {text}
      </span>
      <span
        className={clsx(
          'shrink-0 font-mono text-[9px] uppercase tracking-wider mt-0.5',
          priority === 'high' ? 'text-brief-urgent' : 'text-brief-muted',
        )}
      >
        {priority}
      </span>
    </div>
  );
}

// Derived from compartment insights until the backend surfaces discrete action items
function deriveActionItems(compartment: Compartment) {
  return compartment.insights.slice(0, 4).map((text, i) => ({
    id: `insight-${i}`,
    text,
    done: false,
    priority: i < 2 ? 'high' : 'medium',
  }));
}

export function InsightsPanel({ compartment }: { compartment: Compartment }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSession = async () => {
    setIsSaving(true);
    try {
      const conversations = await api.getConversations(compartment.id);
      if (conversations.length === 0) {
        toast.error('No conversation to save — start a voice briefing first');
        return;
      }
      await api.writeback(compartment.id, conversations[0].id);
      toast.success('Session saved to vault');
    } catch {
      toast.error('Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncObsidian = async () => {
    setIsSaving(true);
    try {
      const result = await api.seedContext(compartment.id);
      if (result.seeded.length > 0) {
        toast.success(`Linked ${result.seeded.length} page${result.seeded.length > 1 ? 's' : ''} from vault`);
      } else {
        toast.success('Vault connected — speak to load context');
      }
    } catch {
      toast.error('Sync failed');
    } finally {
      setIsSaving(false);
    }
  };

  const actionItems = deriveActionItems(compartment);

  return (
    <div className="flex flex-col h-full bg-brief-bg">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brief-border shrink-0">
        <span className="brief-section-label">Insights & Actions</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5">
        {/* key insights */}
        {compartment.insights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-brief-accent" />
              <span className="brief-section-label" style={{ color: '#f59e0b' }}>Key Insights</span>
            </div>
            <div className="space-y-2">
              {compartment.insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 bg-brief-surface border border-brief-border/60"
                >
                  <ChevronRight className="w-3 h-3 text-brief-accent mt-0.5 shrink-0" />
                  <p className="font-sans text-[11px] text-brief-text/80 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* open questions */}
        {compartment.openQuestions > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-brief-muted" />
              <span className="brief-section-label">Open Questions</span>
              <span className="ml-auto font-mono text-[10px] text-brief-accent">{compartment.openQuestions}</span>
            </div>
            <div className="space-y-1.5">
              {Array.from({ length: compartment.openQuestions }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 font-mono text-[11px] text-brief-muted px-2 py-1"
                >
                  <span className="text-brief-muted/50">Q{i + 1}</span>
                  <span className="text-brief-muted/60">
                    {i === 0 && 'Who has final sign-off authority on pricing?'}
                    {i === 1 && 'What is the revised timeline post-legal?'}
                    {i === 2 && 'Are there competing bids we need to counter?'}
                    {i > 2 && `Open question ${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* action items */}
        {actionItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-3.5 h-3.5 text-brief-new" />
              <span className="brief-section-label" style={{ color: '#10b981' }}>Action Items</span>
            </div>
            <div>
              {actionItems.map((item) => (
                <ActionItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* deal status */}
        <div className="bg-brief-surface border border-brief-border p-3">
          <span className="brief-section-label block mb-2">Deal Status</span>
          <div className="space-y-1.5">
            {compartment.metrics.stage && (
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-brief-muted">Stage</span>
                <span className="text-brief-text">{compartment.metrics.stage}</span>
              </div>
            )}
            {compartment.metrics.dealSize && (
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-brief-muted">Value</span>
                <span className="text-brief-accent font-semibold">{compartment.metrics.dealSize}</span>
              </div>
            )}
            {compartment.metrics.probability !== undefined && (
              <div className="flex justify-between font-mono text-[11px] items-center">
                <span className="text-brief-muted">Probability</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-brief-surface2 overflow-hidden">
                    <div
                      className="h-full bg-brief-accent"
                      style={{ width: `${compartment.metrics.probability}%` }}
                    />
                  </div>
                  <span className="text-brief-accent">{compartment.metrics.probability}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="border-t border-brief-border p-4 space-y-2 shrink-0">
        <button
          onClick={handleSaveSession}
          disabled={isSaving}
          className="w-full brief-btn justify-center disabled:opacity-50"
          style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
        >
          <Save className="w-3.5 h-3.5" />
          Save Session to Wiki
        </button>
        <button
          onClick={handleSyncObsidian}
          disabled={isSaving}
          className="w-full brief-btn brief-btn-muted justify-center disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Obsidian
        </button>
      </div>
    </div>
  );
}
