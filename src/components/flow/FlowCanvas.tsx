'use client';

import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Connection,
    Edge,
    BackgroundVariant,
    Panel,
    useReactFlow,
    Node,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import '@xyflow/react/dist/style.css';

import { useDnD } from '@/hooks/useDnD';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useClipboard } from '@/hooks/useClipboard';
import { loadFlow } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Save, Pencil, MousePointer2, Undo2, Redo2, Grid3X3 } from 'lucide-react';
import { toast } from 'sonner';
import BaseNode from './BaseNode';
import StrokeNode from './StrokeNode';
import HelpDialog from './HelpDialog';
import { ColorPicker } from './ColorPicker';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { ZoomControls } from './ZoomControls';
import CustomEdge, { CustomEdgeData } from './CustomEdge';
import { EdgeStylePicker } from './EdgeStylePicker';
import { ExportMenu } from './ExportMenu';
import { TemplateGallery } from './TemplateGallery';
import { DiagramGuide } from './DiagramGuide';
import { FlowData } from '@/lib/export';
import { NODE_CONFIG } from '@/config/nodeTypes';
import { DiagramTemplate } from '@/config/templates';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'agent',
        data: { label: 'Start Agent' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    const { type } = useDnD();
    const { save } = useAutoSave();
    const { undo, redo, takeSnapshot, canUndo, canRedo } = useUndoRedo();
    const { copy, cut, paste } = useClipboard();
    const { setViewport, screenToFlowPosition, getNodes, getViewport } = useReactFlow();

    // Drawing Mode State
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingProcess, setIsDrawingProcess] = useState(false);
    const [currentStroke, setCurrentStroke] = useState<number[][]>([]);

    // Color State
    const [selectedColor, setSelectedColor] = useState<string>(''); // '' means default
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    // Dirty state for unsaved changes warning
    const [isDirty, setIsDirty] = useState(false);

    // Snap to Grid State
    const [snapToGrid, setSnapToGrid] = useState(true);

    // Handler to change color of selected nodes or set global drawing color
    const onColorChange = (color: string) => {
        takeSnapshot(nodes, edges); // Save before changing color
        setSelectedColor(color);
        setIsDirty(true);

        // Update selected nodes
        setNodes((nds) =>
            nds.map((node) => {
                if (node.selected) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            color: color,
                        },
                    };
                }
                return node;
            })
        );
    };

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

    // Manual save handler that resets dirty state
    const handleSave = async () => {
        await save();
        setIsDirty(false);
    };

    // Import handler
    const handleImport = useCallback((data: FlowData) => {
        takeSnapshot(nodes, edges);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        if (data.viewport) {
            setViewport(data.viewport);
        }
        // Reset ID counter
        const maxId = Math.max(
            ...data.nodes.map((n) => {
                const match = n.id.match(/dndnode_(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            }),
            0
        );
        id = maxId + 1;
        setIsDirty(true);
    }, [nodes, edges, takeSnapshot, setNodes, setEdges, setViewport]);

    // Template selection handler
    const handleSelectTemplate = useCallback((template: DiagramTemplate) => {
        takeSnapshot(nodes, edges);
        setNodes(template.nodes || []);
        setEdges(template.edges || []);
        // Reset ID counter based on template nodes
        const maxId = Math.max(
            ...template.nodes.map((n) => {
                const match = n.id.match(/dndnode_(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            }),
            template.nodes.length
        );
        id = maxId + 1;
        setIsDirty(true);
        toast.success(`Template "${template.name}" loaded`);
    }, [nodes, edges, takeSnapshot, setNodes, setEdges]);

    // Load flow on mount
    useEffect(() => {
        const restoreFlow = async () => {
            const flow = await loadFlow();
            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                if (flow.viewport) {
                    setViewport(flow.viewport);
                }
                id = (flow.nodes || []).length + 1;
            }
        };
        restoreFlow();
    }, [setNodes, setEdges, setViewport]);

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

    // Get selected edge for styling
    const selectedEdge = useMemo(() => {
        return edges.find((e) => e.selected);
    }, [edges]);

    // Update edge data
    const updateEdgeData = useCallback((data: Partial<CustomEdgeData>) => {
        if (!selectedEdge) return;
        takeSnapshot(nodes, edges);
        setEdges((eds) =>
            eds.map((edge) => {
                if (edge.id === selectedEdge.id) {
                    return {
                        ...edge,
                        data: {
                            ...(edge.data || {}),
                            ...data,
                        },
                    };
                }
                return edge;
            })
        );
        setIsDirty(true);
    }, [selectedEdge, nodes, edges, takeSnapshot, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => {
            takeSnapshot(nodes, edges); // Save before connecting
            // Add edge with custom type
            const newEdge = {
                ...params,
                type: 'custom',
                data: { styleType: 'bezier' as const },
            };
            setEdges((eds) => addEdge(newEdge, eds));
            setIsDirty(true);
        },
        [setEdges, nodes, edges, takeSnapshot],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (!type || isDrawing) return;

            takeSnapshot(nodes, edges); // Save before dropping

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                    color: selectedColor // Apply current color to new node
                },
            };

            setNodes((nds) => nds.concat(newNode));
            setIsDirty(true);
        },
        [reactFlowInstance, type, setNodes, isDrawing, selectedColor, takeSnapshot, nodes, edges],
    );

    // Drawing Handlers
    const onPointerDown = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        takeSnapshot(nodes, edges); // Save before drawing stroke
        setIsDrawingProcess(true);
        const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        setCurrentStroke([[x, y, e.pressure]]);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDrawing || !isDrawingProcess) return;
        const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        setCurrentStroke((points) => [...points, [x, y, e.pressure]]);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!isDrawing || !isDrawingProcess) return;
        setIsDrawingProcess(false);

        const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        const points = [...currentStroke, [x, y, e.pressure]];

        if (points.length < 2) return;

        const xs = points.map((p) => p[0]);
        const ys = points.map((p) => p[1]);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        const relativePoints = points.map(([px, py, pr]) => [px - minX, py - minY, pr]);

        const newNode: Node = {
            id: getId(),
            type: 'stroke',
            position: { x: minX, y: minY },
            data: {
                points: relativePoints,
                color: selectedColor // Apply current color to new drawing
            },
            style: { width: maxX - minX, height: maxY - minY, zIndex: 1000 },
            draggable: true,
        };

        setNodes((nds) => nds.concat(newNode));
        setCurrentStroke([]);
        setIsDirty(true);
    };

    // Handle Node Drag Start to save state
    const onNodeDragStart = useCallback(() => {
        takeSnapshot(nodes, edges);
    }, [nodes, edges, takeSnapshot]);

    // Handle deletion with undo feedback
    const onNodesDelete = useCallback(
        (deletedNodes: Node[]) => {
            if (deletedNodes.length === 0) return;
            setIsDirty(true);

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
        },
        [undo, nodes, edges, setNodes, setEdges]
    );

    const onEdgesDelete = useCallback(
        (deletedEdges: Edge[]) => {
            if (deletedEdges.length === 0) return;
            setIsDirty(true);

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
        },
        [undo, nodes, edges, setNodes, setEdges]
    );

    // Take snapshot before deletion (called by React Flow's onNodesChange/onEdgesChange)
    const handleNodesChange = useCallback(
        (changes: any[]) => {
            const hasDelete = changes.some((c) => c.type === 'remove');
            if (hasDelete) {
                takeSnapshot(nodes, edges);
            }
            onNodesChange(changes);
        },
        [nodes, edges, takeSnapshot, onNodesChange]
    );

    const handleEdgesChange = useCallback(
        (changes: any[]) => {
            const hasDelete = changes.some((c) => c.type === 'remove');
            if (hasDelete) {
                takeSnapshot(nodes, edges);
            }
            onEdgesChange(changes);
        },
        [nodes, edges, takeSnapshot, onEdgesChange]
    );

    // Export Logic
    const onExport = async () => {
        if (!reactFlowWrapper.current) return;

        // We want to export the whole diagram
        const nodes = getNodes();
        if (nodes.length === 0) return;

        // Calculate bounds of all nodes
        const nodesBounds = getNodesBounds(nodes);
        const imageWidth = nodesBounds.width || 1024;
        const imageHeight = nodesBounds.height || 768;

        // We can use the viewport transformation logic or just export what is seen
        // For simplicity and robustness with infinite canvas, we often need to translate
        // However, simplest MVP is exporting current view or fitting view first.
        // Let's try to export the DOM element with a specific style helper if needed.
        // For now, simpler: user often zooms to what they want to print.
        // Enhanced: Use `toPng` options to set width/height matching the bounds and transform.

        const transform = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
            0.1 // clamp offsets
        );

        try {
            const dataUrl = await toPng(reactFlowWrapper.current, {
                backgroundColor: '#ffffff', // Force white bg for png
                width: imageWidth * 2, // Higher res
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
            // Fallback: simple screenshot of current view
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
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input/textarea
            const target = e.target as HTMLElement;
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            // Cmd/Ctrl shortcuts (work even when typing)
            if (e.metaKey || e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            const next = redo(nodes, edges);
                            if (next) {
                                setNodes(next.nodes);
                                setEdges(next.edges);
                            }
                        } else {
                            const prev = undo(nodes, edges);
                            if (prev) {
                                setNodes(prev.nodes);
                                setEdges(prev.edges);
                            }
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        handleSave();
                        break;
                    case 'e':
                        e.preventDefault();
                        onExport();
                        break;
                    case 'd':
                        e.preventDefault();
                        // Duplicate selected nodes
                        const selectedNodes = nodes.filter((n) => n.selected);
                        if (selectedNodes.length > 0) {
                            takeSnapshot(nodes, edges);
                            const newNodes = selectedNodes.map((node) => ({
                                ...node,
                                id: getId(),
                                position: {
                                    x: node.position.x + 20,
                                    y: node.position.y + 20,
                                },
                                selected: false,
                                data: { ...node.data },
                            }));
                            setNodes((nds) => [
                                ...nds.map((n) => ({ ...n, selected: false })),
                                ...newNodes.map((n) => ({ ...n, selected: true })),
                            ]);
                            setIsDirty(true);
                            toast.success(`${selectedNodes.length} node${selectedNodes.length > 1 ? 's' : ''} duplicated`);
                        }
                        break;
                    case 'c':
                        e.preventDefault();
                        const copiedCount = copy(nodes, edges);
                        if (copiedCount > 0) {
                            toast.success(`${copiedCount} node${copiedCount > 1 ? 's' : ''} copied`);
                        }
                        break;
                    case 'x':
                        e.preventDefault();
                        takeSnapshot(nodes, edges);
                        const cutCount = cut(nodes, edges, setNodes, setEdges);
                        if (cutCount > 0) {
                            setIsDirty(true);
                            toast.success(`${cutCount} node${cutCount > 1 ? 's' : ''} cut`);
                        }
                        break;
                    case 'v':
                        e.preventDefault();
                        takeSnapshot(nodes, edges);
                        const pastedCount = paste(getId, setNodes, setEdges);
                        if (pastedCount > 0) {
                            setIsDirty(true);
                            toast.success(`${pastedCount} node${pastedCount > 1 ? 's' : ''} pasted`);
                        }
                        break;
                }
                return;
            }

            // Single key shortcuts (only when not typing)
            if (isTyping) return;

            switch (e.key.toLowerCase()) {
                case 'd':
                    e.preventDefault();
                    setIsDrawing((prev) => !prev);
                    break;
                case 'c':
                    e.preventDefault();
                    setColorPickerOpen((prev) => !prev);
                    break;
                case 'escape':
                    e.preventDefault();
                    if (isDrawing) {
                        setIsDrawing(false);
                    }
                    if (colorPickerOpen) {
                        setColorPickerOpen(false);
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, nodes, edges, setNodes, setEdges, isDrawing, colorPickerOpen]);

    return (
        <div
            className="flex-1 h-full w-full relative"
            ref={reactFlowWrapper}
            data-onboarding="canvas"
        >
            <div
                className="absolute inset-0 z-50 transition-colors"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                    pointerEvents: isDrawing ? 'auto' : 'none',
                    cursor: isDrawing ? 'crosshair' : 'default'
                }}
            />

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
                onInit={setReactFlowInstance}
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
                <Controls showZoom={false} showFitView={false} className="bg-background border rounded-md shadow-sm" />
                <MiniMap zoomable pannable className="bg-card border rounded-lg overflow-hidden" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} style={{ pointerEvents: 'none' }} />

                {/* Zoom Controls */}
                <Panel position="bottom-left" className="ml-12 !z-10" data-onboarding="zoom-controls">
                    <ZoomControls />
                </Panel>

                {/* Drawing Mode Indicator */}
                {isDrawing && (
                    <Panel position="top-center" className="pointer-events-none !z-10">
                        <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
                            <Pencil className="h-3.5 w-3.5" />
                            Drawing Mode
                            <span className="text-xs opacity-75">(Press D or Esc to exit)</span>
                        </div>
                    </Panel>
                )}

                <Panel position="top-right" className="flex gap-2 !z-10">
                    <div className="bg-background border rounded-md flex mr-2 shadow-sm items-center">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                const prev = undo(nodes, edges);
                                if (prev) { setNodes(prev.nodes); setEdges(prev.edges); }
                            }}
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
                            onClick={() => {
                                const next = redo(nodes, edges);
                                if (next) { setNodes(next.nodes); setEdges(next.edges); }
                            }}
                            disabled={!canRedo}
                            className="h-8 w-8 p-0 rounded-none"
                            title="Redo (Ctrl+Shift+Z)"
                            aria-label="Redo last action"
                        >
                            <Redo2 className="h-4 w-4" />
                        </Button>
                        <div className="w-[1px] h-4 bg-border" />
                        <ColorPicker selectedColor={selectedColor} onSelectColor={onColorChange} open={colorPickerOpen} onOpenChange={setColorPickerOpen} />
                        <div className="w-[1px] h-4 bg-border mx-1" />
                        <Button
                            size="sm"
                            variant={snapToGrid ? 'secondary' : 'ghost'}
                            onClick={() => setSnapToGrid((prev) => !prev)}
                            className="rounded-none px-3 h-8"
                            title={snapToGrid ? 'Snap to Grid: ON' : 'Snap to Grid: OFF'}
                            aria-label="Toggle snap to grid"
                            aria-pressed={snapToGrid}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <div className="w-[1px] h-4 bg-border mx-1" />
                        <Button
                            size="sm"
                            variant={!isDrawing ? 'secondary' : 'ghost'}
                            onClick={() => setIsDrawing(false)}
                            className="rounded-none px-3 h-8"
                            title="Selection Mode (Esc)"
                            aria-label="Selection mode"
                            aria-pressed={!isDrawing}
                        >
                            <MousePointer2 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={isDrawing ? 'secondary' : 'ghost'}
                            onClick={() => setIsDrawing(true)}
                            className="rounded-none rounded-r-md px-3 h-8"
                            title="Drawing Mode (D)"
                            aria-label="Drawing mode"
                            aria-pressed={isDrawing}
                            data-onboarding="drawing-toggle"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>

                    {selectedEdge && (
                        <EdgeStylePicker
                            edgeData={(selectedEdge.data as CustomEdgeData) || {}}
                            onUpdate={updateEdgeData}
                        />
                    )}
                    <TemplateGallery onSelectTemplate={handleSelectTemplate} />
                    <DiagramGuide />
                    <SyncStatusIndicator />
                    <Button size="sm" variant="outline" className="gap-2 bg-background h-8" onClick={handleSave} title="Save (Cmd+S)" aria-label="Save diagram">
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <ExportMenu
                        nodes={nodes}
                        edges={edges}
                        viewport={getViewport()}
                        reactFlowWrapper={reactFlowWrapper}
                        onImport={handleImport}
                    />
                    <div data-onboarding="help">
                        <HelpDialog />
                    </div>
                </Panel>
            </ReactFlow>
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
