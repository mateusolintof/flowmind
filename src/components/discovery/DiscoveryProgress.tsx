'use client';

import { useDiscoveryStore, type DiscoveryPhase } from '@/store/discoveryStore';
import { cn } from '@/lib/utils';

// Map phases to progress percentages
const PHASE_PROGRESS: Record<DiscoveryPhase, number> = {
  idle: 0,
  loading: 5,
  questioning: 20, // Base for questioning, will be adjusted by qaHistory length
  summarizing: 80,
  generating: 90,
  complete: 100,
  error: 0, // Keep current progress on error
};

// Typical range of questions (min to max)
const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 6;

export function DiscoveryProgress() {
  const qaHistory = useDiscoveryStore((s) => s.qaHistory);
  const phase = useDiscoveryStore((s) => s.phase);

  // Calculate progress based on phase and Q&A history
  const calculateProgress = () => {
    const questionCount = qaHistory.length;

    switch (phase) {
      case 'idle':
        return 0;
      case 'loading':
        // If we have questions, we're loading next question
        // Progress increases with each answered question
        if (questionCount === 0) return 5;
        // Scale from 20% to 75% based on questions answered
        const loadingProgress = 20 + (questionCount / MAX_QUESTIONS) * 55;
        return Math.min(loadingProgress, 75);
      case 'questioning':
        // Scale from 20% to 75% based on questions answered
        const questioningProgress = 20 + (questionCount / MAX_QUESTIONS) * 55;
        return Math.min(questioningProgress, 75);
      case 'summarizing':
        return 80;
      case 'generating':
        return 90;
      case 'complete':
        return 100;
      case 'error':
        // Keep showing progress where we were
        if (questionCount === 0) return 5;
        return 20 + (questionCount / MAX_QUESTIONS) * 55;
      default:
        return 0;
    }
  };

  const progress = calculateProgress();

  // Get status text based on phase
  const getStatusText = () => {
    switch (phase) {
      case 'loading':
        if (qaHistory.length === 0) return 'Starting...';
        return 'Analyzing...';
      case 'questioning':
        return `Question ${qaHistory.length + 1}`;
      case 'summarizing':
        return 'Creating summary...';
      case 'generating':
        return 'Generating diagram...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error';
      default:
        return 'Discovery Progress';
    }
  };

  // Show dots for questions answered + current question indicator
  const renderProgressDots = () => {
    const questionCount = qaHistory.length;
    const showCurrentDot = phase === 'questioning' || phase === 'loading';
    const totalDots = Math.max(questionCount + (showCurrentDot ? 1 : 0), MIN_QUESTIONS);

    return (
      <div className="flex items-center gap-1 justify-center">
        {Array.from({ length: Math.min(totalDots, MAX_QUESTIONS) }).map((_, i) => {
          const isCompleted = i < questionCount;
          const isCurrent = i === questionCount && showCurrentDot;
          const isFuture = i > questionCount;

          return (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                isCompleted && 'bg-primary',
                isCurrent && 'bg-primary/50 animate-pulse',
                isFuture && 'bg-muted'
              )}
            />
          );
        })}
        {/* Show final indicator for summary/generating/complete */}
        {(phase === 'summarizing' || phase === 'generating' || phase === 'complete') && (
          <div
            className={cn(
              'w-2 h-2 rounded-full transition-colors ml-1',
              phase === 'complete' ? 'bg-green-500' : 'bg-primary/50 animate-pulse'
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{getStatusText()}</span>
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
      {renderProgressDots()}
    </div>
  );
}
