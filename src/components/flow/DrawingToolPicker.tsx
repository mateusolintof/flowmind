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
import { ChevronDown } from 'lucide-react';
import { useFlowStore, useDrawingTool, useIsDrawing } from '@/store/flowStore';
import { cn } from '@/lib/utils';
import { DRAWING_TOOLS, DRAWING_TOOL_MAP } from '@/config/drawingTools';

function DrawingToolPicker() {
  const drawingTool = useDrawingTool();
  const isDrawing = useIsDrawing();
  const setDrawingTool = useFlowStore((s) => s.setDrawingTool);

  const currentTool = DRAWING_TOOL_MAP[drawingTool];
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
        {DRAWING_TOOLS.map((tool, index) => {
          const Icon = tool.icon;
          const isSelected = drawingTool === tool.tool;
          return (
            <div key={tool.tool}>
              <DropdownMenuItem
                onClick={() => setDrawingTool(tool.tool)}
                className={cn(
                  'gap-3 cursor-pointer',
                  isSelected && 'bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-muted-foreground">{tool.description}</div>
                </div>
                <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{tool.shortcut}</kbd>
              </DropdownMenuItem>
              {index === 0 && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(DrawingToolPicker);
