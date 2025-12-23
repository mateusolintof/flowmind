import { get, set } from 'idb-keyval';
import { Edge, Node, Viewport } from '@xyflow/react';
import { supabase } from './supabase';
import { toast } from 'sonner';

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
    // Always save locally first (speed/offline)
    await set(STORAGE_KEY, state);

    // Then try to save to Supabase
    let cloudSaveSuccess = false;
    try {
        const userId = await getUserId();

        // Upsert logic: check if we have a diagram for this user
        // For simplicity in this anonymous model, we assume 1 active diagram per user for now
        // or we could store a diagram_id in local storage.
        // Let's store a SINGLE diagram object per user for this MVP.

        const { error } = await supabase
            .from('diagrams')
            .upsert({
                user_id: userId,
                data: state,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) {
            console.error('Supabase save error:', error);
        } else {
            cloudSaveSuccess = true;
        }
    } catch (err) {
        // If supabase fails (e.g. invalid URL/Key), just warn, don't crash the app
        console.warn('Supabase sync failed, using local only', err);
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
    return await get(STORAGE_KEY);
};
