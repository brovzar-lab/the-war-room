'use client';

import { isDemoMode } from '@/lib/demo';

export function DemoModeBadge() {
  if (!isDemoMode) return null;
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-2 py-1 bg-brief-accent/10 border border-brief-accent/30">
      <span className="w-1.5 h-1.5 rounded-full bg-brief-accent animate-pulse-slow" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-brief-accent">
        Demo Mode
      </span>
    </div>
  );
}
