'use client';

import { useEffect } from 'react';
import { useSyncStatusStore, setSyncStatus } from '@/store/syncStatusStore';

// Re-export types and functions for backward compatibility
export type { SyncStatus } from '@/store/syncStatusStore';
export { setSyncStatus, getSyncStatus } from '@/store/syncStatusStore';

/**
 * Hook for sync status using Zustand store.
 * Handles online/offline detection automatically.
 */
export function useSyncStatus() {
  const status = useSyncStatusStore((s) => s.status);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      const currentStatus = useSyncStatusStore.getState().status;
      if (currentStatus === 'offline') {
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
