'use client';

import { Button } from '@/components/ui/button';
import { PRESET_COLORS } from '@/config/colors';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface ColorPickerProps {
    selectedColor?: string;
    onSelectColor: (color: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ColorPicker({ selectedColor, onSelectColor, open, onOpenChange }: ColorPickerProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Open color picker">
                    <Palette className="h-4 w-4" style={{ color: selectedColor || 'var(--foreground)' }} aria-hidden="true" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
                <div className="grid grid-cols-5 gap-1">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color.name}
                            className={cn(
                                "w-6 h-6 rounded-full border border-border transition-transform hover:scale-110 focus:outline-hidden focus:ring-2 focus:ring-ring",
                                selectedColor === color.value && "ring-2 ring-ring scale-110"
                            )}
                            style={{ backgroundColor: color.value || 'var(--card)' }}
                            onClick={() => onSelectColor(color.value)}
                            title={color.name}
                            aria-label={`Select ${color.name} color`}
                            aria-pressed={selectedColor === color.value}
                        >
                            {/* Visual indicator for 'Default' (transparent/theme) */}
                            {!color.value && (
                                <div className="w-full h-full rounded-full relative overflow-hidden">
                                    <div className="absolute inset-0 border-r border-destructive -rotate-45 transform origin-center scale-150 opacity-50" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
