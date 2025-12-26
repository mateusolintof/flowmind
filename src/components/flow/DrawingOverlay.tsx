'use client';

import { memo, useState, useCallback } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { useFlowStore } from '@/store/flowStore';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { generateNodeId } from '@/utils/idGenerator';

interface DrawingOverlayProps {
  nodes: Node[];
  edges: any[];
  setNodes: (fn: (nodes: Node[]) => Node[]) => void;
}

/**
 * Overlay component for drawing mode.
 * Handles pointer events for freehand drawing.
 */
function DrawingOverlay({ nodes, edges, setNodes }: DrawingOverlayProps) {
  const { screenToFlowPosition } = useReactFlow();
  const { takeSnapshot } = useUndoRedo();

  // Get state from store
  const isDrawing = useFlowStore((s) => s.isDrawing);
  const selectedColor = useFlowStore((s) => s.selectedColor);
  const markDirty = useFlowStore((s) => s.markDirty);

  // Local state for current stroke
  const [isDrawingProcess, setIsDrawingProcess] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<number[][]>([]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawing) return;
    takeSnapshot(nodes, edges);
    setIsDrawingProcess(true);
    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setCurrentStroke([[x, y, e.pressure]]);
  }, [isDrawing, takeSnapshot, nodes, edges, screenToFlowPosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingProcess) return;
    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setCurrentStroke((points) => [...points, [x, y, e.pressure]]);
  }, [isDrawing, isDrawingProcess, screenToFlowPosition]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingProcess) return;
    setIsDrawingProcess(false);

    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const points = [...currentStroke, [x, y, e.pressure]];

    if (points.length < 2) return;

    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const relativePoints = points.map(([px, py, pr]) => [px - minX, py - minY, pr]);

    const newNode: Node = {
      id: generateNodeId(),
      type: 'stroke',
      position: { x: minX, y: minY },
      data: {
        points: relativePoints,
        color: selectedColor,
      },
      style: { width: maxX - minX, height: maxY - minY, zIndex: 1000 },
      draggable: true,
    };

    setNodes((nds) => nds.concat(newNode));
    setCurrentStroke([]);
    markDirty();
  }, [isDrawing, isDrawingProcess, screenToFlowPosition, currentStroke, selectedColor, setNodes, markDirty]);

  if (!isDrawing) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-50 transition-colors"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        pointerEvents: 'auto',
        cursor: 'crosshair',
      }}
    />
  );
}

export default memo(DrawingOverlay);
