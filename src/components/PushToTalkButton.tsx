'use client';

import { useCallback, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceStore } from '@/store/voice-store';
import { WaveformVisualizer, useWaveformSimulator } from './WaveformVisualizer';

export function PushToTalkButton() {
  const { state, startRecording, stopRecording, setIdle, setWaveformData, waveformData } = useVoiceStore();
  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useWaveformSimulator(isRecording, setWaveformData);

  const handlePress = useCallback(() => {
    if (isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, isProcessing, startRecording, stopRecording]);

  // Simulate processing after recording stops
  useEffect(() => {
    if (state === 'processing') {
      holdTimerRef.current = setTimeout(() => setIdle(), 2000);
    }
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [state, setIdle]);

  return (
    <div className="flex flex-col gap-4">
      {/* waveform display */}
      <div className="w-full h-10 flex items-center justify-center">
        <WaveformVisualizer data={waveformData} isActive={isRecording} className="w-full" />
      </div>

      {/* full-width amber voice briefing button */}
      <div className="relative">
        {/* amber glow ring when recording */}
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
