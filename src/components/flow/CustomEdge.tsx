'use client';

import { memo, useMemo } from 'react';
import {
    EdgeProps,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    EdgeLabelRenderer,
    BaseEdge,
} from '@xyflow/react';
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
    const edgeData = data as CustomEdgeData | undefined;

    const styleType = edgeData?.styleType || 'bezier';
    const color = edgeData?.color || 'hsl(var(--muted-foreground))';
    const label = edgeData?.label || '';
    const animated = edgeData?.animated || false;

    // Memoize path calculation - only recalculate when positions change
    const { edgePath, labelX, labelY } = useMemo(() => {
        let path: string;
        let lx: number;
        let ly: number;

        switch (styleType) {
            case 'smoothstep':
                [path, lx, ly] = getSmoothStepPath({
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
                [path, lx, ly] = getStraightPath({
                    sourceX,
                    sourceY,
                    targetX,
                    targetY,
                });
                break;
            case 'bezier':
            default:
                [path, lx, ly] = getBezierPath({
                    sourceX,
                    sourceY,
                    sourcePosition,
                    targetX,
                    targetY,
                    targetPosition,
                });
                break;
        }

        return { edgePath: path, labelX: lx, labelY: ly };
    }, [styleType, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]);

    // Memoize style object to prevent re-renders
    const edgeStyle = useMemo(() => ({
        stroke: selected ? 'hsl(var(--primary))' : color,
        strokeWidth: selected ? 2.5 : 1.5,
    }), [selected, color]);

    return (
        <>
            {/* Main edge with CSS hover effect */}
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={edgeStyle}
                className={cn(
                    'custom-edge-path',
                    animated && 'react-flow__edge-path-animated',
                )}
                interactionWidth={20}
            />

            {/* Edge Label - only render if there's a label or selected */}
            {(label || selected) && (
                <EdgeLabelRenderer>
                    <div
                        className={cn(
                            "absolute pointer-events-auto nodrag nopan",
                            "px-2 py-1 text-xs rounded-md shadow-sm",
                            "transition-all duration-150",
                            "edge-label",
                            selected
                                ? "bg-background border-2 border-primary"
                                : "bg-muted/80 border border-border",
                        )}
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        }}
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
