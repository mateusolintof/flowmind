'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export default function HelpDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                    <HelpCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>FlowMind Guides</DialogTitle>
                    <DialogDescription>
                        Tips for creating effective architectural diagrams.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Basic Controls</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li><strong>Drag & Drop</strong> components from the sidebar.</li>
                                <li><strong>Connect</strong> nodes by dragging connects handles.</li>
                                <li><strong>Drawing Mode</strong> (Pencil) allows freehand sketches.</li>
                                <li><strong>Selection Mode</strong> (Pointer) to move items.</li>
                                <li><strong>Delete</strong> key to remove selected items.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Agent Design Patterns</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li><strong>Orchestrator:</strong> Central agent managing others.</li>
                                <li><strong>Worker:</strong> Specialized agent for single tasks.</li>
                                <li><strong>Memory:</strong> Vector DB or History context.</li>
                                <li><strong>Tools:</strong> External APIs or Functions.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <h3 className="font-semibold text-sm">Shortcuts</h3>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div className="p-2 border rounded bg-muted/50">Backspace/Del: Delete</div>
                            <div className="p-2 border rounded bg-muted/50">Scroll: Zoom</div>
                            <div className="p-2 border rounded bg-muted/50">Space + Drag: Pan (if locked)</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
