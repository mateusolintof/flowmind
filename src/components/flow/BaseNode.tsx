'use client';

import { memo, useCallback, useMemo } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { NODE_CONFIG, NodeType } from '@/config/nodeTypes';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Pre-computed animation config (outside component for stable reference)
const animationConfig = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring" as const, stiffness: 260, damping: 20 },
};

const BaseNode = ({ data, type, selected, id }: NodeProps) => {
  const config = NODE_CONFIG[type as NodeType] || NODE_CONFIG.note;
  const Icon = config.icon;
  const { setNodes } = useReactFlow();

  // Memoized callback to prevent re-renders
  const onLabelChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLabel = e.target.value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, [id, setNodes]);

  // Memoized style object to prevent re-renders
  const cardStyle = useMemo(() => {
    if (!data.color) return undefined;
    return {
      borderColor: data.color as string,
      backgroundColor: `${data.color}20`, // 20 = ~12% opacity in hex
    };
  }, [data.color]);

  return (
    <motion.div
      {...animationConfig}
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
          !data.color && config.color,
          selected ? 'ring-2 ring-ring border-primary' : 'hover:border-primary/50'
        )}
        style={cardStyle}
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
          <span className="text-[10px] text-muted-foreground mt-1 capitalize">
            {type?.replace('-', ' ')}
          </span>
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
