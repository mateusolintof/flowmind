'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { NODE_CONFIG, NodeType } from '@/config/nodeTypes';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';

const BaseNode = ({ data, type, selected, id }: NodeProps) => {
    const config = NODE_CONFIG[type as NodeType] || NODE_CONFIG.note; // Fallback to note
    const Icon = config.icon;
    const { setNodes } = useReactFlow();

    // Auto-resize textarea logic could go here, but allowing manual node resize is better.

    const onLabelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newLabel = e.target.value;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            })
        );
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="h-full w-full"
        >
            <NodeResizer
                isVisible={selected}
                minWidth={100}
                minHeight={60}
                maxWidth={600}
                maxHeight={400}
                handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
                lineStyle={{ border: 0 }}
            />
            <Card
                className={cn(
                    'h-full min-w-[150px] min-h-[80px] shadow-sm border-2 transition-all flex flex-col',
                    // Only apply default config color if NO dynamic color is present
                    !data.color && config.color,
                    selected ? 'ring-2 ring-ring border-primary' : 'hover:border-primary/50'
                )}
                style={
                    data.color
                        ? {
                            borderColor: data.color as string,
                            backgroundColor: `${data.color} 20`, // 20 = ~12% opacity
                        }
                        : undefined
                }
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

                <div className="flex flex-col items-center justify-center p-4 gap-2 h-full w-full">
                    <Icon className="h-8 w-8 opacity-80 shrink-0" />
                    <textarea
                        className="text-sm font-medium text-center bg-transparent border-none resize-none focus:outline-hidden w-full h-full nodrag cursor-text"
                        value={(data.label as string) || ''}
                        onChange={onLabelChange}
                        placeholder="Label..."
                        style={{ color: 'inherit' }}
                    />
                    <span className="text-[10px] text-muted-foreground mt-1 capitalize">{type?.replace('-', ' ')}</span>
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
