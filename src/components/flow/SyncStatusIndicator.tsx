'use client';

import { useSyncStatus, SyncStatus } from '@/hooks/useSyncStatus';
import { Cloud, CloudOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const statusConfig: Record<SyncStatus, {
    icon: typeof Cloud;
    label: string;
    className: string;
    animate?: boolean;
}> = {
    idle: {
        icon: Cloud,
        label: 'Connected to cloud',
        className: 'text-muted-foreground',
    },
    syncing: {
        icon: Loader2,
        label: 'Syncing...',
        className: 'text-blue-500',
        animate: true,
    },
    synced: {
        icon: CheckCircle2,
        label: 'Saved to cloud',
        className: 'text-green-500',
    },
    error: {
        icon: AlertCircle,
        label: 'Sync failed - saved locally',
        className: 'text-orange-500',
    },
    offline: {
        icon: CloudOff,
        label: 'Offline - changes saved locally',
        className: 'text-gray-400',
    },
};

export function SyncStatusIndicator() {
    const status = useSyncStatus();
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-md border bg-background",
                        config.className
                    )}>
                        <Icon
                            className={cn(
                                "h-4 w-4",
                                config.animate && "animate-spin"
                            )}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p className="text-xs">{config.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
