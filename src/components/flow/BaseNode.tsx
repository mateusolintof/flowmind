'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NODE_CONFIG, NodeType } from '@/config/nodeTypes';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const BaseNode = ({ data, type, selected }: NodeProps) => {
    const config = NODE_CONFIG[type as NodeType] || NODE_CONFIG.agent; // Fallback
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Card
                className={cn(
                    'w-40 shadow-sm border-2 transition-all',
                    config.color,
                    selected ? 'ring-2 ring-ring border-primary' : 'hover:border-primary/50'
                )}
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-3 h-3 bg-muted-foreground border-2 border-background"
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 bg-muted-foreground border-2 border-background"
                />

                <div className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded-md bg-background/50 border shadow-sm">
                        <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none text-foreground">{data.label as string || config.label}</span>
                        <span className="text-[10px] text-muted-foreground mt-1 capitalize">{type?.replace('-', ' ')}</span>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-3 h-3 bg-muted-foreground border-2 border-background"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-3 h-3 bg-muted-foreground border-2 border-background"
                />
            </Card>
        </motion.div>
    );
};

export default memo(BaseNode);
