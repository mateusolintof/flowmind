'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Download,
    Image as ImageIcon,
    FileCode2,
    FileJson,
    Upload,
    ChevronDown,
} from 'lucide-react';
import { Node, Edge, Viewport } from '@xyflow/react';
import { exportAsPng, exportAsSvg, exportAsJson, importFromJson, FlowData } from '@/lib/diagram';
import { toast } from 'sonner';

interface ExportMenuProps {
    nodes: Node[];
    edges: Edge[];
    viewport?: Viewport;
    reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
    onImport: (data: FlowData) => void;
}

export function ExportMenu({
    nodes,
    edges,
    viewport,
    reactFlowWrapper,
    onImport,
}: ExportMenuProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportPng = async () => {
        if (!reactFlowWrapper.current) return;
        try {
            await exportAsPng(reactFlowWrapper.current, nodes);
            toast.success('Exported as PNG');
        } catch (err) {
            console.error('Failed to export PNG', err);
            toast.error('Failed to export PNG');
        }
    };

    const handleExportSvg = async () => {
        if (!reactFlowWrapper.current) return;
        try {
            await exportAsSvg(reactFlowWrapper.current, nodes);
            toast.success('Exported as SVG');
        } catch (err) {
            console.error('Failed to export SVG', err);
            toast.error('Failed to export SVG');
        }
    };

    const handleExportJson = () => {
        try {
            exportAsJson({ nodes, edges, viewport });
            toast.success('Exported as JSON');
        } catch (err) {
            console.error('Failed to export JSON', err);
            toast.error('Failed to export JSON');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const data = await importFromJson(file);
            onImport(data);
            toast.success(`Imported ${data.nodes.length} nodes and ${data.edges.length} connections`);
        } catch (error) {
            toast.error((error as Error).message || 'Failed to import');
        }

        // Reset input
        e.target.value = '';
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-background h-8"
                        title="Export/Import (Cmd+E)"
                        aria-label="Export options"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleExportPng} className="gap-2 cursor-pointer">
                        <ImageIcon className="h-4 w-4" />
                        Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportSvg} className="gap-2 cursor-pointer">
                        <FileCode2 className="h-4 w-4" />
                        Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJson} className="gap-2 cursor-pointer">
                        <FileJson className="h-4 w-4" />
                        Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleImportClick} className="gap-2 cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Import from JSON
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
