'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';

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
                {/* Collapsible Sidebar */}
                <div
                    className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
                        isCollapsed ? 'w-0 overflow-hidden' : 'w-60'
                    }`}
                >
                    <Sidebar />
                </div>
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {children}
                </div>
            </main>
        </SidebarContext.Provider>
    );
}
