import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Node, Edge, Viewport } from '@xyflow/react';

export type DrawingTool = 'select' | 'freehand' | 'arrow' | 'rectangle' | 'ellipse' | 'line';

export interface FlowState {
  // Core state
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;

  // UI state
  isDrawing: boolean;
  drawingTool: DrawingTool;
  selectedColor: string;
  colorPickerOpen: boolean;
  snapToGrid: boolean;
  isDirty: boolean;

  // Diagram metadata
  currentDiagramId: string | null;
  currentDiagramName: string;

  // Actions
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setViewport: (viewport: Viewport) => void;

  updateNode: (id: string, data: Partial<Node['data']>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  removeNodes: (ids: string[]) => void;
  removeEdges: (ids: string[]) => void;

  setDrawing: (isDrawing: boolean) => void;
  toggleDrawing: () => void;
  setDrawingTool: (tool: DrawingTool) => void;
  setSelectedColor: (color: string) => void;
  setColorPickerOpen: (open: boolean) => void;
  toggleColorPicker: () => void;
  setSnapToGrid: (snap: boolean) => void;
  toggleSnapToGrid: () => void;

  markDirty: () => void;
  markClean: () => void;

  setCurrentDiagram: (id: string | null, name: string) => void;
  loadDiagram: (id: string, name: string, nodes: Node[], edges: Edge[], viewport: Viewport) => void;

  reset: () => void;
}

const initialState = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  isDrawing: false,
  drawingTool: 'freehand' as DrawingTool,
  selectedColor: '',
  colorPickerOpen: false,
  snapToGrid: true,
  isDirty: false,
  currentDiagramId: null,
  currentDiagramName: 'Loading...',
};

export const useFlowStore = create<FlowState>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        // Initial state
        ...initialState,

        // Node actions
        setNodes: (nodesOrFn) => set((state) => {
          state.nodes = typeof nodesOrFn === 'function'
            ? nodesOrFn(state.nodes)
            : nodesOrFn;
          state.isDirty = true;
        }),

        setEdges: (edgesOrFn) => set((state) => {
          state.edges = typeof edgesOrFn === 'function'
            ? edgesOrFn(state.edges)
            : edgesOrFn;
          state.isDirty = true;
        }),

        setViewport: (viewport) => set((state) => {
          state.viewport = viewport;
        }),

        updateNode: (id, data) => set((state) => {
          const node = state.nodes.find(n => n.id === id);
          if (node) {
            Object.assign(node.data, data);
            state.isDirty = true;
          }
        }),

        updateNodePosition: (id, position) => set((state) => {
          const node = state.nodes.find(n => n.id === id);
          if (node) {
            node.position = position;
            state.isDirty = true;
          }
        }),

        addNode: (node) => set((state) => {
          state.nodes.push(node);
          state.isDirty = true;
        }),

        addEdge: (edge) => set((state) => {
          state.edges.push(edge);
          state.isDirty = true;
        }),

        removeNodes: (ids) => set((state) => {
          const idSet = new Set(ids);
          state.nodes = state.nodes.filter(n => !idSet.has(n.id));
          // Also remove connected edges
          state.edges = state.edges.filter(e => !idSet.has(e.source) && !idSet.has(e.target));
          state.isDirty = true;
        }),

        removeEdges: (ids) => set((state) => {
          const idSet = new Set(ids);
          state.edges = state.edges.filter(e => !idSet.has(e.id));
          state.isDirty = true;
        }),

        // UI actions
        setDrawing: (isDrawing) => set((state) => {
          state.isDrawing = isDrawing;
        }),

        toggleDrawing: () => set((state) => {
          state.isDrawing = !state.isDrawing;
        }),

        setDrawingTool: (tool) => set((state) => {
          state.drawingTool = tool;
          // When selecting a drawing tool (not 'select'), enable drawing mode
          if (tool !== 'select') {
            state.isDrawing = true;
          } else {
            state.isDrawing = false;
          }
        }),

        setSelectedColor: (color) => set((state) => {
          state.selectedColor = color;
        }),

        setColorPickerOpen: (open) => set((state) => {
          state.colorPickerOpen = open;
        }),

        toggleColorPicker: () => set((state) => {
          state.colorPickerOpen = !state.colorPickerOpen;
        }),

        setSnapToGrid: (snap) => set((state) => {
          state.snapToGrid = snap;
        }),

        toggleSnapToGrid: () => set((state) => {
          state.snapToGrid = !state.snapToGrid;
        }),

        // Dirty state
        markDirty: () => set((state) => {
          state.isDirty = true;
        }),

        markClean: () => set((state) => {
          state.isDirty = false;
        }),

        // Diagram management
        setCurrentDiagram: (id, name) => set((state) => {
          state.currentDiagramId = id;
          state.currentDiagramName = name;
        }),

        loadDiagram: (id, name, nodes, edges, viewport) => set((state) => {
          state.currentDiagramId = id;
          state.currentDiagramName = name;
          state.nodes = nodes;
          state.edges = edges;
          state.viewport = viewport;
          state.isDirty = false;
        }),

        reset: () => set(() => initialState),
      }))
    ),
    { name: 'FlowStore' }
  )
);

// Selectors for optimized subscriptions
export const useNodes = () => useFlowStore((s) => s.nodes);
export const useEdges = () => useFlowStore((s) => s.edges);
export const useViewport = () => useFlowStore((s) => s.viewport);
export const useSelectedNodes = () => useFlowStore((s) => s.nodes.filter(n => n.selected));
export const useSelectedEdges = () => useFlowStore((s) => s.edges.filter(e => e.selected));
export const useIsDrawing = () => useFlowStore((s) => s.isDrawing);
export const useDrawingTool = () => useFlowStore((s) => s.drawingTool);
export const useSelectedColor = () => useFlowStore((s) => s.selectedColor);
export const useSnapToGrid = () => useFlowStore((s) => s.snapToGrid);
export const useColorPickerOpen = () => useFlowStore((s) => s.colorPickerOpen);
export const useIsDirty = () => useFlowStore((s) => s.isDirty);
export const useCurrentDiagramId = () => useFlowStore((s) => s.currentDiagramId);
export const useCurrentDiagramName = () => useFlowStore((s) => s.currentDiagramName);

// Action selectors (stable references)
export const useFlowActions = () => useFlowStore((s) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setViewport: s.setViewport,
  updateNode: s.updateNode,
  addNode: s.addNode,
  addEdge: s.addEdge,
  removeNodes: s.removeNodes,
  removeEdges: s.removeEdges,
  setDrawing: s.setDrawing,
  toggleDrawing: s.toggleDrawing,
  setDrawingTool: s.setDrawingTool,
  setSelectedColor: s.setSelectedColor,
  setColorPickerOpen: s.setColorPickerOpen,
  toggleColorPicker: s.toggleColorPicker,
  setSnapToGrid: s.setSnapToGrid,
  toggleSnapToGrid: s.toggleSnapToGrid,
  markDirty: s.markDirty,
  markClean: s.markClean,
  setCurrentDiagram: s.setCurrentDiagram,
  loadDiagram: s.loadDiagram,
  reset: s.reset,
}));
