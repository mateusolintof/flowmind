'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Menu } from 'lucide-react';
import { Bot, Brain, Wrench, Database as MemoryIcon, MessageSquare, Monitor, Server, Database, Cloud, User, StickyNote, Square } from 'lucide-react';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';
import { useDnD } from '@/hooks/useDnD';

// Context for sidebar state
interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Mini icons for collapsed sidebar
const MINI_ICONS = [
    { type: 'agent', icon: Bot, label: 'Agent' },
    { type: 'llm', icon: Brain, label: 'LLM' },
    { type: 'tool', icon: Wrench, label: 'Tool' },
    { type: 'memory', icon: MemoryIcon, label: 'Memory' },
    { type: 'input', icon: MessageSquare, label: 'Input' },
    { type: 'frontend', icon: Monitor, label: 'Frontend' },
    { type: 'backend', icon: Server, label: 'Backend' },
    { type: 'database', icon: Database, label: 'Database' },
    { type: 'cloud', icon: Cloud, label: 'Cloud' },
    { type: 'user', icon: User, label: 'User' },
    { type: 'note', icon: StickyNote, label: 'Note' },
    { type: 'container', icon: Square, label: 'Group' },
];

function CollapsedSidebar() {
    const { setType } = useDnD();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <TooltipProvider delayDuration={200}>
            <Card className="h-full w-12 border-r rounded-none bg-sidebar flex flex-col items-center py-2 gap-1 overflow-y-auto">
                {MINI_ICONS.map(({ type, icon: Icon, label }) => (
                    <Tooltip key={type}>
                        <TooltipTrigger asChild>
                            <div
                                className="w-9 h-9 flex items-center justify-center rounded-md cursor-grab hover:bg-accent transition-colors"
                                onDragStart={(e) => onDragStart(e, type)}
                                draggable
                                role="button"
                                aria-label={`Drag ${label}`}
                            >
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p className="text-xs">{label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </Card>
        </TooltipProvider>
    );
}

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return (
            <SidebarContext.Provider value={{ isCollapsed: true, setIsCollapsed }}>
                <OnboardingTour />
                <main className="h-screen w-screen overflow-hidden bg-background flex flex-col">
                    {/* Mobile Header */}
                    <div className="h-12 border-b bg-background flex items-center px-3 gap-3 shrink-0">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                    <Menu className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <Sidebar onItemSelect={() => setIsOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <span className="font-bold text-base">FlowMind</span>
                    </div>
                    {/* Canvas */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </main>
            </SidebarContext.Provider>
        );
    }

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <OnboardingTour />
            <main className="h-screen w-screen overflow-hidden bg-background flex">
                {/* Sidebar - Full or Collapsed */}
                {isCollapsed ? (
                    <CollapsedSidebar />
                ) : (
                    <div className="h-full w-60 shrink-0">
                        <Sidebar />
                    </div>
                )}
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {children}
                </div>
            </main>
        </SidebarContext.Provider>
    );
}
