'use client';

import { useDnD } from '@/hooks/useDnD';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Bot,
    Brain,
    Database,
    Globe,
    HardDrive,
    Layout,
    MessageSquare,
    Server,
    User,
    Box,
    FileText,
    Cloud
} from 'lucide-react';

export default function Sidebar() {
    const { setType } = useDnD();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const categories = [
        {
            name: 'AI Agents',
            items: [
                { type: 'agent', label: 'Agent', icon: Bot },
                { type: 'llm', label: 'LLM Model', icon: Brain },
                { type: 'tool', label: 'Tool', icon: HardDrive },
                { type: 'memory', label: 'Memory', icon: Database },
                { type: 'input', label: 'User Input', icon: MessageSquare },
            ]
        },
        {
            name: 'Architecture',
            items: [
                { type: 'frontend', label: 'Frontend', icon: Layout },
                { type: 'backend', label: 'Backend API', icon: Server },
                { type: 'database', label: 'Database', icon: Database },
                { type: 'cloud', label: 'Cloud Service', icon: Cloud },
            ]
        },
        {
            name: 'General',
            items: [
                { type: 'user', label: 'User', icon: User },
                { type: 'note', label: 'Note', icon: FileText },
                { type: 'container', label: 'Group', icon: Box },
            ]
        }
    ];

    return (
        <Card className="h-full w-64 border-r rounded-none bg-sidebar text-sidebar-foreground flex flex-col pointer-events-auto shadow-xl z-50">
            <div className="p-4 font-bold text-lg tracking-tight">FlowMind</div>
            <Separator />
            <ScrollArea className="flex-1">
                <div className="p-4 gap-6 flex flex-col">
                    {categories.map((cat) => (
                        <div key={cat.name}>
                            <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {cat.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {cat.items.map((item) => (
                                    <div
                                        key={item.type}
                                        className="flex flex-col items-center justify-center gap-2 p-3 text-xs border rounded-md cursor-grab hover:bg-accent hover:text-accent-foreground transition-colors bg-card"
                                        onDragStart={(event) => onDragStart(event, item.type)}
                                        draggable
                                        role="button"
                                        aria-label={`Drag ${item.label} component to canvas`}
                                        tabIndex={0}
                                    >
                                        <item.icon className="h-6 w-6 stroke-1" aria-hidden="true" />
                                        <span className="text-[10px] font-medium text-center leading-none">{item.label}</span>
                                    </div>
                                ))}
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
    );
}
