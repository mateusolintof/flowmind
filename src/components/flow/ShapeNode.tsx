'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { NodeProps, NodeResizer, Handle, Position, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useFlowStore } from '@/store/flowStore';
import { SHAPE_COLORS } from '@/config/nodeColors';
import { SHAPE_PADDING, MIN_SHAPE_SIZE, ARROW_HEAD_LENGTH, ARROW_HEAD_ANGLE } from '@/config/drawingConstants';
import { NODE_RESIZER_HANDLE_STYLE, NODE_RESIZER_LINE_STYLE } from './nodeStyles';
import type { ShapeNodeData } from '@/types/flowNodes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ShapeNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as ShapeNodeData;
  const { setNodes } = useReactFlow();
  const markDirty = useFlowStore((s) => s.markDirty);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    shapeType = 'rectangle',
    color = '#64748b',
    strokeWidth = 2,
    fill = false,
    width = 100,
    height = 100,
    startX = 0,
    startY = 0,
    endX = 100,
    endY = 0,
  } = nodeData;

  const onColorChange = useCallback((newColor: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, color: newColor } }
          : node
      )
    );
    setShowColorPicker(false);
    markDirty();
  }, [id, setNodes, markDirty]);

  const toggleFill = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, fill: !fill } }
          : node
      )
    );
    markDirty();
  }, [id, setNodes, fill, markDirty]);

  // Render the appropriate shape
  const shapeElement = useMemo(() => {
    switch (shapeType) {
      case 'rectangle':
        return (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width - strokeWidth}
            height={height - strokeWidth}
            rx={4}
            ry={4}
            fill={fill ? `${color}20` : 'none'}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={(width - strokeWidth) / 2}
            ry={(height - strokeWidth) / 2}
            fill={fill ? `${color}20` : 'none'}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );

      case 'line':
        return (
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );

      case 'arrow':
        // Calculate arrow head
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);

        const arrowX1 = endX - ARROW_HEAD_LENGTH * Math.cos(angle - ARROW_HEAD_ANGLE);
        const arrowY1 = endY - ARROW_HEAD_LENGTH * Math.sin(angle - ARROW_HEAD_ANGLE);
        const arrowX2 = endX - ARROW_HEAD_LENGTH * Math.cos(angle + ARROW_HEAD_ANGLE);
        const arrowY2 = endY - ARROW_HEAD_LENGTH * Math.sin(angle + ARROW_HEAD_ANGLE);

        return (
          <g>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <path
              d={`M ${endX} ${endY} L ${arrowX1} ${arrowY1} M ${endX} ${endY} L ${arrowX2} ${arrowY2}`}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      default:
        return null;
    }
  }, [shapeType, color, strokeWidth, fill, width, height, startX, startY, endX, endY]);

  // Calculate SVG viewBox
  const viewBox = useMemo(() => {
    if (shapeType === 'line' || shapeType === 'arrow') {
      const minX = Math.min(startX, endX) - SHAPE_PADDING;
      const minY = Math.min(startY, endY) - SHAPE_PADDING;
      const maxX = Math.max(startX, endX) + SHAPE_PADDING;
      const maxY = Math.max(startY, endY) + SHAPE_PADDING;
      return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    }
    return `0 0 ${width} ${height}`;
  }, [shapeType, width, height, startX, startY, endX, endY]);

  // Calculate SVG dimensions
  const svgDimensions = useMemo(() => {
    if (shapeType === 'line' || shapeType === 'arrow') {
      const w = Math.abs(endX - startX) + SHAPE_PADDING * 2;
      const h = Math.abs(endY - startY) + SHAPE_PADDING * 2;
      return { width: Math.max(w, SHAPE_PADDING * 2), height: Math.max(h, SHAPE_PADDING * 2) };
    }
    return { width, height };
  }, [shapeType, width, height, startX, startY, endX, endY]);

  // Determine if shape should have handles (rectangles and ellipses yes, lines/arrows optional)
  const hasHandles = shapeType === 'rectangle' || shapeType === 'ellipse';
  const shapeHandleClassName = '!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity';

  return (
    <div
      className={cn(
        'shape-node relative group',
        selected && 'ring-2 ring-primary ring-offset-2 rounded'
      )}
      style={{
        width: svgDimensions.width,
        height: svgDimensions.height,
      }}
    >
      {(shapeType === 'rectangle' || shapeType === 'ellipse') && (
        <NodeResizer
          isVisible={selected}
          minWidth={MIN_SHAPE_SIZE}
          minHeight={MIN_SHAPE_SIZE}
          maxWidth={800}
          maxHeight={600}
          handleStyle={NODE_RESIZER_HANDLE_STYLE}
          lineStyle={NODE_RESIZER_LINE_STYLE}
        />
      )}

      {/* Handles for connecting shapes */}
      {hasHandles && (
        <>
          <Handle
            id="target-top"
            type="target"
            position={Position.Top}
            className={shapeHandleClassName}
            style={{ top: -5 }}
          />
          <Handle
            id="target-left"
            type="target"
            position={Position.Left}
            className={shapeHandleClassName}
            style={{ left: -5 }}
          />
          <Handle
            id="source-right"
            type="source"
            position={Position.Right}
            className={shapeHandleClassName}
            style={{ right: -5 }}
          />
          <Handle
            id="source-bottom"
            type="source"
            position={Position.Bottom}
            className={shapeHandleClassName}
            style={{ bottom: -5 }}
          />
        </>
      )}

      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        className="overflow-visible"
      >
        {shapeElement}
      </svg>

      {/* Color picker and fill toggle - appears on selection */}
      {selected && (shapeType === 'rectangle' || shapeType === 'ellipse') && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1 border nodrag">
          {/* Fill toggle */}
          <button
            onClick={toggleFill}
            className={cn(
              'w-5 h-5 rounded border-2 text-[10px] font-medium transition-colors',
              fill ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200'
            )}
            title={fill ? 'Remove fill' : 'Add fill'}
          >
            {fill ? 'F' : 'O'}
          </button>

          {/* Color picker */}
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <button
                className="w-5 h-5 rounded-full border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title="Change color"
              />
            </PopoverTrigger>
            <PopoverContent className="w-36 p-2" align="center">
              <div className="text-xs font-medium text-muted-foreground mb-2">Color</div>
              <div className="grid grid-cols-6 gap-1">
                {SHAPE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onColorChange(c.value)}
                    className={cn(
                      'w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform',
                      color === c.value ? 'border-slate-900' : 'border-white'
                    )}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default memo(ShapeNode);
