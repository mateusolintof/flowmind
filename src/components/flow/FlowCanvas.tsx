'use client';

import { useCallback, useRef, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Connection,
  Edge,
  BackgroundVariant,
  useReactFlow,
  Node,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDnD } from '@/hooks/useDnD';
import { generateNodeId, resetIdCounter } from '@/utils/idGenerator';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useFlowStore } from '@/store/flowStore';
import { migrateLegacyStorage, loadDiagramById, listDiagrams, Diagram } from '@/lib/storage';
import { toast } from 'sonner';

import BaseNode from './BaseNode';
import StrokeNode from './StrokeNode';
import CustomEdge, { CustomEdgeData } from './CustomEdge';
import FlowToolbar from './FlowToolbar';
import DrawingOverlay from './DrawingOverlay';
import { ZoomControls } from './ZoomControls';
import { NODE_CONFIG } from '@/config/nodeTypes';
import { FlowData } from '@/lib/export';
import { DiagramTemplate } from '@/config/templates';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'agent',
    data: { label: 'Start Agent' },
    position: { x: 250, y: 5 },
  },
];

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { type } = useDnD();
  const { undo, redo, takeSnapshot, canUndo, canRedo } = useUndoRedo();
  const { setViewport, getNodes, getViewport, screenToFlowPosition } = useReactFlow();

  // Get state from store
  const isDrawing = useFlowStore((s) => s.isDrawing);
  const selectedColor = useFlowStore((s) => s.selectedColor);
  const snapToGrid = useFlowStore((s) => s.snapToGrid);
  const isDirty = useFlowStore((s) => s.isDirty);
  const currentDiagramId = useFlowStore((s) => s.currentDiagramId);
  const currentDiagramName = useFlowStore((s) => s.currentDiagramName);

  // Get actions from store
  const setSelectedColor = useFlowStore((s) => s.setSelectedColor);
  const markDirty = useFlowStore((s) => s.markDirty);
  const markClean = useFlowStore((s) => s.markClean);
  const setCurrentDiagram = useFlowStore((s) => s.setCurrentDiagram);

  // Auto-save with debouncing and change detection
  const { save } = useAutoSave(currentDiagramId, isDirty);

  // Color change handler
  const onColorChange = useCallback((color: string) => {
    takeSnapshot(nodes, edges);
    setSelectedColor(color);
    markDirty();

    setNodes((nds) =>
      nds.map((node) => {
        if (node.selected) {
          return {
            ...node,
            data: { ...node.data, color },
          };
        }
        return node;
      })
    );
  }, [takeSnapshot, nodes, edges, setSelectedColor, markDirty, setNodes]);

  // Manual save handler
  const handleSave = useCallback(async () => {
    await save();
    markClean();
  }, [save, markClean]);

  // Export handler
  const onExport = useCallback(async () => {
    if (!reactFlowWrapper.current) return;

    const nodes = getNodes();
    if (nodes.length === 0) return;

    const nodesBounds = getNodesBounds(nodes);
    const imageWidth = nodesBounds.width || 1024;
    const imageHeight = nodesBounds.height || 768;

    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.1
    );

    const { toPng } = await import('html-to-image');

    try {
      const dataUrl = await toPng(reactFlowWrapper.current, {
        backgroundColor: '#ffffff',
        width: imageWidth * 2,
        height: imageHeight * 2,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        },
      });
      const a = document.createElement('a');
      a.setAttribute('download', 'flowmind-diagram.png');
      a.setAttribute('href', dataUrl);
      a.click();
      toast.success('Diagram exported successfully');
    } catch (err) {
      console.error('Export failed', err);
      try {
        const dataUrl = await toPng(reactFlowWrapper.current, { backgroundColor: '#fff' });
        const a = document.createElement('a');
        a.setAttribute('download', 'flowmind-snapshot.png');
        a.setAttribute('href', dataUrl);
        a.click();
        toast.success('Snapshot exported');
      } catch (fallbackErr) {
        toast.error('Export failed');
      }
    }
  }, [getNodes]);

  // Import handler
  const handleImport = useCallback((data: FlowData) => {
    takeSnapshot(nodes, edges);
    setNodes(data.nodes || []);
    setEdges(data.edges || []);
    if (data.viewport) {
      setViewport(data.viewport);
    }
    resetIdCounter(data.nodes || []);
    markDirty();
  }, [nodes, edges, takeSnapshot, setNodes, setEdges, setViewport, markDirty]);

  // Template selection handler
  const handleSelectTemplate = useCallback((template: DiagramTemplate) => {
    takeSnapshot(nodes, edges);
    setNodes(template.nodes || []);
    setEdges(template.edges || []);
    resetIdCounter(template.nodes || []);
    markDirty();
    toast.success(`Template "${template.name}" loaded`);
  }, [nodes, edges, takeSnapshot, setNodes, setEdges, markDirty]);

  // Load diagram by ID
  const loadDiagram = useCallback(async (diagramId: string) => {
    const flow = await loadDiagramById(diagramId);
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (flow.viewport) {
        setViewport(flow.viewport);
      }
      resetIdCounter(flow.nodes || []);
    } else {
      setNodes([]);
      setEdges([]);
      setViewport({ x: 0, y: 0, zoom: 1 });
      resetIdCounter([]);
    }

    const diagrams = await listDiagrams();
    const diagram = diagrams.find((d: Diagram) => d.id === diagramId);
    setCurrentDiagram(diagramId, diagram?.name || 'Untitled');
    markClean();
  }, [setNodes, setEdges, setViewport, setCurrentDiagram, markClean]);

  // Handle diagram change
  const handleDiagramChange = useCallback(async (diagramId: string) => {
    await loadDiagram(diagramId);
  }, [loadDiagram]);

  // Use keyboard shortcuts hook
  const { handleUndo, handleRedo } = useKeyboardShortcuts({
    nodes,
    edges,
    setNodes,
    setEdges,
    onSave: handleSave,
    onExport,
  });

  // Load flow on mount with migration
  useEffect(() => {
    const restoreFlow = async () => {
      const diagramId = await migrateLegacyStorage();
      await loadDiagram(diagramId);
    };
    restoreFlow();
  }, [loadDiagram]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Fix React Flow background pointer events
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .react-flow__background { pointer-events: none !important; }
      .react-flow__background * { pointer-events: none !important; }
      .react-flow__panel { pointer-events: auto !important; z-index: 5 !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Define nodeTypes
  const nodeTypes = useMemo(() => {
    const types: Record<string, any> = { stroke: StrokeNode };
    Object.keys(NODE_CONFIG).forEach((key) => {
      types[key] = BaseNode;
    });
    return types;
  }, []);

  // Define edgeTypes
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  // Get selected edge
  const selectedEdge = useMemo(() => edges.find((e) => e.selected), [edges]);

  // Update edge data
  const updateEdgeData = useCallback((data: Partial<CustomEdgeData>) => {
    if (!selectedEdge) return;
    takeSnapshot(nodes, edges);
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdge.id) {
          return {
            ...edge,
            data: { ...(edge.data || {}), ...data },
          };
        }
        return edge;
      })
    );
    markDirty();
  }, [selectedEdge, nodes, edges, takeSnapshot, setEdges, markDirty]);

  // Connection handler
  const onConnect = useCallback((params: Connection) => {
    takeSnapshot(nodes, edges);
    const newEdge = {
      ...params,
      type: 'custom',
      data: { styleType: 'bezier' as const },
    };
    setEdges((eds) => addEdge(newEdge, eds));
    markDirty();
  }, [setEdges, nodes, edges, takeSnapshot, markDirty]);

  // Drag handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!type || isDrawing) return;

    takeSnapshot(nodes, edges);

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: generateNodeId(),
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        color: selectedColor,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    markDirty();
  }, [type, isDrawing, takeSnapshot, nodes, edges, screenToFlowPosition, selectedColor, setNodes, markDirty]);

  // Node drag start handler
  const onNodeDragStart = useCallback(() => {
    takeSnapshot(nodes, edges);
  }, [nodes, edges, takeSnapshot]);

  // Delete handlers
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    if (deletedNodes.length === 0) return;
    markDirty();

    const count = deletedNodes.length;
    toast(`${count} node${count > 1 ? 's' : ''} deleted`, {
      action: {
        label: 'Undo',
        onClick: () => {
          const prev = undo(nodes, edges);
          if (prev) {
            setNodes(prev.nodes);
            setEdges(prev.edges);
            toast.success('Deletion undone');
          }
        },
      },
      duration: 5000,
    });
  }, [undo, nodes, edges, setNodes, setEdges, markDirty]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    if (deletedEdges.length === 0) return;
    markDirty();

    const count = deletedEdges.length;
    toast(`${count} connection${count > 1 ? 's' : ''} deleted`, {
      action: {
        label: 'Undo',
        onClick: () => {
          const prev = undo(nodes, edges);
          if (prev) {
            setNodes(prev.nodes);
            setEdges(prev.edges);
            toast.success('Deletion undone');
          }
        },
      },
      duration: 5000,
    });
  }, [undo, nodes, edges, setNodes, setEdges, markDirty]);

  // Change handlers with snapshot for delete
  const handleNodesChange = useCallback((changes: any[]) => {
    const hasDelete = changes.some((c) => c.type === 'remove');
    if (hasDelete) {
      takeSnapshot(nodes, edges);
    }
    onNodesChange(changes);
  }, [nodes, edges, takeSnapshot, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any[]) => {
    const hasDelete = changes.some((c) => c.type === 'remove');
    if (hasDelete) {
      takeSnapshot(nodes, edges);
    }
    onEdgesChange(changes);
  }, [nodes, edges, takeSnapshot, onEdgesChange]);

  return (
    <div className="flex-1 h-full w-full flex flex-col" data-onboarding="canvas">
      {/* Toolbar */}
      <FlowToolbar
        nodes={nodes}
        edges={edges}
        selectedEdge={selectedEdge}
        currentDiagramId={currentDiagramId}
        currentDiagramName={currentDiagramName}
        canUndo={canUndo}
        canRedo={canRedo}
        reactFlowWrapper={reactFlowWrapper}
        getViewport={getViewport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onColorChange={onColorChange}
        onDiagramChange={handleDiagramChange}
        onSelectTemplate={handleSelectTemplate}
        onUpdateEdgeData={updateEdgeData}
        onImport={handleImport}
      />

      {/* Canvas Area */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        {/* Drawing Overlay */}
        <DrawingOverlay nodes={nodes} edges={edges} setNodes={setNodes} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'custom' }}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStart={onNodeDragStart}
          fitView
          panOnDrag={!isDrawing}
          selectionOnDrag={!isDrawing}
          nodesDraggable={!isDrawing}
          snapToGrid={snapToGrid}
          snapGrid={[12, 12]}
          className="bg-background"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} style={{ pointerEvents: 'none' }} />

          {/* Zoom Controls - Bottom Left */}
          <div className="absolute left-4 bottom-4 z-10" data-onboarding="zoom-controls">
            <ZoomControls />
          </div>

          {/* MiniMap - Bottom Right */}
          <div className="absolute right-4 bottom-4 z-10">
            <MiniMap
              zoomable
              pannable
              className="bg-card border rounded-lg overflow-hidden"
              style={{ width: 150, height: 100 }}
            />
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
