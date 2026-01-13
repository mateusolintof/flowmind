import type { FlowchartVariant } from '@/config/flowchartNodeTypes';

export interface BaseNodeData {
  label: string;
  description?: string;
  color?: string;
  [key: string]: unknown;
}

export interface GenericNodeData {
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  [key: string]: unknown;
}

export type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'arrow';

export interface ShapeNodeData {
  shapeType: ShapeType;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  [key: string]: unknown;
}

export interface FlowchartNodeData {
  label: string;
  description?: string;
  icon?: string;
  variant?: FlowchartVariant;
  color?: string;
  [key: string]: unknown;
}

export interface StrokeNodeData {
  points: number[][];
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  [key: string]: unknown;
}
