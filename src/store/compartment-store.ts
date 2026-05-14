import { create } from 'zustand';
import { Compartment, Message, MOCK_COMPARTMENTS, MOCK_MESSAGES } from '@/lib/mock-data';
import { isDemoMode } from '@/lib/demo';

interface CompartmentStore {
  compartments: Compartment[];
  activeCompartmentId: string | null;
  messages: Record<string, Message[]>;
  activeContextPages: string[];
  setActiveCompartment: (id: string) => void;
  addMessage: (compartmentId: string, message: Message) => void;
  toggleContextPage: (page: string) => void;
  clearContext: () => void;
}

export const useCompartmentStore = create<CompartmentStore>((set, get) => ({
  compartments: isDemoMode ? MOCK_COMPARTMENTS : [],
  activeCompartmentId: null,
  messages: isDemoMode ? MOCK_MESSAGES : {},
  activeContextPages: [],

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
