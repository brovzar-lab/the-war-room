'use client';

import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface WaveformVisualizerProps {
  data: number[];
  isActive: boolean;
  className?: string;
}

export function WaveformVisualizer({ data, isActive, className }: WaveformVisualizerProps) {
  const bars = data.length > 0 ? data : Array(32).fill(0);

  return (
    <div className={clsx('flex items-center justify-center gap-[2px]', className)}>
      {bars.map((value, i) => {
        const height = isActive
          ? Math.max(4, Math.round(value * 48))
          : 4;

        return (
          <div
            key={i}
            className={clsx(
              'w-[3px] rounded-full transition-all',
              isActive ? 'bg-electric-400' : 'bg-charcoal-600',
            )}
            style={{
              height: `${height}px`,
              animationDelay: isActive ? `${i * 40}ms` : undefined,
              animation: isActive && value === 0 ? `waveform ${0.8 + (i % 4) * 0.2}s ease-in-out infinite` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

export function useWaveformSimulator(isActive: boolean, onData: (data: number[]) => void) {
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      onData(Array(32).fill(0));
      return;
    }

    const animate = () => {
      phaseRef.current += 0.15;
      const data = Array.from({ length: 32 }, (_, i) => {
        const wave1 = Math.sin(phaseRef.current + i * 0.3) * 0.4;
        const wave2 = Math.sin(phaseRef.current * 1.7 + i * 0.5) * 0.3;
        const noise = (Math.random() - 0.5) * 0.3;
        return Math.max(0, Math.min(1, 0.5 + wave1 + wave2 + noise));
      });
      onData(data);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, onData]);
}
