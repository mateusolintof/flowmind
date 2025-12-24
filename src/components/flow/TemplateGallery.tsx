'use client';

import { useState } from 'react';
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
import { LayoutTemplate, Bot, Server, Layout, ChevronRight } from 'lucide-react';
import { DIAGRAM_TEMPLATES, DiagramTemplate } from '@/config/templates';
import { cn } from '@/lib/utils';

interface TemplateGalleryProps {
    onSelectTemplate: (template: DiagramTemplate) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: LayoutTemplate },
    { id: 'ai-agents', label: 'AI Agents', icon: Bot },
    { id: 'architecture', label: 'Architecture', icon: Server },
    { id: 'general', label: 'General', icon: Layout },
];

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    const filteredTemplates = selectedCategory === 'all'
        ? DIAGRAM_TEMPLATES
        : DIAGRAM_TEMPLATES.filter((t) => t.category === selectedCategory);

    const handleSelect = (template: DiagramTemplate) => {
        onSelectTemplate(template);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-background h-8">
                    <LayoutTemplate className="h-4 w-4" />
                    Templates
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <LayoutTemplate className="h-5 w-5" />
                        Diagram Templates
                    </DialogTitle>
                    <DialogDescription>
                        Choose a template to get started quickly or start with a blank canvas.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 flex-1 min-h-0">
                    {/* Categories Sidebar */}
                    <div className="w-48 shrink-0 border-r pr-4 overflow-y-auto">
                        <div className="space-y-1">
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
                    <ScrollArea className="flex-1">
                        <div className="grid grid-cols-2 gap-4 pr-4">
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
                                    </div>

                                    {/* Info */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-sm truncate">{template.name}</h3>
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

function TemplatePreview({ template }: { template: DiagramTemplate }) {
    if (template.nodes.length === 0) return null;

    // Calculate bounds
    const xs = template.nodes.map((n) => n.position.x);
    const ys = template.nodes.map((n) => n.position.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs) + 120; // Approximate node width
    const maxY = Math.max(...ys) + 60; // Approximate node height
    const width = maxX - minX;
    const height = maxY - minY;

    // Scale to fit
    const scale = Math.min(180 / width, 100 / height, 0.4);
    const offsetX = (180 - width * scale) / 2;
    const offsetY = (100 - height * scale) / 2;

    return (
        <svg
            viewBox={`0 0 200 120`}
            className="w-full h-full"
            style={{ opacity: 0.8 }}
        >
            {/* Edges */}
            {template.edges.map((edge) => {
                const source = template.nodes.find((n) => n.id === edge.source);
                const target = template.nodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;

                const x1 = (source.position.x - minX) * scale + offsetX + 30;
                const y1 = (source.position.y - minY) * scale + offsetY + 15;
                const x2 = (target.position.x - minX) * scale + offsetX + 30;
                const y2 = (target.position.y - minY) * scale + offsetY + 15;

                return (
                    <line
                        key={edge.id}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={1}
                        opacity={0.4}
                    />
                );
            })}

            {/* Nodes */}
            {template.nodes.map((node) => {
                const x = (node.position.x - minX) * scale + offsetX;
                const y = (node.position.y - minY) * scale + offsetY;

                return (
                    <rect
                        key={node.id}
                        x={x}
                        y={y}
                        width={60}
                        height={30}
                        rx={4}
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--border))"
                        strokeWidth={1}
                    />
                );
            })}
        </svg>
    );
}
