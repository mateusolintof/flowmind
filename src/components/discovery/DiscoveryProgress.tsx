'use client';

import { useDiscoveryStore } from '@/store/discoveryStore';
import { cn } from '@/lib/utils';

export function DiscoveryProgress() {
  const qaHistory = useDiscoveryStore((s) => s.qaHistory);
  const phase = useDiscoveryStore((s) => s.phase);

  const totalSteps = 5; // Expected number of questions
  const currentStep = qaHistory.length + (phase === 'questioning' ? 1 : 0);
  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Discovery Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            phase === 'complete' ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-1 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              i < qaHistory.length
                ? 'bg-primary'
                : i === qaHistory.length && phase === 'questioning'
                  ? 'bg-primary/50 animate-pulse'
                  : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}
