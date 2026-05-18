'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronRight, User, FileText, Tag, Network, RefreshCw, Upload } from 'lucide-react';
import { useCompartmentStore } from '@/store/compartment-store';
import { Compartment } from '@/lib/mock-data';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadDocument(compartment.id, file);
      toast.success(`Uploaded: ${result.filename} (${Math.round(result.char_count / 1000)}k chars)`);
      await fetchCompartments();
      router.refresh();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

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

      {/* upload + context footer */}
      <div className="border-t border-brief-border px-4 py-2.5 shrink-0 space-y-2">
        {/* upload document button */}
        <label className={clsx(
          'flex items-center gap-2 w-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border cursor-pointer transition-colors',
          uploading
            ? 'border-brief-border text-brief-muted cursor-not-allowed'
            : 'border-brief-border text-brief-muted hover:border-brief-accent hover:text-brief-accent',
        )}>
          <Upload className="w-3 h-3 shrink-0" />
          {uploading ? 'Uploading…' : 'Upload Document'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx"
            className="hidden"
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
        {/* context count */}
        <div className="flex items-center justify-between font-mono text-[10px] text-brief-muted">
          <span>Context loaded</span>
          <span className="text-brief-accent">{activeContextPages.length} active</span>
        </div>
      </div>
    </div>
  );
}
