'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MousePointer2,
  Pencil,
  ArrowRight,
  Square,
  Circle,
  Minus,
  ChevronDown,
} from 'lucide-react';
import { useFlowStore, useDrawingTool, useIsDrawing, type DrawingTool } from '@/store/flowStore';
import { cn } from '@/lib/utils';

interface ToolConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
  description: string;
}

const TOOLS: Record<DrawingTool, ToolConfig> = {
  select: {
    icon: MousePointer2,
    label: 'Select',
    shortcut: 'V',
    description: 'Select and move elements',
  },
  freehand: {
    icon: Pencil,
    label: 'Freehand',
    shortcut: 'P',
    description: 'Draw freehand strokes',
  },
  arrow: {
    icon: ArrowRight,
    label: 'Arrow',
    shortcut: 'A',
    description: 'Draw arrows',
  },
  rectangle: {
    icon: Square,
    label: 'Rectangle',
    shortcut: 'R',
    description: 'Draw rectangles',
  },
  ellipse: {
    icon: Circle,
    label: 'Ellipse',
    shortcut: 'O',
    description: 'Draw circles and ellipses',
  },
  line: {
    icon: Minus,
    label: 'Line',
    shortcut: 'L',
    description: 'Draw straight lines',
  },
};

function DrawingToolPicker() {
  const drawingTool = useDrawingTool();
  const isDrawing = useIsDrawing();
  const setDrawingTool = useFlowStore((s) => s.setDrawingTool);

  const currentTool = TOOLS[drawingTool];
  const CurrentIcon = currentTool.icon;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isDrawing ? 'secondary' : 'outline'}
              size="sm"
              className={cn(
                'gap-1.5 h-8 px-2',
                isDrawing && 'bg-primary/10 border-primary/50'
              )}
            >
              <CurrentIcon className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">{currentTool.label}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Drawing Tools</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Drawing Tools
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Select tool */}
        <DropdownMenuItem
          onClick={() => setDrawingTool('select')}
          className={cn(
            'gap-3 cursor-pointer',
            drawingTool === 'select' && 'bg-accent'
          )}
        >
          <MousePointer2 className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium text-sm">Select</div>
            <div className="text-xs text-muted-foreground">Select and move elements</div>
          </div>
          <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded">V</kbd>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Drawing tools */}
        {(Object.entries(TOOLS) as [DrawingTool, ToolConfig][])
          .filter(([key]) => key !== 'select')
          .map(([key, tool]) => {
            const Icon = tool.icon;
            return (
              <DropdownMenuItem
                key={key}
                onClick={() => setDrawingTool(key)}
                className={cn(
                  'gap-3 cursor-pointer',
                  drawingTool === key && 'bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-muted-foreground">{tool.description}</div>
                </div>
                <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{tool.shortcut}</kbd>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(DrawingToolPicker);
