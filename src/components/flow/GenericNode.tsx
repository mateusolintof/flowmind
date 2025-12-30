'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFlowStore } from '@/store/flowStore';
import { GENERIC_NODE_COLORS } from '@/config/nodeColors';
import { GENERIC_NODE_ICONS } from '@/config/genericNode';
import { NODE_RESIZER_HANDLE_STYLE, NODE_RESIZER_LINE_STYLE, getFlowHandleClassName } from './nodeStyles';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Circle } from 'lucide-react';

export interface GenericNodeData {
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  [key: string]: unknown;
}

const animationConfig = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

const GenericNode = ({ data, selected, id }: NodeProps) => {
  const nodeData = data as GenericNodeData;
  const { setNodes } = useReactFlow();
  const markDirty = useFlowStore((s) => s.markDirty);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const color = nodeData.color || '#64748b';
  const iconKey = nodeData.icon || 'circle';
  const IconComponent = GENERIC_NODE_ICONS[iconKey] || Circle;

  const onLabelChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: e.target.value } }
          : node
      )
    );
    markDirty();
  }, [id, setNodes, markDirty]);

  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, description: e.target.value } }
          : node
      )
    );
    markDirty();
  }, [id, setNodes, markDirty]);

  const onIconChange = useCallback((newIcon: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, icon: newIcon } }
          : node
      )
    );
    setShowIconPicker(false);
    markDirty();
  }, [id, setNodes, markDirty]);

  const onColorChange = useCallback((newColor: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, color: newColor } }
          : node
      )
    );
    setShowColorPicker(false);
    markDirty();
  }, [id, setNodes, markDirty]);

  const handleClassName = getFlowHandleClassName(selected);

  return (
    <motion.div
      {...animationConfig}
      className={cn(
        'relative px-4 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm',
        'min-w-[160px] max-w-[300px]',
        'hover:shadow-xl hover:scale-[1.02] transition-all duration-200',
        'cursor-pointer group bg-white',
        selected && 'ring-2 ring-ring ring-offset-2'
      )}
      style={{
        borderColor: color,
        backgroundColor: `${color}10`,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={60}
        maxWidth={400}
        maxHeight={300}
        handleStyle={NODE_RESIZER_HANDLE_STYLE}
        lineStyle={NODE_RESIZER_LINE_STYLE}
      />

      {/* Handles - all 4 sides */}
      <Handle
        type="target"
        position={Position.Top}
        className={handleClassName}
      />
      <Handle
        type="target"
        position={Position.Left}
        className={handleClassName}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={handleClassName}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleClassName}
      />

      {/* Content */}
      <div className="flex items-start gap-3">
        {/* Icon Badge - Clickable to change */}
        <Popover open={showIconPicker} onOpenChange={setShowIconPicker}>
          <PopoverTrigger asChild>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:scale-110 transition-transform nodrag"
              style={{ backgroundColor: color }}
              title="Click to change icon"
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="text-xs font-medium text-muted-foreground mb-2">Select Icon</div>
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {Object.entries(GENERIC_NODE_ICONS).map(([key, Icon]) => (
                <button
                  key={key}
                  onClick={() => onIconChange(key)}
                  className={cn(
                    'p-1.5 rounded hover:bg-accent transition-colors',
                    iconKey === key && 'bg-accent ring-1 ring-primary'
                  )}
                  title={key}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Label - Editable */}
          {isEditing ? (
            <textarea
              className="text-sm font-semibold leading-tight bg-transparent border-none resize-none focus:outline-none w-full nodrag"
              style={{ color }}
              value={nodeData.label || ''}
              onChange={onLabelChange}
              onBlur={() => setIsEditing(false)}
              autoFocus
              placeholder="Label..."
              rows={1}
            />
          ) : (
            <div
              className="text-sm font-semibold leading-tight cursor-text"
              style={{ color }}
              onClick={() => setIsEditing(true)}
            >
              {nodeData.label || 'Click to edit...'}
            </div>
          )}

          {/* Description */}
          <div className={cn(
            'transition-all duration-200',
            (isEditingDesc || nodeData.description) ? 'mt-1' : '',
            !isEditingDesc && !nodeData.description && 'opacity-0 group-hover:opacity-100'
          )}>
            {isEditingDesc ? (
              <textarea
                className="text-xs text-slate-500 leading-snug bg-transparent border-none resize-none focus:outline-none w-full nodrag"
                value={nodeData.description || ''}
                onChange={onDescriptionChange}
                onBlur={() => setIsEditingDesc(false)}
                autoFocus
                placeholder="Add description..."
                rows={2}
              />
            ) : (
              <div
                className="text-xs text-slate-500 leading-snug cursor-text"
                onClick={() => setIsEditingDesc(true)}
              >
                {nodeData.description || (
                  <span className="italic opacity-50">+ Add description</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color picker - appears on selection */}
      {selected && (
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <button
              className="absolute -bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform nodrag"
              style={{ backgroundColor: color }}
              title="Change color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="text-xs font-medium text-muted-foreground mb-2">Select Color</div>
            <div className="grid grid-cols-6 gap-1">
              {GENERIC_NODE_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onColorChange(c.value)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform',
                    color === c.value ? 'border-slate-900 ring-1 ring-offset-1 ring-slate-400' : 'border-white'
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Type indicator */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <span className="text-[9px] bg-white/90 px-1.5 py-0.5 rounded text-slate-500 shadow-sm">
          generic
        </span>
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl -z-10"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

export default memo(GenericNode);
