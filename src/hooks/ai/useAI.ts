'use client';

import { useState, useCallback } from 'react';
import type { PromptType } from '@/lib/ai/prompts';

export interface UseAIOptions {
  onError?: (error: string) => void;
}

export interface AIResponse {
  content: string;
  isReady?: boolean;
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = useCallback(async (
    type: PromptType,
    variables?: { conversation?: string; summary?: string }
  ): Promise<AIResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...variables,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to get AI response';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const getInitialQuestion = useCallback(async () => {
    return callAI('initial');
  }, [callAI]);

  const getFollowUpQuestion = useCallback(async (conversation: string) => {
    return callAI('followup', { conversation });
  }, [callAI]);

  const getSummary = useCallback(async (conversation: string) => {
    return callAI('summary', { conversation });
  }, [callAI]);

  const generateDiagram = useCallback(async (conversation: string, summary: string) => {
    return callAI('diagram', { conversation, summary });
  }, [callAI]);

  return {
    isLoading,
    error,
    callAI,
    getInitialQuestion,
    getFollowUpQuestion,
    getSummary,
    generateDiagram,
  };
}
