'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Spline, TrendingUp, Minus, Zap, Palette, Tag } from 'lucide-react';
import { EdgeStyleType, CustomEdgeData } from './CustomEdge';

const EDGE_COLORS = [
    { name: 'Default', value: '' },
    { name: 'Blue', value: 'hsl(217, 91%, 60%)' },
    { name: 'Green', value: 'hsl(142, 71%, 45%)' },
    { name: 'Red', value: 'hsl(0, 84%, 60%)' },
    { name: 'Orange', value: 'hsl(25, 95%, 53%)' },
    { name: 'Purple', value: 'hsl(263, 70%, 50%)' },
    { name: 'Cyan', value: 'hsl(186, 100%, 42%)' },
];

interface EdgeStylePickerProps {
    edgeData: CustomEdgeData;
    onUpdate: (data: Partial<CustomEdgeData>) => void;
}

export function EdgeStylePicker({ edgeData, onUpdate }: EdgeStylePickerProps) {
    const currentStyle = edgeData.styleType || 'bezier';
    const currentColor = edgeData.color || '';
    const currentLabel = edgeData.label || '';
    const isAnimated = edgeData.animated || false;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                    <Spline className="h-4 w-4" />
                    Edge Style
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Edge Style</h4>
                        <p className="text-xs text-muted-foreground">
                            Customize the selected connection style.
                        </p>
                    </div>

                    {/* Line Type */}
                    <div className="space-y-2">
                        <Label className="text-xs">Line Type</Label>
                        <ToggleGroup
                            type="single"
                            value={currentStyle}
                            onValueChange={(value: EdgeStyleType) => {
                                if (value) onUpdate({ styleType: value });
                            }}
                            className="justify-start"
                        >
                            <ToggleGroupItem value="bezier" aria-label="Curved" className="gap-1.5">
                                <Spline className="h-3.5 w-3.5" />
                                Curved
                            </ToggleGroupItem>
                            <ToggleGroupItem value="smoothstep" aria-label="Step" className="gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Step
                            </ToggleGroupItem>
                            <ToggleGroupItem value="straight" aria-label="Straight" className="gap-1.5">
                                <Minus className="h-3.5 w-3.5" />
                                Straight
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Animation Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-xs">Animated</Label>
                        </div>
                        <Button
                            variant={isAnimated ? 'secondary' : 'outline'}
                            size="sm"
                            className="h-7 px-3"
                            onClick={() => onUpdate({ animated: !isAnimated })}
                        >
                            {isAnimated ? 'On' : 'Off'}
                        </Button>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-xs">Color</Label>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {EDGE_COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                        currentColor === color.value
                                            ? 'ring-2 ring-primary ring-offset-2'
                                            : 'hover:scale-110'
                                    }`}
                                    style={{
                                        backgroundColor: color.value || 'hsl(var(--muted-foreground))',
                                    }}
                                    onClick={() => onUpdate({ color: color.value })}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Label Input */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="edge-label" className="text-xs">Label</Label>
                        </div>
                        <Input
                            id="edge-label"
                            placeholder="Enter connection label..."
                            value={currentLabel}
                            onChange={(e) => onUpdate({ label: e.target.value })}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
