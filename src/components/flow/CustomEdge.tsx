'use client';

import { memo, useState, useCallback } from 'react';
import {
    EdgeProps,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    EdgeLabelRenderer,
    BaseEdge,
} from '@xyflow/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EdgeStyleType = 'bezier' | 'smoothstep' | 'straight';

export interface CustomEdgeData {
    label?: string;
    color?: string;
    animated?: boolean;
    styleType?: EdgeStyleType;
}

const CustomEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    markerEnd,
}: EdgeProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const edgeData = data as CustomEdgeData | undefined;

    const styleType = edgeData?.styleType || 'bezier';
    const color = edgeData?.color || 'hsl(var(--muted-foreground))';
    const label = edgeData?.label || '';
    const animated = edgeData?.animated || false;

    // Get path based on style type
    let edgePath: string;
    let labelX: number;
    let labelY: number;

    switch (styleType) {
        case 'smoothstep':
            [edgePath, labelX, labelY] = getSmoothStepPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
                borderRadius: 8,
            });
            break;
        case 'straight':
            [edgePath, labelX, labelY] = getStraightPath({
                sourceX,
                sourceY,
                targetX,
                targetY,
            });
            break;
        case 'bezier':
        default:
            [edgePath, labelX, labelY] = getBezierPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            });
            break;
    }

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: selected ? 'hsl(var(--primary))' : color,
                    strokeWidth: selected || isHovered ? 2.5 : 1.5,
                    transition: 'stroke-width 0.15s ease',
                }}
                className={cn(
                    animated && 'react-flow__edge-path-animated',
                )}
                interactionWidth={20}
            />

            {/* Invisible wider path for easier hover/selection */}
            <path
                d={edgePath}
                fill="none"
                strokeWidth={20}
                stroke="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            {/* Edge Label */}
            {(label || selected || isHovered) && (
                <EdgeLabelRenderer>
                    <div
                        className={cn(
                            "absolute pointer-events-auto nodrag nopan",
                            "px-2 py-1 text-xs rounded-md shadow-sm",
                            "transition-all duration-150",
                            selected || isHovered
                                ? "bg-background border-2 border-primary"
                                : "bg-muted/80 border border-border",
                        )}
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {label || (
                            <span className="text-muted-foreground italic">
                                {selected ? 'Click to add label' : ''}
                            </span>
                        )}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
