import { get, set } from 'idb-keyval';
import { Edge, Node, Viewport } from '@xyflow/react';

const STORAGE_KEY = 'flowmind-canvas';

export type FlowState = {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
    updatedAt: number;
};

export const saveFlow = async (state: FlowState) => {
    await set(STORAGE_KEY, state);
};

export const loadFlow = async (): Promise<FlowState | null> => {
    return await get(STORAGE_KEY);
};
