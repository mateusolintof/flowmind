'use client';

import { useState, useMemo } from 'react';
import { useDnD } from '@/hooks/useDnD';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { NODE_CONFIG, NodeType } from '@/config/nodeTypes';
import { Search, X } from 'lucide-react';

interface SidebarProps {
    onItemSelect?: () => void;
}

export default function Sidebar({ onItemSelect }: SidebarProps = {}) {
    const { setType } = useDnD();
    const [searchQuery, setSearchQuery] = useState('');

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
        onItemSelect?.();
    };

    const allCategories = [
        {
            name: 'AI Agents',
            items: ['agent', 'llm', 'tool', 'memory', 'input'] as NodeType[]
        },
        {
            name: 'Architecture',
            items: ['frontend', 'backend', 'database', 'cloud'] as NodeType[]
        },
        {
            name: 'General',
            items: ['user', 'note', 'container'] as NodeType[]
        }
    ];

    // Filter categories and items based on search query
    const categories = useMemo(() => {
        if (!searchQuery.trim()) return allCategories;

        const query = searchQuery.toLowerCase();
        return allCategories
            .map((cat) => ({
                ...cat,
                items: cat.items.filter((nodeType) => {
                    const config = NODE_CONFIG[nodeType];
                    return (
                        config.label.toLowerCase().includes(query) ||
                        config.tooltip.toLowerCase().includes(query) ||
                        nodeType.toLowerCase().includes(query)
                    );
                }),
            }))
            .filter((cat) => cat.items.length > 0);
    }, [searchQuery]);

    return (
        <TooltipProvider delayDuration={300}>
            <Card className="h-full w-64 border-r rounded-none bg-sidebar text-sidebar-foreground flex flex-col pointer-events-auto shadow-xl z-50" data-onboarding="sidebar">
                <div className="p-4 font-bold text-lg tracking-tight">FlowMind</div>
                <Separator />
                <div className="p-3" data-onboarding="search">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-8 h-9 text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 gap-6 flex flex-col">
                        {categories.map((cat) => (
                            <div key={cat.name}>
                                <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {cat.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {cat.items.map((nodeType) => {
                                        const config = NODE_CONFIG[nodeType];
                                        const Icon = config.icon;
                                        return (
                                            <Tooltip key={nodeType}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className="flex flex-col items-center justify-center gap-2 p-3 text-xs border rounded-md cursor-grab hover:bg-accent hover:text-accent-foreground transition-colors bg-card"
                                                        onDragStart={(event) => onDragStart(event, nodeType)}
                                                        draggable
                                                        role="button"
                                                        aria-label={`Drag ${config.label} component to canvas`}
                                                        tabIndex={0}
                                                    >
                                                        <Icon className="h-6 w-6 stroke-1" aria-hidden="true" />
                                                        <span className="text-[10px] font-medium text-center leading-none">{config.label}</span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="max-w-[200px]">
                                                    <p className="text-xs">{config.tooltip}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 text-[10px] text-muted-foreground text-center">
                    Drag components to canvas
                </div>
            </Card>
        </TooltipProvider>
    );
}
