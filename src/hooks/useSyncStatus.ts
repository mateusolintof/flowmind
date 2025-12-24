'use client';

import { useState, useCallback, useEffect } from 'react';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

// Global state to share sync status across components
let globalStatus: SyncStatus = 'idle';
let listeners: Set<(status: SyncStatus) => void> = new Set();

const notifyListeners = () => {
    listeners.forEach((listener) => listener(globalStatus));
};

export const setSyncStatus = (status: SyncStatus) => {
    globalStatus = status;
    notifyListeners();
};

export const getSyncStatus = () => globalStatus;

export function useSyncStatus() {
    const [status, setStatus] = useState<SyncStatus>(globalStatus);

    useEffect(() => {
        const listener = (newStatus: SyncStatus) => setStatus(newStatus);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    // Check online status
    useEffect(() => {
        const handleOnline = () => {
            if (globalStatus === 'offline') {
                setSyncStatus('idle');
            }
        };
        const handleOffline = () => {
            setSyncStatus('offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        if (!navigator.onLine) {
            setSyncStatus('offline');
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return status;
}
