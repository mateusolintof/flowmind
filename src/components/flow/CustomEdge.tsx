'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import {
    EdgeProps,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath,
    EdgeLabelRenderer,
    BaseEdge,
    useReactFlow,
} from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useFlowStore } from '@/store/flowStore';

export type EdgeStyleType = 'bezier' | 'smoothstep' | 'straight';

// Preset label styles for quick selection
export const EDGE_LABEL_PRESETS = {
    success: { bg: '#dcfce7', text: '#166534', label: 'Success' },
    warning: { bg: '#fef3c7', text: '#92400e', label: 'Warning' },
    error: { bg: '#fee2e2', text: '#991b1b', label: 'Error' },
    info: { bg: '#dbeafe', text: '#1e40af', label: 'Info' },
    neutral: { bg: '#f1f5f9', text: '#475569', label: 'Neutral' },
} as const;

export type EdgeLabelPreset = keyof typeof EDGE_LABEL_PRESETS;

export interface CustomEdgeData {
    label?: string;
    color?: string;
    animated?: boolean;
    styleType?: EdgeStyleType;
    labelBgColor?: string;
    labelTextColor?: string;
    labelPreset?: EdgeLabelPreset;
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
    const { setEdges } = useReactFlow();
    const markDirty = useFlowStore((s) => s.markDirty);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const styleType = edgeData?.styleType || 'bezier';
    const color = edgeData?.color || 'var(--muted-foreground)';
    const label = edgeData?.label || '';
    const animated = edgeData?.animated || false;

    // Get label colors from preset or custom values
    const labelPreset = edgeData?.labelPreset;
    const presetColors = labelPreset ? EDGE_LABEL_PRESETS[labelPreset] : null;
    const labelBgColor = edgeData?.labelBgColor || presetColors?.bg;
    const labelTextColor = edgeData?.labelTextColor || presetColors?.text;

    // Handle label edit start
    const handleLabelClick = useCallback(() => {
        if (selected) {
            setEditValue(label);
            setIsEditing(true);
        }
    }, [selected, label]);

    // Handle label change
    const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    }, []);

    // Handle label save
    const handleLabelSave = useCallback(() => {
        setEdges((edges) =>
            edges.map((edge) =>
                edge.id === id
                    ? { ...edge, data: { ...edge.data, label: editValue } }
                    : edge
            )
        );
        markDirty();
        setIsEditing(false);
    }, [id, editValue, setEdges, markDirty]);

    // Handle key press
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLabelSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }, [handleLabelSave]);

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
        stroke: selected ? 'var(--primary)' : color,
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
                            "px-2.5 py-1 text-xs rounded-md shadow-sm",
                            "transition-all duration-150 cursor-pointer",
                            "edge-label font-semibold",
                            selected && !labelBgColor && "ring-2 ring-primary ring-offset-1",
                            !labelBgColor && (selected
                                ? "bg-background border border-primary"
                                : "bg-muted/90 border border-border"),
                        )}
                        style={{
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                            ...(labelBgColor && {
                                backgroundColor: labelBgColor,
                                color: labelTextColor || '#1f2937',
                                border: 'none',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }),
                        }}
                        onClick={handleLabelClick}
                    >
                        {isEditing ? (
                            <input
                                type="text"
                                value={editValue}
                                onChange={handleLabelChange}
                                onBlur={handleLabelSave}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent border-none outline-none w-20 text-center text-xs font-semibold"
                                autoFocus
                                style={{ color: labelTextColor || 'inherit' }}
                            />
                        ) : (
                            label || (
                                <span className="text-muted-foreground italic font-normal">
                                    {selected ? '+ Add label' : ''}
                                </span>
                            )
                        )}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
