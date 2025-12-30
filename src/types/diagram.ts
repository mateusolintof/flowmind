import type { Node, Edge, Viewport } from '@xyflow/react';

export type DiagramContent = {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
};

export type FlowState = Omit<DiagramContent, 'viewport'> & {
  viewport: Viewport;
  updatedAt: number;
};

export type Diagram = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type DiagramWithData = Diagram & {
  data: FlowState;
};

export type FlowMetadata = {
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: string;
};

export type FlowData = DiagramContent & {
  metadata?: FlowMetadata;
};
