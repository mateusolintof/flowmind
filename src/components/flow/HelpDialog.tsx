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
import { HelpCircle, PlayCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { DRAWING_TOOLS } from '@/config/drawingTools';
import { GENERAL_SHORTCUTS, MODE_SHORTCUTS } from '@/config/shortcuts';

export default function HelpDialog() {
    const { startTour, resetTour } = useOnboarding();

    const handleStartTour = () => {
        resetTour();
        startTour();
    };

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

                <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Basic Controls</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li><strong>Drag & Drop</strong> components from the sidebar.</li>
                                <li><strong>Connect</strong> nodes by dragging connection handles.</li>
                                <li><strong>Edit Labels</strong> by clicking on node text.</li>
                                <li><strong>Delete</strong> key to remove selected items.</li>
                                <li><strong>Edge Labels</strong> - click on edges to add/edit labels.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Node Categories</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li><strong>AI Architecture:</strong> Agents, LLMs, Memory, Tools.</li>
                                <li><strong>Flowchart:</strong> Start, End, Process, Decision.</li>
                                <li><strong>System:</strong> Database, Cloud, Frontend, Backend.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Drawing Tools</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                {DRAWING_TOOLS.map((tool) => (
                                    <li key={tool.tool}>
                                        <strong>{tool.label} ({tool.shortcut}):</strong> {tool.description}.
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Flowchart Nodes</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li><span className="text-emerald-600">Start/End:</span> Entry and exit points.</li>
                                <li><span className="text-blue-600">Process:</span> Actions and operations.</li>
                                <li><span className="text-amber-600">Decision:</span> Yes/No branching.</li>
                                <li><span className="text-purple-600">Result:</span> Outcomes and outputs.</li>
                                <li><span className="text-slate-600">Data/IO:</span> Input and storage.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <h3 className="font-semibold text-sm">General Shortcuts</h3>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            {GENERAL_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.display} className="p-2 border rounded bg-muted/50">
                                    <kbd className="font-mono bg-background px-1 rounded">{shortcut.display}</kbd> {shortcut.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <h3 className="font-semibold text-sm">Drawing Tool Shortcuts</h3>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            {DRAWING_TOOLS.map((tool) => (
                                <div key={tool.tool} className="p-2 border rounded bg-muted/50">
                                    <kbd className="font-mono bg-background px-1 rounded">{tool.shortcut}</kbd> {tool.label}
                                </div>
                            ))}
                            {MODE_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.display} className="p-2 border rounded bg-muted/50">
                                    <kbd className="font-mono bg-background px-1 rounded">{shortcut.display}</kbd> {shortcut.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleStartTour}
                        >
                            <PlayCircle className="h-4 w-4" />
                            Take the Interactive Tour
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
