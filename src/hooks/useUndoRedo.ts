import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useUndoRedoStore, useCanUndo, useCanRedo } from '@/store/undoRedoStore';

/**
 * Hook for undo/redo functionality using Zustand store.
 * Uses structuredClone for efficient deep copying.
 * History limited to 30 items for memory performance.
 */
export const useUndoRedo = () => {
  const takeSnapshotFn = useUndoRedoStore((s) => s.takeSnapshot);
  const undoFn = useUndoRedoStore((s) => s.undo);
  const redoFn = useUndoRedoStore((s) => s.redo);
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    takeSnapshotFn(nodes, edges);
  }, [takeSnapshotFn]);

  const undo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    return undoFn(currentNodes, currentEdges);
  }, [undoFn]);

  const redo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    return redoFn(currentNodes, currentEdges);
  }, [redoFn]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo,
    canRedo,
  };
};
