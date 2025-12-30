import { useEffect, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { saveDiagramById } from '@/lib/storage';
import { useFlowStore } from '@/store/flowStore';

const DEBOUNCE_MS = 2000; // Debounce saves by 2 seconds
const AUTO_SAVE_INTERVAL_MS = 60000; // Auto-save every 60 seconds (increased from 30s)

/**
 * Hook for auto-saving with debouncing and change detection.
 * - Debounces saves to avoid excessive writes
 * - Saves until the diagram is clean (dirty counter returns to 0)
 * - Saves on visibility change (tab switch)
 * - Manual save always works regardless of debounce
 */
export const useAutoSave = (currentDiagramId: string | null, dirtyCounter: number) => {
  const { getNodes, getEdges, getViewport } = useReactFlow();
  const markClean = useFlowStore((s) => s.markClean);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const dirtyCounterRef = useRef(dirtyCounter);

  useEffect(() => {
    dirtyCounterRef.current = dirtyCounter;
  }, [dirtyCounter]);

  // Internal save function
  const saveInternal = useCallback(async (showToast = false) => {
    if (!currentDiagramId) return;
    if (isSavingRef.current) return; // Prevent concurrent saves

    const dirtyAtStart = dirtyCounterRef.current;
    if (dirtyAtStart === 0) return;

    isSavingRef.current = true;

    try {
      const flow = {
        nodes: getNodes(),
        edges: getEdges(),
        viewport: getViewport(),
        updatedAt: Date.now(),
      };
      await saveDiagramById(currentDiagramId, flow, showToast);
    } finally {
      isSavingRef.current = false;
    }

    // If nothing changed while we were saving, we can clear the dirty state.
    if (dirtyCounterRef.current === dirtyAtStart) {
      markClean();
    } else {
      // Changes happened while saving; schedule another pass.
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        void saveInternal(false);
      }, DEBOUNCE_MS);
    }
  }, [currentDiagramId, getNodes, getEdges, getViewport, markClean]);

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      void saveInternal(false);
    }, DEBOUNCE_MS);
  }, [saveInternal]);

  // Manual save (bypasses debounce, shows toast)
  const save = useCallback(async () => {
    // Clear any pending debounced save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    await saveInternal(true);
  }, [saveInternal]);

  // Trigger debounced save when dirty changes
  useEffect(() => {
    if (dirtyCounter > 0 && currentDiagramId) {
      debouncedSave();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [dirtyCounter, currentDiagramId, debouncedSave]);

  // Periodic save check (only if dirty)
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyCounterRef.current > 0 && currentDiagramId) {
        void saveInternal(false);
      }
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [currentDiagramId, saveInternal]);

  // Save on visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentDiagramId) {
        // Immediate save when tab is hidden
        void saveInternal(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentDiagramId, saveInternal]);

  // Reset debounce when diagram changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, [currentDiagramId]);

  return { save };
};
