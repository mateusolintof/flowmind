'use client';

import { memo } from 'react';
import { useFlowStore, useStrokeWidth, useDrawingTool } from '@/store/flowStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const STROKE_PRESETS = [
  { value: 2, label: 'S' },
  { value: 4, label: 'M' },
  { value: 8, label: 'L' },
  { value: 12, label: 'XL' },
];

function StrokeWidthPicker() {
  const strokeWidth = useStrokeWidth();
  const setStrokeWidth = useFlowStore((s) => s.setStrokeWidth);
  const drawingTool = useDrawingTool();
  const isDrawing = useFlowStore((s) => s.isDrawing);

  // Only show when drawing tools are active (not select)
  if (!isDrawing || drawingTool === 'select') {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 gap-1.5"
          title="Stroke Width"
        >
          <Minus className="h-4 w-4" style={{ strokeWidth: Math.min(strokeWidth / 2, 4) }} />
          <span className="text-xs w-4">{strokeWidth}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-3" align="center">
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">Stroke Width</div>

          {/* Presets */}
          <div className="flex gap-1">
            {STROKE_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                size="sm"
                variant={strokeWidth === preset.value ? 'secondary' : 'ghost'}
                className={cn(
                  'flex-1 h-8 text-xs px-1',
                  strokeWidth === preset.value && 'bg-primary/10 text-primary'
                )}
                onClick={() => setStrokeWidth(preset.value)}
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
              className="h-8 w-8 p-0"
              onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
              disabled={strokeWidth <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-lg font-mono w-8 text-center">{strokeWidth}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setStrokeWidth(Math.min(20, strokeWidth + 1))}
              disabled={strokeWidth >= 20}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Preview */}
          <div className="border rounded-md p-2 bg-muted/30">
            <svg width="100%" height="24" viewBox="0 0 150 24">
              <line
                x1="10"
                y1="12"
                x2="140"
                y2="12"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default memo(StrokeWidthPicker);
