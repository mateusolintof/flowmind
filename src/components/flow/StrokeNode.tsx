'use client';

import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { getSvgPathFromStroke } from '@/utils/drawing/getSvgPathFromStroke';

const StrokeNode = ({ data, selected }: NodeProps) => {
    const path = getSvgPathFromStroke(data.points as number[][]);

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${selected ? 'bg-primary/5' : ''
                }`}
            style={{
                width: '100%',
                height: '100%',
                // We need to ensure the SVG is large enough or the node size matches the stroke bounding box
            }}
        >
            <svg
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
                <path
                    d={path}
                    fill={data.color as string || "var(--foreground)"}
                    fillOpacity={0.8}
                />
            </svg>
        </div>
    );
};

export default memo(StrokeNode);
