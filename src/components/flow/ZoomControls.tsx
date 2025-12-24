'use client';

import { useReactFlow, useStore } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function ZoomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const zoom = useStore((state) => state.transform[2]);
    const zoomPercent = Math.round(zoom * 100);

    return (
        <TooltipProvider>
            <div className="bg-background border rounded-md flex items-center shadow-sm">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => zoomOut()}
                            className="h-8 w-8 p-0 rounded-none rounded-l-md"
                            aria-label="Zoom out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p className="text-xs">Zoom out</p>
                    </TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-4 bg-border" />

                <div className="px-2 text-xs font-mono text-muted-foreground min-w-[48px] text-center select-none">
                    {zoomPercent}%
                </div>

                <div className="w-[1px] h-4 bg-border" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => zoomIn()}
                            className="h-8 w-8 p-0 rounded-none"
                            aria-label="Zoom in"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p className="text-xs">Zoom in</p>
                    </TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-4 bg-border" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => fitView({ padding: 0.2, duration: 200 })}
                            className="h-8 w-8 p-0 rounded-none rounded-r-md"
                            aria-label="Fit view"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p className="text-xs">Fit to view</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
