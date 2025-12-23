import { useEffect, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { saveFlow } from '@/lib/storage';

export const useAutoSave = () => {
    const { getNodes, getEdges, getViewport } = useReactFlow();

    // Just a simple save function we can call
    const save = useCallback(async () => {
        const flow = {
            nodes: getNodes(),
            edges: getEdges(),
            viewport: getViewport(),
            updatedAt: Date.now(),
        };
        await saveFlow(flow);
        console.log('Saved flow', flow);
    }, [getNodes, getEdges, getViewport]);

    // Save every 30 seconds automatically
    useEffect(() => {
        const interval = setInterval(() => {
            save();
        }, 30000);
        return () => clearInterval(interval);
    }, [save]);

    // Also save on visibility change (tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                save();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [save]);

    return { save };
};
