'use client';

import { memo } from 'react';
import { Node, Edge, Viewport } from '@xyflow/react';
import { useFlowStore } from '@/store/flowStore';
import { useSidebar } from './ResponsiveLayout';
import { Button } from '@/components/ui/button';
import {
  Save,
  Pencil,
  Undo2,
  Redo2,
  Grid3X3,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react';

import { DiagramManager } from './DiagramManager';
import { ColorPicker } from './ColorPicker';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { EdgeStylePicker } from './EdgeStylePicker';
import { ExportMenu } from './ExportMenu';
import { TemplateGallery } from './TemplateGallery';
import { DiagramGuide } from './DiagramGuide';
import DrawingToolPicker from './DrawingToolPicker';
import HelpDialog from './HelpDialog';
import { CustomEdgeData } from './CustomEdge';
import { FlowData } from '@/lib/export';
import { DiagramTemplate } from '@/config/templates';

interface FlowToolbarProps {
  nodes: Node[];
  edges: Edge[];
  selectedEdge: Edge | undefined;
  currentDiagramId: string | null;
  currentDiagramName: string;
  canUndo: boolean;
  canRedo: boolean;
  reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
  getViewport: () => Viewport;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onColorChange: (color: string) => void;
  onDiagramChange: (diagramId: string) => void;
  onSelectTemplate: (template: DiagramTemplate) => void;
  onUpdateEdgeData: (data: Partial<CustomEdgeData>) => void;
  onImport: (data: FlowData) => void;
}

function FlowToolbar({
  nodes,
  edges,
  selectedEdge,
  currentDiagramId,
  currentDiagramName,
  canUndo,
  canRedo,
  reactFlowWrapper,
  getViewport,
  onUndo,
  onRedo,
  onSave,
  onColorChange,
  onDiagramChange,
  onSelectTemplate,
  onUpdateEdgeData,
  onImport,
}: FlowToolbarProps) {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  // Get UI state from store
  const isDrawing = useFlowStore((s) => s.isDrawing);
  const selectedColor = useFlowStore((s) => s.selectedColor);
  const colorPickerOpen = useFlowStore((s) => s.colorPickerOpen);
  const snapToGrid = useFlowStore((s) => s.snapToGrid);
  const drawingTool = useFlowStore((s) => s.drawingTool);

  // Get actions from store
  const setColorPickerOpen = useFlowStore((s) => s.setColorPickerOpen);
  const toggleSnapToGrid = useFlowStore((s) => s.toggleSnapToGrid);

  return (
    <div className="h-12 border-b bg-background flex items-center px-2 gap-2 shrink-0 z-10">
      {/* Left Section: Sidebar Toggle + Diagram Selector */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
          title={isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
          aria-label={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
        <div className="w-[1px] h-6 bg-border" />
        <DiagramManager
          currentDiagramId={currentDiagramId}
          currentDiagramName={currentDiagramName}
          onDiagramChange={onDiagramChange}
        />
      </div>

      {/* Center Section: Tools */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {/* Undo/Redo */}
        <div className="bg-muted/50 border rounded-md flex items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0 rounded-none rounded-l-md"
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-4 bg-border" />
          <Button
            size="sm"
            variant="ghost"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0 rounded-none rounded-r-md"
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo last action"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-[1px] h-6 bg-border" />

        {/* Color, Grid, Drawing Tools */}
        <div className="bg-muted/50 border rounded-md flex items-center">
          <ColorPicker
            selectedColor={selectedColor}
            onSelectColor={onColorChange}
            open={colorPickerOpen}
            onOpenChange={setColorPickerOpen}
          />
          <div className="w-[1px] h-4 bg-border" />
          <Button
            size="sm"
            variant={snapToGrid ? 'secondary' : 'ghost'}
            onClick={toggleSnapToGrid}
            className="rounded-none rounded-r-md px-2 h-8"
            title={snapToGrid ? 'Snap to Grid: ON' : 'Snap to Grid: OFF'}
            aria-label="Toggle snap to grid"
            aria-pressed={snapToGrid}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawing Tools Picker */}
        <div data-onboarding="drawing-toggle">
          <DrawingToolPicker />
        </div>

        {/* Edge Style Picker */}
        {selectedEdge && (
          <>
            <div className="w-[1px] h-6 bg-border" />
            <EdgeStylePicker
              edgeData={(selectedEdge.data as CustomEdgeData) || {}}
              onUpdate={onUpdateEdgeData}
            />
          </>
        )}

        {/* Drawing Mode Indicator */}
        {isDrawing && drawingTool !== 'select' && (
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Pencil className="h-3 w-3" />
            {drawingTool.charAt(0).toUpperCase() + drawingTool.slice(1)}
          </div>
        )}
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2">
        <TemplateGallery onSelectTemplate={onSelectTemplate} />
        <DiagramGuide />
        <div className="w-[1px] h-6 bg-border" />
        <SyncStatusIndicator />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 h-8"
          onClick={onSave}
          title="Save (Cmd+S)"
          aria-label="Save diagram"
        >
          <Save className="h-3.5 w-3.5" /> Save
        </Button>
        <ExportMenu
          nodes={nodes}
          edges={edges}
          viewport={getViewport()}
          reactFlowWrapper={reactFlowWrapper}
          onImport={onImport}
        />
        <div data-onboarding="help">
          <HelpDialog />
        </div>
      </div>
    </div>
  );
}

export default memo(FlowToolbar);
