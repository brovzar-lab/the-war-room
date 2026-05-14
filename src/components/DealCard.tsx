'use client';

import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { Clock, MessageSquare, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { Compartment, DealStatus } from '@/lib/mock-data';

const STATUS_CONFIG: Record<DealStatus, { label: string; color: string; dot: string }> = {
  active: { label: 'ACTIVE', color: 'text-tactical-green', dot: 'bg-tactical-green' },
  watch: { label: 'WATCH', color: 'text-amber-400', dot: 'bg-amber-400' },
  stalled: { label: 'STALLED', color: 'text-slate-500', dot: 'bg-slate-500' },
  closing: { label: 'CLOSING', color: 'text-electric-400', dot: 'bg-electric-400 animate-pulse' },
};

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(ms / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatMeeting(dateStr: string | null): string {
  if (!dateStr) return 'None scheduled';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function DealCard({ compartment }: { compartment: Compartment }) {
  const router = useRouter();
  const status = STATUS_CONFIG[compartment.status];

  return (
    <div
      onClick={() => router.push(`/compartment/${compartment.id}`)}
      className={clsx(
        'group relative tac-panel p-4 cursor-pointer',
        'hover:border-electric-500/50 hover:shadow-electric transition-all duration-200',
        'before:absolute before:inset-0 before:rounded-sm before:opacity-0 before:transition-opacity',
        'hover:before:opacity-100 before:bg-electric-500/[0.03]',
      )}
    >
      {/* corner accent */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-electric-500/40 group-hover:border-electric-400 transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-electric-500/20 group-hover:border-electric-500/50 transition-colors" />

      {/* header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx('status-dot', status.dot)} />
            <span className={clsx('tac-label', status.color)}>{status.label}</span>
          </div>
          <h3 className="font-serif text-base font-semibold text-slate-100 leading-tight group-hover:text-white truncate">
            {compartment.name}
          </h3>
        </div>
        {compartment.metrics.probability !== undefined && (
          <div className="flex flex-col items-end ml-3 shrink-0">
            <span className="text-[10px] tac-label">PROB</span>
            <span className={clsx(
              'text-lg font-mono font-bold',
              compartment.metrics.probability >= 70 ? 'text-tactical-green' :
              compartment.metrics.probability >= 40 ? 'text-amber-400' : 'text-slate-500'
            )}>
              {compartment.metrics.probability}%
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 font-sans">
        {compartment.description}
      </p>

      {/* metrics row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {compartment.metrics.dealSize && (
          <div>
            <span className="tac-label block">VALUE</span>
            <span className="text-sm font-mono text-electric-400 font-medium">{compartment.metrics.dealSize}</span>
          </div>
        )}
        {compartment.metrics.stage && (
          <div>
            <span className="tac-label block">STAGE</span>
            <span className="text-xs font-mono text-slate-300 truncate block">{compartment.metrics.stage}</span>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="tac-divider pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(compartment.lastConversationAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          {compartment.openQuestions > 0 && (
            <div className="flex items-center gap-1 text-amber-500">
              <AlertTriangle className="w-3 h-3" />
              <span>{compartment.openQuestions}q</span>
            </div>
          )}
          {compartment.nextMeeting && (
            <div className="flex items-center gap-1 text-tactical-green">
              <Calendar className="w-3 h-3" />
              <span>{formatMeeting(compartment.nextMeeting)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
