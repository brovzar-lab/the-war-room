import { create } from 'zustand';

type VoiceState = 'idle' | 'recording' | 'processing' | 'playing';

interface VoiceStore {
  state: VoiceState;
  transcript: string;
  waveformData: number[];
  startRecording: () => void;
  stopRecording: () => void;
  setProcessing: () => void;
  setIdle: () => void;
  setWaveformData: (data: number[]) => void;
  setTranscript: (text: string) => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  state: 'idle',
  transcript: '',
  waveformData: Array(32).fill(0),

  startRecording: () => set({ state: 'recording', transcript: '' }),
  stopRecording: () => set({ state: 'processing' }),
  setProcessing: () => set({ state: 'processing' }),
  setIdle: () => set({ state: 'idle', waveformData: Array(32).fill(0) }),

  setWaveformData: (data) => set({ waveformData: data }),
  setTranscript: (text) => set({ transcript: text }),
}));
