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
import { loadFlow } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Download, Save, Pencil, MousePointer2 } from 'lucide-react';
import BaseNode from './BaseNode';
import StrokeNode from './StrokeNode';
import HelpDialog from './HelpDialog';
import { NODE_CONFIG } from '@/config/nodeTypes';

const initialNodes = [
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
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    const { type } = useDnD();
    const { save } = useAutoSave();
    const { setViewport, screenToFlowPosition, getNodes } = useReactFlow();

    // Drawing Mode State
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawingProcess, setIsDrawingProcess] = useState(false);
    const [currentStroke, setCurrentStroke] = useState<number[][]>([]);

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

    // Define nodeTypes
    const nodeTypes = useMemo(() => {
        const types: Record<string, any> = { stroke: StrokeNode };
        Object.keys(NODE_CONFIG).forEach((key) => {
            types[key] = BaseNode;
        });
        return types;
    }, []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (!type || isDrawing) return;

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, type, setNodes, isDrawing],
    );

    // Drawing Handlers
    const onPointerDown = (e: React.PointerEvent) => {
        if (!isDrawing) return;
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
            data: { points: relativePoints },
            style: { width: maxX - minX, height: maxY - minY, zIndex: 1000 },
            draggable: true,
        };

        setNodes((nds) => nds.concat(newNode));
        setCurrentStroke([]);
    };

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
        } catch (err) {
            console.error('Export failed', err);
            // Fallback: simple screenshot of current view
            const dataUrl = await toPng(reactFlowWrapper.current, { backgroundColor: '#fff' });
            const a = document.createElement('a');
            a.setAttribute('download', 'flowmind-snapshot.png');
            a.setAttribute('href', dataUrl);
            a.click();
        }
    };

    return (
        <div
            className="flex-1 h-full w-full relative"
            ref={reactFlowWrapper}
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                panOnDrag={!isDrawing}
                selectionOnDrag={!isDrawing}
                nodesDraggable={!isDrawing}
                className="bg-background"
            >
                <Controls />
                <MiniMap zoomable pannable className="bg-card border rounded-lg overflow-hidden" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

                <Panel position="top-right" className="flex gap-2">
                    <div className="bg-background border rounded-md flex mr-4 shadow-sm">
                        <Button
                            size="sm"
                            variant={!isDrawing ? 'secondary' : 'ghost'}
                            onClick={() => setIsDrawing(false)}
                            className="rounded-none rounded-l-md px-3 h-8"
                            title="Selection Mode"
                        >
                            <MousePointer2 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={isDrawing ? 'secondary' : 'ghost'}
                            onClick={() => setIsDrawing(true)}
                            className="rounded-none rounded-r-md px-3 h-8"
                            title="Drawing Mode"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button size="sm" variant="outline" className="gap-2 bg-background h-8" onClick={save}>
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-background h-8" onClick={onExport}>
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <HelpDialog />
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
