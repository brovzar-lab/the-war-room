'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
    return () => { if (holdTimerRef.current) clearTimeout(holdTimerRef.current); };
  }, [state, setIdle]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* waveform display */}
      <div className="w-full h-16 flex items-center justify-center">
        <WaveformVisualizer data={waveformData} isActive={isRecording} className="w-full" />
      </div>

      {/* PTT button */}
      <div className="relative">
        {/* outer ring */}
        <div className={clsx(
          'absolute inset-0 rounded-full transition-all duration-300',
          isRecording && 'animate-ping-slow bg-electric-500/20',
        )} style={{ inset: '-16px' }} />

        {/* second ring */}
        {isRecording && (
          <div className="absolute rounded-full border border-electric-500/30 animate-pulse"
            style={{ inset: '-8px' }} />
        )}

        {/* main button */}
        <button
          onMouseDown={handlePress}
          onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
          disabled={isProcessing}
          className={clsx(
            'relative w-24 h-24 rounded-full flex items-center justify-center',
            'transition-all duration-150 select-none',
            'focus:outline-none focus:ring-2 focus:ring-electric-500 focus:ring-offset-2 focus:ring-offset-navy-900',
            isRecording
              ? 'bg-electric-600 border-2 border-electric-400 shadow-electric-lg scale-105'
              : isProcessing
              ? 'bg-charcoal-700 border-2 border-charcoal-600 cursor-not-allowed'
              : 'bg-charcoal-800 border-2 border-charcoal-600 hover:border-electric-500 hover:shadow-electric active:scale-95',
          )}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-electric-400 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-slate-400" />
          )}
        </button>
      </div>

      {/* status label */}
      <div className="flex items-center gap-2 h-5">
        {isRecording && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-red-400">Recording</span>
          </>
        )}
        {isProcessing && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-electric-400">Processing...</span>
          </>
        )}
        {state === 'idle' && (
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-600">
            Press to talk
          </span>
        )}
      </div>
    </div>
  );
}
