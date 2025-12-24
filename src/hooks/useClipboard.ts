'use client';

import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

interface ClipboardData {
    nodes: Node[];
    edges: Edge[];
}

// Simple in-memory clipboard for nodes (security prevents real clipboard for complex objects)
let clipboardData: ClipboardData | null = null;

export function useClipboard() {
    const [hasClipboard, setHasClipboard] = useState(false);

    const copy = useCallback((nodes: Node[], edges: Edge[]) => {
        const selectedNodes = nodes.filter((n) => n.selected);
        if (selectedNodes.length === 0) return 0;

        const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

        // Only copy edges that connect selected nodes
        const selectedEdges = edges.filter(
            (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
        );

        clipboardData = {
            nodes: selectedNodes.map((n) => ({ ...n, data: { ...n.data } })),
            edges: selectedEdges.map((e) => ({ ...e })),
        };

        setHasClipboard(true);
        return selectedNodes.length;
    }, []);

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
        if (!clipboardData || clipboardData.nodes.length === 0) return 0;

        // Create ID mapping for new nodes
        const idMapping = new Map<string, string>();
        clipboardData.nodes.forEach((node) => {
            idMapping.set(node.id, getId());
        });

        // Create new nodes with new IDs and offset position
        const newNodes = clipboardData.nodes.map((node) => ({
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
        const newEdges = clipboardData.edges.map((edge) => ({
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
        clipboardData = {
            nodes: newNodes,
            edges: newEdges,
        };

        return newNodes.length;
    }, []);

    return { copy, cut, paste, hasClipboard };
}
