import { useEffect, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { saveDiagramById } from '@/lib/storage';

const DEBOUNCE_MS = 2000; // Debounce saves by 2 seconds
const AUTO_SAVE_INTERVAL_MS = 60000; // Auto-save every 60 seconds (increased from 30s)

/**
 * Hook for auto-saving with debouncing and change detection.
 * - Debounces saves to avoid excessive writes
 * - Only saves when there are actual changes (hash comparison)
 * - Saves on visibility change (tab switch)
 * - Manual save always works regardless of debounce
 */
export const useAutoSave = (currentDiagramId: string | null, isDirty: boolean) => {
  const { getNodes, getEdges, getViewport } = useReactFlow();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveHashRef = useRef<string>('');
  const isSavingRef = useRef(false);

  // Compute a simple hash for change detection
  const computeHash = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    const viewport = getViewport();
    // Simple hash based on counts and viewport
    return `${nodes.length}-${edges.length}-${viewport.x.toFixed(1)}-${viewport.y.toFixed(1)}-${viewport.zoom.toFixed(2)}`;
  }, [getNodes, getEdges, getViewport]);

  // Internal save function
  const saveInternal = useCallback(async (showToast = false, force = false) => {
    if (!currentDiagramId) return;
    if (isSavingRef.current) return; // Prevent concurrent saves

    // Skip if no changes (unless forced)
    if (!force && !isDirty) return;

    const currentHash = computeHash();
    if (!force && currentHash === lastSaveHashRef.current) return;

    isSavingRef.current = true;

    try {
      const flow = {
        nodes: getNodes(),
        edges: getEdges(),
        viewport: getViewport(),
        updatedAt: Date.now(),
      };
      await saveDiagramById(currentDiagramId, flow, showToast);
      lastSaveHashRef.current = currentHash;
    } finally {
      isSavingRef.current = false;
    }
  }, [currentDiagramId, isDirty, computeHash, getNodes, getEdges, getViewport]);

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      saveInternal(false, false);
    }, DEBOUNCE_MS);
  }, [saveInternal]);

  // Manual save (bypasses debounce, shows toast)
  const save = useCallback(async () => {
    // Clear any pending debounced save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    await saveInternal(true, true);
  }, [saveInternal]);

  // Trigger debounced save when dirty changes
  useEffect(() => {
    if (isDirty && currentDiagramId) {
      debouncedSave();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [isDirty, currentDiagramId, debouncedSave]);

  // Periodic save check (only if dirty)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && currentDiagramId) {
        saveInternal(false, false);
      }
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isDirty, currentDiagramId, saveInternal]);

  // Save on visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isDirty && currentDiagramId) {
        // Immediate save when tab is hidden
        saveInternal(false, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isDirty, currentDiagramId, saveInternal]);

  // Reset hash when diagram changes
  useEffect(() => {
    lastSaveHashRef.current = '';
  }, [currentDiagramId]);

  return { save };
};
