'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useFlowStore } from '@/store/flowStore';
import { getSvgPathFromStroke } from '@/utils/drawing/getSvgPathFromStroke';
import { SHAPE_COLORS } from '@/config/nodeColors';
import type { StrokeNodeData } from '@/types/flowNodes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

const STROKE_SIZE_PRESETS = [
  { value: 2, label: 'S' },
  { value: 4, label: 'M' },
  { value: 8, label: 'L' },
  { value: 12, label: 'XL' },
];

const OPACITY_PRESETS = [
  { value: 0.3, label: '30%' },
  { value: 0.5, label: '50%' },
  { value: 0.8, label: '80%' },
  { value: 1, label: '100%' },
];

const StrokeNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as StrokeNodeData;
  const { setNodes } = useReactFlow();
  const markDirty = useFlowStore((s) => s.markDirty);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [showOpacityPicker, setShowOpacityPicker] = useState(false);

  const {
    points = [],
    color = '#64748b',
    strokeWidth = 4,
    opacity = 0.8,
  } = nodeData;

  // Generate SVG path
  const path = useMemo(() => {
    if (points.length < 2) return '';
    return getSvgPathFromStroke(points, { size: strokeWidth });
  }, [points, strokeWidth]);

  // Color change handler
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

  // Stroke width change handler
  const onStrokeWidthChange = useCallback((newWidth: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, strokeWidth: newWidth } }
          : node
      )
    );
    markDirty();
  }, [id, setNodes, markDirty]);

  // Opacity change handler
  const onOpacityChange = useCallback((newOpacity: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, opacity: newOpacity } }
          : node
      )
    );
    markDirty();
  }, [id, setNodes, markDirty]);

  return (
    <div
      className={cn(
        'stroke-node relative group',
        selected && 'ring-2 ring-primary ring-offset-2 rounded'
      )}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <svg
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <path
          d={path}
          fill={color}
          fillOpacity={opacity}
        />
      </svg>

      {/* Edit toolbar - appears on selection */}
      {selected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg px-2 py-1.5 border nodrag">
          {/* Color picker */}
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <button
                className="w-6 h-6 rounded-full border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform"
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

          <div className="w-[1px] h-4 bg-border mx-0.5" />

          {/* Stroke width picker */}
          <Popover open={showStrokePicker} onOpenChange={setShowStrokePicker}>
            <PopoverTrigger asChild>
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 transition-colors text-xs font-medium"
                title="Stroke width"
              >
                {strokeWidth}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="center">
              <div className="text-xs font-medium text-muted-foreground mb-2">Stroke Width</div>
              {/* Presets */}
              <div className="flex gap-1 mb-2">
                {STROKE_SIZE_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    size="sm"
                    variant={strokeWidth === preset.value ? 'secondary' : 'ghost'}
                    className={cn(
                      'flex-1 h-7 text-xs px-1',
                      strokeWidth === preset.value && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => onStrokeWidthChange(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              {/* +/- Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => onStrokeWidthChange(Math.max(1, strokeWidth - 1))}
                  disabled={strokeWidth <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-mono w-6 text-center">{strokeWidth}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => onStrokeWidthChange(Math.min(20, strokeWidth + 1))}
                  disabled={strokeWidth >= 20}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-[1px] h-4 bg-border mx-0.5" />

          {/* Opacity picker */}
          <Popover open={showOpacityPicker} onOpenChange={setShowOpacityPicker}>
            <PopoverTrigger asChild>
              <button
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 transition-colors text-[10px] font-medium"
                title="Opacity"
              >
                {Math.round(opacity * 100)}%
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-2" align="center">
              <div className="text-xs font-medium text-muted-foreground mb-2">Opacity</div>
              <div className="flex flex-wrap gap-1">
                {OPACITY_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    size="sm"
                    variant={opacity === preset.value ? 'secondary' : 'ghost'}
                    className={cn(
                      'flex-1 h-7 text-xs px-1',
                      opacity === preset.value && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => onOpacityChange(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default memo(StrokeNode);
