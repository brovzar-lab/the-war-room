'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export function CreateCompartmentButton() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    setError('');
    try {
      const compartment = await api.createCompartment({ name: trimmed });
      router.push(`/compartment/${compartment.id}`);
    } catch (err) {
      setError('Failed to create compartment. Check that the backend is reachable.');
      setCreating(false);
    }
  }

  if (!showForm) {
    return (
      <button className="brief-btn" onClick={() => setShowForm(true)}>
        Create Compartment
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
      <input
        autoFocus
        type="text"
        placeholder="Deal name (e.g. DataBridge Acquisition)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-brief-surface border border-brief-border text-brief-text font-mono text-sm px-4 py-2 outline-none focus:border-brief-accent placeholder:text-brief-muted/50"
        disabled={creating}
      />
      {error && (
        <p className="font-mono text-[11px] text-brief-urgent">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          className="brief-btn brief-btn-muted"
          onClick={() => { setShowForm(false); setName(''); setError(''); }}
          disabled={creating}
        >
          Cancel
        </button>
        <button type="submit" className="brief-btn" disabled={creating || !name.trim()}>
          {creating ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  );
}
