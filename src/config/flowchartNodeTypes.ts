import {
  Play,
  Square,
  Diamond,
  Database,
  StopCircle,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  User,
  Settings,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Flowchart node variants with styling
export const FLOWCHART_VARIANTS = {
  input: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/80',
    border: 'border-emerald-300',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-900',
    color: '#10b981', // for minimap
  },
  primary: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/80',
    border: 'border-blue-400',
    iconBg: 'bg-blue-600',
    text: 'text-blue-900',
    color: '#3b82f6',
  },
  decision: {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/80',
    border: 'border-amber-400',
    iconBg: 'bg-amber-500',
    text: 'text-amber-900',
    color: '#f59e0b',
  },
  output: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/80',
    border: 'border-purple-400',
    iconBg: 'bg-purple-600',
    text: 'text-purple-900',
    color: '#a855f7',
  },
  default: {
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100/80',
    border: 'border-slate-300',
    iconBg: 'bg-slate-500',
    text: 'text-slate-800',
    color: '#64748b',
  },
} as const;

export type FlowchartVariant = keyof typeof FLOWCHART_VARIANTS;

// Flowchart node type configuration
export interface FlowchartNodeConfig {
  label: string;
  icon: LucideIcon;
  variant: FlowchartVariant;
  tooltip: string;
  category: 'flowchart';
}

export const FLOWCHART_NODE_CONFIG: Record<string, FlowchartNodeConfig> = {
  'flowchart-start': {
    label: 'Start',
    icon: Play,
    variant: 'input',
    tooltip: 'Starting point of the flowchart',
    category: 'flowchart',
  },
  'flowchart-end': {
    label: 'End',
    icon: StopCircle,
    variant: 'output',
    tooltip: 'End point of the flowchart',
    category: 'flowchart',
  },
  'flowchart-process': {
    label: 'Process',
    icon: Square,
    variant: 'primary',
    tooltip: 'A process, action, or operation step',
    category: 'flowchart',
  },
  'flowchart-decision': {
    label: 'Decision',
    icon: Diamond,
    variant: 'decision',
    tooltip: 'A decision or branching point (yes/no)',
    category: 'flowchart',
  },
  'flowchart-data': {
    label: 'Data',
    icon: Database,
    variant: 'default',
    tooltip: 'Data input, output, or storage',
    category: 'flowchart',
  },
  'flowchart-io': {
    label: 'Input/Output',
    icon: MessageSquare,
    variant: 'input',
    tooltip: 'User input or system output',
    category: 'flowchart',
  },
  'flowchart-condition': {
    label: 'Condition',
    icon: HelpCircle,
    variant: 'decision',
    tooltip: 'Conditional check or validation',
    category: 'flowchart',
  },
  'flowchart-action': {
    label: 'Action',
    icon: Zap,
    variant: 'primary',
    tooltip: 'An action or task to be performed',
    category: 'flowchart',
  },
  'flowchart-result': {
    label: 'Result',
    icon: CheckCircle2,
    variant: 'output',
    tooltip: 'Result or outcome of a process',
    category: 'flowchart',
  },
  'flowchart-user': {
    label: 'User Action',
    icon: User,
    variant: 'input',
    tooltip: 'User interaction or manual step',
    category: 'flowchart',
  },
  'flowchart-system': {
    label: 'System',
    icon: Settings,
    variant: 'default',
    tooltip: 'System process or automated step',
    category: 'flowchart',
  },
} as const;

export type FlowchartNodeType = keyof typeof FLOWCHART_NODE_CONFIG;

// Data structure for flowchart nodes
// Icon map for dynamic icon rendering
export const FLOWCHART_ICON_MAP: Record<string, LucideIcon> = {
  Play,
  StopCircle,
  Square,
  Diamond,
  Database,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  User,
  Settings,
  Zap,
};
