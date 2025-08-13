'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
// Keep your alias if it's correct in your project:
import { Progress } from '@components/ui/progress';

const MESSAGES: string[] = [
  'Gathering property data...',
  'Analysing market comparables...',
  'Calculating potential returns...',
  'Evaluating investment strategies...',
  'Assessing local rental demand...',
  'Projecting cash flow scenarios...',
  'Analysing neighbourhood trends...',
  'Compiling comprehensive report...'
] as const;

const DURATION_MS = 18_000; // 18 seconds

export default function ProcessingAnimation() {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(MESSAGES[1]);

  // Refs so React 18 Strict Mode double-mount doesn't duplicate timers
  const frameId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      if (startTime.current === null) startTime.current = ts;
      const elapsed = ts - startTime.current;

      // progress 0..95
      const pct = Math.min(95, (elapsed / DURATION_MS) * 100);

      // Avoid excessive re-renders by rounding a bit
      setProgress(prev => (Math.abs(prev - pct) >= 0.2 ? pct : prev));

      // Message based on progress
      const idx = Math.min(
        Math.floor((pct / 100) * MESSAGES.length),
        MESSAGES.length - 1
      );
      setLoadingMessage(MESSAGES[idx]);

      if (pct < 95) {
        frameId.current = requestAnimationFrame(step);
      }
    };

    frameId.current = requestAnimationFrame(step);

    return () => {
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
      frameId.current = null;
      startTime.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-propalytiq-blue/20 flex items-center justify-center">
          <Loader className="w-12 h-12 text-propalytiq-blue animate-spin" />
        </div>
        <div className="absolute -inset-4 rounded-full border-4 border-propalytiq-blue/20 border-t-propalytiq-blue animate-spin" />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Analysing Your Property</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Our AI is generating a comprehensive investment report tailored to your property...
      </p>

      <div className="w-full max-w-md mb-2">
        <Progress value={progress} className="h-2.5" />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{loadingMessage}</div>
    </div>
  );
}
