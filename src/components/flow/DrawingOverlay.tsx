'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';
import { useFlowStore, useDrawingTool, useStrokeWidth } from '@/store/flowStore';
import { useUndoRedo } from '@/hooks/diagrams/useUndoRedo';
import { generateNodeId } from '@/utils/diagram/idGenerator';
import { getSvgPathFromStroke } from '@/utils/drawing/getSvgPathFromStroke';
import type { ShapeNodeData } from '@/types/flowNodes';

interface DrawingOverlayProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (fn: (nodes: Node[]) => Node[]) => void;
}

interface DrawingState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * Overlay component for drawing mode.
 * Handles pointer events for freehand drawing and shape tools.
 */
function DrawingOverlay({ nodes, edges, setNodes }: DrawingOverlayProps) {
  const { screenToFlowPosition } = useReactFlow();
  const { takeSnapshot } = useUndoRedo();

  // Get state from store
  const isDrawing = useFlowStore((s) => s.isDrawing);
  const selectedColor = useFlowStore((s) => s.selectedColor);
  const markDirty = useFlowStore((s) => s.markDirty);
  const drawingTool = useDrawingTool();
  const strokeWidth = useStrokeWidth();

  // Local state for current drawing
  const [isDrawingProcess, setIsDrawingProcess] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<number[][]>([]);
  const [shapeState, setShapeState] = useState<DrawingState | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Hide default cursor when drawing (we show custom cursor indicator)
  const cursorStyle = useMemo(() => {
    if (drawingTool === 'select') return 'default';
    return 'none'; // Hide cursor, we show custom indicator
  }, [drawingTool]);

  // Track cursor for custom indicator
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseLeave = useCallback(() => {
    setCursorPos(null);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || drawingTool === 'select') return;

    takeSnapshot(nodes, edges);
    setIsDrawingProcess(true);
    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    if (drawingTool === 'freehand') {
      setCurrentStroke([[x, y, e.pressure]]);
    } else {
      // Shape tools: store start position
      setShapeState({
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
      });
    }
  }, [isDrawing, drawingTool, takeSnapshot, nodes, edges, screenToFlowPosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingProcess || drawingTool === 'select') return;

    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    if (drawingTool === 'freehand') {
      setCurrentStroke((points) => [...points, [x, y, e.pressure]]);
    } else {
      // Update current position for shape preview
      setShapeState((prev) => prev ? { ...prev, currentX: x, currentY: y } : null);
    }
  }, [isDrawing, isDrawingProcess, drawingTool, screenToFlowPosition]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingProcess || drawingTool === 'select') return;
    setIsDrawingProcess(false);

    const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    if (drawingTool === 'freehand') {
      // Handle freehand stroke
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
          color: selectedColor || '#64748b',
          strokeWidth: strokeWidth,
        },
        style: { width: maxX - minX, height: maxY - minY, zIndex: 1000 },
        draggable: true,
      };

      setNodes((nds) => nds.concat(newNode));
      setCurrentStroke([]);
    } else if (shapeState) {
      // Handle shape tools
      const { startX, startY } = shapeState;
      const endX = x;
      const endY = y;

      // Calculate bounds
      const minX = Math.min(startX, endX);
      const minY = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      // Minimum size check
      if (width < 10 && height < 10 && drawingTool !== 'line' && drawingTool !== 'arrow') {
        setShapeState(null);
        return;
      }

      let nodeData: ShapeNodeData;
      let nodeStyle: { width: number; height: number };

      if (drawingTool === 'rectangle' || drawingTool === 'ellipse') {
        nodeData = {
          shapeType: drawingTool,
          color: selectedColor || '#64748b',
          strokeWidth: 2,
          fill: false,
          width: Math.max(width, 30),
          height: Math.max(height, 30),
        };
        nodeStyle = { width: Math.max(width, 30), height: Math.max(height, 30) };
      } else {
        // Line or arrow - use relative coordinates
        const relStartX = startX - minX;
        const relStartY = startY - minY;
        const relEndX = endX - minX;
        const relEndY = endY - minY;

        nodeData = {
          shapeType: drawingTool as 'line' | 'arrow',
          color: selectedColor || '#64748b',
          strokeWidth: 2,
          startX: relStartX + 20, // Add padding
          startY: relStartY + 20,
          endX: relEndX + 20,
          endY: relEndY + 20,
        };
        nodeStyle = {
          width: Math.max(width, 40) + 40,
          height: Math.max(height, 40) + 40
        };
      }

      const newNode: Node = {
        id: generateNodeId(),
        type: 'shape',
        position: { x: minX - 20, y: minY - 20 },
        data: nodeData,
        style: { ...nodeStyle, zIndex: 1000 },
        draggable: true,
      };

      setNodes((nds) => nds.concat(newNode));
      setShapeState(null);
    }

    markDirty();
  }, [isDrawing, isDrawingProcess, drawingTool, screenToFlowPosition, currentStroke, selectedColor, strokeWidth, setNodes, markDirty, shapeState]);

  // Render preview for shapes during drawing
  const renderShapePreview = useMemo(() => {
    if (!isDrawingProcess || !shapeState || drawingTool === 'freehand' || drawingTool === 'select') {
      return null;
    }

    const { startX, startY, currentX, currentY } = shapeState;
    const color = selectedColor || '#64748b';

    switch (drawingTool) {
      case 'rectangle':
        return (
          <rect
            x={Math.min(startX, currentX)}
            y={Math.min(startY, currentY)}
            width={Math.abs(currentX - startX)}
            height={Math.abs(currentY - startY)}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="4"
            rx={4}
          />
        );
      case 'ellipse':
        const cx = (startX + currentX) / 2;
        const cy = (startY + currentY) / 2;
        const rx = Math.abs(currentX - startX) / 2;
        const ry = Math.abs(currentY - startY) / 2;
        return (
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="4"
          />
        );
      case 'line':
        return (
          <line
            x1={startX}
            y1={startY}
            x2={currentX}
            y2={currentY}
            stroke={color}
            strokeWidth={2}
            strokeDasharray="4"
            strokeLinecap="round"
          />
        );
      case 'arrow':
        // Calculate arrow head for preview
        const dx = currentX - startX;
        const dy = currentY - startY;
        const angle = Math.atan2(dy, dx);
        const arrowLength = 12;
        const arrowAngle = Math.PI / 6;
        const arrowX1 = currentX - arrowLength * Math.cos(angle - arrowAngle);
        const arrowY1 = currentY - arrowLength * Math.sin(angle - arrowAngle);
        const arrowX2 = currentX - arrowLength * Math.cos(angle + arrowAngle);
        const arrowY2 = currentY - arrowLength * Math.sin(angle + arrowAngle);

        return (
          <g>
            <line
              x1={startX}
              y1={startY}
              x2={currentX}
              y2={currentY}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="4"
              strokeLinecap="round"
            />
            <path
              d={`M ${currentX} ${currentY} L ${arrowX1} ${arrowY1} M ${currentX} ${currentY} L ${arrowX2} ${arrowY2}`}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      default:
        return null;
    }
  }, [isDrawingProcess, shapeState, drawingTool, selectedColor]);

  // Render freehand preview during drawing
  const renderFreehandPreview = useMemo(() => {
    if (!isDrawingProcess || drawingTool !== 'freehand' || currentStroke.length < 2) {
      return null;
    }
    const path = getSvgPathFromStroke(currentStroke, { size: strokeWidth });
    const color = selectedColor || '#64748b';
    return (
      <svg className="absolute inset-0 pointer-events-none overflow-visible w-full h-full">
        <path d={path} fill={color} fillOpacity={0.6} />
      </svg>
    );
  }, [isDrawingProcess, drawingTool, currentStroke, selectedColor, strokeWidth]);

  // Render cursor indicator with color and size
  const renderCursorIndicator = useMemo(() => {
    if (!cursorPos || drawingTool === 'select') return null;
    const color = selectedColor || '#64748b';
    const size = drawingTool === 'freehand' ? strokeWidth + 4 : 12;
    return (
      <div
        className="fixed pointer-events-none z-[100] rounded-full border-2 border-white shadow-md"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          width: size,
          height: size,
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          opacity: 0.8,
        }}
      />
    );
  }, [cursorPos, drawingTool, selectedColor, strokeWidth]);

  if (!isDrawing || drawingTool === 'select') {
    return null;
  }

  return (
    <>
      {/* Custom cursor indicator */}
      {renderCursorIndicator}

      <div
        className="absolute inset-0 z-50 transition-colors"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          pointerEvents: 'auto',
          cursor: cursorStyle,
        }}
      >
        {/* SVG overlay for shape preview */}
        {isDrawingProcess && shapeState && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            {renderShapePreview}
          </svg>
        )}

        {/* Freehand preview */}
        {renderFreehandPreview}
      </div>
    </>
  );
}

export default memo(DrawingOverlay);
