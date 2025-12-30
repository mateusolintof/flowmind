'use client';

import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FLOWCHART_NODE_CONFIG,
  FLOWCHART_VARIANTS,
  type FlowchartNodeData,
  type FlowchartVariant,
  type FlowchartNodeType,
} from '@/config/flowchartNodeTypes';

// Colors for inline picker
const NODE_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

const animationConfig = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

const FlowchartNode = ({ data, type, selected, id }: NodeProps) => {
  const nodeData = data as FlowchartNodeData;
  const config = FLOWCHART_NODE_CONFIG[type as FlowchartNodeType];
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { setNodes } = useReactFlow();

  // Get variant styles (use nodeData.variant if provided, otherwise use config default)
  const variant = nodeData.variant || config?.variant || 'default';
  const styles = FLOWCHART_VARIANTS[variant as FlowchartVariant] || FLOWCHART_VARIANTS.default;
  const IconComponent = config?.icon;

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

  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, description: newDescription } }
          : node
      )
    );
  }, [id, setNodes]);

  const onColorChange = useCallback((newColor: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, color: newColor || undefined } }
          : node
      )
    );
    setShowColorPicker(false);
  }, [id, setNodes]);

  // Handle color override from data
  const customColor = nodeData.color;
  const bgStyle = customColor
    ? { backgroundColor: `${customColor}20`, borderColor: customColor }
    : {};

  return (
    <motion.div
      {...animationConfig}
      className={cn(
        'relative px-4 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm',
        'min-w-[180px] max-w-[280px]',
        !customColor && styles.bg,
        !customColor && styles.border,
        'hover:shadow-xl hover:scale-[1.02] transition-all duration-200',
        'cursor-pointer group',
        selected && 'ring-2 ring-ring ring-offset-2'
      )}
      style={customColor ? bgStyle : undefined}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={60}
        maxWidth={400}
        maxHeight={300}
        handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
        lineStyle={{ border: 0 }}
      />

      {/* Handles - all 4 sides */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white"
      />

      {/* Content */}
      <div className="flex items-start gap-3">
        {/* Icon Badge */}
        {IconComponent && (
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md',
              !customColor && styles.iconBg
            )}
            style={customColor ? { backgroundColor: customColor } : undefined}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Label - Editable */}
          {isEditing ? (
            <textarea
              className={cn(
                'text-sm font-semibold leading-tight bg-transparent border-none resize-none',
                'focus:outline-none w-full nodrag',
                !customColor && styles.text
              )}
              value={nodeData.label || ''}
              onChange={onLabelChange}
              onBlur={() => setIsEditing(false)}
              autoFocus
              placeholder="Label..."
              rows={1}
            />
          ) : (
            <div
              className={cn(
                'text-sm font-semibold leading-tight cursor-text',
                !customColor && styles.text
              )}
              onClick={() => setIsEditing(true)}
            >
              {nodeData.label || 'Click to edit...'}
            </div>
          )}

          {/* Description - Shows on hover or when editing */}
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

      {/* Type indicator */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <span className="text-[9px] bg-white/90 px-1.5 py-0.5 rounded text-slate-500 capitalize shadow-sm">
          {type?.replace('flowchart-', '')}
        </span>
      </div>

      {/* Color picker - appears on selection */}
      {selected && (
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <button
              className="absolute -bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform nodrag"
              style={{ backgroundColor: customColor || styles.color }}
              title="Change color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="end">
            <div className="text-xs font-medium text-muted-foreground mb-2">Node Color</div>
            <div className="grid grid-cols-6 gap-1">
              {NODE_COLORS.map((c) => (
                <button
                  key={c.value || 'default'}
                  onClick={() => onColorChange(c.value)}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform',
                    c.value === '' && 'bg-gradient-to-br from-slate-200 to-slate-400',
                    (customColor || '') === c.value ? 'border-slate-900 ring-1 ring-offset-1 ring-slate-400' : 'border-white'
                  )}
                  style={c.value ? { backgroundColor: c.value } : undefined}
                  title={c.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl -z-10',
          !customColor && styles.iconBg
        )}
        style={customColor ? { backgroundColor: customColor } : undefined}
      />
    </motion.div>
  );
};

export default memo(FlowchartNode);
