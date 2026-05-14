'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Lightbulb, CheckSquare, HelpCircle, Save, RefreshCw, ChevronRight } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { Compartment } from '@/lib/mock-data';
import { isDemoMode, demoToast } from '@/lib/demo';
import toast from 'react-hot-toast';

const MOCK_ACTION_ITEMS = [
  { id: 'a1', text: 'Send revised IP clause language to Marcus', done: false, priority: 'high' },
  { id: 'a2', text: 'Confirm data residency requirements with Sarah', done: false, priority: 'high' },
  { id: 'a3', text: 'Review termination clause counter-proposal', done: true, priority: 'medium' },
  { id: 'a4', text: 'Schedule follow-up call with legal team', done: false, priority: 'medium' },
];

function ActionItem({ text, done, priority }: { text: string; done: boolean; priority: string }) {
  const [checked, setChecked] = useState(done);
  return (
    <div
      className="flex items-start gap-2.5 py-2 border-b border-charcoal-700/50 last:border-0 cursor-pointer group"
      onClick={() => setChecked(!checked)}
    >
      <div className={clsx(
        'mt-0.5 w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center transition-all',
        checked ? 'bg-tactical-green/20 border-tactical-green' : 'border-charcoal-600 group-hover:border-electric-500',
      )}>
        {checked && <div className="w-1.5 h-1.5 rounded-sm bg-tactical-green" />}
      </div>
      <span className={clsx(
        'text-[11px] font-sans leading-relaxed flex-1',
        checked ? 'text-slate-600 line-through' : 'text-slate-300',
      )}>
        {text}
      </span>
      <span className={clsx(
        'shrink-0 text-[9px] font-mono uppercase tracking-wider mt-0.5',
        priority === 'high' ? 'text-red-400' : 'text-slate-600',
      )}>
        {priority}
      </span>
    </div>
  );
}

export function InsightsPanel({ compartment }: { compartment: Compartment }) {
  const handleSaveSession = () => {
    if (isDemoMode) {
      toast(demoToast, { icon: '📋' });
    }
  };

  const handleSyncObsidian = () => {
    if (isDemoMode) {
      toast(demoToast, { icon: '🔄' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 shrink-0">
        <span className="tac-header">Insights & Actions</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5">
        {/* key insights */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="tac-header text-amber-400">Key Insights</span>
          </div>
          <div className="space-y-2">
            {compartment.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-navy-950/60 border border-charcoal-700/60 rounded-sm">
                <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* open questions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-electric-400" />
            <span className="tac-header">Open Questions</span>
            <span className="ml-auto text-[10px] font-mono text-amber-400">{compartment.openQuestions}</span>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: compartment.openQuestions }, (_, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-500 px-2 py-1">
                <span className="text-electric-400/50">Q{i + 1}</span>
                <span className="text-slate-600">
                  {i === 0 && 'Who has final sign-off authority on pricing?'}
                  {i === 1 && 'What is the revised timeline post-legal?'}
                  {i === 2 && 'Are there competing bids we need to counter?'}
                  {i > 2 && `Open question ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* action items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-3.5 h-3.5 text-tactical-green" />
            <span className="tac-header text-tactical-green">Action Items</span>
          </div>
          <div>
            {MOCK_ACTION_ITEMS.map((item) => (
              <ActionItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* deal status */}
        <div className="tac-panel p-3">
          <span className="tac-label block mb-2">Deal Status</span>
          <div className="space-y-1.5">
            {compartment.metrics.stage && (
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Stage</span>
                <span className="text-slate-300">{compartment.metrics.stage}</span>
              </div>
            )}
            {compartment.metrics.dealSize && (
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-500">Value</span>
                <span className="text-electric-400 font-semibold">{compartment.metrics.dealSize}</span>
              </div>
            )}
            {compartment.metrics.probability !== undefined && (
              <div className="flex justify-between text-[11px] font-mono items-center">
                <span className="text-slate-500">Probability</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-charcoal-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tactical-green rounded-full"
                      style={{ width: `${compartment.metrics.probability}%` }}
                    />
                  </div>
                  <span className="text-tactical-green">{compartment.metrics.probability}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="border-t border-charcoal-700 p-4 space-y-2 shrink-0">
        <button
          onClick={handleSaveSession}
          className="w-full btn-tactical-primary justify-center py-2"
        >
          <Save className="w-3.5 h-3.5" />
          Save Session to Wiki
        </button>
        <button
          onClick={handleSyncObsidian}
          className="w-full btn-tactical justify-center py-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Obsidian
        </button>
      </div>
    </div>
  );
}
