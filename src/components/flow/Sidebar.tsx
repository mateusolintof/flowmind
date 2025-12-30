'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { useDnD } from '@/hooks/drawing/useDnD';
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
import { Search, X } from 'lucide-react';
import { ALL_NODE_CONFIG, NODE_CATEGORIES } from '@/config/nodeCatalog';

interface SidebarProps {
    onItemSelect?: () => void;
}

function Sidebar({ onItemSelect }: SidebarProps = {}) {
    const { setType } = useDnD();
    const [searchQuery, setSearchQuery] = useState('');

    // Memoized drag handler
    const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
        onItemSelect?.();
    }, [setType, onItemSelect]);

    // Filter categories and items based on search query
    const categories = useMemo(() => {
        if (!searchQuery.trim()) return NODE_CATEGORIES;

        const query = searchQuery.toLowerCase();
        return NODE_CATEGORIES
            .map((cat) => ({
                ...cat,
                items: cat.items.filter((nodeType) => {
                    const config = ALL_NODE_CONFIG[nodeType as keyof typeof ALL_NODE_CONFIG];
                    if (!config) return false;
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
            <Card className="h-full w-60 border-r border-white/10 rounded-none bg-sidebar/60 backdrop-blur-xl text-sidebar-foreground flex flex-col pointer-events-auto z-50 overflow-hidden shadow-2xl" data-onboarding="sidebar">
                <div className="h-12 px-4 flex items-center border-b shrink-0">
                    <span className="font-bold text-lg tracking-tight">FlowMind</span>
                </div>
                <div className="p-3" data-onboarding="search">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-8 h-8 text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 gap-6 flex flex-col pb-2">
                        {categories.map((cat) => (
                            <div key={cat.name}>
                                <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {cat.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-2 auto-rows-[1fr]">
                                    {cat.items.map((nodeType) => {
                                        const config = ALL_NODE_CONFIG[nodeType as keyof typeof ALL_NODE_CONFIG];
                                        if (!config) return null;
                                        const Icon = config.icon;
                                        return (
                                            <Tooltip key={nodeType}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className="group flex h-full min-h-[72px] flex-col items-center justify-center gap-2 rounded-md border bg-card p-3 text-xs transition-colors hover:bg-accent hover:text-accent-foreground cursor-grab"
                                                        onDragStart={(event) => onDragStart(event, nodeType)}
                                                        draggable
                                                        role="button"
                                                        aria-label={`Drag ${config.label} component to canvas`}
                                                        tabIndex={0}
                                                    >
                                                        <Icon className="h-6 w-6 stroke-1" aria-hidden="true" />
                                                        <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">
                                                            {config.label}
                                                        </span>
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

export default memo(Sidebar);
