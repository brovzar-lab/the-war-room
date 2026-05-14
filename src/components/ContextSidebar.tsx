'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronRight, User, Building2, FileText, Tag, Network } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { Compartment } from '@/lib/mock-data';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 py-2 px-3 hover:bg-charcoal-700/50 transition-colors"
      >
        <ChevronRight className={clsx('w-3 h-3 text-electric-400 transition-transform shrink-0', open && 'rotate-90')} />
        <span className="flex items-center gap-1.5 flex-1">
          <span className="text-slate-500 shrink-0">{icon}</span>
          <span className="tac-header">{title}</span>
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

function ContextPageChip({ page, compartmentId }: { page: string; compartmentId: string }) {
  const { activeContextPages, toggleContextPage } = useCompartmentStore();
  const isActive = activeContextPages.includes(page);
  const filename = page.split('/').pop() ?? page;

  return (
    <button
      onClick={() => toggleContextPage(page)}
      className={clsx(
        'w-full text-left px-2 py-1.5 rounded-sm text-[11px] font-mono truncate transition-all',
        isActive
          ? 'bg-electric-500/10 border border-electric-500/30 text-electric-300'
          : 'text-slate-500 hover:text-slate-300 hover:bg-charcoal-700/50',
      )}
    >
      {isActive && <span className="mr-1.5 text-electric-400">●</span>}
      {filename}
    </button>
  );
}

export function ContextSidebar({ compartment }: { compartment: Compartment }) {
  const { activeContextPages } = useCompartmentStore();

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 shrink-0">
        <span className="tac-header">Context Explorer</span>
        <span className="text-[10px] font-mono text-electric-400">
          {activeContextPages.length} loaded
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-charcoal-700/50">
        {/* context pages */}
        <Section title="Source Files" icon={<FileText className="w-3 h-3" />}>
          <div className="space-y-1 mt-1">
            {compartment.contextPages.map((page) => (
              <ContextPageChip key={page} page={page} compartmentId={compartment.id} />
            ))}
          </div>
        </Section>

        {/* key contacts */}
        <Section title="Contacts" icon={<User className="w-3 h-3" />}>
          <div className="space-y-1.5 mt-1">
            {compartment.keyContacts.map((contact) => (
              <div key={contact} className="flex items-center gap-2 text-[11px] font-mono text-slate-400 px-2 py-1">
                <div className="w-4 h-4 rounded-sm bg-charcoal-600 flex items-center justify-center shrink-0">
                  <span className="text-[8px] text-slate-300">{contact[0]}</span>
                </div>
                <span className="truncate">{contact}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* topics / tags */}
        <Section title="Topics" icon={<Tag className="w-3 h-3" />}>
          <div className="flex flex-wrap gap-1.5 mt-2 px-2">
            {compartment.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
                bg-charcoal-700 border border-charcoal-600 text-slate-400 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        </Section>

        {/* mini knowledge graph placeholder */}
        <Section title="Knowledge Graph" icon={<Network className="w-3 h-3" />} defaultOpen={false}>
          <div className="mt-2 h-32 bg-navy-950/60 border border-charcoal-700 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <Network className="w-6 h-6 text-electric-400/30 mx-auto mb-1" />
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                Graph View
              </span>
            </div>
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-600 text-center">
            {compartment.contextPages.length} nodes linked
          </p>
        </Section>
      </div>

      {/* context count footer */}
      <div className="border-t border-charcoal-700 px-4 py-2 shrink-0">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
          <span>Context loaded</span>
          <span className="text-electric-400">{activeContextPages.length} / {compartment.contextPages.length}</span>
        </div>
        <div className="mt-1 h-0.5 bg-charcoal-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-electric-500 transition-all"
            style={{ width: `${Math.round((activeContextPages.length / compartment.contextPages.length) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
