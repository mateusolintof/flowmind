'use client';

import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
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
import Image from 'next/image';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';
import { useDnD } from '@/hooks/drawing/useDnD';
import { ALL_NODE_CONFIG, COLLAPSED_NODE_TYPES } from '@/config/nodeCatalog';

// Context for sidebar state
interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

function CollapsedSidebar() {
    const { setType } = useDnD();

    // Memoized drag handler
    const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }, [setType]);

    return (
        <TooltipProvider delayDuration={200}>
            <Card className="h-full w-12 border-r border-white/10 rounded-none bg-sidebar/50 backdrop-blur-md flex flex-col items-center py-2 gap-1 overflow-y-auto shadow-2xl">
                {COLLAPSED_NODE_TYPES.map((type) => {
                    const config = ALL_NODE_CONFIG[type as keyof typeof ALL_NODE_CONFIG];
                    if (!config) return null;
                    const Icon = config.icon;
                    return (
                        <Tooltip key={type}>
                            <TooltipTrigger asChild>
                                <div
                                    className="w-9 h-9 flex items-center justify-center rounded-md cursor-grab hover:bg-accent transition-colors"
                                    onDragStart={(e) => onDragStart(e, type)}
                                    draggable
                                    role="button"
                                    aria-label={`Drag ${config.label}`}
                                >
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p className="text-xs">{config.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
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

    // Memoize context value for mobile
    const mobileContextValue = useMemo(() => ({
        isCollapsed: true,
        setIsCollapsed
    }), []);

    // Memoize context value for desktop
    const desktopContextValue = useMemo(() => ({
        isCollapsed,
        setIsCollapsed
    }), [isCollapsed]);

    if (isMobile) {
        return (
            <SidebarContext.Provider value={mobileContextValue}>
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
                        <div className="flex items-center gap-2">
                            <Image src="/logo.png" alt="FlowMind Logo" width={24} height={24} className="w-6 h-6 object-contain" />
                            <span className="font-bold text-base font-[family-name:var(--font-outfit)]">FlowMind</span>
                        </div>
                        <div className="ml-auto">
                            <ModeToggle />
                        </div>
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
        <SidebarContext.Provider value={desktopContextValue}>
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
                <div className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
                    {/* Add a subtle decorative gradient orb in the background */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]" />
                    </div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        {children}
                    </div>
                </div>
            </main>
        </SidebarContext.Provider>
    );
}
