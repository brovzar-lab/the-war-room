'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeft, Shield } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { ContextSidebar } from '@/components/ContextSidebar';
import { VoiceInterface } from '@/components/VoiceInterface';
import { InsightsPanel } from '@/components/InsightsPanel';
import { DemoModeBadge } from '@/components/DemoModeBadge';

const STATUS_COLORS: Record<string, string> = {
  active: 'text-tactical-green',
  watch: 'text-amber-400',
  stalled: 'text-slate-500',
  closing: 'text-electric-400',
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
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-mono text-sm uppercase tracking-wider mb-4">Compartment not found</p>
          <button onClick={() => router.push('/')} className="btn-tactical">
            <ArrowLeft className="w-3 h-3" />
            Back to Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-navy-900 overflow-hidden">
      <DemoModeBadge />

      {/* top bar */}
      <header className="shrink-0 border-b border-charcoal-700 bg-navy-950/90 backdrop-blur-sm z-40">
        <div className="h-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BOARD
            </button>
            <span className="text-charcoal-600">|</span>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-electric-400" />
              <span className="text-sm font-serif font-semibold text-slate-100">{compartment.name}</span>
              <span className={clsx('text-[10px] font-mono uppercase tracking-widest', STATUS_COLORS[compartment.status])}>
                {compartment.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600">
            {compartment.metrics.stage && (
              <span>STAGE: <span className="text-slate-400">{compartment.metrics.stage}</span></span>
            )}
            {compartment.metrics.dealSize && (
              <span>VALUE: <span className="text-electric-400">{compartment.metrics.dealSize}</span></span>
            )}
            {compartment.nextMeeting && (
              <span>NEXT MTG: <span className="text-tactical-green">
                {new Date(compartment.nextMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span></span>
            )}
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex-1 flex min-h-0">
        {/* left: context sidebar (25%) */}
        <aside className="w-[22%] min-w-[200px] max-w-[280px] border-r border-charcoal-700 overflow-hidden flex flex-col">
          <ContextSidebar compartment={compartment} />
        </aside>

        {/* center: voice interface (50%) */}
        <main className="flex-1 min-w-0 border-r border-charcoal-700 overflow-hidden flex flex-col">
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
