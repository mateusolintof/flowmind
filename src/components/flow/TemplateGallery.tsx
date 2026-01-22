'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    LayoutTemplate,
    Bot,
    Server,
    Layout,
    ChevronRight,
    Search,
    Sparkles,
    GitBranch
} from 'lucide-react';
import { DIAGRAM_TEMPLATES, DiagramTemplate } from '@/config/templates';
import { cn } from '@/lib/utils';
import { useDiscoveryStore } from '@/store/discoveryStore';

interface TemplateGalleryProps {
    onSelectTemplate: (template: DiagramTemplate) => void;
}

// Module-level constants
const CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: LayoutTemplate },
    { id: 'ai-agents', label: 'AI Agents', icon: Bot },
    { id: 'architecture', label: 'Architecture', icon: Server },
    { id: 'flowchart', label: 'Flowcharts', icon: GitBranch },
    { id: 'general', label: 'General', icon: Layout },
] as const;

// Templates added recently (show NEW badge)
const NEW_TEMPLATE_IDS = [
    'customer-service',
    'research-agent',
    'code-review',
    'rag-reranking',
    'data-pipeline-etl',
];

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const openDiscovery = useDiscoveryStore((s) => s.open);

    // Memoize filtered templates with search
    const filteredTemplates = useMemo(() => {
        let templates = selectedCategory === 'all'
            ? DIAGRAM_TEMPLATES
            : DIAGRAM_TEMPLATES.filter((t) => t.category === selectedCategory);

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            templates = templates.filter((t) =>
                t.name.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            );
        }

        return templates;
    }, [selectedCategory, searchQuery]);

    // Memoize handler
    const handleSelect = useCallback((template: DiagramTemplate) => {
        onSelectTemplate(template);
        setOpen(false);
    }, [onSelectTemplate]);

    // Handle "Start with AI" click
    const handleStartWithAI = useCallback(() => {
        setOpen(false);
        // Small delay to let dialog close animation complete
        setTimeout(() => {
            openDiscovery();
        }, 150);
    }, [openDiscovery]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-background h-8" aria-label="Open templates">
                    <LayoutTemplate className="h-4 w-4" />
                    <span className="hidden sm:inline">Templates</span>
                </Button>
            </DialogTrigger>
            <DialogContent variant="fullscreen" className="overflow-hidden flex flex-col">
                <DialogHeader className="shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2">
                                <LayoutTemplate className="h-5 w-5" />
                                Diagram Templates
                            </DialogTitle>
                            <DialogDescription>
                                Choose a template to get started quickly or start with a blank canvas.
                            </DialogDescription>
                        </div>
                        {/* Search Input */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
                    {/* Categories Sidebar */}
                    <div className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r md:pr-4 pb-3 md:pb-0">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-1">
                            {CATEGORIES.map((category) => {
                                const Icon = category.icon;
                                const count = category.id === 'all'
                                    ? DIAGRAM_TEMPLATES.length
                                    : DIAGRAM_TEMPLATES.filter((t) => t.category === category.id).length;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={cn(
                                            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                                            selectedCategory === category.id
                                                ? 'bg-accent text-accent-foreground'
                                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="flex-1 text-left">{category.label}</span>
                                        <span className="text-xs opacity-60">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pr-2 md:pr-4">
                            {/* Start with AI - Featured Card */}
                            {selectedCategory === 'all' && !searchQuery && (
                                <Card
                                    className="p-4 cursor-pointer transition-all hover:shadow-lg border-2 border-dashed border-primary/50 hover:border-primary bg-gradient-to-br from-primary/5 to-primary/10 col-span-full md:col-span-1"
                                    onClick={handleStartWithAI}
                                >
                                    <div className="h-32 mb-3 rounded-md bg-primary/10 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Sparkles className="h-6 w-6 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-primary">AI-Powered</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-sm leading-snug text-primary">
                                                Start with AI Discovery
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Answer a few questions and let AI generate your diagram automatically.
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                    </div>
                                </Card>
                            )}

                            {filteredTemplates.map((template) => (
                                <Card
                                    key={template.id}
                                    className={cn(
                                        'p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                                        hoveredTemplate === template.id && 'border-primary'
                                    )}
                                    onMouseEnter={() => setHoveredTemplate(template.id)}
                                    onMouseLeave={() => setHoveredTemplate(null)}
                                    onClick={() => handleSelect(template)}
                                >
                                    {/* Preview Area */}
                                    <div className="h-32 mb-3 rounded-md bg-muted/50 border border-dashed flex items-center justify-center relative overflow-hidden">
                                        {template.nodes.length === 0 ? (
                                            <span className="text-muted-foreground text-sm">Blank Canvas</span>
                                        ) : (
                                            <TemplatePreview template={template} />
                                        )}
                                        {/* NEW Badge */}
                                        {NEW_TEMPLATE_IDS.includes(template.id) && (
                                            <Badge
                                                variant="default"
                                                className="absolute top-2 right-2 text-[10px] px-1.5 py-0 h-5 bg-emerald-500 hover:bg-emerald-500"
                                            >
                                                NEW
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-sm leading-snug line-clamp-2">
                                                {template.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {template.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                <span>{template.nodes.length} nodes</span>
                                                <span>·</span>
                                                <span>{template.edges.length} conn.</span>
                                            </div>
                                        </div>
                                        <ChevronRight className={cn(
                                            'h-4 w-4 shrink-0 transition-opacity mt-0.5',
                                            hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                                        )} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Memoized TemplatePreview component with O(1) node lookup
const TemplatePreview = memo(function TemplatePreview({ template }: { template: DiagramTemplate }) {
    // Memoize all calculations
    const previewData = useMemo(() => {
        if (template.nodes.length === 0) return null;

        // Create Map for O(1) lookup instead of O(n) find
        const nodeMap = new Map(template.nodes.map(n => [n.id, n]));

        // Calculate bounds
        const xs = template.nodes.map((n) => n.position.x);
        const ys = template.nodes.map((n) => n.position.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs) + 120;
        const maxY = Math.max(...ys) + 60;
        const width = maxX - minX;
        const height = maxY - minY;

        // Scale to fit
        const scale = Math.min(180 / width, 100 / height, 0.4);
        const offsetX = (180 - width * scale) / 2;
        const offsetY = (100 - height * scale) / 2;

        // Pre-calculate edge lines using O(1) lookup
        const edgeLines = template.edges
            .map((edge) => {
                const source = nodeMap.get(edge.source);
                const target = nodeMap.get(edge.target);
                if (!source || !target) return null;

                return {
                    id: edge.id,
                    x1: (source.position.x - minX) * scale + offsetX + 30,
                    y1: (source.position.y - minY) * scale + offsetY + 15,
                    x2: (target.position.x - minX) * scale + offsetX + 30,
                    y2: (target.position.y - minY) * scale + offsetY + 15,
                };
            })
            .filter(Boolean);

        // Pre-calculate node rects
        const nodeRects = template.nodes.map((node) => ({
            id: node.id,
            x: (node.position.x - minX) * scale + offsetX,
            y: (node.position.y - minY) * scale + offsetY,
        }));

        return { edgeLines, nodeRects };
    }, [template]);

    if (!previewData) return null;

    return (
        <svg
            viewBox="0 0 200 120"
            className="w-full h-full"
            style={{ opacity: 0.8 }}
        >
            {/* Edges */}
            {previewData.edgeLines.map((line) => line && (
                <line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="var(--muted-foreground)"
                    strokeWidth={1}
                    opacity={0.4}
                />
            ))}

            {/* Nodes */}
            {previewData.nodeRects.map((rect) => (
                <rect
                    key={rect.id}
                    x={rect.x}
                    y={rect.y}
                    width={60}
                    height={30}
                    rx={4}
                    fill="var(--card)"
                    stroke="var(--border)"
                    strokeWidth={1}
                />
            ))}
        </svg>
    );
});
