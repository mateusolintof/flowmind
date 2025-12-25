'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    FileText,
    Plus,
    ChevronDown,
    Pencil,
    Trash2,
    Copy,
    Check,
    MoreHorizontal,
} from 'lucide-react';
import {
    Diagram,
    listDiagrams,
    createDiagram,
    renameDiagram,
    deleteDiagram,
    duplicateDiagram,
    getCurrentDiagramId,
    setCurrentDiagramId,
} from '@/lib/storage';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DiagramManagerProps {
    currentDiagramId: string | null;
    currentDiagramName: string;
    onDiagramChange: (diagramId: string) => void;
    onDiagramsUpdate?: () => void;
}

export function DiagramManager({
    currentDiagramId,
    currentDiagramName,
    onDiagramChange,
    onDiagramsUpdate,
}: DiagramManagerProps) {
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [renameDialog, setRenameDialog] = useState<{ open: boolean; diagram: Diagram | null }>({
        open: false,
        diagram: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; diagram: Diagram | null }>({
        open: false,
        diagram: null,
    });
    const [newName, setNewName] = useState('');

    const loadDiagrams = useCallback(async () => {
        const list = await listDiagrams();
        setDiagrams(list);
    }, []);

    useEffect(() => {
        loadDiagrams();
    }, [loadDiagrams]);

    const handleCreateNew = async () => {
        const diagram = await createDiagram();
        await loadDiagrams();
        onDiagramChange(diagram.id);
        setIsOpen(false);
        toast.success('New diagram created');
        onDiagramsUpdate?.();
    };

    const handleSwitch = async (diagramId: string) => {
        if (diagramId !== currentDiagramId) {
            setCurrentDiagramId(diagramId);
            onDiagramChange(diagramId);
            setIsOpen(false);
        }
    };

    const handleRename = async () => {
        if (!renameDialog.diagram || !newName.trim()) return;

        await renameDiagram(renameDialog.diagram.id, newName.trim());
        await loadDiagrams();
        setRenameDialog({ open: false, diagram: null });
        setNewName('');
        toast.success('Diagram renamed');
        onDiagramsUpdate?.();
    };

    const handleDelete = async () => {
        if (!deleteDialog.diagram) return;

        const newDiagramId = await deleteDiagram(deleteDialog.diagram.id);
        await loadDiagrams();
        setDeleteDialog({ open: false, diagram: null });

        if (newDiagramId) {
            onDiagramChange(newDiagramId);
        }
        toast.success('Diagram deleted');
        onDiagramsUpdate?.();
    };

    const handleDuplicate = async (diagram: Diagram) => {
        const newDiagram = await duplicateDiagram(diagram.id);
        if (newDiagram) {
            await loadDiagrams();
            onDiagramChange(newDiagram.id);
            toast.success('Diagram duplicated');
            onDiagramsUpdate?.();
        }
        setIsOpen(false);
    };

    const openRenameDialog = (e: React.MouseEvent, diagram: Diagram) => {
        e.stopPropagation();
        setNewName(diagram.name);
        setRenameDialog({ open: true, diagram });
    };

    const openDeleteDialog = (e: React.MouseEvent, diagram: Diagram) => {
        e.stopPropagation();
        setDeleteDialog({ open: true, diagram });
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 max-w-[200px] h-8"
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate">{currentDiagramName}</span>
                        <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Your Diagrams ({diagrams.length})
                    </div>
                    <DropdownMenuSeparator />

                    <ScrollArea className="max-h-[300px]">
                        {diagrams.map((diagram) => (
                            <DropdownMenuItem
                                key={diagram.id}
                                className={cn(
                                    'flex items-center justify-between gap-2 cursor-pointer py-2',
                                    diagram.id === currentDiagramId && 'bg-accent'
                                )}
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleSwitch(diagram.id);
                                }}
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {diagram.id === currentDiagramId ? (
                                        <Check className="h-4 w-4 shrink-0 text-primary" />
                                    ) : (
                                        <FileText className="h-4 w-4 shrink-0 opacity-50" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-medium text-sm">
                                            {diagram.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatDate(diagram.updatedAt)}
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 shrink-0"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem
                                            onClick={(e) => openRenameDialog(e, diagram)}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDuplicate(diagram);
                                            }}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={(e) => openDeleteDialog(e, diagram)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCreateNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Diagram
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Rename Dialog */}
            <Dialog
                open={renameDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setRenameDialog({ open: false, diagram: null });
                        setNewName('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Diagram</DialogTitle>
                        <DialogDescription>
                            Enter a new name for this diagram.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Diagram name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleRename();
                            }
                        }}
                        autoFocus
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRenameDialog({ open: false, diagram: null })}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRename} disabled={!newName.trim()}>
                            Rename
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => {
                    if (!open) setDeleteDialog({ open: false, diagram: null });
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Diagram?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.diagram?.name}&quot;?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
