import { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { saveFlow } from '@/lib/storage';

export const useAutoSave = () => {
    const { getNodes, getEdges, getViewport } = useReactFlow();

    // Internal save function (no toast)
    const saveInternal = useCallback(async (showToast = false) => {
        const flow = {
            nodes: getNodes(),
            edges: getEdges(),
            viewport: getViewport(),
            updatedAt: Date.now(),
        };
        await saveFlow(flow, showToast);
    }, [getNodes, getEdges, getViewport]);

    // Manual save (shows toast)
    const save = useCallback(async () => {
        await saveInternal(true);
    }, [saveInternal]);

    // Auto-save (no toast)
    const autoSave = useCallback(async () => {
        await saveInternal(false);
    }, [saveInternal]);

    // Save every 30 seconds automatically (no toast)
    useEffect(() => {
        const interval = setInterval(() => {
            autoSave();
        }, 30000);
        return () => clearInterval(interval);
    }, [autoSave]);

    // Also save on visibility change (tab switch, no toast)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                autoSave();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [autoSave]);

    return { save };
};
