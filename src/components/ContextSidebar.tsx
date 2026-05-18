'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronRight, User, FileText, Tag, Network, RefreshCw } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { Compartment } from '@/lib/mock-data';
import { api } from '@/lib/api';

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
        className="w-full flex items-center gap-2 py-2 px-3 hover:bg-brief-surface2 transition-colors"
      >
        <ChevronRight
          className={clsx(
            'w-3 h-3 text-brief-accent transition-transform shrink-0',
            open && 'rotate-90',
          )}
        />
        <span className="flex items-center gap-1.5 flex-1">
          <span className="text-brief-muted shrink-0">{icon}</span>
          <span className="brief-section-label">{title}</span>
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

function ContextPageChip({ page }: { page: string }) {
  const { activeContextPages, toggleContextPage } = useCompartmentStore();
  const isActive = activeContextPages.includes(page);
  const filename = page.split('/').pop() ?? page;

  return (
    <button
      onClick={() => toggleContextPage(page)}
      className={clsx(
        'w-full text-left px-2 py-1.5 text-[11px] font-mono truncate transition-all',
        isActive
          ? 'bg-brief-accent/10 border border-brief-accent/30 text-brief-accent'
          : 'text-brief-muted hover:text-brief-text hover:bg-brief-surface2',
      )}
    >
      {isActive && <span className="mr-1.5 text-brief-accent">●</span>}
      {filename}
    </button>
  );
}

export function ContextSidebar({ compartment }: { compartment: Compartment }) {
  const { activeContextPages, fetchCompartments } = useCompartmentStore();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  async function handleSyncBrain() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await api.seedContext(compartment.id);
      if (result.seeded.length > 0) {
        setSyncResult(`${result.seeded.length} page${result.seeded.length > 1 ? 's' : ''} linked`);
        await fetchCompartments();
        router.refresh();
      } else {
        setSyncResult('No matching pages found');
      }
    } catch {
      setSyncResult('Sync failed — check backend');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-brief-bg">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brief-border shrink-0">
        <span className="brief-section-label">Context Explorer</span>
        <button
          onClick={handleSyncBrain}
          disabled={syncing}
          title="Search Obsidian Brain and link relevant pages"
          className={clsx(
            'flex items-center gap-1 font-mono text-[10px] transition-colors',
            syncing ? 'text-brief-muted' : 'text-brief-accent hover:text-brief-text',
          )}
        >
          <RefreshCw className={clsx('w-2.5 h-2.5', syncing && 'animate-spin')} />
          {syncing ? 'Syncing…' : 'Sync Brain'}
        </button>
      </div>
      {syncResult && (
        <div className="px-4 py-1.5 border-b border-brief-border bg-brief-surface">
          <span className="font-mono text-[10px] text-brief-accent">{syncResult}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-brief-border/50">
        {/* context pages */}
        <Section title="Source Files" icon={<FileText className="w-3 h-3" />}>
          <div className="space-y-1 mt-1">
            {compartment.contextPages.map((page) => (
              <ContextPageChip key={page} page={page} />
            ))}
          </div>
        </Section>

        {/* key contacts */}
        <Section title="Contacts" icon={<User className="w-3 h-3" />}>
          <div className="space-y-1.5 mt-1">
            {compartment.keyContacts.map((contact) => (
              <div
                key={contact}
                className="flex items-center gap-2 text-[11px] font-mono text-brief-muted px-2 py-1"
              >
                <div className="w-4 h-4 bg-brief-surface2 border border-brief-border flex items-center justify-center shrink-0">
                  <span className="text-[8px] text-brief-text">{contact[0]}</span>
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
              <span
                key={tag}
                className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider bg-brief-surface2 border border-brief-border text-brief-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </Section>

        {/* knowledge graph placeholder */}
        <Section title="Knowledge Graph" icon={<Network className="w-3 h-3" />} defaultOpen={false}>
          <div className="mt-2 h-32 bg-brief-surface2 border border-brief-border flex items-center justify-center">
            <div className="text-center">
              <Network className="w-6 h-6 text-brief-accent/20 mx-auto mb-1" />
              <span className="font-mono text-[10px] text-brief-muted uppercase tracking-wider">
                Graph View
              </span>
            </div>
          </div>
          <p className="mt-2 font-mono text-[10px] text-brief-muted text-center">
            {compartment.contextPages.length} nodes linked
          </p>
        </Section>
      </div>

      {/* context count footer */}
      <div className="border-t border-brief-border px-4 py-2.5 shrink-0">
        <div className="flex items-center justify-between font-mono text-[10px] text-brief-muted mb-1">
          <span>Context loaded</span>
          <span className="text-brief-accent">
            {activeContextPages.length} / {compartment.contextPages.length}
          </span>
        </div>
        <div className="h-0.5 bg-brief-surface2 overflow-hidden">
          <div
            className="h-full bg-brief-accent transition-all"
            style={{
              width: `${Math.round((activeContextPages.length / compartment.contextPages.length) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
