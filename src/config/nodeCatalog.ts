import { Sparkles } from 'lucide-react';
import { NODE_CONFIG, type NodeType } from '@/config/nodeTypes';
import { FLOWCHART_NODE_CONFIG, type FlowchartNodeType } from '@/config/flowchartNodeTypes';

// Config for special nodes not in the standard configs
export const SPECIAL_NODE_CONFIG = {
  generic: {
    label: 'Free Node',
    icon: Sparkles,
    tooltip: 'Fully customizable node - pick any icon and color',
    category: 'brainstorming' as const,
  },
} as const;

// Combined config for all node types
export const ALL_NODE_CONFIG = { ...NODE_CONFIG, ...FLOWCHART_NODE_CONFIG, ...SPECIAL_NODE_CONFIG };

export type AllNodeType = NodeType | FlowchartNodeType | keyof typeof SPECIAL_NODE_CONFIG;

export const NODE_CATEGORIES = [
  {
    name: 'Brainstorming',
    items: ['generic'] as AllNodeType[],
  },
  {
    name: 'Flowchart',
    items: [
      'flowchart-start',
      'flowchart-end',
      'flowchart-process',
      'flowchart-decision',
      'flowchart-data',
      'flowchart-io',
      'flowchart-condition',
      'flowchart-action',
      'flowchart-result',
      'flowchart-user',
      'flowchart-system',
    ] as AllNodeType[],
  },
  {
    name: 'AI Agents',
    items: ['agent', 'llm', 'tool', 'memory', 'input'] as AllNodeType[],
  },
  {
    name: 'Architecture',
    items: ['frontend', 'backend', 'database', 'cloud'] as AllNodeType[],
  },
  {
    name: 'General',
    items: ['user', 'note', 'container'] as AllNodeType[],
  },
] as const;

export const COLLAPSED_NODE_TYPES: AllNodeType[] = [
  'agent',
  'llm',
  'tool',
  'memory',
  'input',
  'frontend',
  'backend',
  'database',
  'cloud',
  'user',
  'note',
  'container',
];
