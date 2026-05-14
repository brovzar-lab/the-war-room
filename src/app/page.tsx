import { DealCard } from '@/components/DealCard';
import { DemoModeBadge } from '@/components/DemoModeBadge';
import { MOCK_COMPARTMENTS } from '@/lib/mock-data';
import { Shield, Plus, Activity, Crosshair } from 'lucide-react';

export default function DashboardPage() {
  const active = MOCK_COMPARTMENTS.filter((c) => c.status === 'active').length;
  const closing = MOCK_COMPARTMENTS.filter((c) => c.status === 'closing').length;
  const totalQuestions = MOCK_COMPARTMENTS.reduce((sum, c) => sum + c.openQuestions, 0);

  return (
    <div className="min-h-screen bg-navy-900 bg-grid-pattern">
      <DemoModeBadge />

      {/* top bar */}
      <header className="border-b border-charcoal-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-5 h-5 text-electric-400" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-tactical-green rounded-full animate-pulse-slow" />
            </div>
            <div>
              <span className="text-sm font-mono font-semibold tracking-wider text-white">THE WAR ROOM</span>
              <span className="ml-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tactical-green animate-pulse" />
                <span className="text-slate-400">{active} ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
                <span className="text-slate-400">{closing} CLOSING</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-slate-400">{totalQuestions} OPEN Q'S</span>
              </div>
            </div>
            <button className="btn-tactical-primary">
              <Plus className="w-3 h-3" />
              New Compartment
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crosshair className="w-4 h-4 text-electric-400" />
              <span className="tac-header">Deal Compartments</span>
            </div>
            <p className="text-xs font-sans text-slate-500">
              {MOCK_COMPARTMENTS.length} active compartments — select to enter
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="tac-label">SORT BY</span>
            <button className="btn-tactical text-[10px]">LAST ACTIVITY</button>
            <button className="btn-tactical text-[10px]">STATUS</button>
            <button className="btn-tactical text-[10px]">VALUE</button>
          </div>
        </div>

        {/* deal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_COMPARTMENTS.map((compartment) => (
            <DealCard key={compartment.id} compartment={compartment} />
          ))}
        </div>

        {/* activity feed hint */}
        <div className="mt-8 tac-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-electric-400" />
            <span className="tac-header">Recent Activity</span>
          </div>
          <div className="space-y-2">
            {[
              { time: '2m ago', event: 'Voice session saved', deal: 'Vertex AI Partnership', type: 'save' },
              { time: '1h ago', event: 'Legal notes updated', deal: 'DataBridge Acquisition', type: 'note' },
              { time: '3h ago', event: 'New insight extracted', deal: 'Series B Round', type: 'insight' },
              { time: '5h ago', event: 'Context sync from Obsidian', deal: 'LATAM Expansion', type: 'sync' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px] font-mono text-slate-500 py-1 border-b border-charcoal-700/50 last:border-0">
                <span className="text-slate-600 w-12 shrink-0">{item.time}</span>
                <span className="text-slate-400">{item.event}</span>
                <span className="text-electric-400/70">→</span>
                <span className="text-slate-300">{item.deal}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
