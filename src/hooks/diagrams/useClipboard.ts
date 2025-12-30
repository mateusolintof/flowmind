'use client';

import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useClipboardStore } from '@/store/clipboardStore';

/**
 * Hook for clipboard operations using Zustand store.
 * Uses structuredClone for deep copying to prevent mutation issues.
 */
export function useClipboard() {
  const clipboardNodes = useClipboardStore((s) => s.nodes);
  const clipboardEdges = useClipboardStore((s) => s.edges);
  const hasClipboard = useClipboardStore((s) => s.hasContent);
  const setClipboard = useClipboardStore((s) => s.setClipboard);

  const copy = useCallback((nodes: Node[], edges: Edge[]) => {
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length === 0) return 0;

    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

    // Only copy edges that connect selected nodes
    const selectedEdges = edges.filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );

    setClipboard(selectedNodes, selectedEdges);
    return selectedNodes.length;
  }, [setClipboard]);

  const cut = useCallback((
    nodes: Node[],
    edges: Edge[],
    setNodes: (fn: (nodes: Node[]) => Node[]) => void,
    setEdges: (fn: (edges: Edge[]) => Edge[]) => void
  ) => {
    const count = copy(nodes, edges);
    if (count === 0) return 0;

    const selectedNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));

    // Remove selected nodes
    setNodes((nds) => nds.filter((n) => !n.selected));

    // Remove edges connected to selected nodes
    setEdges((eds) =>
      eds.filter((e) => !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target))
    );

    return count;
  }, [copy]);

  const paste = useCallback((
    getId: () => string,
    setNodes: (fn: (nodes: Node[]) => Node[]) => void,
    setEdges: (fn: (edges: Edge[]) => Edge[]) => void
  ) => {
    if (clipboardNodes.length === 0) return 0;

    // Create ID mapping for new nodes
    const idMapping = new Map<string, string>();
    clipboardNodes.forEach((node) => {
      idMapping.set(node.id, getId());
    });

    // Create new nodes with new IDs and offset position
    const newNodes = clipboardNodes.map((node) => ({
      ...node,
      id: idMapping.get(node.id)!,
      position: {
        x: node.position.x + 30,
        y: node.position.y + 30,
      },
      selected: true,
      data: { ...node.data },
    }));

    // Create new edges with updated IDs
    const newEdges = clipboardEdges.map((edge) => ({
      ...edge,
      id: `${idMapping.get(edge.source)}-${idMapping.get(edge.target)}`,
      source: idMapping.get(edge.source)!,
      target: idMapping.get(edge.target)!,
    }));

    // Deselect existing nodes and add new ones
    setNodes((nds) => [
      ...nds.map((n) => ({ ...n, selected: false })),
      ...newNodes,
    ]);

    // Add new edges
    setEdges((eds) => [...eds, ...newEdges]);

    // Update clipboard positions for subsequent pastes
    setClipboard(newNodes, newEdges);

    return newNodes.length;
  }, [clipboardNodes, clipboardEdges, setClipboard]);

  return { copy, cut, paste, hasClipboard };
}
