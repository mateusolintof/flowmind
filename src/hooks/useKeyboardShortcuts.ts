'use client';

import { useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useFlowStore } from '@/store/flowStore';
import { useUndoRedo } from './useUndoRedo';
import { useClipboard } from './useClipboard';
import { generateNodeId } from '@/utils/idGenerator';
import { toast } from 'sonner';

interface UseKeyboardShortcutsProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (fn: (nodes: Node[]) => Node[]) => void;
  setEdges: (fn: (edges: Edge[]) => Edge[]) => void;
  onSave: () => void;
  onExport: () => void;
}

/**
 * Hook for handling keyboard shortcuts.
 * Extracted from FlowCanvas to reduce file size and improve maintainability.
 */
export function useKeyboardShortcuts({
  nodes,
  edges,
  setNodes,
  setEdges,
  onSave,
  onExport,
}: UseKeyboardShortcutsProps) {
  const { undo, redo, takeSnapshot } = useUndoRedo();
  const { copy, cut, paste } = useClipboard();

  // Get UI state and actions from store
  const isDrawing = useFlowStore((s) => s.isDrawing);
  const colorPickerOpen = useFlowStore((s) => s.colorPickerOpen);
  const toggleDrawing = useFlowStore((s) => s.toggleDrawing);
  const setColorPickerOpen = useFlowStore((s) => s.setColorPickerOpen);
  const setDrawingTool = useFlowStore((s) => s.setDrawingTool);
  const markDirty = useFlowStore((s) => s.markDirty);

  // Handle undo action
  const handleUndo = useCallback(() => {
    const prev = undo(nodes, edges);
    if (prev) {
      setNodes(() => prev.nodes);
      setEdges(() => prev.edges);
    }
  }, [undo, nodes, edges, setNodes, setEdges]);

  // Handle redo action
  const handleRedo = useCallback(() => {
    const next = redo(nodes, edges);
    if (next) {
      setNodes(() => next.nodes);
      setEdges(() => next.edges);
    }
  }, [redo, nodes, edges, setNodes, setEdges]);

  // Handle duplicate
  const handleDuplicate = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    if (selectedNodes.length > 0) {
      takeSnapshot(nodes, edges);
      const newNodes = selectedNodes.map((node) => ({
        ...node,
        id: generateNodeId(),
        position: {
          x: node.position.x + 20,
          y: node.position.y + 20,
        },
        selected: false,
        data: { ...node.data },
      }));
      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        ...newNodes.map((n) => ({ ...n, selected: true })),
      ]);
      markDirty();
      toast.success(`${selectedNodes.length} node${selectedNodes.length > 1 ? 's' : ''} duplicated`);
    }
  }, [nodes, edges, takeSnapshot, setNodes, markDirty]);

  // Handle copy
  const handleCopy = useCallback(() => {
    const copiedCount = copy(nodes, edges);
    if (copiedCount > 0) {
      toast.success(`${copiedCount} node${copiedCount > 1 ? 's' : ''} copied`);
    }
  }, [copy, nodes, edges]);

  // Handle cut
  const handleCut = useCallback(() => {
    takeSnapshot(nodes, edges);
    const cutCount = cut(nodes, edges, setNodes, setEdges);
    if (cutCount > 0) {
      markDirty();
      toast.success(`${cutCount} node${cutCount > 1 ? 's' : ''} cut`);
    }
  }, [takeSnapshot, cut, nodes, edges, setNodes, setEdges, markDirty]);

  // Handle paste
  const handlePaste = useCallback(() => {
    takeSnapshot(nodes, edges);
    const pastedCount = paste(generateNodeId, setNodes, setEdges);
    if (pastedCount > 0) {
      markDirty();
      toast.success(`${pastedCount} node${pastedCount > 1 ? 's' : ''} pasted`);
    }
  }, [takeSnapshot, nodes, edges, paste, setNodes, setEdges, markDirty]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl shortcuts (work even when typing)
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 's':
            e.preventDefault();
            onSave();
            break;
          case 'e':
            e.preventDefault();
            onExport();
            break;
          case 'd':
            e.preventDefault();
            handleDuplicate();
            break;
          case 'c':
            e.preventDefault();
            handleCopy();
            break;
          case 'x':
            e.preventDefault();
            handleCut();
            break;
          case 'v':
            e.preventDefault();
            handlePaste();
            break;
        }
        return;
      }

      // Single key shortcuts (only when not typing)
      if (isTyping) return;

      switch (e.key.toLowerCase()) {
        // Drawing tool shortcuts
        case 'v':
          e.preventDefault();
          setDrawingTool('select');
          break;
        case 'p':
          e.preventDefault();
          setDrawingTool('freehand');
          break;
        case 'a':
          e.preventDefault();
          setDrawingTool('arrow');
          break;
        case 'r':
          e.preventDefault();
          setDrawingTool('rectangle');
          break;
        case 'o':
          e.preventDefault();
          setDrawingTool('ellipse');
          break;
        case 'l':
          e.preventDefault();
          setDrawingTool('line');
          break;
        // Legacy toggle (now just toggles freehand)
        case 'd':
          e.preventDefault();
          toggleDrawing();
          break;
        case 'c':
          e.preventDefault();
          setColorPickerOpen(!colorPickerOpen);
          break;
        case 'escape':
          e.preventDefault();
          if (isDrawing) {
            setDrawingTool('select');
          }
          if (colorPickerOpen) {
            setColorPickerOpen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleDuplicate,
    handleCopy,
    handleCut,
    handlePaste,
    onSave,
    onExport,
    isDrawing,
    colorPickerOpen,
    toggleDrawing,
    setColorPickerOpen,
    setDrawingTool,
  ]);

  return {
    handleUndo,
    handleRedo,
    handleDuplicate,
    handleCopy,
    handleCut,
    handlePaste,
  };
}
