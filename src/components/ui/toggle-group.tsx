'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';

const ToggleGroupContext = React.createContext<{
    size?: 'default' | 'sm' | 'lg';
    variant?: 'default' | 'outline';
}>({
    size: 'default',
    variant: 'default',
});

function ToggleGroup({
    className,
    variant = 'default',
    size = 'default',
    children,
    ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}) {
    return (
        <ToggleGroupPrimitive.Root
            className={cn(
                'flex items-center justify-center gap-1',
                className
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant, size }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
}

function ToggleGroupItem({
    className,
    children,
    variant,
    size,
    ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}) {
    const context = React.useContext(ToggleGroupContext);
    const finalVariant = variant || context.variant;
    const finalSize = size || context.size;

    return (
        <ToggleGroupPrimitive.Item
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
                finalVariant === 'outline' && 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
                finalSize === 'default' && 'h-9 px-3',
                finalSize === 'sm' && 'h-7 px-2 text-xs',
                finalSize === 'lg' && 'h-11 px-5',
                className
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
}

export { ToggleGroup, ToggleGroupItem };
