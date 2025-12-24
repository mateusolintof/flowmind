import { get, set } from 'idb-keyval';
import { Edge, Node, Viewport } from '@xyflow/react';
import { supabase } from './supabase';
import { toast } from 'sonner';
import { setSyncStatus } from '@/hooks/useSyncStatus';

const STORAGE_KEY = 'flowmind-canvas';
const USER_ID_KEY = 'flowmind-user-id';

export type FlowState = {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    updatedAt: number;
};

// Helper: Get or create persistent anonymous user ID
const getUserId = async () => {
    if (typeof window === 'undefined') return 'server-side';
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
};

export const saveFlow = async (state: FlowState, showToast = false) => {
    // Check if online
    if (typeof window !== 'undefined' && !navigator.onLine) {
        setSyncStatus('offline');
        await set(STORAGE_KEY, state);
        if (showToast) {
            toast.success('Saved locally (offline)');
        }
        return;
    }

    setSyncStatus('syncing');

    // Always save locally first (speed/offline)
    await set(STORAGE_KEY, state);

    // Then try to save to Supabase
    let cloudSaveSuccess = false;
    try {
        const userId = await getUserId();

        // Check if a diagram already exists for this user
        const { data: existing } = await supabase
            .from('diagrams')
            .select('id')
            .eq('user_id', userId)
            .single();

        let error;
        if (existing) {
            // Update existing record
            const result = await supabase
                .from('diagrams')
                .update({
                    data: state,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
            error = result.error;
        } else {
            // Insert new record
            const result = await supabase
                .from('diagrams')
                .insert({
                    user_id: userId,
                    data: state,
                    updated_at: new Date().toISOString()
                });
            error = result.error;
        }

        if (error) {
            console.error('Supabase save error:', error);
            setSyncStatus('error');
        } else {
            cloudSaveSuccess = true;
            setSyncStatus('synced');
            // Reset to idle after 3 seconds
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    } catch (err) {
        // If supabase fails (e.g. invalid URL/Key), just warn, don't crash the app
        console.warn('Supabase sync failed, using local only', err);
        setSyncStatus('error');
    }

    if (showToast) {
        if (cloudSaveSuccess) {
            toast.success('Saved to cloud');
        } else {
            toast.success('Saved locally');
        }
    }
};

export const loadFlow = async (): Promise<FlowState | null> => {
    // 1. Try cloud load first (to get cross-device sync)
    try {
        const userId = await getUserId();
        const { data, error } = await supabase
            .from('diagrams')
            .select('data')
            .eq('user_id', userId)
            .single();

        if (data && !error) {
            console.log('Loaded from Cloud');
            // Update local cache too
            await set(STORAGE_KEY, data.data);
            return data.data as FlowState;
        }
    } catch (err) {
        console.warn('Cloud load failed or empty, falling back to local', err);
    }

    // 2. Fallback to local
    return await get(STORAGE_KEY) ?? null;
};
