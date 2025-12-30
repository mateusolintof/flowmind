import type { ComponentType } from 'react';
import {
  MousePointer2,
  Pencil,
  ArrowRight,
  Square,
  Circle,
  Minus,
} from 'lucide-react';
import type { DrawingTool } from '@/store/flowStore';

export interface DrawingToolConfig {
  tool: DrawingTool;
  icon: ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
  description: string;
}

export const DRAWING_TOOLS: DrawingToolConfig[] = [
  {
    tool: 'select',
    icon: MousePointer2,
    label: 'Select',
    shortcut: 'V',
    description: 'Select and move elements',
  },
  {
    tool: 'freehand',
    icon: Pencil,
    label: 'Freehand',
    shortcut: 'P',
    description: 'Draw freehand strokes',
  },
  {
    tool: 'arrow',
    icon: ArrowRight,
    label: 'Arrow',
    shortcut: 'A',
    description: 'Draw arrows',
  },
  {
    tool: 'rectangle',
    icon: Square,
    label: 'Rectangle',
    shortcut: 'R',
    description: 'Draw rectangles',
  },
  {
    tool: 'ellipse',
    icon: Circle,
    label: 'Ellipse',
    shortcut: 'O',
    description: 'Draw circles and ellipses',
  },
  {
    tool: 'line',
    icon: Minus,
    label: 'Line',
    shortcut: 'L',
    description: 'Draw straight lines',
  },
];

export const DRAWING_TOOL_MAP = DRAWING_TOOLS.reduce((acc, tool) => {
  acc[tool.tool] = tool;
  return acc;
}, {} as Record<DrawingTool, DrawingToolConfig>);

export const DRAWING_TOOL_SHORTCUTS = DRAWING_TOOLS.reduce((acc, tool) => {
  acc[tool.shortcut.toLowerCase()] = tool.tool;
  return acc;
}, {} as Record<string, DrawingTool>);
