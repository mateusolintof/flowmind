import { create } from 'zustand';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface SyncStatusStore {
  status: SyncStatus;
  setStatus: (status: SyncStatus) => void;
}

export const useSyncStatusStore = create<SyncStatusStore>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status }),
}));

// External setter for use in storage.ts (without React hook)
export const setSyncStatus = (status: SyncStatus) => {
  useSyncStatusStore.getState().setStatus(status);
};

// External getter for use outside React
export const getSyncStatus = () => {
  return useSyncStatusStore.getState().status;
};

// Selector hooks
export const useSyncStatus = () => useSyncStatusStore((s) => s.status);
