'use client';

import { useCallback, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceStore } from '@/store/voice-store';
import { WaveformVisualizer, useWaveformSimulator } from './WaveformVisualizer';

// Minimal Web Speech API typings — not in all lib.dom.d.ts versions
interface SpeechRecognitionResultItem {
  readonly transcript: string;
}
interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionResultItem;
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface Props {
  onTranscript: (text: string) => Promise<void>;
}

export function PushToTalkButton({ onTranscript }: Props) {
  const { state, startRecording, stopRecording, setIdle, setWaveformData, waveformData } =
    useVoiceStore();
  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptHandledRef = useRef(false);

  useWaveformSimulator(isRecording, setWaveformData);

  // Fallback: if processing gets stuck (e.g. network timeout), auto-reset after 15s
  useEffect(() => {
    if (state !== 'processing') return;
    const timer = setTimeout(() => setIdle(), 15_000);
    return () => clearTimeout(timer);
  }, [state, setIdle]);

  const handlePress = useCallback(() => {
    if (isProcessing) return;

    if (isRecording) {
      // User released early — stop recognition; onend will fire and clean up
      recognitionRef.current?.stop();
      return;
    }

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      // Browser doesn't support speech recognition — graceful no-op
      return;
    }

    transcriptHandledRef.current = false;
    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript ?? '';
      if (!transcript) return;
      transcriptHandledRef.current = true;
      stopRecording(); // → 'processing'

      onTranscript(transcript).finally(() => {
        setIdle();
      });
    };

    recognition.onerror = () => {
      setIdle();
    };

    recognition.onend = () => {
      // If no result was produced (silence), go back to idle
      if (!transcriptHandledRef.current) {
        setIdle();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    startRecording();
  }, [isRecording, isProcessing, startRecording, stopRecording, setIdle, onTranscript]);

  return (
    <div className="flex flex-col gap-4">
      {/* waveform display */}
      <div className="w-full h-10 flex items-center justify-center">
        <WaveformVisualizer data={waveformData} isActive={isRecording} className="w-full" />
      </div>

      {/* full-width amber voice briefing button */}
      <div className="relative">
        {isRecording && (
          <div
            className="absolute inset-0 rounded-sm animate-pulse-slow"
            style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)' }}
          />
        )}

        <button
          onMouseDown={handlePress}
          onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
          disabled={isProcessing}
          className={clsx(
            'relative w-full flex items-center justify-center gap-3 py-3.5',
            'font-mono text-[12px] uppercase tracking-[0.2em]',
            'transition-all duration-150 select-none focus:outline-none',
            'border',
            isRecording
              ? 'bg-brief-accent border-brief-accent text-black'
              : isProcessing
              ? 'bg-brief-surface2 border-brief-border text-brief-muted cursor-not-allowed'
              : 'bg-brief-surface border-brief-accent/40 text-brief-accent hover:bg-brief-accent/10 hover:border-brief-accent active:scale-[0.99]',
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              Release to Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Hold to Voice Briefing
            </>
          )}
        </button>
      </div>

      {/* status line */}
      <div className="flex items-center justify-center h-4">
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brief-urgent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-urgent">
              Recording
            </span>
          </div>
        )}
        {isProcessing && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brief-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-brief-accent">
              Processing...
            </span>
          </div>
        )}
        {state === 'idle' && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-brief-muted">
            Ready
          </span>
        )}
      </div>
    </div>
  );
}
