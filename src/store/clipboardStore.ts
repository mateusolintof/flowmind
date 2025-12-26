import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface ClipboardStore {
  nodes: Node[];
  edges: Edge[];
  hasContent: boolean;

  setClipboard: (nodes: Node[], edges: Edge[]) => void;
  clear: () => void;
}

export const useClipboardStore = create<ClipboardStore>((set) => ({
  nodes: [],
  edges: [],
  hasContent: false,

  setClipboard: (nodes, edges) => set({
    // Use structuredClone for deep copy
    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
    hasContent: nodes.length > 0,
  }),

  clear: () => set({ nodes: [], edges: [], hasContent: false }),
}));

// Selectors
export const useClipboardNodes = () => useClipboardStore((s) => s.nodes);
export const useClipboardEdges = () => useClipboardStore((s) => s.edges);
export const useHasClipboard = () => useClipboardStore((s) => s.hasContent);
