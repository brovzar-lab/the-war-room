'use client';

import { isDemoMode } from '@/lib/demo';

export function DemoModeBadge() {
  if (!isDemoMode) return null;
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Demo Mode</span>
    </div>
  );
}
