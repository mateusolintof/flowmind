import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type DrawingTool = 'select' | 'freehand' | 'arrow' | 'rectangle' | 'ellipse' | 'line';

export interface FlowState {
  // UI state
  isDrawing: boolean;
  drawingTool: DrawingTool;
  lastNonSelectTool: DrawingTool;
  selectedColor: string;
  colorPickerOpen: boolean;
  snapToGrid: boolean;

  // Dirty state (used for auto-save + unload warning)
  dirtyCounter: number;

  // Diagram metadata
  currentDiagramId: string | null;
  currentDiagramName: string;

  // Actions
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

  reset: () => void;
}

const initialState = {
  isDrawing: false,
  drawingTool: 'select' as DrawingTool,
  lastNonSelectTool: 'freehand' as DrawingTool,
  selectedColor: '',
  colorPickerOpen: false,
  snapToGrid: true,
  dirtyCounter: 0,
  currentDiagramId: null,
  currentDiagramName: 'Loading...',
};

export const useFlowStore = create<FlowState>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        // Initial state
        ...initialState,

        // UI actions
        toggleDrawing: () => set((state) => {
          if (state.drawingTool === 'select') {
            const tool = state.lastNonSelectTool === 'select' ? 'freehand' : state.lastNonSelectTool;
            state.drawingTool = tool;
            state.isDrawing = true;
          } else {
            state.drawingTool = 'select';
            state.isDrawing = false;
          }
        }),

        setDrawingTool: (tool) => set((state) => {
          state.drawingTool = tool;
          state.isDrawing = tool !== 'select';
          if (tool !== 'select') {
            state.lastNonSelectTool = tool;
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
          state.dirtyCounter += 1;
        }),

        markClean: () => set((state) => {
          state.dirtyCounter = 0;
        }),

        // Diagram management
        setCurrentDiagram: (id, name) => set((state) => {
          state.currentDiagramId = id;
          state.currentDiagramName = name;
        }),

        reset: () => set(() => initialState),
      }))
    ),
    { name: 'FlowStore' }
  )
);

// Selectors for optimized subscriptions
export const useIsDrawing = () => useFlowStore((s) => s.isDrawing);
export const useDrawingTool = () => useFlowStore((s) => s.drawingTool);
export const useSelectedColor = () => useFlowStore((s) => s.selectedColor);
export const useSnapToGrid = () => useFlowStore((s) => s.snapToGrid);
export const useColorPickerOpen = () => useFlowStore((s) => s.colorPickerOpen);
export const useDirtyCounter = () => useFlowStore((s) => s.dirtyCounter);
export const useCurrentDiagramId = () => useFlowStore((s) => s.currentDiagramId);
export const useCurrentDiagramName = () => useFlowStore((s) => s.currentDiagramName);

// Action selectors (stable references)
export const useFlowActions = () => useFlowStore((s) => ({
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
  reset: s.reset,
}));
