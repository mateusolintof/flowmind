import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Node, Edge } from '@xyflow/react';
import { MAX_UNDO_HISTORY } from '@/config/appConstants';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface UndoRedoStore {
  past: HistoryState[];
  future: HistoryState[];

  takeSnapshot: (nodes: Node[], edges: Edge[]) => void;
  undo: (currentNodes: Node[], currentEdges: Edge[]) => HistoryState | null;
  redo: (currentNodes: Node[], currentEdges: Edge[]) => HistoryState | null;
  clear: () => void;
}

export const useUndoRedoStore = create<UndoRedoStore>()(
  immer((set, get) => ({
    past: [],
    future: [],

    takeSnapshot: (nodes, edges) => set((state) => {
      // Use structuredClone for deep copy (faster than JSON.parse/stringify)
      const snapshot: HistoryState = {
        nodes: structuredClone(nodes),
        edges: structuredClone(edges),
      };

      state.past.push(snapshot);

      // Keep only last MAX_UNDO_HISTORY items
      if (state.past.length > MAX_UNDO_HISTORY) {
        state.past.shift();
      }

      // Clear future on new action
      state.future = [];
    }),

    undo: (currentNodes, currentEdges) => {
      const { past } = get();
      if (past.length === 0) return null;

      const previousState = past[past.length - 1];

      set((state) => {
        state.past.pop();
        state.future.push({
          nodes: structuredClone(currentNodes),
          edges: structuredClone(currentEdges),
        });
      });

      return previousState;
    },

    redo: (currentNodes, currentEdges) => {
      const { future } = get();
      if (future.length === 0) return null;

      const nextState = future[future.length - 1];

      set((state) => {
        state.future.pop();
        state.past.push({
          nodes: structuredClone(currentNodes),
          edges: structuredClone(currentEdges),
        });
      });

      return nextState;
    },

    clear: () => set({ past: [], future: [] }),
  }))
);

// Selectors
export const useCanUndo = () => useUndoRedoStore((s) => s.past.length > 0);
export const useCanRedo = () => useUndoRedoStore((s) => s.future.length > 0);
export const useTakeSnapshot = () => useUndoRedoStore((s) => s.takeSnapshot);
export const useUndo = () => useUndoRedoStore((s) => s.undo);
export const useRedo = () => useUndoRedoStore((s) => s.redo);
