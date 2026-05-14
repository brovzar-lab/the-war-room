import { create } from 'zustand';
import type { Compartment, Message } from '@/lib/mock-data';
import { api } from '@/lib/api';

interface CompartmentStore {
  compartments: Compartment[];
  activeCompartmentId: string | null;
  messages: Record<string, Message[]>;
  activeContextPages: string[];
  isLoading: boolean;
  error: string | null;

  fetchCompartments: () => Promise<void>;
  setActiveCompartment: (id: string) => void;
  addMessage: (compartmentId: string, message: Message) => void;
  toggleContextPage: (page: string) => void;
  clearContext: () => void;
}

export const useCompartmentStore = create<CompartmentStore>((set, get) => ({
  compartments: [],
  activeCompartmentId: null,
  messages: {},
  activeContextPages: [],
  isLoading: false,
  error: null,

  fetchCompartments: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const compartments = await api.getCompartments();
      set({ compartments, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  setActiveCompartment: (id) => {
    const compartment = get().compartments.find((c) => c.id === id);
    set({
      activeCompartmentId: id,
      activeContextPages: compartment?.contextPages.slice(0, 2) ?? [],
    });
  },

  addMessage: (compartmentId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [compartmentId]: [...(state.messages[compartmentId] ?? []), message],
      },
    }));
  },

  toggleContextPage: (page) => {
    set((state) => ({
      activeContextPages: state.activeContextPages.includes(page)
        ? state.activeContextPages.filter((p) => p !== page)
        : [...state.activeContextPages, page],
    }));
  },

  clearContext: () => set({ activeContextPages: [] }),
}));
