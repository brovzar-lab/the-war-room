'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { ContextSidebar } from '@/components/ContextSidebar';
import { VoiceInterface } from '@/components/VoiceInterface';
import { InsightsPanel } from '@/components/InsightsPanel';
import { DemoModeBadge } from '@/components/DemoModeBadge';

const STATUS_COLORS: Record<string, string> = {
  active: 'text-brief-new',
  watch: 'text-brief-warm',
  stalled: 'text-brief-muted',
  closing: 'text-brief-accent',
};

const TEMP_COLORS: Record<string, string> = {
  hot: 'text-brief-hot',
  warm: 'text-brief-warm',
  cold: 'text-brief-cold',
  new: 'text-brief-new',
};

export default function CompartmentPage() {
  const params = useParams();
  const router = useRouter();
  const { compartments, setActiveCompartment, activeCompartmentId } = useCompartmentStore();

  const id = params.id as string;
  const compartment = compartments.find((c) => c.id === id);

  useEffect(() => {
    if (id && id !== activeCompartmentId) {
      setActiveCompartment(id);
    }
  }, [id, activeCompartmentId, setActiveCompartment]);

  if (!compartment) {
    return (
      <div className="min-h-screen bg-brief-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-brief-muted font-mono text-sm uppercase tracking-wider mb-4">
            Compartment not found
          </p>
          <button
            onClick={() => router.push('/')}
            className="brief-btn"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-brief-bg overflow-hidden">
      <DemoModeBadge />

      {/* masthead bar */}
      <header className="shrink-0 border-b border-brief-border bg-brief-bg z-40">
        <div className="h-11 px-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-brief-muted hover:text-brief-text transition-colors font-mono text-[10px] uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" />
              Brief
            </button>
            <span className="text-brief-border">|</span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brief-muted bg-brief-surface border border-brief-border px-2 py-0.5">
                {compartment.companyName}
              </span>
              <span className="font-sans text-sm text-brief-muted italic">Field Report</span>
              <span className={clsx('font-mono text-[10px] uppercase tracking-widest', STATUS_COLORS[compartment.status])}>
                {compartment.status}
              </span>
              {compartment.temperature && (
                <span className={clsx('font-mono text-[9px] uppercase tracking-wider', TEMP_COLORS[compartment.temperature])}>
                  [{compartment.temperature}]
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5 font-mono text-[10px] text-brief-muted">
            {compartment.metrics.stage && (
              <span>
                Stage: <span className="text-brief-text">{compartment.metrics.stage}</span>
              </span>
            )}
            {compartment.metrics.dealSize && (
              <span>
                Value: <span className="text-brief-accent font-semibold">{compartment.metrics.dealSize}</span>
              </span>
            )}
            {compartment.nextMeeting && (
              <span>
                Next:{' '}
                <span className="text-brief-new">
                  {new Date(compartment.nextMeeting).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </span>
            )}
            {compartment.needsAction && (
              <span className="text-brief-urgent uppercase tracking-widest">[ACTION]</span>
            )}
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex-1 flex min-h-0">
        {/* left: context sidebar (22%) */}
        <aside className="w-[22%] min-w-[200px] max-w-[280px] border-r border-brief-border overflow-hidden flex flex-col">
          <ContextSidebar compartment={compartment} />
        </aside>

        {/* center: voice interface (50%) */}
        <main className="flex-1 min-w-0 border-r border-brief-border overflow-hidden flex flex-col">
          <VoiceInterface compartmentId={id} />
        </main>

        {/* right: insights panel (25%) */}
        <aside className="w-[25%] min-w-[220px] max-w-[320px] overflow-hidden flex flex-col">
          <InsightsPanel compartment={compartment} />
        </aside>
      </div>
    </div>
  );
}
