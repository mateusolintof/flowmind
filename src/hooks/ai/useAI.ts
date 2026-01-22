'use client';

import { useState, useCallback, useRef } from 'react';
import type { PromptType } from '@/lib/ai/prompts';

// Timeout for AI requests (30 seconds)
const AI_TIMEOUT_MS = 30000;

export interface UseAIOptions {
  onError?: (error: string) => void;
}

export interface AIResponse {
  content: string;
  isReady?: boolean;
}

// Map prompt types to user-friendly operation names
const OPERATION_NAMES: Record<PromptType, string> = {
  initial: 'generating initial question',
  followup: 'analyzing your response',
  summary: 'creating summary',
  diagram: 'generating diagram',
};

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel any ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const callAI = useCallback(async (
    type: PromptType,
    variables?: { conversation?: string; summary?: string }
  ): Promise<AIResponse | null> => {
    // Cancel any previous request
    cancelRequest();

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, AI_TIMEOUT_MS);

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Error ${OPERATION_NAMES[type]}. Please try again.`;
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      // Handle abort/timeout specifically
      if (err instanceof Error && err.name === 'AbortError') {
        const errorMessage = `Request timed out while ${OPERATION_NAMES[type]}. Please try again.`;
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }

      // Handle network errors
      const errorMessage = err instanceof Error
        ? `Network error while ${OPERATION_NAMES[type]}: ${err.message}`
        : `Unknown error while ${OPERATION_NAMES[type]}`;
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [options, cancelRequest]);

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
    cancelRequest,
    getInitialQuestion,
    getFollowUpQuestion,
    getSummary,
    generateDiagram,
  };
}
