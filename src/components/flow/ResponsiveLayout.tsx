'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
            <>
                <OnboardingTour />
                <main className="h-screen w-screen overflow-hidden bg-background flex flex-col">
                    {/* Mobile Header */}
                    <div className="h-14 border-b bg-background flex items-center px-4 gap-4 shrink-0">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <Sidebar onItemSelect={() => setIsOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <span className="font-bold text-lg">FlowMind</span>
                    </div>
                    {/* Canvas */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <OnboardingTour />
            <main className="h-screen w-screen overflow-hidden bg-background flex">
                <Sidebar />
                {children}
            </main>
        </>
    );
}
