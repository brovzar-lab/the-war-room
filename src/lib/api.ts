import type { Compartment, Message, DealStatus, DealTemperature } from '@/lib/mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ---------- Backend response shapes ----------

export interface CompartmentOut {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_conversation_at: string | null;
  metadata: Record<string, unknown>;
}

export interface ConversationMessageOut {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationOut {
  id: string;
  compartment_id: string;
  created_at: string;
  messages: ConversationMessageOut[];
}

export interface VoiceStartOut {
  id: string;
}

export interface VoiceMessageOut {
  conversation_id: string;
  response: string;
}

// ---------- Normalizers ----------

function coerceBody(raw: unknown): [string, string] {
  if (Array.isArray(raw)) {
    return [String(raw[0] ?? ''), String(raw[1] ?? '')];
  }
  if (typeof raw === 'string') return [raw, ''];
  return ['', ''];
}

export function normalizeCompartment(raw: CompartmentOut): Compartment {
  const meta = raw.metadata ?? {};
  return {
    id: raw.id,
    name: raw.name,
    companyName: (meta.companyName as string) ?? raw.name.toUpperCase(),
    description: raw.description ?? '',
    status: (meta.status as DealStatus) ?? 'active',
    temperature: (meta.temperature as DealTemperature) ?? 'new',
    isPinned: Boolean(meta.isPinned),
    needsAction: Boolean(meta.needsAction),
    actionNote: (meta.actionNote as string | null) ?? null,
    fieldReportSummary: (meta.fieldReportSummary as string) ?? raw.description ?? '',
    editorialHeadline: (meta.editorialHeadline as string) ?? raw.name,
    editorialBody: coerceBody(meta.editorialBody),
    lastConversationAt: raw.last_conversation_at ?? raw.created_at,
    nextMeeting: (meta.nextMeeting as string | null) ?? null,
    openQuestions: Number(meta.openQuestions ?? 0),
    keyContacts: (meta.keyContacts as string[]) ?? [],
    tags: (meta.tags as string[]) ?? [],
    insights: (meta.insights as string[]) ?? [],
    contextPages: (meta.contextPages as string[]) ?? [],
    metrics: (meta.metrics as Compartment['metrics']) ?? {},
  };
}

export function normalizeMessage(msg: ConversationMessageOut): Message {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at,
  };
}

// ---------- Core fetch wrapper ----------

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ---------- API surface ----------

export const api = {
  // Compartments
  getCompartments: (opts?: RequestInit) =>
    apiFetch<CompartmentOut[]>('/api/compartments', opts).then((list) =>
      list.map(normalizeCompartment),
    ),

  getCompartment: (id: string) =>
    apiFetch<CompartmentOut>(`/api/compartments/${id}`).then(normalizeCompartment),

  createCompartment: (data: {
    name: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) =>
    apiFetch<CompartmentOut>('/api/compartments', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(normalizeCompartment),

  updateCompartment: (
    id: string,
    data: { name?: string; description?: string; metadata?: Record<string, unknown> },
  ) =>
    apiFetch<CompartmentOut>(`/api/compartments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(normalizeCompartment),

  archiveCompartment: (id: string) =>
    apiFetch<void>(`/api/compartments/${id}/archive`, { method: 'POST' }),

  // Voice / Conversations
  startConversation: (compartmentId: string) =>
    apiFetch<VoiceStartOut>(`/api/compartments/${compartmentId}/voice/start`, {
      method: 'POST',
    }),

  sendVoiceMessage: (
    compartmentId: string,
    body: { conversation_id: string; message: string },
  ) =>
    apiFetch<VoiceMessageOut>(`/api/compartments/${compartmentId}/voice/message`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getConversations: (compartmentId: string) =>
    apiFetch<ConversationOut[]>(`/api/compartments/${compartmentId}/conversations`),

  getConversation: (conversationId: string) =>
    apiFetch<ConversationOut>(`/api/conversations/${conversationId}`),

  // Writeback to vault
  writeback: (compartmentId: string, conversationId: string) =>
    apiFetch<{ file_path: string; conversation_id: string }>(
      `/api/compartments/${compartmentId}/writeback`,
      { method: 'POST', body: JSON.stringify({ conversation_id: conversationId }) },
    ),

  // Seed context from Obsidian Brain vault
  seedContext: (compartmentId: string) =>
    apiFetch<{ seeded: string[]; compartment_id: string }>(
      `/api/compartments/${compartmentId}/context/seed`,
      { method: 'POST' },
    ),
};
